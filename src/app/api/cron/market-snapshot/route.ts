// /api/cron/market-snapshot — Daily market close snapshot cron.
//
// Schedule: UTC 20:30 = ET 16:30 (30 minutes after NYSE close), weekdays only.
// Also callable manually via GET for testing / emergency seeding.
//
// What it collects:
//   - Indices   : AV GLOBAL_QUOTE  → SPY, QQQ, DIA, IWM (ETF proxies, 4 AV calls)
//   - Sectors   : FMP batch quote  → 11 sector ETFs (XLK…XLC)   (1-2 FMP calls)
//   - Top 30    : FMP batch quote  → TOP_30_TICKERS               (1-2 FMP calls)
//   - Macro     : AV WTI + FMP GCUSD + FMP ^VIX + FMP treasury  (1 AV + 3 FMP)
//   - Crypto    : CoinGecko simple/price → BTC, ETH, SOL          (0 FMP)
//
// Note: Index symbols use ETF proxies because AV GLOBAL_QUOTE does not support
//       ^GSPC / ^IXIC / ^DJI / ^RUT on the free tier (returns empty response).
//       Only changePercent is surfaced for indices; ETF price is not exposed.
//
// Total FMP calls: ~5–7/day  (vs. 148–172 before)
// Total AV  calls: ~5/day    (vs. AV limit of 25/day)
//
// Redis keys:
//   market:snapshot:YYYY-MM-DD  — full snapshot, 48h TTL
//   market:snapshot:latest      — stores the latest trading date string, 48h TTL

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';
import { TOP_30_TICKERS } from '@/lib/top-tickers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FMP_KEY = process.env.FMP_API_KEY || '';
const AV_KEY  = process.env.ALPHA_VANTAGE_KEY || '';

const SNAPSHOT_TTL = 60 * 60 * 48; // 48 hours

// ── Types ────────────────────────────────────────────────────────────────────

