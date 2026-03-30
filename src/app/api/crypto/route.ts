import { NextResponse } from 'next/server';

let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 60000; // 1 min (CoinGecko allows 30 req/min)

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h,7d',
      { cache: 'no-store' }
    );
    const raw = await res.json();

    if (!Array.isArray(raw)) {
      return NextResponse.json({ error: 'CoinGecko rate limit', retry: '60s' }, { status: 429 });
    }

    const coins = raw.map((c: Record<string, unknown>, i: number) => ({
      rank: i + 1,
      id: c.id,
      symbol: (c.symbol as string)?.toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      marketCap: c.market_cap,
      change24h: c.price_change_percentage_24h,
      change7d: c.price_change_percentage_7d_in_currency,
      volume24h: c.total_volume,
    }));

    const result = { coins, lastUpdated: new Date().toISOString(), source: 'CoinGecko' };
    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 });
  }
}
