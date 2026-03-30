import { NextResponse } from 'next/server';

// Alpha Vantage (commercial use allowed, 25 req/day free)
const AV_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
// Financial Modeling Prep (commercial use allowed, 250 req/day free)
const FMP_KEY = process.env.FMP_API_KEY || '';

let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 300000; // 5 min

// Fetch company profile from FMP (commercial-safe)
async function getCompanyProfile(ticker: string): Promise<{
  name: string; sector: string; industry: string; exchange: string;
  description: string; ceo: string; employees: string; country: string;
  marketCap: number; website: string; image: string;
} | null> {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_KEY}`, { cache: 'no-store' });
    const data = await res.json();
    const p = Array.isArray(data) ? data[0] : null;
    if (!p) return null;
    return {
      name: p.companyName || ticker,
      sector: p.sector || '',
      industry: p.industry || '',
      exchange: p.exchangeShortName || p.exchange || '',
      description: (p.description || '').slice(0, 200),
      ceo: p.ceo || '',
      employees: p.fullTimeEmployees ? `${Number(p.fullTimeEmployees).toLocaleString()}` : '',
      country: p.country || '',
      marketCap: p.mktCap || 0,
      website: p.website || '',
      image: p.image || '',
    };
  } catch { return null; }
}

// Generate AI analysis based on price data
function generateAnalysis(ticker: string, name: string, change: number, price: number, sector: string): {
  catalyst: string; outlook: string; signal: 'bullish' | 'bearish' | 'neutral';
} {
  let catalyst = '';
  let outlook = '';
  let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';

  if (change > 30) {
    catalyst = `${name} surged ${change.toFixed(0)}% on massive volume. Likely driven by major news catalyst — contract win, earnings beat, or sector momentum.`;
    outlook = `Extreme volatility. High risk of pullback. Wait for consolidation before considering entry.`;
    signal = 'neutral';
  } else if (change > 15) {
    catalyst = `Strong surge in ${name} (+${change.toFixed(0)}%). ${sector} sector seeing elevated interest from institutional buyers.`;
    outlook = `Significant momentum. If volume sustains, further upside possible. Watch for profit-taking.`;
    signal = 'bullish';
  } else if (change > 8) {
    catalyst = `${name} gained ${change.toFixed(0)}% amid positive sentiment in the ${sector || 'broader market'} sector.`;
    outlook = `Moderate bullish momentum. Consider entry on pullback to support levels.`;
    signal = 'bullish';
  } else {
    catalyst = `${ticker} rose ${change.toFixed(1)}% in today's session.`;
    outlook = `Modest gain. Monitor for continuation or reversal.`;
    signal = 'neutral';
  }

  return { catalyst, outlook, signal };
}

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  try {
    // 1. Get top gainers from Alpha Vantage
    const res = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${AV_KEY}`,
      { cache: 'no-store' }
    );
    const raw = await res.json();

    if (!raw.top_gainers) {
      return NextResponse.json({ error: 'No data available', note: raw.Note || raw.Information || '' }, { status: 503 });
    }

    // 2. Enrich top 10 with FMP company profiles
    const topGainers = raw.top_gainers.slice(0, 10);
    const movers = await Promise.all(
      topGainers.map(async (s: Record<string, string>, i: number) => {
        const ticker = s.ticker;
        const price = parseFloat(s.price);
        const change = parseFloat(s.change_percentage?.replace('%', '') || '0');
        const volume = parseInt(s.volume || '0');

        // FMP profile for top 3 (save API calls)
        const profile = i < 3 ? await getCompanyProfile(ticker) : null;

        // AI analysis for top 3
        const analysis = i < 3 ? generateAnalysis(ticker, profile?.name || ticker, change, price, profile?.sector || '') : null;

        return {
          rank: i + 1,
          ticker,
          name: profile?.name || ticker,
          sector: profile?.sector || '',
          industry: profile?.industry || '',
          exchange: profile?.exchange || '',
          description: profile?.description || '',
          ceo: profile?.ceo || '',
          employees: profile?.employees || '',
          country: profile?.country || '',
          marketCap: profile?.marketCap || 0,
          image: profile?.image || '',
          price,
          change,
          changeAmount: parseFloat(s.change_amount || '0'),
          volume,
          analysis,
        };
      })
    );

    const result = {
      date: new Date().toISOString().split('T')[0],
      movers,
      lastUpdated: new Date().toISOString(),
      source: 'Alpha Vantage + Financial Modeling Prep',
    };

    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
