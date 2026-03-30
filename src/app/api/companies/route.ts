import { NextResponse } from 'next/server';

// Yahoo Finance — free, unofficial API for stock data
const TICKERS = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSM', 'BRK-B', 'AVGO', 'TSLA', 'WMT', 'JPM', 'V', 'LLY', 'MA'];
const FLAGS: Record<string, string> = { 'AAPL': '🇺🇸', 'NVDA': '🇺🇸', 'MSFT': '🇺🇸', 'GOOGL': '🇺🇸', 'AMZN': '🇺🇸', 'META': '🇺🇸', 'TSM': '🇹🇼', 'BRK-B': '🇺🇸', 'AVGO': '🇺🇸', 'TSLA': '🇺🇸', 'WMT': '🇺🇸', 'JPM': '🇺🇸', 'V': '🇺🇸', 'LLY': '🇺🇸', 'MA': '🇺🇸' };

let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 300000; // 5 min

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  try {
    const companies = [];

    for (const ticker of TICKERS) {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1d&interval=1d`,
          { cache: 'no-store' }
        );
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (!meta) continue;

        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose;
        const change = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

        companies.push({
          ticker,
          name: meta.shortName || meta.symbol,
          price,
          change: +change.toFixed(2),
          flag: FLAGS[ticker] || '🏳️',
          exchange: meta.exchangeName,
          currency: meta.currency,
        });
      } catch {
        // Skip failed ticker
      }
    }

    // Sort by price (proxy for market cap since Yahoo doesn't give marketCap in chart API)
    companies.sort((a, b) => b.price - a.price);

    const result = {
      companies: companies.map((c, i) => ({ rank: i + 1, ...c })),
      lastUpdated: new Date().toISOString(),
      source: 'Yahoo Finance',
    };

    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch company data' }, { status: 500 });
  }
}
