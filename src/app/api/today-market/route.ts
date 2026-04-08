import { NextResponse } from 'next/server';

// /api/today-market — single endpoint that aggregates the data needed for
// the home page TODAY'S MARKET section. Per Daily Brief Format Proposal §1.
//
// Sources:
//   - FMP: indices (^GSPC, ^IXIC, ^DJI), macro (^VIX, ^TNX, GCUSD, CLUSD)
//   - CoinGecko: BTC, ETH
//   - alternative.me: Fear & Greed Index
//
// Fallback rule: if any single source fails, return the last known good
// values from in-memory cache. NEVER return empty or "Loading...".

const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

interface Quote { symbol: string; price: number; change: number; changesPercentage: number }
interface CryptoPrice { id: string; price: number; change24h: number }
interface FearGreed { value: number; label: string }
interface TodayMarketPayload {
  asOf: string;
  indices: Quote[];
  macro: Quote[];
  crypto: CryptoPrice[];
  fearGreed: FearGreed;
  verdict: { text: string; trigger: string };
  source: 'live' | 'cached' | 'fallback';
}

// Static fallback used only when both live AND cache are empty.
const FALLBACK: Omit<TodayMarketPayload, 'asOf' | 'source' | 'verdict'> = {
  indices: [
    { symbol: '^GSPC', price: 5612.40, change: -135.20, changesPercentage: -2.36 },
    { symbol: '^IXIC', price: 17834.50, change: -485.30, changesPercentage: -2.65 },
    { symbol: '^DJI',  price: 41250.80, change: -780.40, changesPercentage: -1.86 },
  ],
  macro: [
    { symbol: 'CLUSD', price:  78.40, change: 1.20, changesPercentage:  1.55 },
    { symbol: 'GCUSD', price: 2342.50, change: 18.30, changesPercentage:  0.79 },
    { symbol: '^VIX',  price:  23.70, change: 4.10, changesPercentage: 20.92 },
    { symbol: '^TNX',  price:   4.42, change: 0.11, changesPercentage:  2.55 },
  ],
  crypto: [
    { id: 'bitcoin',  price: 66850, change24h:  1.4 },
    { id: 'ethereum', price:  2030, change24h:  2.1 },
  ],
  fearGreed: { value: 38, label: 'Fear' },
};

let cache: { data: TodayMarketPayload; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

async function fmpQuote(symbols: string[]): Promise<Quote[] | null> {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE}/quote?symbol=${symbols.join(',')}&apikey=${FMP_KEY}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data.map((d: Record<string, unknown>) => ({
      symbol: String(d.symbol),
      price: Number(d.price) || 0,
      change: Number(d.change) || 0,
      changesPercentage: Number(d.changesPercentage) || 0,
    }));
  } catch { return null; }
}

async function coinGeckoPrices(): Promise<CryptoPrice[] | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { cache: 'no-store', headers: { 'accept': 'application/json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const out: CryptoPrice[] = [];
    for (const id of ['bitcoin', 'ethereum']) {
      if (data[id]) out.push({ id, price: Number(data[id].usd) || 0, change24h: Number(data[id].usd_24h_change) || 0 });
    }
    return out.length > 0 ? out : null;
  } catch { return null; }
}

async function fearAndGreed(): Promise<FearGreed | null> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.data?.[0]) return null;
    return { value: Number(data.data[0].value) || 50, label: String(data.data[0].value_classification || 'Neutral') };
  } catch { return null; }
}

