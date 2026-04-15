import { NextResponse } from 'next/server';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

const SYMBOLS = ['^GSPC', '^IXIC', '^DJI', '^RUT'];
const LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'Nasdaq',
  '^DJI':  'Dow',
  '^RUT':  'Russell 2000',
};

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
  const ttl = cacheTtlMs();
  if (memCache && Date.now() - memCache.ts < ttl) {
    return NextResponse.json(memCache.data);
  }

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

    const result = { indices };
    memCache = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ indices: [], stale: true });
  }
}
