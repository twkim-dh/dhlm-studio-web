import { NextResponse } from 'next/server';

const API_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 300000; // 5 min

// Fetch company info + news from Yahoo Finance Search API (free)
async function getCompanyInfo(ticker: string): Promise<{ name: string; sector: string; industry: string; exchange: string; news: { title: string; publisher: string }[] } | null> {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}&quotesCount=1&newsCount=3`, { cache: 'no-store' });
    const data = await res.json();
    const quote = data?.quotes?.[0];
    if (!quote) return null;
    const news = (data?.news || []).slice(0, 2).map((n: Record<string, string>) => ({
      title: n.title || '',
      publisher: n.publisher || '',
    }));
    return {
      name: quote.longname || quote.shortname || ticker,
      sector: quote.sector || '',
      industry: quote.industry || '',
      exchange: quote.exchange || '',
      news,
    };
  } catch { return null; }
}

// Generate AI analysis based on price data
function generateAnalysis(ticker: string, name: string, change: number, price: number, weekHigh52: number, weekLow52: number, sector: string, news: { title: string }[]): { catalyst: string; outlook: string; signal: 'bullish' | 'bearish' | 'neutral' } {
  const pctFrom52High = weekHigh52 > 0 ? ((price - weekHigh52) / weekHigh52 * 100) : 0;
  const pctFrom52Low = weekLow52 > 0 ? ((price - weekLow52) / weekLow52 * 100) : 0;

  // Catalyst from news
  let catalyst = '';
  if (news.length > 0) {
    catalyst = news[0].title;
  } else if (change > 20) {
    catalyst = `${name} surged ${change.toFixed(0)}% on heavy volume, likely driven by sector momentum in ${sector || 'the market'}`;
  } else if (change > 10) {
    catalyst = `Strong buying pressure pushed ${ticker} up ${change.toFixed(0)}%. Possible catalyst: institutional interest or earnings sentiment.`;
  } else {
    catalyst = `${ticker} gained ${change.toFixed(1)}% amid positive market conditions.`;
  }

  // AI outlook
  let outlook = '';
  let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';

  if (change > 30) {
    outlook = `Extreme move (+${change.toFixed(0)}%). High volatility expected. Consider waiting for consolidation before entry. Risk of pullback is elevated.`;
    signal = 'neutral';
  } else if (change > 15 && pctFrom52High < -20) {
    outlook = `Strong recovery move. Still ${Math.abs(pctFrom52High).toFixed(0)}% below 52-week high ($${weekHigh52.toFixed(2)}). Potential for further upside if momentum holds.`;
    signal = 'bullish';
  } else if (change > 10 && pctFrom52High > -10) {
    outlook = `Approaching 52-week high ($${weekHigh52.toFixed(2)}). Breakout potential if volume sustains. Watch for resistance.`;
    signal = 'bullish';
  } else if (change > 5) {
    outlook = `Moderate gain. Up ${pctFrom52Low.toFixed(0)}% from 52-week low. ${sector} sector showing strength.`;
    signal = 'bullish';
  } else {
    outlook = `Modest move. Trading in established range. Monitor volume for direction.`;
    signal = 'neutral';
  }

  return { catalyst, outlook, signal };
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

        const price = parseFloat(s.price);
        const change = parseFloat(s.change_percentage?.replace('%', '') || '0');
        const wh = details?.weekHigh52 || 0;
        const wl = details?.weekLow52 || 0;

        // AI analysis for top 3 only
        const analysis = i < 3 ? generateAnalysis(ticker, info?.name || ticker, change, price, wh, wl, info?.sector || '', info?.news || []) : null;

        return {
          rank: i + 1,
          ticker,
          name: info?.name || ticker,
          sector: info?.sector || '',
          industry: info?.industry || '',
          exchange: info?.exchange || '',
          price,
          change,
          changeAmount: parseFloat(s.change_amount || '0'),
          volume: parseInt(s.volume || '0'),
          weekHigh52: wh,
          weekLow52: wl,
          prevClose: details?.prevClose || 0,
          news: (info?.news || []).slice(0, 2),
          analysis: analysis ? { catalyst: analysis.catalyst, outlook: analysis.outlook, signal: analysis.signal } : null,
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
