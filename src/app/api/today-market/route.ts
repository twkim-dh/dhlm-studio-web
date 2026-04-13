import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { fmpCanCall, fmpTrackCall, fmpCallsToday } from '@/lib/fmp-tracker';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// /api/today-market — single endpoint for the home page TODAY'S MARKET section.
//
// Sources (all licensed for commercial use):
//   - FMP /stable/quote      → ^GSPC, ^IXIC, ^DJI, ^VIX, GCUSD
//                              (single-symbol calls; comma lists are premium-only)
//   - FMP /stable/treasury-rates → year10 field for the 10Y yield
//                              (^TNX direct quote is premium-only)
//   - Alpha Vantage WTI       → CLUSD oil (FMP commodity quotes are premium-only)
//   - CoinGecko simple/price  → BTC, ETH (free, no auth)
//   - CNN Business F&G        → equity sentiment (production.dataviz.cnn.io,
//                              requires Chrome user-agent + Origin/Referer)
//
// Why CNN F&G instead of alternative.me: alternative.me serves a Crypto
// Fear & Greed index, not the equity-market index. The home page TODAY'S
// MARKET section is an equity dashboard, so showing crypto sentiment in
// the same card was misleading. CNN Business is the canonical equity
// sentiment source.
//
// Why Alpha Vantage for oil: FMP /stable/quote returns "Premium Query
// Parameter" for CLUSD on the current subscription tier. AV WTI endpoint
// is free, requires only the existing ALPHA_VANTAGE_KEY env var, and
// returns daily WTI prices that can be converted to a Quote-shaped result.
//
// Fallback rule: if any single source fails, the in-memory cache value
// is used. If cache is also empty, a static snapshot is used. The component
// renders an honest "as of HH:MM UTC" disclosure — never a "DEMO" label.

interface Quote { symbol: string; price: number; change: number; changesPercentage: number }
interface CryptoPrice { id: string; price: number; change24h: number }
interface FearGreed { value: number; label: string; source: string }
interface TodayMarketPayload {
  asOf: string;
  indices: Quote[];
  macro: Quote[];
  crypto: CryptoPrice[];
  fearGreed: FearGreed;
  verdict: { text: string; trigger: string };
  source: 'live' | 'cached' | 'fallback';
}

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
  fearGreed: { value: 50, label: 'Neutral', source: 'CNN' },
};

/** Crypto is a 24/7 market — separate TTL that ignores weekends.
 *  15 min during US market hours (stays in sync with stock data),
 *  30 min at all other times including weekends. */
function cryptoCacheTtlSeconds(): number {
  const now = new Date();
  const minutesIntoDay = now.getUTCHours() * 60 + now.getUTCMinutes();
  return (minutesIntoDay >= 13 * 60 + 30 && minutesIntoDay < 20 * 60) ? 15 * 60 : 30 * 60;
}

// Two-layer cache: in-memory per serverless instance + Redis shared.
// Redis is the source of truth — every cold start checks Redis before
// touching the live APIs. The in-memory layer is just a hot cache for
// repeat reads on the same warm instance.
// v3: bumped 2026-04-11 to flush cached data that had CL=F/GC=F symbols
const REDIS_KEY = 'today-market:cache:v3';
// Separate crypto cache key — uses cryptoCacheTtlSeconds() so BTC/ETH
// refresh every 30 min on weekends instead of the 120-min stock TTL.
const REDIS_CRYPTO_KEY = 'today-market:crypto:v3';
let memCache: { data: TodayMarketPayload; ts: number } | null = null;
let memCryptoCache: { data: CryptoPrice[]; ts: number } | null = null;

