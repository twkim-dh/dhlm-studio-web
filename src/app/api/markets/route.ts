import { NextResponse } from 'next/server';

const AV_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 300000; // 5 min

async function fmpProfile(ticker: string) {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE}/profile?symbol=${ticker}&apikey=${FMP_KEY}`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
  } catch { return null; }
}

async function fmpFinancials(ticker: string) {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE}/income-statement?symbol=${ticker}&period=annual&limit=1&apikey=${FMP_KEY}`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
  } catch { return null; }
}

function fmtCap(v: number) { return v >= 1e12 ? `$${(v/1e12).toFixed(2)}T` : v >= 1e9 ? `$${(v/1e9).toFixed(0)}B` : `$${(v/1e6).toFixed(0)}M`; }
function fmtRev(v: number) { return v >= 1e9 ? `$${(v/1e9).toFixed(0)}B` : `$${(v/1e6).toFixed(0)}M`; }

function enrichItem(s: Record<string, string>, i: number, profile: Record<string, unknown> | null, fin: Record<string, unknown> | null) {
  return {
    rank: i + 1,
    ticker: s.ticker,
    name: (profile?.companyName as string) || s.ticker,
    sector: (profile?.sector as string) || '',
    industry: (profile?.industry as string) || '',
    exchange: (profile?.exchange as string) || '',
    ceo: (profile?.ceo as string) || '',
    employees: (profile?.fullTimeEmployees as string) || '',
    description: profile?.description ? (profile.description as string).slice(0, 200) + '...' : '',
    image: (profile?.image as string) || '',
    marketCap: (profile?.marketCap as number) || 0,
    marketCapFmt: profile?.marketCap ? fmtCap(profile.marketCap as number) : '',
    range52w: (profile?.range as string) || '',
    price: parseFloat(s.price),
    change: parseFloat(s.change_percentage?.replace('%', '') || '0'),
    volume: parseInt(s.volume || '0'),
    revenue: fin?.revenue ? fmtRev(fin.revenue as number) : '',
    netIncome: fin?.netIncome ? fmtRev(fin.netIncome as number) : '',
    eps: (fin?.epsDiluted as number) || '',
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all'; // all, gainers, losers, actives

  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  try {
    // Single API call gets gainers + losers + most active
    const avRes = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${AV_KEY}`, { cache: 'no-store' });
    const avData = await avRes.json();
    if (!avData.top_gainers) {
      return NextResponse.json({ error: 'No data', note: avData.Note || avData.Information || '' }, { status: 503 });
    }

    // Enrich top 3 gainers with FMP profiles + financials
    const gainersRaw = avData.top_gainers.slice(0, 10);
    const losersRaw = avData.top_losers.slice(0, 10);
    const activesRaw = avData.most_actively_traded.slice(0, 10);

    const gainers = await Promise.all(gainersRaw.map(async (s: Record<string, string>, i: number) => {
      const profile = i < 3 ? await fmpProfile(s.ticker) : null;
      const fin = i < 3 ? await fmpFinancials(s.ticker) : null;
      return enrichItem(s, i, profile, fin);
    }));

    const losers = losersRaw.map((s: Record<string, string>, i: number) => enrichItem(s, i, null, null));
    const actives = activesRaw.map((s: Record<string, string>, i: number) => enrichItem(s, i, null, null));

    const result = {
      date: avData.last_updated || new Date().toISOString().split('T')[0],
      gainers,
      losers,
      actives,
      lastUpdated: new Date().toISOString(),
      source: 'Alpha Vantage + Financial Modeling Prep',
    };

    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
