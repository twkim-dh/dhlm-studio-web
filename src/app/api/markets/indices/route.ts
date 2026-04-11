import { NextResponse } from 'next/server';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

const SYMBOLS = ['^GSPC', '^IXIC', '^DJI', '^RUT'];
const LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'Nasdaq',
  '^DJI':  'Dow',
  '^RUT':  'Russell 2000',
};

export const revalidate = 300; // 5-minute ISR cache

export async function GET() {
  if (!FMP_KEY) {
    return NextResponse.json({ indices: [], stale: true });
  }
  try {
    const csv = SYMBOLS.map(encodeURIComponent).join(',');
    const res = await fetch(
      `${FMP_BASE}/batch-quote-short?symbols=${csv}&apikey=${FMP_KEY}`,
      { next: { revalidate: 300 } }
    );
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

    return NextResponse.json({ indices });
  } catch {
    return NextResponse.json({ indices: [], stale: true });
  }
}