// Cache TTL in seconds. Three buckets driven by US market session:
//   - Weekend (Sat/Sun UTC): 120 minutes — almost no real movement
//   - After US close (~21:00 UTC) through pre-open (~13:00 UTC): 60 minutes
//   - During US market hours (13:30-21:00 UTC): 15 minutes — fresh enough
//
// At worst: market hours (6.5 hours / 15 min = 26 windows) +
//           non-market (17.5 hours / 60 min = 17.5 windows) ≈ 44 cache windows.
// With FMP batched call (1 request) + treasury (1 request) per window,
// daily upper bound is ~88 FMP requests, well under the 250 daily limit.
function cacheTtlSeconds(): number {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return 120 * 60;
  const utcHour = now.getUTCHours();
  const utcMin = now.getUTCMinutes();
  const minutesIntoDay = utcHour * 60 + utcMin;
  // US market open 13:30 UTC, close 20:00 UTC (rough — slightly conservative
  // so the 15-min bucket only fires during actual session hours)
  const marketOpen = 13 * 60 + 30;
  const marketClose = 20 * 60;
  if (minutesIntoDay >= marketOpen && minutesIntoDay < marketClose) {
    return 15 * 60;
  }
  return 60 * 60;
}

async function readSharedCache(): Promise<TodayMarketPayload | null> {
  // Try memory first (no network)
  if (memCache && Date.now() - memCache.ts < cacheTtlSeconds() * 1000) {
    return memCache.data;
  }
  // Then Redis
  try {
    const redis = getRedis();
    const raw = await redis.get(REDIS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: TodayMarketPayload; ts: number };
    if (Date.now() - parsed.ts < cacheTtlSeconds() * 1000) {
      memCache = parsed;
      return parsed.data;
    }
  } catch { /* Redis unavailable — fall through to live fetch */ }
  return null;
}

async function writeSharedCache(data: TodayMarketPayload): Promise<void> {
  const entry = { data, ts: Date.now() };
  memCache = entry;
  try {
    const redis = getRedis();
    // EX seconds — Redis evicts automatically
    await redis.set(REDIS_KEY, JSON.stringify(entry), 'EX', cacheTtlSeconds());
  } catch { /* Redis unavailable — memory cache still works for warm instance */ }
}

async function readCryptoCache(): Promise<CryptoPrice[] | null> {
  if (memCryptoCache && Date.now() - memCryptoCache.ts < cryptoCacheTtlSeconds() * 1000) {
    return memCryptoCache.data;
  }
  try {
    const redis = getRedis();
    const raw = await redis.get(REDIS_CRYPTO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: CryptoPrice[]; ts: number };
    if (Date.now() - parsed.ts < cryptoCacheTtlSeconds() * 1000) {
      memCryptoCache = parsed;
      return parsed.data;
    }
  } catch { /* Redis unavailable */ }
  return null;
}

async function writeCryptoCache(data: CryptoPrice[]): Promise<void> {
  const entry = { data, ts: Date.now() };
  memCryptoCache = entry;
  try {
    const redis = getRedis();
    await redis.set(REDIS_CRYPTO_KEY, JSON.stringify(entry), 'EX', cryptoCacheTtlSeconds());
  } catch { /* Redis unavailable — memory cache still works */ }
}

const FMP_KEY = process.env.FMP_API_KEY || '';
const AV_KEY = process.env.ALPHA_VANTAGE_KEY || '';

// FMP may return Yahoo-Finance-style symbols (GC=F, CL=F) even when we
// request canonical names (GCUSD, CLUSD). Normalize at the source so
// every downstream consumer always sees the canonical symbol.
const FMP_SYMBOL_NORMALIZE: Record<string, string> = {
  'GC=F':  'GCUSD',
  'CL=F':  'CLUSD',
  'GCQ25': 'GCUSD',  // front-month futures alias
  'CLM25': 'CLUSD',  // front-month futures alias
};
function normFmpSymbol(sym: string): string {
  return FMP_SYMBOL_NORMALIZE[sym] || sym;
}

// Circuit breaker — when FMP returns 429, set this Redis key with a TTL.
// All FMP fetchers check the flag first and return null without calling
// the API while it is set. This prevents debug requests, cron jobs, or
// stale cache requests from continuing to hammer FMP after the daily
// quota is exhausted.
const FMP_RATE_LIMIT_KEY = 'fmp:rate-limited';

// TTL until UTC midnight — aligns circuit breaker reset with FMP's daily quota reset.
// Minimum 1 hour so a rate-limit event near midnight still gives meaningful protection.
function fmpRateLimitTtl(): number {
  const now = new Date();
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1
  ));
  const secsRemaining = Math.floor((midnight.getTime() - now.getTime()) / 1000);
  return Math.max(3600, secsRemaining);
}

