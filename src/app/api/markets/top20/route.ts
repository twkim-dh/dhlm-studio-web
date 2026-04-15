import { NextResponse } from 'next/server';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

// Top 20 US stocks by market cap with sector assignments.
// stock-screener returns [] on free tier — hardcode the list, fetch only
// daily change% via individual ?symbol= queries (free-tier compatible).
const TOP20_STOCKS: { ticker: string; name: string; sector: string; marketCap: number }[] = [
  { ticker: 'NVDA',  name: 'NVIDIA',          sector: 'Technology',        marketCap: 4_200_000_000_000 },
  { ticker: 'AAPL',  name: 'Apple',            sector: 'Technology',        marketCap: 3_800_000_000_000 },
  { ticker: 'MSFT',  name: 'Microsoft',        sector: 'Technology',        marketCap: 3_000_000_000_000 },
  { ticker: 'GOOGL', name: 'Alphabet',         sector: 'Communication',     marketCap: 3_600_000_000_000 },
  { ticker: 'AMZN',  name: 'Amazon',           sector: 'Consumer Cyclical', marketCap: 2_300_000_000_000 },
  { ticker: 'META',  name: 'Meta',             sector: 'Communication',     marketCap: 1_700_000_000_000 },
  { ticker: 'TSLA',  name: 'Tesla',            sector: 'Consumer Cyclical', marketCap: 1_500_000_000_000 },
  { ticker: 'AVGO',  name: 'Broadcom',         sector: 'Technology',        marketCap: 1_700_000_000_000 },
  { ticker: 'LLY',   name: 'Eli Lilly',        sector: 'Healthcare',        marketCap:   780_000_000_000 },
  { ticker: 'JPM',   name: 'JPMorgan',         sector: 'Financial',         marketCap:   850_000_000_000 },
  { ticker: 'V',     name: 'Visa',             sector: 'Financial',         marketCap:   620_000_000_000 },
  { ticker: 'MA',    name: 'Mastercard',       sector: 'Financial',         marketCap:   450_000_000_000 },
  { ticker: 'WMT',   name: 'Walmart',          sector: 'Consumer Defensive',marketCap:   680_000_000_000 },
  { ticker: 'XOM',   name: 'ExxonMobil',       sector: 'Energy',            marketCap:   510_000_000_000 },
  { ticker: 'UNH',   name: 'UnitedHealth',     sector: 'Healthcare',        marketCap:   450_000_000_000 },
  { ticker: 'JNJ',   name: 'Johnson & J.',     sector: 'Healthcare',        marketCap:   380_000_000_000 },
  { ticker: 'ORCL',  name: 'Oracle',           sector: 'Technology',        marketCap:   480_000_000_000 },
  { ticker: 'BAC',   name: 'Bank of America',  sector: 'Financial',         marketCap:   330_000_000_000 },
  { ticker: 'GE',    name: 'GE Aerospace',     sector: 'Industrials',       marketCap:   220_000_000_000 },
  { ticker: 'CVX',   name: 'Chevron',          sector: 'Energy',            marketCap:   280_000_000_000 },
];

// Smart TTL: weekend=6h, after-hours=30min, market-hours=5min
function cacheTtlMs(): number {
  const now = new Date();
  const dow = now.getUTCDay();
  if (dow === 0 || dow === 6) return 6 * 60 * 60 * 1000;
  const min = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (min >= 13 * 60 + 30 && min < 20 * 60) return 5 * 60 * 1000;
  return 30 * 60 * 1000;
}

let memCache: { data: unknown; ts: number } | null = null;

export const dynamic = 'force-dynamic';

async function fetchChange(ticker: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${FMP_BASE}/quote?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    await fmpTrackCall();
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;
    const d = data[0] as Record<string, unknown>;
    return Number(d.changePercentage ?? d.changesPercentage ?? 0);
  } catch {
    return null;
  }
}

export async function GET() {
  const ttl = cacheTtlMs();
  if (memCache && Date.now() - memCache.ts < ttl) {
    return NextResponse.json(memCache.data);
  }

  if (!FMP_KEY) return NextResponse.json({ stocks: [] });
  if (!(await fmpCanCall())) {
    return NextResponse.json(memCache ? memCache.data : { stocks: [] });
  }

  try {
    // Fetch changes in parallel (20 calls — within free tier budget at 30-min TTL)
    const changes = await Promise.all(TOP20_STOCKS.map(s => fetchChange(s.ticker)));

    const stocks = TOP20_STOCKS.map((s, i) => ({
      ticker: s.ticker,
      name: s.name,
      price: 0,  // price not needed for heatmap color logic
      change: changes[i] ?? 0,
      marketCap: s.marketCap,
      marketCapFmt: '',
      sector: s.sector,
      image: `https://financialmodelingprep.com/image-stock/${s.ticker}.png`,
    }));

    const result = { stocks };
    memCache = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ stocks: [] });
  }
}
