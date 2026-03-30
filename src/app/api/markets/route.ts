import { NextResponse } from 'next/server';

// Alpha Vantage — free API key: get one at alphavantage.co/support
const API_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';

const cache: { data: unknown; ts: number } | null = null;
let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 300000; // 5 min

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`,
      { cache: 'no-store' }
    );
    const raw = await res.json();

    if (!raw.top_gainers) {
      return NextResponse.json({ error: 'No data available', note: raw.Note || raw.Information || '' }, { status: 503 });
    }

    // Transform to our format
    const movers = raw.top_gainers.slice(0, 10).map((s: Record<string, string>, i: number) => ({
      rank: i + 1,
      ticker: s.ticker,
      price: parseFloat(s.price),
      change: parseFloat(s.change_percentage?.replace('%', '') || '0'),
      changeAmount: parseFloat(s.change_amount || '0'),
      volume: parseInt(s.volume || '0'),
    }));

    const result = {
      date: raw.metadata || new Date().toISOString().split('T')[0],
      movers,
      lastUpdated: new Date().toISOString(),
    };

    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