let fmpRateLimitedMem = false;

async function isFmpRateLimited(): Promise<boolean> {
  if (fmpRateLimitedMem) return true;
  try {
    const redis = getRedis();
    const flag = await redis.get(FMP_RATE_LIMIT_KEY);
    if (flag) {
      fmpRateLimitedMem = true;
      return true;
    }
  } catch { /* Redis unavailable — fall through, allow FMP attempt */ }
  return false;
}

async function markFmpRateLimited(): Promise<void> {
  fmpRateLimitedMem = true;
  try {
    const redis = getRedis();
    await redis.set(FMP_RATE_LIMIT_KEY, '1', 'EX', fmpRateLimitTtl());
  } catch { /* ignore */ }
}

// Per-source debug log accumulated within a single GET invocation.
// Returned only when ?debug=1 query param is present.
const debugLog: { source: string; ok: boolean; status?: number; err?: string; sample?: unknown }[] = [];

function dbg(source: string, ok: boolean, extra: { status?: number; err?: string; sample?: unknown } = {}) {
  debugLog.push({ source, ok, ...extra });
}

// FMP /stable/quote — single-symbol parallel because comma-separated
// requests require premium tier.
async function fmpQuoteSingle(symbol: string): Promise<Quote | null> {
  if (!FMP_KEY) { dbg(`fmp:${symbol}`, false, { err: 'FMP_KEY missing' }); return null; }
  if (await isFmpRateLimited()) { dbg(`fmp:${symbol}`, false, { err: 'FMP rate-limited (circuit breaker)' }); return null; }
  if (!(await fmpCanCall())) { dbg(`fmp:${symbol}`, false, { err: 'Daily budget exhausted' }); return null; }
  try {
    const url = `https://financialmodelingprep.com/stable/quote?symbol=${encodeURIComponent(symbol)}&apikey=${FMP_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    await fmpTrackCall();
    if (res.status === 429) { await markFmpRateLimited(); dbg(`fmp:${symbol}`, false, { status: 429, err: 'Rate limited — circuit breaker tripped' }); return null; }
    if (!res.ok) { dbg(`fmp:${symbol}`, false, { status: res.status, err: 'HTTP not ok' }); return null; }
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); }
    catch { dbg(`fmp:${symbol}`, false, { err: 'Not JSON', sample: text.slice(0, 120) }); return null; }
    if (!Array.isArray(data) || !data[0]) { dbg(`fmp:${symbol}`, false, { err: 'Empty array', sample: data }); return null; }
    const d = data[0] as Record<string, unknown>;
    const price = Number(d.price) || 0;
    if (price === 0) { dbg(`fmp:${symbol}`, false, { err: 'price=0', sample: d }); return null; }
    const pct = Number(d.changesPercentage ?? d.changePercentage ?? 0);
    dbg(`fmp:${symbol}`, true, { sample: { price, pct, rawSymbol: d.symbol } });
    // Normalize FMP symbol to canonical form (e.g. GC=F → GCUSD)
    return {
      symbol: normFmpSymbol(String(d.symbol || symbol)),
      price,
      change: Number(d.change) || 0,
      changesPercentage: pct,
    };
  } catch (e) {
    dbg(`fmp:${symbol}`, false, { err: e instanceof Error ? e.message : String(e) });
    return null;
  }
}

async function fmpQuoteMany(symbols: string[]): Promise<Quote[] | null> {
  const results = await Promise.all(symbols.map(fmpQuoteSingle));
  const filtered = results.filter((q): q is Quote => Boolean(q));
  return filtered.length === symbols.length ? filtered : (filtered.length > 0 ? filtered : null);
}

// FMP batched quote — single request for multiple symbols. Tries the path
// format first (legacy convention) and the query-string format second.
// Many free-tier plans accept the path form for indices even when the
// query form returns "Premium Query Parameter".
async function fmpBatchQuote(symbols: string[]): Promise<Quote[] | null> {
  if (!FMP_KEY) { dbg('fmp:batch', false, { err: 'FMP_KEY missing' }); return null; }
  if (await isFmpRateLimited()) { dbg('fmp:batch', false, { err: 'FMP rate-limited (circuit breaker)' }); return null; }
  if (!(await fmpCanCall())) { dbg('fmp:batch', false, { err: 'Daily budget exhausted' }); return null; }
  const csv = symbols.map(encodeURIComponent).join(',');
  const candidates = [
    `https://financialmodelingprep.com/stable/quote?symbol=${csv}&apikey=${FMP_KEY}`,
    `https://financialmodelingprep.com/api/v3/quote/${csv}?apikey=${FMP_KEY}`,
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      await fmpTrackCall();
      if (res.status === 429) { await markFmpRateLimited(); dbg('fmp:batch', false, { status: 429, err: 'Rate limited — circuit breaker tripped' }); return null; }
      if (!res.ok) { dbg('fmp:batch', false, { status: res.status }); continue; }
      const text = await res.text();
      let data; try { data = JSON.parse(text); } catch { continue; }
      if (!Array.isArray(data) || data.length === 0) continue;
      const out: Quote[] = [];
      for (const d of data as Array<Record<string, unknown>>) {
        const rawSym = String(d.symbol || '');
        const sym = normFmpSymbol(rawSym); // normalize GC=F→GCUSD, CL=F→CLUSD
        const price = Number(d.price) || 0;
        if (!sym || price === 0) continue;
        const pct = Number(d.changesPercentage ?? d.changePercentage ?? 0);
        out.push({ symbol: sym, price, change: Number(d.change) || 0, changesPercentage: pct });
      }
      // Re-order to match the requested symbol order
      const ordered = symbols.map(s => out.find(q => q.symbol === s)).filter((q): q is Quote => Boolean(q));
      if (ordered.length === symbols.length) {
        dbg('fmp:batch', true, { sample: { count: ordered.length } });
        return ordered;
      }
    } catch (e) {
      dbg('fmp:batch', false, { err: e instanceof Error ? e.message : String(e) });
    }
  }
  return null;
}

