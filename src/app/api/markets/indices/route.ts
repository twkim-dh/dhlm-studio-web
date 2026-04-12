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

export async function GET() {
  const ttl = cacheTtlMs();
  if (memCache && Date.now() - memCache.ts < ttl) {
    return NextResponse.json(memCache.data);
  }

  if (!FMP_KEY) {
    return NextResponse.json({ indices: [], stale: true });
  }
  if (!(await fmpCanCall())) {
    // Budget exhausted — return stale cache or empty
    return NextResponse.json(memCache ? memCache.data : { indices: [], stale: true });
  }

  try {
    const csv = SYMBOLS.map(encodeURIComponent).join(',');
    const res = await fetch(
      `${FMP_BASE}/batch-quote-short?symbols=${csv}&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    await fmpTrackCall();
    if (!res.ok) return NextResponse.json({ indices: [], stale: true });
    const data = await res.json();
    if (!Array.isArray(data)) return NextResponse.json({ indices: [], stale: true });

    const indices = SYMBOLS.map(sym => {
      const q = data.find((d: Record<string, unknown>) => d.symbol === sym);
      if (!q) return null;
      return {
        symbol: sym,
        label: LABELS[sym],
        price: Number(q.price) || 0,
        pct: Number(q.changesPercentage) || 0,
      };
    }).filter(Boolean);

    const result = { indices };
    memCache = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ indices: [], stale: true });
  }
}
