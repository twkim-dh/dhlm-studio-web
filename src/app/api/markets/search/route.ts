import { NextResponse } from 'next/server';
import { TOP_STOCKS } from '@/data/top-stocks';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';
import { getRedis } from '@/lib/redis';

const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';
const SEARCH_CACHE_TTL = 3600; // 1 hour — same query returns same stocks

type SearchResult = { symbol: string; name: string; currency: string; exchangeShortName: string };

// Local fallback search when FMP is rate-limited or budget exhausted
const STOCK_NAMES: Record<string, string> = {
  NVDA:'NVIDIA Corp',AAPL:'Apple Inc',MSFT:'Microsoft Corp',GOOGL:'Alphabet Inc',AMZN:'Amazon.com Inc',
  META:'Meta Platforms',TSLA:'Tesla Inc',AVGO:'Broadcom Inc',JPM:'JPMorgan Chase',V:'Visa Inc',
  UNH:'UnitedHealth Group',XOM:'Exxon Mobil',MA:'Mastercard',ORCL:'Oracle Corp',NVO:'Novo Nordisk',
  COST:'Costco Wholesale',HD:'Home Depot',PG:'Procter & Gamble',JNJ:'Johnson & Johnson',NFLX:'Netflix Inc',
  BAC:'Bank of America',ABBV:'AbbVie Inc',CRM:'Salesforce Inc',AMD:'AMD Inc',CVX:'Chevron Corp',
  KO:'Coca-Cola Co',MRK:'Merck & Co',TMUS:'T-Mobile US',CSCO:'Cisco Systems',PEP:'PepsiCo Inc',
  TMO:'Thermo Fisher',ACN:'Accenture',LIN:'Linde PLC',MCD:"McDonald's Corp",ABT:'Abbott Labs',
  WFC:'Wells Fargo',IBM:'IBM Corp',GE:'GE Aerospace',ADBE:'Adobe Inc',PM:'Philip Morris',
  ISRG:'Intuitive Surgical',NOW:'ServiceNow',MS:'Morgan Stanley',AXP:'American Express',
  QCOM:'Qualcomm',GS:'Goldman Sachs',DIS:'Walt Disney',TXN:'Texas Instruments',INTU:'Intuit',
  CAT:'Caterpillar',PFE:'Pfizer',BKNG:'Booking Holdings',VZ:'Verizon',T:'AT&T Inc',
  PLTR:'Palantir Tech',COIN:'Coinbase',SNOW:'Snowflake',SHOP:'Shopify',SQ:'Block Inc',
  PYPL:'PayPal',GME:'GameStop',AMC:'AMC Entertainment',RIVN:'Rivian',NIO:'NIO Inc',
  MSTR:'MicroStrategy',MARA:'Marathon Digital',RIOT:'Riot Platforms',BABA:'Alibaba Group',
  SOFI:'SoFi Technologies',RBLX:'Roblox Corp',SNAP:'Snap Inc',SPOT:'Spotify',
};

function localSearch(q: string): SearchResult[] {
  const query = q.toUpperCase();
  return TOP_STOCKS
    .filter(t => t.toUpperCase().includes(query) || (STOCK_NAMES[t] || '').toUpperCase().includes(query))
    .slice(0, 15)
    .map(t => ({ symbol: t, name: STOCK_NAMES[t] || t, currency: 'USD', exchangeShortName: 'US' }));
}

function redisSearchKey(q: string): string {
  return `fmp:search:${q.toLowerCase().trim().slice(0, 40)}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ results: [], error: 'Query required' }, { status: 400 });
  }

  // 1. Redis cache check — same query reuses results for 1 hour
  try {
    const redis = getRedis();
    const cached = await redis.get(redisSearchKey(q));
    if (cached) {
      return NextResponse.json({ results: JSON.parse(cached), cached: true });
    }
  } catch { /* Redis miss — proceed */ }

  if (!FMP_KEY) {
    return NextResponse.json({ results: localSearch(q) });
  }

  // 2. Budget guard — use local search if FMP quota exhausted
  if (!(await fmpCanCall())) {
    return NextResponse.json({ results: localSearch(q), fallback: true });
  }

  try {
    let results: SearchResult[] = [];
    let callCount = 0;

    // Try search-name first, then search-symbol as fallback
    for (const endpoint of ['search-name', 'search-symbol']) {
      if (!(await fmpCanCall())) break; // re-check between calls
      const res = await fetch(
        `${FMP_BASE}/${endpoint}?query=${encodeURIComponent(q)}&limit=15&apikey=${FMP_KEY}`,
        { cache: 'no-store' }
      );
      callCount++;
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

    // Track however many FMP calls we made
    if (callCount > 0) await fmpTrackCall(callCount);

    // If FMP returns nothing, use local fallback (no extra FMP calls)
    if (results.length === 0) {
      results = localSearch(q);
    }

    // Cache successful FMP results in Redis for 1 hour
    if (results.length > 0) {
      try {
        const redis = getRedis();
        await redis.set(redisSearchKey(q), JSON.stringify(results), 'EX', SEARCH_CACHE_TTL);
      } catch { /* Redis write failure is non-fatal */ }
    }

    return NextResponse.json({ results });
  } catch {
    // FMP completely down — use local search
    return NextResponse.json({ results: localSearch(q) });
  }
}
