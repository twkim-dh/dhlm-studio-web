import { NextResponse } from 'next/server';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';
import { getRedis } from '@/lib/redis';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

const SYMBOLS = ['^GSPC', '^IXIC', '^DJI', '^RUT'];
const LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'Nasdaq',
  '^DJI':  'Dow',
  '^RUT':  'Russell 2000',
};

// Redis key — bump suffix to invalidate stale cache
const REDIS_KEY = 'markets:indices:v1';

// Smart TTL (seconds): weekend=6h, after-hours=30min, market-hours=5min
function cacheTtlSec(): number {
  const now = new Date();
  const dow = now.getUTCDay();
  if (dow === 0 || dow === 6) return 6 * 60 * 60;
  const min = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (min >= 13 * 60 + 30 && min < 20 * 60) return 5 * 60;
  return 30 * 60;
}

let memCache: { data: unknown; ts: number; ttlMs: number } | null = null;

export const dynamic = 'force-dynamic';

// Fetch a single index quote via ?symbol= (free-tier compatible).
// batch-quote-short is restricted on free tier.
async function fetchSingle(sym: string): Promise<{ symbol: string; label: string; price: number; pct: number } | null> {
  try {
    const res = await fetch(
      `${FMP_BASE}/quote?symbol=${encodeURIComponent(sym)}&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    await fmpTrackCall();
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;
    const d = data[0] as Record<string, unknown>;
    const price = Number(d.price) || 0;
    if (price === 0) return null;
    // FMP returns changePercentage (not changesPercentage) for index quotes
    const pct = Number(d.changePercentage ?? d.changesPercentage ?? 0);
    return { symbol: sym, label: LABELS[sym], price, pct };
  } catch {
    return null;
  }
}

export async function GET() {
  const ttlSec = cacheTtlSec();
  const ttlMs  = ttlSec * 1000;

  // 1. In-memory cache (warm instance)
  if (memCache && Date.now() - memCache.ts < memCache.ttlMs) {
    return NextResponse.json(memCache.data);
  }

  // 2. Redis cache (shared across all Vercel instances)
  try {
    const redis = getRedis();
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as { indices: unknown[]; ts: number; ttlMs: number };
      if (Date.now() - parsed.ts < parsed.ttlMs) {
        memCache = { data: parsed, ts: parsed.ts, ttlMs: parsed.ttlMs };
        return NextResponse.json(parsed);
      }
    }
  } catch { /* Redis unavailable — continue to FMP */ }

  if (!FMP_KEY) {
    return NextResponse.json({ indices: [], stale: true });
  }
  if (!(await fmpCanCall())) {
    return NextResponse.json(memCache ? memCache.data : { indices: [], stale: true });
  }

  try {
    // Fetch all 4 in parallel — 1 FMP call each, all free-tier compatible
    const results = await Promise.all(SYMBOLS.map(fetchSingle));
    const indices = results.filter(Boolean);

    if (indices.length === 0) {
      return NextResponse.json({ indices: [], stale: true });
    }

    const result = { indices, ts: Date.now(), ttlMs };
    memCache = { data: result, ts: Date.now(), ttlMs };

    // Write to Redis — smart TTL survives Vercel cold starts
    try {
      const redis = getRedis();
      await redis.set(REDIS_KEY, JSON.stringify(result), 'EX', ttlSec);
    } catch { /* Redis write failure is non-fatal */ }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ indices: [], stale: true });
  }
}
