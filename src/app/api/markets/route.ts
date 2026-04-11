import { NextResponse } from 'next/server';

const AV_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

// 60-min cache — keeps FMP calls within free-tier 250/day budget
let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 3_600_000; // 60 min

// Market cap threshold for "S&P 500 quality" filter (temporary until FMP Premium)
const MIN_MARKET_CAP = 10_000_000_000; // $10B

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns last trading day info. On weekends, points back to Friday. */
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

async function fmpProfile(ticker: string) {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE}/profile?symbol=${ticker}&apikey=${FMP_KEY}`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
  } catch { return null; }
}

async function fmpFinancials(ticker: string) {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE}/income-statement?symbol=${ticker}&period=annual&limit=1&apikey=${FMP_KEY}`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
  } catch { return null; }
}

function fmtCap(v: number) { return v >= 1e12 ? `$${(v/1e12).toFixed(2)}T` : v >= 1e9 ? `$${(v/1e9).toFixed(0)}B` : `$${(v/1e6).toFixed(0)}M`; }
function fmtRev(v: number) { return v >= 1e9 ? `$${(v/1e9).toFixed(0)}B` : `$${(v/1e6).toFixed(0)}M`; }

function buildItem(s: Record<string, string>, i: number, profile: Record<string, unknown> | null, fin: Record<string, unknown> | null) {
  return {
    rank: i + 1,
    ticker: s.ticker,
    name: (profile?.companyName as string) || s.ticker,
    sector: (profile?.sector as string) || '',
    industry: (profile?.industry as string) || '',
    exchange: (profile?.exchange as string) || '',
    ceo: (profile?.ceo as string) || '',
    employees: (profile?.fullTimeEmployees as string) || '',
    description: profile?.description ? (profile.description as string).slice(0, 200) + '...' : '',
    image: (profile?.image as string) || '',
    marketCap: (profile?.marketCap as number) || 0,
    marketCapFmt: profile?.marketCap ? fmtCap(profile.marketCap as number) : '',
    range52w: (profile?.range as string) || '',
    price: parseFloat(s.price),
    change: parseFloat(s.change_percentage?.replace('%', '') || '0'),
    volume: parseInt(s.volume || '0'),
    revenue: fin?.revenue ? fmtRev(fin.revenue as number) : '',
    netIncome: fin?.netIncome ? fmtRev(fin.netIncome as number) : '',
    eps: (fin?.epsDiluted as number) || '',
  };
}

/**
 * Enrich raw AV tickers with FMP market cap, then filter to MIN_MARKET_CAP.
 * Pre-filters price < $5 to avoid wasting FMP calls on penny stocks.
 * Returns up to `limit` results.
 */
async function filterToLargeCap(
  raw: Record<string, string>[],
  limit: number,
  withFinancials = false
) {
  // Pre-filter: drop obvious penny stocks (saves FMP calls)
  const candidates = raw.filter(s => parseFloat(s.price) >= 5).slice(0, 15);

  const enriched = await Promise.all(
    candidates.map(async (s, i) => {
      const profile = await fmpProfile(s.ticker);
      const fin = (withFinancials && i < 3) ? await fmpFinancials(s.ticker) : null;
      return buildItem(s, i, profile, fin);
    })
  );

  // Apply $10B+ filter, re-rank, return top `limit`
  return enriched
    .filter(s => s.marketCap >= MIN_MARKET_CAP)
    .slice(0, limit)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  const { isWeekend, lastCloseLabel } = getLastMarketDay();

  // On weekends AV still returns last Friday's data — we just label it correctly
  try {
    const avRes = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${AV_KEY}`,
      { cache: 'no-store' }
    );
    const avData = await avRes.json();

    if (!avData.top_gainers) {
      // AV rate-limited or weekend with no data
      return NextResponse.json({
        error: 'Market data unavailable',
        note: avData.Note || avData.Information || 'Market data available on weekdays.',
        isWeekend,
        lastCloseLabel,
      });
    }

    const [gainers, losers, actives] = await Promise.all([
      filterToLargeCap(avData.top_gainers, 10, true),
      filterToLargeCap(avData.top_losers, 10, false),
      filterToLargeCap(avData.most_actively_traded, 10, false),
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