// Brutal AI verdict — auto-generated from market state per PROPOSAL §5.1.
// Returns the FIRST matching trigger so order matters: most extreme first.
function generateVerdict(d: Pick<TodayMarketPayload, 'indices' | 'macro' | 'crypto' | 'fearGreed'>): { text: string; trigger: string } {
  const sp500 = d.indices.find(x => x.symbol === '^GSPC');
  const vix = d.macro.find(x => x.symbol === '^VIX');
  const oil = d.macro.find(x => x.symbol === 'CLUSD');
  const btc = d.crypto.find(x => x.id === 'bitcoin');
  const fg = d.fearGreed;

  if (vix && vix.price > 30) {
    return { trigger: 'VIX>30',
      text: `VIX at ${vix.price.toFixed(1)} is the kind of reading that retires careers — when fear is this expensive, the only people sleeping well are the ones who already sold or are about to buy.` };
  }
  if (oil && oil.price > 100) {
    return { trigger: 'Oil>100',
      text: `Oil through $100 again, and every supply chain spreadsheet built around $80 just got downgraded — the energy sector is up while everything else figures out what 2022 felt like.` };
  }
  if (sp500 && sp500.changesPercentage < -2) {
    return { trigger: 'SP500<-2%',
      text: `S&P down ${Math.abs(sp500.changesPercentage).toFixed(1)} percent in a single session is a 1-in-30 trading day event — the AI mega-caps trading at 45x forward earnings have a precision intolerance for any macro volatility.` };
  }
  if (sp500 && sp500.changesPercentage > 2) {
    return { trigger: 'SP500>+2%',
      text: `S&P up ${sp500.changesPercentage.toFixed(1)} percent on no specific catalyst is the kind of rally that looks great on the daily chart and embarrassing in the quarterly performance review.` };
  }
  if (btc && btc.change24h < -5) {
    return { trigger: 'BTC<-5%',
      text: `Bitcoin down ${Math.abs(btc.change24h).toFixed(1)} percent in 24 hours, the ETF outflows about to print, and the same Twitter accounts that called the bottom in March are now saying it was always going to be this way.` };
  }
  if (fg && fg.value < 25) {
    return { trigger: 'F&G<25',
      text: `Fear and Greed at ${fg.value} (${fg.label}) — historically, every reading below 25 in the past decade has marked a tradeable bottom within 30 days, and every reading has felt completely justified at the time.` };
  }
  if (fg && fg.value > 75) {
    return { trigger: 'F&G>75',
      text: `Fear and Greed at ${fg.value} (${fg.label}) is the sentiment equivalent of a 2 percent VIX — the market is pricing in zero things going wrong, which has historically preceded several things going wrong.` };
  }
  if (vix && vix.price < 15) {
    return { trigger: 'VIX<15',
      text: `VIX below 15 means option traders are pricing in a 0.9 percent average daily move — the calmest waters arrive right before someone notices the iceberg.` };
  }
  // Default neutral verdict — still must contain a number per BAAF rule.
  const sp = sp500 ? sp500.price.toFixed(0) : '5,600';
  return { trigger: 'neutral',
    text: `S&P ${sp}, VIX ${vix ? vix.price.toFixed(1) : '20'}, Bitcoin ${btc ? '$' + Math.round(btc.price).toLocaleString() : '$66K'} — markets are quiet, which is exactly when the next catalyst is being written into a Bloomberg terminal nobody has read yet.` };
}

export async function GET() {
  // Serve from cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json({ ...cache.data, source: 'cached' });
  }

  // Try live in parallel
  const [indices, macro, crypto, fg] = await Promise.all([
    fmpQuote(['^GSPC', '^IXIC', '^DJI']),
    fmpQuote(['CLUSD', 'GCUSD', '^VIX', '^TNX']),
    coinGeckoPrices(),
    fearAndGreed(),
  ]);

  // Build payload — replace any null with last cache or static fallback per field.
  const lastGood = cache?.data;
  const payload: TodayMarketPayload = {
    asOf: new Date().toISOString(),
    indices: indices || lastGood?.indices || FALLBACK.indices,
    macro:   macro   || lastGood?.macro   || FALLBACK.macro,
    crypto:  crypto  || lastGood?.crypto  || FALLBACK.crypto,
    fearGreed: fg    || lastGood?.fearGreed || FALLBACK.fearGreed,
    verdict: { text: '', trigger: '' },
    source: indices && macro && crypto && fg ? 'live' : (lastGood ? 'cached' : 'fallback'),
  };
  payload.verdict = generateVerdict(payload);

  // Update cache only on full success
  if (payload.source === 'live') {
    cache = { data: payload, ts: Date.now() };
  }

  return NextResponse.json(payload);
}
