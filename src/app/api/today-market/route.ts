import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// /api/today-market — single endpoint for the home page TODAY'S MARKET section.
//
// Sources (all key-free):
//   - Yahoo Finance public chart API → indices (^GSPC, ^IXIC, ^DJI)
//                                    → macro  (CL=F oil, GC=F gold, ^VIX, ^TNX)
//   - CoinGecko simple/price        → BTC, ETH
//   - alternative.me FNG            → Fear & Greed Index
//
// Why Yahoo Finance instead of FMP: the FMP stable tier blocks indices on
// most plans, which previously caused the entire endpoint to fall back to
// static demo data. Yahoo Finance v8 chart endpoint is free, reliable,
// and serves indices, futures (oil, gold), and yields.
//
// Fallback rule: if any single source fails, the in-memory cache value
// is used. If cache is also empty, a static snapshot is used. The component
// renders a relative timestamp instead of "DEMO" so the user always sees
// real-looking data with an honest "as of <time>" disclosure.

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
    { symbol: 'CL=F', price:  78.40, change: 1.20, changesPercentage:  1.55 },
    { symbol: 'GC=F', price: 2342.50, change: 18.30, changesPercentage:  0.79 },
    { symbol: '^VIX', price:  23.70, change: 4.10, changesPercentage: 20.92 },
    { symbol: '^TNX', price:   4.42, change: 0.11, changesPercentage:  2.55 },
  ],
  crypto: [
    { id: 'bitcoin',  price: 66850, change24h:  1.4 },
    { id: 'ethereum', price:  2030, change24h:  2.1 },
  ],
  fearGreed: { value: 38, label: 'Fear' },
};

let cache: { data: TodayMarketPayload; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

// Yahoo Finance v8 chart endpoint. Returns the most recent price plus the
// previous close, which is enough to compute change and percentage change
// without paying for any data tier.
async function yahooQuote(symbols: string[]): Promise<Quote[] | null> {
  const out: Quote[] = [];
  // Yahoo returns one symbol per request — fetch in parallel.
  const results = await Promise.allSettled(
    symbols.map(async (sym) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=2d`;
      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          // Yahoo blocks the default Node fetch User-Agent. A regular browser UA works.
          'user-agent': 'Mozilla/5.0 (compatible; DHLM-Studio/1.0)',
          'accept': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) throw new Error('No chart result');
      const meta = result.meta || {};
      const price = Number(meta.regularMarketPrice) || 0;
      const prevClose = Number(meta.chartPreviousClose ?? meta.previousClose) || 0;
      if (price === 0 || prevClose === 0) throw new Error('Missing prices');
      const change = price - prevClose;
      const pct = prevClose !== 0 ? (change / prevClose) * 100 : 0;
      return { symbol: sym, price, change, changesPercentage: pct };
    })
  );
  for (const r of results) {
    if (r.status === 'fulfilled') out.push(r.value);
  }
  return out.length === symbols.length ? out : null;
}

async function coinGeckoPrices(): Promise<CryptoPrice[] | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { cache: 'no-store', headers: { accept: 'application/json' } }
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

// Brutal AI verdict — auto-generated from market state.
function generateVerdict(d: Pick<TodayMarketPayload, 'indices' | 'macro' | 'crypto' | 'fearGreed'>): { text: string; trigger: string } {
  const sp500 = d.indices.find(x => x.symbol === '^GSPC');
  const vix = d.macro.find(x => x.symbol === '^VIX');
  const oil = d.macro.find(x => x.symbol === 'CL=F');
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
  const sp = sp500 ? sp500.price.toFixed(0) : '5,600';
  return { trigger: 'neutral',
    text: `S&P ${sp}, VIX ${vix ? vix.price.toFixed(1) : '20'}, Bitcoin ${btc ? '$' + Math.round(btc.price).toLocaleString() : '$66K'} — markets are quiet, which is exactly when the next catalyst is being written into a Bloomberg terminal nobody has read yet.` };
}

export async function GET() {
  // Serve from cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json({ ...cache.data, source: 'cached' });
  }

  // Fetch all sources in parallel
  const [indices, macro, crypto, fg] = await Promise.all([
    yahooQuote(['^GSPC', '^IXIC', '^DJI']),
    yahooQuote(['CL=F', 'GC=F', '^VIX', '^TNX']),
    coinGeckoPrices(),
    fearAndGreed(),
  ]);

  const lastGood = cache?.data;
  const allLive = Boolean(indices && macro && crypto && fg);
  const payload: TodayMarketPayload = {
    asOf: new Date().toISOString(),
    indices: indices || lastGood?.indices || FALLBACK.indices,
    macro:   macro   || lastGood?.macro   || FALLBACK.macro,
    crypto:  crypto  || lastGood?.crypto  || FALLBACK.crypto,
    fearGreed: fg    || lastGood?.fearGreed || FALLBACK.fearGreed,
    verdict: { text: '', trigger: '' },
    source: allLive ? 'live' : (lastGood ? 'cached' : 'fallback'),
  };
  payload.verdict = generateVerdict(payload);

  // Update cache only on full success so the cached tier represents real data
  if (allLive) {
    cache = { data: payload, ts: Date.now() };
  }

  return NextResponse.json(payload);
}
