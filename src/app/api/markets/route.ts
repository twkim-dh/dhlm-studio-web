import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';

const AV_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

// Market cap threshold for "S&P 500 quality" filter (temporary until FMP Premium)
const MIN_MARKET_CAP = 10_000_000_000; // $10B

// ── Cache TTL (smart: weekend = 6h, after-hours = 30min, market hours = 60min) ─

function cacheTtlMs(): number {
  const now = new Date();
  const dow = now.getUTCDay(); // 0=Sun, 6=Sat
  if (dow === 0 || dow === 6) return 6 * 60 * 60 * 1000;   // weekend: 6 hours
  const utcHour = now.getUTCHours();
  const utcMin = now.getUTCMinutes();
  const min = utcHour * 60 + utcMin;
  if (min >= 13 * 60 + 30 && min < 20 * 60) return 60 * 60 * 1000; // market hours: 60 min
  return 30 * 60 * 1000; // after-hours: 30 min
}

let cacheData: { data: unknown; ts: number } | null = null;

// ── Large-cap screener cache (Redis, 24h TTL) ─────────────────────────────────
// Replaces 45 individual fmpProfile calls per refresh with 1 screener call/day.
// ScreenerItem shape mirrors FMP /stable/stock-screener response fields.

interface ScreenerItem {
  companyName: string;
  marketCap: number;
  sector: string;
  image: string;
}

const LARGECAP_REDIS_KEY = 'fmp:largecap-data:v1';
const LARGECAP_MEM_TTL = 24 * 60 * 60 * 1000; // 24 hours
let largeCapMem: { map: Map<string, ScreenerItem>; ts: number } | null = null;

async function getLargeCapMap(): Promise<Map<string, ScreenerItem>> {
  // 1. Memory cache
  if (largeCapMem && Date.now() - largeCapMem.ts < LARGECAP_MEM_TTL) {
    return largeCapMem.map;
  }
  // 2. Redis cache
  try {
    const redis = getRedis();
    const raw = await redis.get(LARGECAP_REDIS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { ts: number; items: Record<string, ScreenerItem> };
      if (Date.now() - parsed.ts < LARGECAP_MEM_TTL) {
        const map = new Map(Object.entries(parsed.items));
        largeCapMem = { map, ts: parsed.ts };
        return map;
      }
    }
  } catch { /* Redis unavailable */ }

  // 3. Fetch from FMP (1 call per 24h)
  if (!FMP_KEY) return new Map();
  if (!(await fmpCanCall())) return new Map();

  try {
    const res = await fetch(
      `${FMP_BASE}/stock-screener?marketCapMoreThan=10000000000&limit=200&country=US&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    await fmpTrackCall();
    if (!res.ok) return new Map();
    const data = await res.json();
    if (!Array.isArray(data)) return new Map();

    const items: Record<string, ScreenerItem> = {};
    for (const s of data) {
      if (s.symbol) {
        items[s.symbol as string] = {
          companyName: (s.companyName as string) || (s.symbol as string),
          marketCap: Number(s.marketCap) || 0,
          sector: (s.sector as string) || '',
          image: (s.image as string) || '',
        };
      }
    }

    const map = new Map(Object.entries(items));
    largeCapMem = { map, ts: Date.now() };
    try {
      const redis = getRedis();
      await redis.set(LARGECAP_REDIS_KEY, JSON.stringify({ ts: Date.now(), items }), 'EX', 25 * 60 * 60);
    } catch { /* Redis unavailable */ }

    return map;
  } catch {
    return new Map();
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLastMarketDay(): { isWeekend: boolean; lastCloseLabel: string } {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun, 6=Sat
  if (dow === 0 || dow === 6) {
    const friday = new Date(now);
    friday.setDate(now.getDate() - (dow === 0 ? 2 : 1));
    const label = friday.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    return { isWeekend: true, lastCloseLabel: label };
  }
  return { isWeekend: false, lastCloseLabel: '' };
}

function fmtCap(v: number) {
  return v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T`
    : v >= 1e9 ? `$${(v / 1e9).toFixed(0)}B`
    : `$${(v / 1e6).toFixed(0)}M`;
}

/**
 * Filter and enrich AV raw tickers using the cached large-cap screener map.
 * Zero individual FMP calls — just a map lookup.
 */
async function filterWithCache(
  raw: Record<string, string>[],
  limit: number,
  largeCapMap: Map<string, ScreenerItem>
) {
  const candidates = raw.filter(s => parseFloat(s.price) >= 5).slice(0, 20);

  const enriched = candidates
    .map((s, i) => {
      const ticker = s.ticker?.toUpperCase();
      const meta = largeCapMap.get(ticker);
      // If not in map, fall back to minimal data (may be filtered out)
      return {
        rank: i + 1,
        ticker,
        name: meta?.companyName || ticker,
        sector: meta?.sector || '',
        image: meta?.image || '',
        marketCap: meta?.marketCap || 0,
        marketCapFmt: meta?.marketCap ? fmtCap(meta.marketCap) : '',
        price: parseFloat(s.price),
        change: parseFloat(s.change_percentage?.replace('%', '') || '0'),
        volume: parseInt(s.volume || '0'),
      };
    });

  return enriched
    .filter(s => s.marketCap >= MIN_MARKET_CAP)
    .slice(0, limit)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET() {
  const ttl = cacheTtlMs();
  if (cacheData && Date.now() - cacheData.ts < ttl) {
    return NextResponse.json(cacheData.data);
  }

  const { isWeekend, lastCloseLabel } = getLastMarketDay();

  try {
    const avRes = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${AV_KEY}`,
      { cache: 'no-store' }
    );
    const avData = await avRes.json();

    if (!avData.top_gainers) {
      return NextResponse.json({
        error: 'Market data unavailable',
        note: avData.Note || avData.Information || 'Market data available on weekdays.',
        isWeekend,
        lastCloseLabel,
      });
    }

    // Single large-cap map fetch (1 FMP call/day via Redis cache)
    const largeCapMap = await getLargeCapMap();

    const [gainers, losers, actives] = await Promise.all([
      filterWithCache(avData.top_gainers, 10, largeCapMap),
      filterWithCache(avData.top_losers, 10, largeCapMap),
      filterWithCache(avData.most_actively_traded, 10, largeCapMap),
    ]);

    const result = {
      date: avData.last_updated || new Date().toISOString().split('T')[0],
      gainers,
      losers,
      actives,
      isWeekend,
      lastCloseLabel,
      lastUpdated: new Date().toISOString(),
      source: 'Alpha Vantage + Financial Modeling Prep',
      filter: 'S&P 500 quality (market cap $10B+)',
    };

    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch market data', isWeekend, lastCloseLabel });
  }
}
