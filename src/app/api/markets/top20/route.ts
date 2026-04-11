import { NextResponse } from 'next/server';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

export const revalidate = 300;

function fmtCap(v: number) {
  return v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T`
       : v >= 1e9  ? `$${(v / 1e9).toFixed(0)}B`
       : `$${(v / 1e6).toFixed(0)}M`;
}

export async function GET() {
  if (!FMP_KEY) return NextResponse.json({ stocks: [] });
  try {
    const res = await fetch(
      `${FMP_BASE}/stock-screener?marketCapMoreThan=50000000000&limit=30&country=US&apikey=${FMP_KEY}`,
      { next: { revalidate: 300 } }
    );
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

    return NextResponse.json({ stocks });
  } catch {
    return NextResponse.json({ stocks: [] });
  }
}
