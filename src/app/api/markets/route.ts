import { NextResponse } from 'next/server';

// Alpha Vantage — gainers list (commercial OK, 25/day free)
const AV_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
// FMP — company profiles & financials (commercial OK, 250/day free)
const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 300000; // 5 min

// FMP: Company profile (name, sector, CEO, employees, description, logo, marketCap)
async function fmpProfile(ticker: string) {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE}/profile?symbol=${ticker}&apikey=${FMP_KEY}`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
  } catch { return null; }
}

// FMP: Income statement (revenue, netIncome, eps)
async function fmpFinancials(ticker: string) {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE}/income-statement?symbol=${ticker}&period=annual&limit=1&apikey=${FMP_KEY}`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
  } catch { return null; }
}

function fmtCap(v: number) { return v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T` : v >= 1e9 ? `$${(v / 1e9).toFixed(0)}B` : `$${(v / 1e6).toFixed(0)}M`; }
function fmtRev(v: number) { return v >= 1e9 ? `$${(v / 1e9).toFixed(0)}B` : `$${(v / 1e6).toFixed(0)}M`; }

// AI analysis
function analyze(name: string, change: number, sector: string, mktCap: number, revenue: number, netIncome: number) {
  let catalyst = '', outlook = '', signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';

  if (change > 30) {
    catalyst = `${name} surged ${change.toFixed(0)}% — likely driven by major catalyst (contract win, earnings beat, or sector momentum).`;
    outlook = `Extreme volatility (+${change.toFixed(0)}%). High pullback risk. Wait for consolidation.`;
  } else if (change > 15) {
    catalyst = `Strong surge in ${name} (+${change.toFixed(0)}%). ${sector} sector seeing elevated institutional interest.`;
    outlook = `Significant momentum. Watch for profit-taking. ${mktCap > 0 ? `Market cap: ${fmtCap(mktCap)}.` : ''}`;
    signal = 'bullish';
  } else if (change > 8) {
    catalyst = `${name} gained ${change.toFixed(0)}% amid positive ${sector || 'market'} sentiment.`;
    outlook = revenue > 0 ? `Revenue: ${fmtRev(revenue)}, Net Income: ${fmtRev(netIncome)}. Moderate bullish.` : `Moderate bullish momentum.`;
    signal = 'bullish';
  } else {
    catalyst = `${name} rose ${change.toFixed(1)}% in today's session.`;
    outlook = `Modest gain. Monitor for continuation.`;
  }
  return { catalyst, outlook, signal };
}

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  try {
    // 1. Alpha Vantage — top gainers
    const avRes = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${AV_KEY}`, { cache: 'no-store' });
    const avData = await avRes.json();
    if (!avData.top_gainers) {
      return NextResponse.json({ error: 'No data', note: avData.Note || avData.Information || '' }, { status: 503 });
    }

    // 2. Enrich top 10 with FMP profiles (top 3 get financials + analysis)
    const top10 = avData.top_gainers.slice(0, 10);
    const movers = await Promise.all(top10.map(async (s: Record<string, string>, i: number) => {
      const ticker = s.ticker;
      const price = parseFloat(s.price);
      const change = parseFloat(s.change_percentage?.replace('%', '') || '0');
      const volume = parseInt(s.volume || '0');

      // FMP profile for top 5 (save API calls)
      const profile = i < 5 ? await fmpProfile(ticker) : null;
      // FMP financials for top 3 only
      const fin = i < 3 ? await fmpFinancials(ticker) : null;
      // AI analysis for top 3
      const analysis = i < 3 ? analyze(
        profile?.companyName || ticker, change, profile?.sector || '',
        profile?.marketCap || 0, fin?.revenue || 0, fin?.netIncome || 0
      ) : null;

      return {
        rank: i + 1,
        ticker,
        name: profile?.companyName || ticker,
        sector: profile?.sector || '',
        industry: profile?.industry || '',
        exchange: profile?.exchange || '',
        country: profile?.country || '',
        ceo: profile?.ceo || '',
        employees: profile?.fullTimeEmployees || '',
        description: profile?.description ? (profile.description as string).slice(0, 200) + '...' : '',
        image: profile?.image || '',
        website: profile?.website || '',
        marketCap: profile?.marketCap || 0,
        marketCapFmt: profile?.marketCap ? fmtCap(profile.marketCap as number) : '',
        range52w: profile?.range || '',
        price, change, volume,
        // Financials (top 3)
        revenue: fin?.revenue ? fmtRev(fin.revenue) : '',
        netIncome: fin?.netIncome ? fmtRev(fin.netIncome) : '',
        eps: fin?.epsDiluted || '',
        // AI analysis (top 3)
        analysis,
      };
    }));

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