interface IndexQuote {
  symbol: string;  // ETF proxy: SPY | QQQ | DIA | IWM
  label: string;   // Display name: "S&P 500" | "Nasdaq" | "Dow Jones" | "Russell 2000"
  id: string;      // Canonical id: sp500 | nasdaq | dow | russell
  changePercent: number;
  tradingDate: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface CryptoPrice {
  id: string;
  price: number;
  change24h: number;
}

export interface MarketSnapshot {
  tradingDate: string;       // ET date: "2026-04-16"
  asOf: string;              // ISO UTC timestamp of when cron ran
  indices: IndexQuote[];
  sectors: StockQuote[];     // sector ETF daily close % change
  top30: StockQuote[];       // TOP_30_TICKERS daily close
  macro: StockQuote[];       // WTI, Gold, VIX, 10Y yield
  crypto: CryptoPrice[];
  sources: Record<string, 'ok' | 'failed'>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// ET date: used as the canonical trading date key.
function etDateString(): string {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return et.toISOString().slice(0, 10);
}

// FMP symbol normalizer (same as today-market)
const FMP_NORM: Record<string, string> = {
  'GC=F': 'GCUSD', 'CL=F': 'CLUSD',
  'GCQ25': 'GCUSD', 'CLM25': 'CLUSD',
};
function normSym(s: string): string { return FMP_NORM[s] || s; }

// ── Index config — ETF proxies for major US indices ──────────────────────────
// AV GLOBAL_QUOTE free tier does not support ^ prefix symbols (returns {}).
// SPY/QQQ/DIA/IWM are liquid 1:1 proxies whose daily % change mirrors indices.
// Only changePercent is stored and exposed — ETF price is intentionally excluded.

const INDEX_CONFIG = [
  { symbol: 'SPY', label: 'S&P 500',     id: 'sp500'   },
  { symbol: 'QQQ', label: 'Nasdaq',      id: 'nasdaq'  },
  { symbol: 'DIA', label: 'Dow Jones',   id: 'dow'     },
  { symbol: 'IWM', label: 'Russell 2000', id: 'russell' },
] as const;

// ── Alpha Vantage: GLOBAL_QUOTE for a single ETF symbol ──────────────────────
// Returns only changePercent + tradingDate; price is intentionally omitted.

async function avGlobalQuote(
  symbol: string,
  label: string,
  id: string,
): Promise<IndexQuote | null> {
  if (!AV_KEY || AV_KEY === 'demo') return null;
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${AV_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const text = await res.text();
    let data: Record<string, unknown>;
    try { data = JSON.parse(text); } catch { return null; }

    // AV rate-limit check
    if (data?.Note || data?.Information) {
      console.warn(`[market-snapshot] AV throttled for ${symbol}`);
      return null;
    }

    const q = data['Global Quote'] as Record<string, string> | undefined;
    if (!q || !q['05. price']) return null;

    const tradingDate = q['07. latest trading day'] || '';

    // Staleness check — reject if > 3 calendar days old
    if (tradingDate) {
      const daysDiff = (Date.now() - new Date(tradingDate).getTime()) / 86_400_000;
      if (daysDiff > 3) {
        console.warn(`[market-snapshot] AV stale for ${symbol}: ${tradingDate} is ${daysDiff.toFixed(1)}d old`);
        return null;
      }
    }

    const price         = parseFloat(q['05. price']) || 0;
    const changePercent = parseFloat((q['10. change percent'] || '').replace('%', '')) || 0;

    if (price === 0) return null;
    return { symbol, label, id, changePercent, tradingDate };
  } catch (e) {
    console.error(`[market-snapshot] avGlobalQuote(${symbol}) error:`, e);
    return null;
  }
}

// ── Alpha Vantage: WTI daily (same pattern as today-market) ──────────────────

async function avWTI(): Promise<StockQuote | null> {
  if (!AV_KEY || AV_KEY === 'demo') return null;
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=WTI&interval=daily&apikey=${AV_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.Note || data?.Information) return null;

    const arr = Array.isArray(data?.data) ? data.data : null;
    if (!arr || arr.length < 2) return null;

    // Staleness check
    const rawDate = arr[0]?.date as string | undefined;
    if (rawDate) {
      const daysDiff = (Date.now() - new Date(rawDate).getTime()) / 86_400_000;
      if (daysDiff > 3) {
        console.warn(`[market-snapshot] AV WTI stale: ${rawDate} is ${daysDiff.toFixed(1)}d old`);
        return null;
      }
    }

    const today     = Number(arr[0]?.value);
    const yesterday = Number(arr[1]?.value);
    if (!today || !yesterday) return null;

    const change        = today - yesterday;
    const changePercent = yesterday !== 0 ? (change / yesterday) * 100 : 0;
    return { symbol: 'CLUSD', price: today, change, changePercent };
  } catch (e) {
    console.error('[market-snapshot] avWTI error:', e);
    return null;
  }
}

// ── FMP: batch quote (tries path format first, then query-string) ─────────────
// Path format `/api/v3/quote/AAPL,MSFT` works on free tier for stocks/ETFs.
// Query-string format `/stable/quote?symbol=AAPL,MSFT` may require premium.

async function fmpBatch(symbols: string[]): Promise<StockQuote[]> {
  if (!FMP_KEY || symbols.length === 0) return [];
  if (!(await fmpCanCall())) return [];

  const csv = symbols.map(encodeURIComponent).join(',');
  const urls = [
    `https://financialmodelingprep.com/api/v3/quote/${csv}?apikey=${FMP_KEY}`,
    `https://financialmodelingprep.com/stable/quote?symbol=${csv}&apikey=${FMP_KEY}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      await fmpTrackCall();
      if (!res.ok) continue;
      const text = await res.text();
      let data: unknown;
      try { data = JSON.parse(text); } catch { continue; }
      if (!Array.isArray(data) || data.length === 0) continue;

      const out: StockQuote[] = [];
      for (const d of data as Array<Record<string, unknown>>) {
        const sym   = normSym(String(d.symbol || ''));
        const price = Number(d.price) || 0;
        if (!sym || price === 0) continue;
        const change        = Number(d.change) || 0;
        const changePercent = Number(d.changesPercentage ?? d.changePercentage ?? 0);
        out.push({ symbol: sym, price, change, changePercent });
      }

      if (out.length > 0) return out;
    } catch { continue; }
  }

  return [];
}

// ── FMP: single quote (for GCUSD, ^VIX) ──────────────────────────────────────

async function fmpSingle(symbol: string): Promise<StockQuote | null> {
  if (!FMP_KEY) return null;
  if (!(await fmpCanCall())) return null;
  try {
    const url = `https://financialmodelingprep.com/stable/quote?symbol=${encodeURIComponent(symbol)}&apikey=${FMP_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    await fmpTrackCall();
    if (!res.ok) return null;
    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { return null; }
    if (!Array.isArray(data) || !data[0]) return null;
    const d = data[0] as Record<string, unknown>;
    const price = Number(d.price) || 0;
    if (price === 0) return null;
    return {
      symbol: normSym(String(d.symbol || symbol)),
      price,
      change: Number(d.change) || 0,
      changePercent: Number(d.changesPercentage ?? d.changePercentage ?? 0),
    };
  } catch {
    return null;
  }
}

// ── FMP: 10Y Treasury rate ────────────────────────────────────────────────────

async function fmpTreasury10Y(): Promise<StockQuote | null> {
  if (!FMP_KEY) return null;
  if (!(await fmpCanCall())) return null;
  try {
    const res = await fetch(
      `https://financialmodelingprep.com/stable/treasury-rates?apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    await fmpTrackCall();
    if (!res.ok) return null;
    const data = await res.json();
    const latest = Array.isArray(data) ? data[0] : data;
    if (!latest) return null;
    const rate = Number(latest.year10) || 0;
    if (rate === 0) return null;
    return { symbol: '^TNX', price: rate, change: 0, changePercent: 0 };
  } catch {
    return null;
  }
}

// ── CoinGecko: BTC, ETH, SOL ─────────────────────────────────────────────────

async function coinGecko(): Promise<CryptoPrice[]> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true',
      { cache: 'no-store', headers: { accept: 'application/json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const out: CryptoPrice[] = [];
    for (const id of ['bitcoin', 'ethereum', 'solana']) {
      if (data[id]) {
        out.push({ id, price: Number(data[id].usd) || 0, change24h: Number(data[id].usd_24h_change) || 0 });
      }
    }
    return out;
  } catch {
    return [];
  }
}

// ── Route ────────────────────────────────────────────────────────────────────

const SECTOR_ETFS = ['XLK', 'XLF', 'XLV', 'XLE', 'XLY', 'XLI', 'XLP', 'XLU', 'XLRE', 'XLB', 'XLC'];
const TOP30 = [...TOP_30_TICKERS] as string[];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceDate = url.searchParams.get('date'); // optional: ?date=2026-04-16

  const tradingDate = forceDate || etDateString();

  console.log(`[market-snapshot] Starting collection for ${tradingDate}`);

  const sources: Record<string, 'ok' | 'failed'> = {};

  // 1. Indices via AV GLOBAL_QUOTE (4 calls, sequential to respect AV rate limits)
  // Using ETF proxies: SPY=S&P500, QQQ=Nasdaq, DIA=DowJones, IWM=Russell2000
  const indicesRaw: (IndexQuote | null)[] = [];
  for (const cfg of INDEX_CONFIG) {
    const q = await avGlobalQuote(cfg.symbol, cfg.label, cfg.id);
    indicesRaw.push(q);
    // AV free tier: 5 calls/min = 12s minimum between calls
    await new Promise(r => setTimeout(r, 12000));
  }
  const indices = indicesRaw.filter((q): q is IndexQuote => Boolean(q));
  sources['av:indices'] = indices.length === INDEX_CONFIG.length ? 'ok' : 'failed';
  console.log(`[market-snapshot] indices: ${indices.length}/${INDEX_CONFIG.length}`);

  // 2. Sector ETFs — FMP free tier does not support ETF symbols (premium only).
  // Sectors disabled until an alternative data source is available.
  const sectorsRaw: StockQuote[] = [];
  sources['fmp:sectors'] = 'failed'; // intentionally skipped
  console.log('[market-snapshot] sectors: skipped (ETF quotes require FMP premium)');

  // 3. Top 30 stocks — 30 parallel individual FMP calls (free tier supports single stock quotes).
  // fmpBatch (comma-separated) requires premium; individual calls are free.
  const top30Raw = (
    await Promise.all(TOP30.map(sym => fmpSingle(sym)))
  ).filter((q): q is StockQuote => Boolean(q));
  sources['fmp:top30'] = top30Raw.length > 0 ? 'ok' : 'failed';
  console.log(`[market-snapshot] top30: ${top30Raw.length}/${TOP30.length}`);

  // 4. Macro: WTI (AV), Gold + VIX (FMP single), 10Y (FMP treasury)
  const [wti, gold, vix, treasury] = await Promise.all([
    avWTI(),
    fmpSingle('GCUSD'),
    fmpSingle('^VIX'),
    fmpTreasury10Y(),
  ]);
  const macro: StockQuote[] = [wti, gold, vix, treasury].filter((q): q is StockQuote => Boolean(q));
  sources['macro'] = macro.length >= 2 ? 'ok' : 'failed';
  console.log(`[market-snapshot] macro: ${macro.map(m => m.symbol).join(', ')}`);

  // 5. Crypto via CoinGecko (0 FMP calls)
  const crypto = await coinGecko();
  sources['coingecko'] = crypto.length > 0 ? 'ok' : 'failed';
  console.log(`[market-snapshot] crypto: ${crypto.map(c => c.id).join(', ')}`);

  // 6. Companies screener (1 FMP call) — stored separately for /api/companies
  const COMPANY_FLAGS: Record<string, string> = { US: '🇺🇸', CN: '🇨🇳', TW: '🇹🇼', KR: '🇰🇷', JP: '🇯🇵', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', SA: '🇸🇦', NL: '🇳🇱', CH: '🇨🇭', IE: '🇮🇪', DK: '🇩🇰' };
  let companiesSnapshot: unknown[] = [];
  try {
    if (FMP_KEY && (await fmpCanCall())) {
      const screenerRes = await fetch(
        `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=100000000000&limit=20&apikey=${FMP_KEY}`,
        { cache: 'no-store' }
      );
      await fmpTrackCall();
      if (screenerRes.ok) {
        const raw = await screenerRes.json();
        if (Array.isArray(raw) && raw.length > 0) {
          const sorted = raw.sort((a: Record<string, number>, b: Record<string, number>) => (b.marketCap || 0) - (a.marketCap || 0));
          companiesSnapshot = sorted.slice(0, 15).map((c: Record<string, unknown>, i: number) => {
            const mktCap = (c.marketCap as number) || 0;
            return {
              rank: i + 1,
              ticker: c.symbol,
              name: c.companyName,
              price: c.price,
              change: c.changesPercentage || 0,
              marketCap: mktCap,
              marketCapFmt: mktCap >= 1e12 ? `$${(mktCap / 1e12).toFixed(2)}T` : `$${(mktCap / 1e9).toFixed(0)}B`,
              sector: c.sector || '',
              industry: c.industry || '',
              country: c.country || '',
              flag: COMPANY_FLAGS[(c.country as string) || ''] || '🏳️',
              exchange: c.exchangeShortName || c.exchange || '',
            };
          });
          sources['fmp:companies'] = 'ok';
        }
      }
    } else {
      sources['fmp:companies'] = 'failed';
    }
  } catch {
    sources['fmp:companies'] = 'failed';
  }
  console.log(`[market-snapshot] companies: ${companiesSnapshot.length}`);

  const snapshot: MarketSnapshot = {
    tradingDate,
    asOf: new Date().toISOString(),
    indices,
    sectors: sectorsRaw,
    top30: top30Raw,
    macro,
    crypto,
    sources,
  };

  // Store in Redis
  try {
    const redis = getRedis();
    const key = `market:snapshot:${tradingDate}`;
    await redis.set(key, JSON.stringify(snapshot), 'EX', SNAPSHOT_TTL);
    await redis.set('market:snapshot:latest', tradingDate, 'EX', SNAPSHOT_TTL);
    console.log(`[market-snapshot] Saved to Redis: ${key}`);
    if (companiesSnapshot.length > 0) {
      await redis.set('companies:snapshot', JSON.stringify(companiesSnapshot), 'EX', SNAPSHOT_TTL);
      console.log('[market-snapshot] companies:snapshot saved');
    }
  } catch (e) {
    console.error('[market-snapshot] Redis write failed:', e);
    sources['redis'] = 'failed';
  }

  // Also write today-market:snapshot:v1 for /api/today-market (read-only endpoint).
  // Indices use ETF proxy changePercent only (price=0 → frontend shows "—").
  // id→symbol mapping: sp500→^GSPC, nasdaq→^IXIC, dow→^DJI, russell omitted (home page shows 3 indices).
  // Macro field: changePercent → changesPercentage (TodayMarketPayload field name).
  const ID_TO_SYMBOL: Record<string, string> = {
    sp500:   '^GSPC',
    nasdaq:  '^IXIC',
    dow:     '^DJI',
    russell: '^RUT',
  };
  const todayMarketEntry = {
    data: {
      asOf: snapshot.asOf,
      indices: snapshot.indices.map(idx => ({
        symbol: ID_TO_SYMBOL[idx.id] ?? idx.symbol,
        price: 0,       // intentionally 0; ETF price ≠ index level; UI shows "—"
        change: 0,
        changesPercentage: idx.changePercent,
      })),
      macro: snapshot.macro.map(m => ({
        symbol: m.symbol,
        price: m.price,
        change: m.change,
        changesPercentage: m.changePercent,
      })),
      crypto: snapshot.crypto,
      // fearGreed is NOT included here — /api/today-market fetches it live from CNN (free).
      fearGreed: null,
      verdict: null,
      source: 'cached' as const,
    },
    ts: Date.now(),
  };
  try {
    const redis = getRedis();
    await redis.set('today-market:snapshot:v1', JSON.stringify(todayMarketEntry), 'EX', SNAPSHOT_TTL);
    console.log('[market-snapshot] Wrote today-market:snapshot:v1');
  } catch (e) {
    console.error('[market-snapshot] today-market snapshot write failed:', e);
  }

  // 7. OHLC historical data (30 FMP calls) — stored as ohlc:{sym}:90 for /api/markets/ohlc
  const ohlcCount = { ok: 0, failed: 0 };
  await Promise.all(TOP30.map(async sym => {
    try {
      if (!FMP_KEY || !(await fmpCanCall())) { ohlcCount.failed++; return; }
      const res = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${encodeURIComponent(sym)}?timeseries=90&apikey=${FMP_KEY}`,
        { cache: 'no-store' }
      );
      await fmpTrackCall();
      if (!res.ok) { ohlcCount.failed++; return; }
      const data = await res.json();
      const raw: Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }> = data?.historical ?? [];
      const candles = raw.slice(0, 90).reverse().map(c => ({
        date: c.date, open: Number(c.open) || 0, high: Number(c.high) || 0,
        low: Number(c.low) || 0, close: Number(c.close) || 0, volume: Number(c.volume) || 0,
      }));
      const redisC = getRedis();
      await redisC.set(`ohlc:${sym}:90`, JSON.stringify({ candles, symbol: sym }), 'EX', SNAPSHOT_TTL);
      ohlcCount.ok++;
    } catch { ohlcCount.failed++; }
  }));
  console.log(`[market-snapshot] ohlc: ${ohlcCount.ok}/${TOP30.length}`);

  // 8. Ticker profiles (60 FMP calls, 2 per symbol) — stored as ticker:profile:{sym}
  const profileCount = { ok: 0, failed: 0 };
  const fmtVolP = (v: number) => v >= 1e9 ? `${(v/1e9).toFixed(1)}B` : v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(0)}K` : String(v);
  const fmtRevP = (v: number) => v >= 1e9 ? `$${(v/1e9).toFixed(0)}B` : `$${(v/1e6).toFixed(0)}M`;
  await Promise.all(TOP30.map(async sym => {
    try {
      if (!FMP_KEY || !(await fmpCanCall())) { profileCount.failed++; return; }
      const [profileRes, finRes] = await Promise.all([
        fetch(`https://financialmodelingprep.com/stable/profile?symbol=${sym}&apikey=${FMP_KEY}`, { cache: 'no-store' }),
        fetch(`https://financialmodelingprep.com/stable/income-statement?symbol=${sym}&period=annual&limit=1&apikey=${FMP_KEY}`, { cache: 'no-store' }),
      ]);
      await fmpTrackCall(2);
      if (!profileRes.ok) { profileCount.failed++; return; }
      const profileData = await profileRes.json();
      const p = Array.isArray(profileData) && profileData[0] ? profileData[0] as Record<string, unknown> : null;
      if (!p || !p.price) { profileCount.failed++; return; }
      const finData = await finRes.json();
      const f = Array.isArray(finData) && finData[0] ? finData[0] as Record<string, unknown> : null;
      const mc = (p.marketCap as number) || 0;
      const fmtCap = mc >= 1e12 ? `$${(mc/1e12).toFixed(2)}T` : mc >= 1e9 ? `$${(mc/1e9).toFixed(0)}B` : mc >= 1e6 ? `$${(mc/1e6).toFixed(0)}M` : '';
      const profileResult = {
        ticker: p.symbol || sym, name: p.companyName || sym,
        price: p.price || 0,
        change: p.changes ? ((p.changes as number) / ((p.price as number) - (p.changes as number)) * 100) : 0,
        changeDollar: p.changes || 0,
        cap: fmtCap, marketCap: mc,
        sector: p.sector || '', industry: p.industry || '',
        description: p.description || '', ceo: p.ceo || '',
        employees: p.fullTimeEmployees ? Number(p.fullTimeEmployees).toLocaleString() + '+' : '',
        hq: [p.city, p.state, p.country].filter(Boolean).join(', '),
        website: p.website ? (p.website as string).replace(/^https?:\/\//, '') : '',
        image: p.image || '', range52w: p.range || '',
        exchange: p.exchangeShortName || p.exchange || '',
        pe: p.peRatio ? Number(p.peRatio).toFixed(1) : '',
        beta: p.beta ? Number(p.beta).toFixed(2) : '',
        volAvg: p.volAvg ? fmtVolP(p.volAvg as number) : '', volAvgRaw: (p.volAvg as number) || 0,
        lastDiv: p.lastDiv ? `$${Number(p.lastDiv).toFixed(2)}` : '',
        volume: (p.volume as number) || 0,
        revenue: f?.revenue ? fmtRevP(f.revenue as number) : '',
        netIncome: f?.netIncome ? fmtRevP(f.netIncome as number) : '',
        eps: f?.epsDiluted ? `$${Number(f.epsDiluted).toFixed(2)}` : '',
        live: true,
      };
      const redisP = getRedis();
      await redisP.set(`ticker:profile:${sym}`, JSON.stringify(profileResult), 'EX', SNAPSHOT_TTL);
      profileCount.ok++;
    } catch { profileCount.failed++; }
  }));
  console.log(`[market-snapshot] profiles: ${profileCount.ok}/${TOP30.length}`);

  const failed = Object.entries(sources).filter(([, v]) => v === 'failed').map(([k]) => k);
  const ok     = failed.length === 0;

  return NextResponse.json({
    ok,
    tradingDate,
    asOf: snapshot.asOf,
    counts: {
      indices:  indices.length,
      sectors:  sectorsRaw.length,
      top30:    top30Raw.length,
      macro:    macro.length,
      crypto:   crypto.length,
      ohlc:     ohlcCount.ok,
      profiles: profileCount.ok,
    },
    sources,
    ...(failed.length > 0 ? { warnings: failed.map(f => `${f} failed`) } : {}),
  });
}
