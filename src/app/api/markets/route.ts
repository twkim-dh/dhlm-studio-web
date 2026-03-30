import { NextResponse } from 'next/server';

const API_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 300000; // 5 min

// Fetch company info from Yahoo Finance Search API (free)
async function getCompanyInfo(ticker: string): Promise<{ name: string; sector: string; industry: string; exchange: string } | null> {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}&quotesCount=1&newsCount=0`, { cache: 'no-store' });
    const data = await res.json();
    const quote = data?.quotes?.[0];
    if (!quote) return null;
    return {
      name: quote.longname || quote.shortname || ticker,
      sector: quote.sector || '',
      industry: quote.industry || '',
      exchange: quote.exchange || '',
    };
  } catch { return null; }
}

// Fetch price details from Yahoo Finance Chart API (free)
async function getPriceDetails(ticker: string): Promise<{ weekHigh52: number; weekLow52: number; prevClose: number } | null> {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1d&interval=1d`, { cache: 'no-store' });
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    return {
      weekHigh52: meta.fiftyTwoWeekHigh,
      weekLow52: meta.fiftyTwoWeekLow,
      prevClose: meta.chartPreviousClose || meta.previousClose,
    };
  } catch { return null; }
}

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  try {
    // 1. Get top gainers from Alpha Vantage
    const res = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`,
      { cache: 'no-store' }
    );
    const raw = await res.json();

    if (!raw.top_gainers) {
      return NextResponse.json({ error: 'No data available', note: raw.Note || raw.Information || '' }, { status: 503 });
    }

    // 2. Enrich top 10 with Yahoo Finance company info
    const topGainers = raw.top_gainers.slice(0, 10);
    const movers = await Promise.all(
      topGainers.map(async (s: Record<string, string>, i: number) => {
        const ticker = s.ticker;
        const [info, details] = await Promise.all([
          getCompanyInfo(ticker),
          getPriceDetails(ticker),
        ]);

        return {
          rank: i + 1,
          ticker,
          name: info?.name || ticker,
          sector: info?.sector || '',
          industry: info?.industry || '',
          exchange: info?.exchange || '',
          price: parseFloat(s.price),
          change: parseFloat(s.change_percentage?.replace('%', '') || '0'),
          changeAmount: parseFloat(s.change_amount || '0'),
          volume: parseInt(s.volume || '0'),
          weekHigh52: details?.weekHigh52 || 0,
          weekLow52: details?.weekLow52 || 0,
          prevClose: details?.prevClose || 0,
        };
      })
    );

    const result = {
      date: new Date().toISOString().split('T')[0],
      movers,
      lastUpdated: new Date().toISOString(),
      source: 'Alpha Vantage + Yahoo Finance',
    };

    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
