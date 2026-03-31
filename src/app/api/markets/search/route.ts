import { NextResponse } from 'next/server';

const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ results: [], error: 'Query required' }, { status: 400 });
  }

  if (!FMP_KEY) {
    return NextResponse.json({ results: [], error: 'FMP_API_KEY not configured' }, { status: 503 });
  }

  try {
    const res = await fetch(
      `${FMP_BASE}/search-name?query=${encodeURIComponent(q)}&limit=15&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    const data = await res.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ results: [], raw: data });
    }

    const results = data.map((item: Record<string, unknown>) => ({
      symbol: item.symbol,
      name: item.name,
      currency: item.currency || '',
      exchangeShortName: item.exchangeShortName || '',
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}
