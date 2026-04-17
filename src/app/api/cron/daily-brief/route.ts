import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Base types (mirrors today-market) ───────────────────────────────────────
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

// ─── Daily-Brief-specific types ───────────────────────────────────────────────
export interface Mover {
  symbol: string;
  name: string;
  price: number;
  pct: number;
  direction: 'up' | 'down';
  reason: string;   // from news headline, or generic fallback
}

export interface NewsItem {
  headline: string;
  summary: string;
  source: string;
  url: string;
}

export interface TomorrowEvent {
  time: string;
  event: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface DailyBriefData {
  date: string;          // ET date "2026-04-15"
  generatedAt: string;   // ISO UTC timestamp
  status: 'ok' | 'maintenance';
  maintenanceReason?: string;
  // Base market data (from today-market cache)
  indices: Quote[];      // S&P 500, Nasdaq, Dow Jones
  macro: Quote[];        // Oil, Gold, VIX, 10Y
  crypto: CryptoPrice[]; // BTC, ETH
  fearGreed: FearGreed;
  verdict: { text: string; trigger: string };
  // Extended market data (fetched by this cron)
  russell2000: Quote | null;
  dxy: Quote | null;
  eurusd: Quote | null;  // EUR/USD rate
  usdjpy: Quote | null;  // USD/JPY rate
  solana: CryptoPrice | null;
  // Content sections
  movers: Mover[];
  news: NewsItem[];
  tomorrow: TomorrowEvent[];
  // Metadata
  validation: {
    stage1Pass: boolean;
    stage2Pass: boolean;
    warnings: string[];
  };
  source: string;
}

// ─── Environment ─────────────────────────────────────────────────────────────
const FMP_KEY = process.env.FMP_API_KEY || '';
const AV_KEY  = process.env.ALPHA_VANTAGE_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';

// ─── ET date helper ───────────────────────────────────────────────────────────
function getETDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

function getNextBusinessDayET(now = new Date()): string {
  const d = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  do { d.setDate(d.getDate() + 1); } while (d.getDay() === 0 || d.getDay() === 6);
  return d.toISOString().slice(0, 10);
}

// ─── FMP helpers ─────────────────────────────────────────────────────────────
async function fmpGet(path: string): Promise<unknown[] | null> {
  if (!FMP_KEY) return null;
  if (!(await fmpCanCall())) return null;
  try {
    const sep = path.includes('?') ? '&' : '?';
    const res = await fetch(`${FMP_BASE}${path}${sep}apikey=${FMP_KEY}`, { cache: 'no-store' });
    await fmpTrackCall();
    if (!res.ok) return null;
    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { return null; }
    return Array.isArray(data) ? data : null;
  } catch { return null; }
}

async function fmpQuote(symbol: string): Promise<Quote | null> {
  const data = await fmpGet(`/quote?symbol=${encodeURIComponent(symbol)}`);
  if (!data || data.length === 0) return null;
  const d = data[0] as Record<string, unknown>;
  const price = Number(d.price) || 0;
  if (price === 0) return null;
  return {
    symbol,
    price,
    change: Number(d.change) || 0,
    changesPercentage: Number(d.changesPercentage ?? d.changePercentage ?? 0),
  };
}

// ─── Alpha Vantage FX daily ───────────────────────────────────────────────────
// Returns last 2 daily values to compute change%.
async function avFxDaily(from: string, to: string, displaySymbol: string): Promise<Quote | null> {
  if (!AV_KEY || AV_KEY === 'demo') return null;
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${from}&to_symbol=${to}&outputsize=compact&apikey=${AV_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    if (data?.Note || data?.Information) return null;
    const series = data['Time Series FX (Daily)'] as Record<string, Record<string, string>> | undefined;
    if (!series) return null;
    const dates = Object.keys(series).sort().reverse();
    if (dates.length < 2) return null;
    // Stage 3 freshness: reject if most recent FX date is older than 3 days
    const daysDiff = (Date.now() - new Date(dates[0]).getTime()) / 86_400_000;
    if (daysDiff > 3) return null;
    const today = Number(series[dates[0]]?.['4. close']);
    const yesterday = Number(series[dates[1]]?.['4. close']);
    if (!today || !yesterday) return null;
    const change = today - yesterday;
    const pct = yesterday !== 0 ? (change / yesterday) * 100 : 0;
    return { symbol: displaySymbol, price: today, change, changesPercentage: pct };
  } catch { return null; }
}

// ─── CoinGecko extended (adds SOL) ───────────────────────────────────────────
async function coinGeckoExtended(): Promise<CryptoPrice[] | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true',
      { cache: 'no-store', headers: { accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const out: CryptoPrice[] = [];
    for (const id of ['bitcoin', 'ethereum', 'solana']) {
      if (data[id]) out.push({ id, price: Number(data[id].usd) || 0, change24h: Number(data[id].usd_24h_change) || 0 });
    }
    return out.length > 0 ? out : null;
  } catch { return null; }
}

// ─── Report tickers for movers prioritization ────────────────────────────────
// Tickers we have active coverage on — shown first when they appear in movers
const PRIORITY_TICKERS = new Set([
  'NVDA','AAPL','MSFT','GOOGL','META','AMZN','TSLA','AMD','PLTR',
  'COIN','CRCL','IONQ','RGTI','QBTS','RDW',
]);

// ─── FMP Top Movers ───────────────────────────────────────────────────────────
interface FmpMover { symbol: string; name?: string; price?: number; change?: number; changesPercentage?: number; changePercentage?: number }

async function fetchTopMovers(): Promise<Mover[]> {
  const [gainers, losers] = await Promise.all([
    fmpGet('/stock-market-top-performers'),
    fmpGet('/stock-market-worst-performers'),
  ]);

  const all: Mover[] = [];
  const pushMovers = (items: unknown[] | null, direction: 'up' | 'down') => {
    if (!items) return;
    for (const item of items.slice(0, 3) as FmpMover[]) {
      const pct = Number(item.changesPercentage ?? item.changePercentage ?? 0);
      if (!item.symbol || Math.abs(pct) < 1) continue;
      all.push({
        symbol: item.symbol,
        name: item.name || item.symbol,
        price: Number(item.price) || 0,
        pct,
        direction,
        reason: '',   // filled in below from news fetch
      });
    }
  };
  pushMovers(gainers, 'up');
  pushMovers(losers, 'down');

  if (all.length === 0) return [];

  // Fetch news for movers in one call
  const tickers = all.map(m => m.symbol).join(',');
  const newsItems = await fmpGet(`/news?tickers=${encodeURIComponent(tickers)}&limit=20`);
  if (newsItems) {
    type FmpNews = { symbol?: string; title?: string; text?: string; site?: string; publishedDate?: string };
    for (const m of all) {
      const item = (newsItems as FmpNews[]).find(n => n.symbol === m.symbol || (n.title || '').toLowerCase().includes(m.symbol.toLowerCase()));
      if (item?.title) {
        m.reason = item.title.length > 120 ? item.title.slice(0, 117) + '…' : item.title;
      } else {
        m.reason = 'No specific catalyst identified in recent headlines.';
      }
    }
  } else {
    for (const m of all) {
      m.reason = m.direction === 'up'
        ? 'Broad market momentum and sector rotation.'
        : 'Selling pressure; check earnings, guidance, or macro news.';
    }
  }

  // Prioritize our report tickers
  const priority = all.filter(m => PRIORITY_TICKERS.has(m.symbol));
  const rest = all.filter(m => !PRIORITY_TICKERS.has(m.symbol));
  return [...priority, ...rest].slice(0, 5);
}

// ─── FMP Top News ─────────────────────────────────────────────────────────────
async function fetchTopNews(): Promise<NewsItem[]> {
  type FmpNews = { title?: string; text?: string; site?: string; url?: string; publishedDate?: string };
  const items = await fmpGet('/news?limit=15') as FmpNews[] | null;
  if (!items) return [];

  const out: NewsItem[] = [];
  for (const item of items) {
    if (!item.title) continue;
    const summary = item.text
      ? item.text.replace(/<[^>]+>/g, '').slice(0, 200).trimEnd() + '…'
      : '';
    out.push({
      headline: item.title,
      summary,
      source: item.site || 'FMP',
      url: item.url || '',
    });
    if (out.length >= 5) break;
  }
  return out;
}

// ─── FMP Economic Calendar ────────────────────────────────────────────────────
async function fetchTomorrowEvents(): Promise<TomorrowEvent[]> {
  const tomorrow = getNextBusinessDayET();
  type FmpEvent = { event?: string; date?: string; time?: string; impact?: string; country?: string };
  const items = await fmpGet(`/economic-calendar?from=${tomorrow}&to=${tomorrow}`) as FmpEvent[] | null;
  if (!items) return [];

  // Filter US events, sort by importance
  const impMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
  const usEvents = (items as FmpEvent[])
    .filter(e => (!e.country || e.country === 'US') && e.event)
    .sort((a, b) => (impMap[b.impact || 'Low'] || 0) - (impMap[a.impact || 'Low'] || 0))
    .slice(0, 4);

  return usEvents.map(e => ({
    time: e.time || 'TBD',
    event: e.event || '',
    importance: (e.impact === 'High' || e.impact === 'Medium' || e.impact === 'Low') ? e.impact : 'Low',
  }));
}

// ─── Stage 1: Range sanity ───────────────────────────────────────────────────
const PRICE_RANGES: Record<string, [number, number]> = {
  '^GSPC':  [4_000,  10_000],
  '^IXIC':  [8_000,  25_000],
  '^DJI':   [20_000, 60_000],
  '^VIX':   [5,      80],
  'GCUSD':  [1_000,  5_000],
  'CLUSD':  [10,     200],
  '^TNX':   [0.5,    15],
};

function stage1Check(d: TodayMarketPayload): { pass: boolean; warnings: string[] } {
  const warnings: string[] = [];
  for (const q of [...d.indices, ...d.macro]) {
    const r = PRICE_RANGES[q.symbol];
    if (r && (q.price < r[0] || q.price > r[1]))
      warnings.push(`${q.symbol} ${q.price.toFixed(2)} out of range [${r[0]}, ${r[1]}]`);
  }
  const btc = d.crypto.find(c => c.id === 'bitcoin');
  const eth = d.crypto.find(c => c.id === 'ethereum');
  if (btc && (btc.price < 5_000 || btc.price > 500_000))
    warnings.push(`BTC ${btc.price} out of range [5000, 500000]`);
  if (eth && (eth.price < 100 || eth.price > 50_000))
    warnings.push(`ETH ${eth.price} out of range [100, 50000]`);
  if (d.fearGreed.value < 1 || d.fearGreed.value > 100)
    warnings.push(`F&G score ${d.fearGreed.value} out of range [1, 100]`);
  return { pass: warnings.length === 0, warnings };
}

// ─── Stage 2: Daily volatility thresholds ────────────────────────────────────
function stage2Check(d: TodayMarketPayload): { pass: boolean; warnings: string[] } {
  const warnings: string[] = [];
  for (const q of d.indices) {
    if (Math.abs(q.changesPercentage) > 10)
      warnings.push(`${q.symbol} ${q.changesPercentage.toFixed(2)}% exceeds ±10% threshold`);
  }
  const vix = d.macro.find(q => q.symbol === '^VIX');
  if (vix && Math.abs(vix.changesPercentage) > 50)
    warnings.push(`VIX ${vix.changesPercentage.toFixed(2)}% exceeds ±50% threshold`);
  for (const c of d.crypto) {
    if (Math.abs(c.change24h) > 30)
      warnings.push(`${c.id} ${c.change24h.toFixed(2)}% exceeds ±30% threshold`);
  }
  return { pass: warnings.length === 0, warnings };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function GET() {
  const redis = getRedis();
  const etDate = getETDate();
  const briefKey = `daily-brief:${etDate}`;

  try {
    // 1. Read today-market base data from Redis cache
    const raw = await redis.get('today-market:cache:v5');
    if (!raw) {
      await redis.set(briefKey, JSON.stringify({
        date: etDate, generatedAt: new Date().toISOString(),
        status: 'maintenance', maintenanceReason: 'Market data cache empty at generation time.',
        indices: [], macro: [], crypto: [],
        fearGreed: { value: 50, label: 'Neutral', source: 'CNN' },
        verdict: { text: '', trigger: '' },
        russell2000: null, dxy: null, eurusd: null, usdjpy: null, solana: null,
        movers: [], news: [], tomorrow: [],
        validation: { stage1Pass: false, stage2Pass: false, warnings: ['Cache empty'] },
        source: 'none',
      } satisfies DailyBriefData), 'EX', 86400 * 7);
      return NextResponse.json({ ok: false, date: etDate, reason: 'Market data cache empty' });
    }

    const parsed = JSON.parse(raw) as { data: TodayMarketPayload; ts: number };
    const market = parsed.data;

    // 2. 3-stage validation on base data
    // Stage 3: market cache freshness — reject if data is older than 6 hours
    const cacheAgeHours = (Date.now() - (parsed.ts || 0)) / 3_600_000;
    if (cacheAgeHours > 6) {
      const reason = `Market cache is ${cacheAgeHours.toFixed(1)}h old (max 6h). Data may not reflect today's close.`;
      await redis.set(briefKey, JSON.stringify({
        date: etDate, generatedAt: new Date().toISOString(),
        status: 'maintenance', maintenanceReason: reason,
        indices: [], macro: [], crypto: [],
        fearGreed: { value: 50, label: 'Neutral', source: 'CNN' },
        verdict: { text: '', trigger: '' },
        russell2000: null, dxy: null, eurusd: null, usdjpy: null, solana: null,
        movers: [], news: [], tomorrow: [],
        validation: { stage1Pass: true, stage2Pass: true, warnings: [reason] },
        source: market.source,
      } satisfies DailyBriefData), 'EX', 86400 * 7);
      return NextResponse.json({ ok: false, date: etDate, reason });
    }

    const s1 = stage1Check(market);
    const s2 = stage2Check(market);
    const allWarnings = [...s1.warnings, ...s2.warnings];
    const allPass = s1.pass && s2.pass;

    if (!allPass) {
      await redis.set(briefKey, JSON.stringify({
        date: etDate, generatedAt: new Date().toISOString(),
        status: 'maintenance', maintenanceReason: allWarnings.join(' | '),
        indices: market.indices, macro: market.macro, crypto: market.crypto,
        fearGreed: market.fearGreed, verdict: market.verdict,
        russell2000: null, dxy: null, eurusd: null, usdjpy: null, solana: null,
        movers: [], news: [], tomorrow: [],
        validation: { stage1Pass: s1.pass, stage2Pass: s2.pass, warnings: allWarnings },
        source: market.source,
      } satisfies DailyBriefData), 'EX', 86400 * 7);
      return NextResponse.json({ ok: false, date: etDate, warnings: allWarnings });
    }

    // 3. Fetch extended data in parallel (best-effort; failures don't block publish)
    const [russell2000, dxy, eurusd, usdjpy, cryptoExtended, movers, news, tomorrow] =
      await Promise.all([
        fmpQuote('^RUT'),
        fmpQuote('DX-Y.NYB'),
        avFxDaily('EUR', 'USD', 'EUR/USD'),
        avFxDaily('USD', 'JPY', 'USD/JPY'),
        coinGeckoExtended(),
        fetchTopMovers(),
        fetchTopNews(),
        fetchTomorrowEvents(),
      ]);

    // Extract SOL from extended crypto fetch (BTC/ETH from base data take precedence)
    const solana = cryptoExtended?.find(c => c.id === 'solana') || null;

    // 4. Store validated brief
    await redis.set(briefKey, JSON.stringify({
      date: etDate,
      generatedAt: new Date().toISOString(),
      status: 'ok',
      indices: market.indices,
      macro: market.macro,
      crypto: market.crypto,
      fearGreed: market.fearGreed,
      verdict: market.verdict,
      russell2000,
      dxy,
      eurusd,
      usdjpy,
      solana,
      movers,
      news,
      tomorrow,
      validation: { stage1Pass: true, stage2Pass: true, warnings: [] },
      source: market.source,
    } satisfies DailyBriefData), 'EX', 86400 * 7);

    return NextResponse.json({
      ok: true, date: etDate, source: market.source,
      extended: {
        russell2000: Boolean(russell2000), dxy: Boolean(dxy),
        eurusd: Boolean(eurusd), usdjpy: Boolean(usdjpy), solana: Boolean(solana),
        movers: movers.length, news: news.length, tomorrow: tomorrow.length,
      },
    });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[daily-brief cron] error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