// FMP treasury-rates returns the full curve. We pull year10 and synthesize
// a Quote-shaped object for ^TNX so the rest of the rendering pipeline does
// not need to special-case it.
async function fmpTenYearYield(): Promise<Quote | null> {
  if (!FMP_KEY) { dbg('fmp:treasury', false, { err: 'FMP_KEY missing' }); return null; }
  if (await isFmpRateLimited()) { dbg('fmp:treasury', false, { err: 'FMP rate-limited (circuit breaker)' }); return null; }
  if (!(await fmpCanCall())) { dbg('fmp:treasury', false, { err: 'Daily budget exhausted' }); return null; }
  try {
    const res = await fetch(`https://financialmodelingprep.com/stable/treasury-rates?apikey=${FMP_KEY}`, { cache: 'no-store' });
    await fmpTrackCall();
    if (res.status === 429) { await markFmpRateLimited(); dbg('fmp:treasury', false, { status: 429, err: 'Rate limited — circuit breaker tripped' }); return null; }
    if (!res.ok) { dbg('fmp:treasury', false, { status: res.status }); return null; }
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { dbg('fmp:treasury', false, { err: 'Not JSON', sample: text.slice(0, 120) }); return null; }
    if (!Array.isArray(data) || data.length < 2) { dbg('fmp:treasury', false, { err: 'Bad shape', sample: data }); return null; }
    const today = data[0];
    const yesterday = data[1];
    const price = Number(today?.year10);
    const prev = Number(yesterday?.year10);
    if (!price || !prev) { dbg('fmp:treasury', false, { err: 'Missing year10', sample: { today, yesterday } }); return null; }
    const change = price - prev;
    const pct = prev !== 0 ? (change / prev) * 100 : 0;
    dbg('fmp:treasury', true, { sample: { year10: price } });
    return { symbol: '^TNX', price, change, changesPercentage: pct };
  } catch (e) { dbg('fmp:treasury', false, { err: e instanceof Error ? e.message : String(e) }); return null; }
}

