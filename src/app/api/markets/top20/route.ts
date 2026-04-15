import { NextResponse } from 'next/server';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';
import { getRedis } from '@/lib/redis';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

// Redis key — bump suffix to invalidate stale cache
const REDIS_KEY = 'markets:top20:v1';
// 24h TTL — data is EOD, same as today-market. Prevents 20 FMP calls per cold start.
const CACHE_TTL = 86400;

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
  // 1. In-memory cache (warm instance)
  if (memCache && Date.now() - memCache.ts < CACHE_TTL * 1000) {
    return NextResponse.json(memCache.data);
  }

  // 2. Redis cache (shared across all Vercel instances)
  try {
    const redis = getRedis();
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as { stocks: unknown[]; ts: number };
      if (Date.now() - parsed.ts < CACHE_TTL * 1000) {
        memCache = { data: parsed, ts: parsed.ts };
        return NextResponse.json(parsed);
      }
    }
  } catch { /* Redis unavailable — continue to FMP */ }

  if (!FMP_KEY) return NextResponse.json({ stocks: [] });
  if (!(await fmpCanCall())) {
    return NextResponse.json(memCache ? memCache.data : { stocks: [] });
  }

  try {
    const changes = await Promise.all(TOP20_STOCKS.map(s => fetchChange(s.ticker)));

    const stocks = TOP20_STOCKS.map((s, i) => ({
      ticker: s.ticker,
      name: s.name,
      price: 0,
      change: changes[i] ?? 0,
      marketCap: s.marketCap,
      marketCapFmt: '',
      sector: s.sector,
      image: `https://financialmodelingprep.com/image-stock/${s.ticker}.png`,
    }));

    const result = { stocks, ts: Date.now() };
    memCache = { data: result, ts: Date.now() };

    // Write to Redis — 24h TTL, survives Vercel cold starts
    try {
      const redis = getRedis();
      await redis.set(REDIS_KEY, JSON.stringify(result), 'EX', CACHE_TTL);
    } catch { /* Redis write failure is non-fatal */ }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ stocks: [] });
  }
}
