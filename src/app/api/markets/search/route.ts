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
    // Try search-name first, then search-symbol as fallback
    let results: { symbol: string; name: string; currency: string; exchangeShortName: string }[] = [];

    for (const endpoint of ['search-name', 'search-symbol']) {
      const res = await fetch(
        `${FMP_BASE}/${endpoint}?query=${encodeURIComponent(q)}&limit=15&apikey=${FMP_KEY}`,
        { cache: 'no-store' }
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        results = data.map((item: Record<string, unknown>) => ({
          symbol: String(item.symbol || ''),
          name: String(item.name || item.symbol || ''),
          currency: String(item.currency || ''),
          exchangeShortName: String(item.exchangeShortName || item.exchange || ''),
        }));
        break;
      }
    }

    // If FMP returns nothing, try v3 endpoint as last resort
    if (results.length === 0) {
      const v3Res = await fetch(
        `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(q)}&limit=15&apikey=${FMP_KEY}`,
        { cache: 'no-store' }
      );
      const v3Data = await v3Res.json();
      if (Array.isArray(v3Data) && v3Data.length > 0) {
        results = v3Data.map((item: Record<string, unknown>) => ({
          symbol: String(item.symbol || ''),
          name: String(item.name || ''),
          currency: String(item.currency || ''),
          exchangeShortName: String(item.exchangeShortName || ''),
        }));
      }
    }

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}