// Alpha Vantage WTI — daily oil prices. Returns the latest two values to
// compute change and percentage change. Free tier allows 25 requests/day,
// well within the 5-minute cache budget.
async function alphaVantageWTI(): Promise<Quote | null> {
  if (!AV_KEY || AV_KEY === 'demo') { dbg('av:wti', false, { err: 'AV_KEY missing or demo' }); return null; }
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=WTI&interval=daily&apikey=${AV_KEY}`, { cache: 'no-store' });
    if (!res.ok) { dbg('av:wti', false, { status: res.status }); return null; }
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { dbg('av:wti', false, { err: 'Not JSON', sample: text.slice(0, 120) }); return null; }
    // Alpha Vantage rate limit response is JSON with a "Note" or "Information" key
    if (data?.Note || data?.Information) { dbg('av:wti', false, { err: 'AV throttled', sample: data }); return null; }
    const arr = Array.isArray(data?.data) ? data.data : null;
    if (!arr || arr.length < 2) { dbg('av:wti', false, { err: 'Bad shape', sample: data }); return null; }
    const today = Number(arr[0]?.value);
    const yesterday = Number(arr[1]?.value);
    if (!today || !yesterday) { dbg('av:wti', false, { err: 'Missing values' }); return null; }
    const change = today - yesterday;
    const pct = yesterday !== 0 ? (change / yesterday) * 100 : 0;
    dbg('av:wti', true, { sample: { wti: today } });
    return { symbol: 'CLUSD', price: today, change, changesPercentage: pct };
  } catch (e) { dbg('av:wti', false, { err: e instanceof Error ? e.message : String(e) }); return null; }
}

async function coinGeckoPrices(): Promise<CryptoPrice[] | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { cache: 'no-store', headers: { accept: 'application/json' } }
    );
    if (!res.ok) { dbg('coingecko', false, { status: res.status }); return null; }
    const data = await res.json();
    const out: CryptoPrice[] = [];
    for (const id of ['bitcoin', 'ethereum']) {
      if (data[id]) out.push({ id, price: Number(data[id].usd) || 0, change24h: Number(data[id].usd_24h_change) || 0 });
    }
    if (out.length === 0) { dbg('coingecko', false, { err: 'No prices', sample: data }); return null; }
    dbg('coingecko', true, { sample: out });
    return out;
  } catch (e) { dbg('coingecko', false, { err: e instanceof Error ? e.message : String(e) }); return null; }
}

// CNN Business Fear & Greed Index. The endpoint is publicly accessible
// but the production CDN requires browser-like headers (User-Agent +
// Origin + Referer) to bypass bot mitigation.
async function cnnFearGreed(): Promise<FearGreed | null> {
  try {
    const res = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata/', {
      cache: 'no-store',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'referer': 'https://edition.cnn.com/markets/fear-and-greed',
        'origin': 'https://edition.cnn.com',
      },
    });
    if (!res.ok) { dbg('cnn:fng', false, { status: res.status }); return null; }
    const data = await res.json();
    const fg = data?.fear_and_greed;
    if (!fg) { dbg('cnn:fng', false, { err: 'Missing fear_and_greed' }); return null; }
    const score = Math.round(Number(fg.score) || 50);
    const ratingRaw = String(fg.rating || 'neutral').toLowerCase();
    const label = ratingRaw.replace(/\b\w/g, c => c.toUpperCase());
    dbg('cnn:fng', true, { sample: { score, label } });
    return { value: score, label, source: 'CNN' };
  } catch (e) { dbg('cnn:fng', false, { err: e instanceof Error ? e.message : String(e) }); return null; }
}

// Brutal Edge verdict — auto-generated from market state.
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
      text: `S&P down ${Math.abs(sp500.changesPercentage).toFixed(1)} percent in a single session — mega-caps trading at elevated multiples absorb macro shocks first, and today's tape is proof.` };
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
      text: `CNN Fear and Greed at ${fg.value} (${fg.label}) — historically, every reading below 25 in the past decade has marked a tradeable bottom within 30 days, and every reading has felt completely justified at the time.` };
  }
  if (fg && fg.value > 75) {
    return { trigger: 'F&G>75',
      text: `CNN Fear and Greed at ${fg.value} (${fg.label}) is the sentiment equivalent of a 2 percent VIX — the market is pricing in zero things going wrong, which has historically preceded several things going wrong.` };
  }
  if (vix && vix.price < 15) {
    return { trigger: 'VIX<15',
      text: `VIX below 15 means option traders are pricing in a 0.9 percent average daily move — the calmest waters arrive right before someone notices the iceberg.` };
  }
  const sp = sp500 ? sp500.price.toFixed(0) : '5,600';
  return { trigger: 'neutral',
    text: `S&P ${sp}, VIX ${vix ? vix.price.toFixed(1) : '20'}, Bitcoin ${btc ? '$' + Math.round(btc.price).toLocaleString() : '$66K'} — markets are quiet, which is exactly when the next catalyst is being written into a Bloomberg terminal nobody has read yet.` };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const debugParam = url.searchParams.get('debug');
  const debugLive = debugParam === '1' || debugParam === 'live';
  const debugCache = debugParam === 'cache';
  if (debugLive || debugCache) debugLog.length = 0;

  // ?debug=cache — read-only mode that touches Redis ONLY and never calls
  // any external API. Use this to verify cache state without burning quota.
  // Returns the cached payload plus envCheck and circuit breaker state.
  if (debugCache) {
    let cachedRaw: { data: TodayMarketPayload; ts: number } | null = null;
    let rateLimited = false;
    try {
      const redis = getRedis();
      const raw = await redis.get(REDIS_KEY);
      if (raw) cachedRaw = JSON.parse(raw);
      const flag = await redis.get(FMP_RATE_LIMIT_KEY);
      rateLimited = Boolean(flag);
    } catch { /* ignore */ }
    return NextResponse.json({
      mode: 'cache-read-only',
      hasCachedPayload: Boolean(cachedRaw),
      cacheAgeSeconds: cachedRaw ? Math.floor((Date.now() - cachedRaw.ts) / 1000) : null,
      cacheTtlSeconds: cacheTtlSeconds(),
      cachedAt: cachedRaw ? new Date(cachedRaw.ts).toISOString() : null,
      cachedPayload: cachedRaw?.data || null,
      circuitBreaker: { fmpRateLimited: rateLimited, key: FMP_RATE_LIMIT_KEY },
      fmpBudget: await fmpCallsToday(),
      envCheck: {
        FMP_API_KEY_present: Boolean(process.env.FMP_API_KEY),
        FMP_API_KEY_length: (process.env.FMP_API_KEY || '').length,
        ALPHA_VANTAGE_KEY_present: Boolean(process.env.ALPHA_VANTAGE_KEY),
        ALPHA_VANTAGE_KEY_length: (process.env.ALPHA_VANTAGE_KEY || '').length,
      },
    });
  }

  // Even ?debug=1 (live mode) checks the cache first now. The previous
  // behavior of always bypassing cache in debug mode was the root cause
  // of the FMP 429 — every diagnostic check was costing 8 API calls.
  // Use ?debug=fresh to explicitly force a live re-fetch (intentionally
  // costs quota; reserved for cases where the cache is suspected stale).
  const debugFresh = debugParam === 'fresh';
  if (!debugFresh) {
    const cached = await readSharedCache();
    if (cached) {
      // Stock cache is valid. Independently check if crypto sub-cache is stale
      // (crypto trades 24/7 — refresh every 30 min even on weekends/evenings).
      let freshCrypto = await readCryptoCache();
      if (!freshCrypto) {
        freshCrypto = await coinGeckoPrices();
        if (freshCrypto) await writeCryptoCache(freshCrypto);
      }
      const payload = { ...cached, ...(freshCrypto ? { crypto: freshCrypto } : {}), source: 'cached' as const };
      if (debugLive) {
        return NextResponse.json({
          ...payload,
          _debug: {
            note: 'Returned cached payload (no API calls were made). Pass ?debug=fresh to force a live re-fetch (costs FMP quota).',
            cacheAgeSeconds: memCache ? Math.floor((Date.now() - memCache.ts) / 1000) : null,
            envCheck: {
              FMP_API_KEY_present: Boolean(process.env.FMP_API_KEY),
              FMP_API_KEY_length: (process.env.FMP_API_KEY || '').length,
              ALPHA_VANTAGE_KEY_present: Boolean(process.env.ALPHA_VANTAGE_KEY),
              ALPHA_VANTAGE_KEY_length: (process.env.ALPHA_VANTAGE_KEY || '').length,
            },
          },
        });
      }
      return NextResponse.json(payload);
    }
  }

  // Try one batched FMP call first to minimize the FMP request count.
  // If batch returns all 5 symbols, indices and macro (sans yield/oil) are
  // satisfied with a single API hit instead of 5 separate calls.
  const batched = await fmpBatchQuote(['^GSPC', '^IXIC', '^DJI', '^VIX', 'GCUSD']);

  let indices: Quote[] | null = null;
  let vix: Quote | null = null;
  let gold: Quote | null = null;

  if (batched) {
    indices = batched.filter(q => ['^GSPC', '^IXIC', '^DJI'].includes(q.symbol));
    vix = batched.find(q => q.symbol === '^VIX') || null;
    gold = batched.find(q => q.symbol === 'GCUSD') || null;
    if (indices.length !== 3) indices = null;
  }

  // If batch did not return everything, fall back to per-symbol calls only
  // for the missing items. This minimizes total FMP requests when batch works.
  const needsIndices = !indices;
  const needsVix = !vix;
  const needsGold = !gold;

  const [fallbackIndices, fallbackVix, fallbackGold, tnx, oil, crypto, fg] = await Promise.all([
    needsIndices ? fmpQuoteMany(['^GSPC', '^IXIC', '^DJI']) : Promise.resolve(null),
    needsVix ? fmpQuoteSingle('^VIX') : Promise.resolve(null),
    needsGold ? fmpQuoteSingle('GCUSD') : Promise.resolve(null),
    fmpTenYearYield(),
    alphaVantageWTI(),
    coinGeckoPrices(),
    cnnFearGreed(),
  ]);

  if (!indices) indices = fallbackIndices;
  if (!vix) vix = fallbackVix;
  if (!gold) gold = fallbackGold;

  const macroLive: Quote[] = [];
  if (oil)  macroLive.push(oil);
  if (gold) macroLive.push(gold);
  if (vix)  macroLive.push(vix);
  if (tnx)  macroLive.push(tnx);

  // Read the most recently cached value as the absolute fallback. Even
  // expired Redis cache is preferable to static demo data.
  const lastGood = memCache?.data || (await (async () => {
    try {
      const redis = getRedis();
      const raw = await redis.get(REDIS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { data: TodayMarketPayload; ts: number };
      return parsed.data;
    } catch { return null; }
  })());

  const macroOk = macroLive.length === 4;
  const allLive = Boolean(indices && macroOk && crypto && fg);

  const payload: TodayMarketPayload = {
    asOf: new Date().toISOString(),
    indices: indices || lastGood?.indices || FALLBACK.indices,
    macro:   macroOk  ? macroLive : (lastGood?.macro || FALLBACK.macro),
    crypto:  crypto   || lastGood?.crypto || FALLBACK.crypto,
    fearGreed: fg     || lastGood?.fearGreed || FALLBACK.fearGreed,
    verdict: { text: '', trigger: '' },
    source: allLive ? 'live' : (lastGood ? 'cached' : 'fallback'),
  };
  payload.verdict = generateVerdict(payload);

  // Persist to shared cache only on full success so the cached tier
  // always represents real live data, never partial fallback.
  if (allLive) {
    await writeSharedCache(payload);
    if (crypto) await writeCryptoCache(crypto);
  }

  if (debugLive || debugFresh) {
    return NextResponse.json({
      ...payload,
      _debug: {
        mode: debugFresh ? 'fresh-fetch (cache bypassed)' : 'live (cache miss)',
        envCheck: {
          FMP_API_KEY_present: Boolean(process.env.FMP_API_KEY),
          FMP_API_KEY_length: (process.env.FMP_API_KEY || '').length,
          ALPHA_VANTAGE_KEY_present: Boolean(process.env.ALPHA_VANTAGE_KEY),
          ALPHA_VANTAGE_KEY_length: (process.env.ALPHA_VANTAGE_KEY || '').length,
        },
        cacheTtlSeconds: cacheTtlSeconds(),
        cacheKey: REDIS_KEY,
        circuitBreakerKey: FMP_RATE_LIMIT_KEY,
        sources: debugLog,
        macroLiveCount: macroLive.length,
        indicesCount: indices?.length || 0,
        allLive,
      },
    });
  }

  return NextResponse.json(payload);
}
