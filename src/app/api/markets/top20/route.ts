import { NextResponse } from 'next/server';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

function fmtCap(v: number) {
  return v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T`
       : v >= 1e9  ? `$${(v / 1e9).toFixed(0)}B`
       : `$${(v / 1e6).toFixed(0)}M`;
}

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

  if (!FMP_KEY) return NextResponse.json({ stocks: [] });
  if (!(await fmpCanCall())) {
    return NextResponse.json(memCache ? memCache.data : { stocks: [] });
  }

  try {
    const res = await fetch(
      `${FMP_BASE}/stock-screener?marketCapMoreThan=50000000000&limit=30&country=US&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    await fmpTrackCall();
    if (!res.ok) return NextResponse.json({ stocks: [] });
    const data = await res.json();
    if (!Array.isArray(data)) return NextResponse.json({ stocks: [] });

    const stocks = data
      .filter((s: Record<string, unknown>) => s.marketCap)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (Number(b.marketCap) || 0) - (Number(a.marketCap) || 0))
      .slice(0, 20)
      .map((s: Record<string, unknown>) => ({
        ticker: s.symbol as string,
        name: (s.companyName as string) || (s.symbol as string),
        price: Number(s.price) || 0,
        change: Number(s.changesPercentage) || 0,
        marketCap: Number(s.marketCap) || 0,
        marketCapFmt: fmtCap(Number(s.marketCap) || 0),
        sector: (s.sector as string) || '',
        image: (s.image as string) || '',
      }));

    const result = { stocks };
    memCache = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ stocks: [] });
  }
}
