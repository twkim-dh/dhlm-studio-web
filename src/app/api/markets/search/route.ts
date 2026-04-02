import { NextResponse } from 'next/server';
import { TOP_STOCKS } from '@/data/top-stocks';

const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

// Local fallback search when FMP is rate-limited
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

function localSearch(q: string) {
  const query = q.toUpperCase();
  return TOP_STOCKS
    .filter(t => t.toUpperCase().includes(query) || (STOCK_NAMES[t] || '').toUpperCase().includes(query))
    .slice(0, 15)
    .map(t => ({ symbol: t, name: STOCK_NAMES[t] || t, currency: 'USD', exchangeShortName: 'US' }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ results: [], error: 'Query required' }, { status: 400 });
  }

  if (!FMP_KEY) {
    return NextResponse.json({ results: [], error: 'FMP_API_KEY not configured' }, /* graceful */);
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

    // If all FMP endpoints failed, use local fallback
    if (results.length === 0) {
      results = localSearch(q);
    }

    return NextResponse.json({ results });
  } catch {
    // FMP completely down — use local search
    const fallback = localSearch(q);
    return NextResponse.json({ results: fallback });
  }
}
