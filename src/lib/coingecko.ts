// CoinGecko API v3 — free tier, no auth required.
// Rate limit: ~30 requests/minute on free tier.
//
// Cache strategy (three-layer):
//   L1: in-memory     (per-serverless-instance, instant, 60s max)
//   L2: Redis fresh   (shared, TTL = cacheTtlSeconds())
//   L3: Redis stale   (shared, TTL = 24h — returned when 429 or circuit open)
//
// Circuit breaker:
//   On 429 → set cgBlocked = Date.now() + 10min
//   While blocked → skip live fetch, serve stale cache
//   After 10min → auto-retry

import { getRedis } from '@/lib/redis';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CoinMarket {
  rank: number;
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  marketCap: number;
  change24h: number;
  change7d: number;
  change30d: number;
  volume24h: number;
  sparkline?: number[];
}

export interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  image: { small: string; large: string };
  market_cap_rank: number;
  description: { en: string };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    ath: { usd: number };
    ath_date: { usd: string };
  };
  stale?: boolean; // true when served from stale cache
}

export interface CoinChartPoint {
  ts: number;   // Unix ms
  price: number;
}

export interface OHLCPoint {
  ts: number;   // Unix ms
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface GainersLosers {
  gainers: CoinMarket[];
  losers: CoinMarket[];
  lastUpdated: string;
  stale?: boolean;
}

// ─── Circuit breaker ─────────────────────────────────────────────────────────

let cgBlockedUntil = 0; // epoch ms
const CG_COOLDOWN_MS = 10 * 60 * 1000; // 10 min

function isBlocked(): boolean {
  return Date.now() < cgBlockedUntil;
}

function trip429(): void {
  cgBlockedUntil = Date.now() + CG_COOLDOWN_MS;
  console.warn(`[coingecko] 429 received — circuit open for 10 min (until ${new Date(cgBlockedUntil).toISOString()})`);
}

// ─── TTL helper ──────────────────────────────────────────────────────────────

function cacheTtlSeconds(): number {
  const now = new Date();
  const day = now.getUTCDay();
  const h = now.getUTCHours();
  const isWeekday = day >= 1 && day <= 5;
  const isMarketHours = h >= 13 && h < 20;
  return isWeekday && isMarketHours ? 300 : 1800;
}

const STALE_TTL = 86400; // 24h stale cache

// ─── L1 in-memory cache ───────────────────────────────────────────────────────

const memCache = new Map<string, { data: unknown; expiresAt: number }>();

function memGet<T>(key: string): T | null {
  const entry = memCache.get(key);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.data as T;
}

function memSet(key: string, data: unknown, ttlSeconds: number) {
  memCache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
}

// ─── Redis helpers ────────────────────────────────────────────────────────────

async function redisGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await getRedis().get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch { return null; }
}

async function redisSet(key: string, data: unknown, ttlSeconds: number) {
  try {
    await getRedis().set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch { /* non-fatal */ }
}

// Store both fresh and stale copies together
async function redisPersist(freshKey: string, staleKey: string, data: unknown, freshTtl: number) {
  try {
    const r = getRedis();
    const p = r.pipeline();
    const serialized = JSON.stringify(data);
    p.set(freshKey, serialized, 'EX', freshTtl);
    p.set(staleKey, serialized, 'EX', STALE_TTL);
    await p.exec();
  } catch { /* non-fatal */ }
}

// ─── CoinGecko fetch with 429 detection ──────────────────────────────────────

const CG_BASE = 'https://api.coingecko.com/api/v3';

async function cgFetch<T>(url: string): Promise<T | null> {
  if (isBlocked()) return null;
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (res.status === 429) { trip429(); return null; }
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || (typeof json === 'object' && 'error' in json)) return null;
    return json as T;
  } catch { return null; }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Top N coins by market cap. Falls back to stale cache on 429.
 */
export async function getCryptoMarkets(perPage = 50, sparkline = false): Promise<CoinMarket[]> {
  const key = `cg:markets:${perPage}:${sparkline ? 'spark' : 'nospk'}`;
  const staleKey = `cg:stale:markets:${perPage}:${sparkline ? 'spark' : 'nospk'}`;
  const ttl = cacheTtlSeconds();

  const mem = memGet<CoinMarket[]>(key);
  if (mem) return mem;

  const cached = await redisGet<CoinMarket[]>(key);
  if (cached) { memSet(key, cached, Math.min(ttl, 60)); return cached; }

  // Circuit open or no fresh cache — try live fetch
  const sparkParam = sparkline ? '&sparkline=true' : '';
  const raw = await cgFetch<Record<string, unknown>[]>(
    `${CG_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&price_change_percentage=24h,7d,30d${sparkParam}`
  );

  if (!Array.isArray(raw)) {
    // Return stale if available
    const stale = await redisGet<CoinMarket[]>(staleKey);
    if (stale) { memSet(key, stale, 60); return stale; }
    return [];
  }

  const coins: CoinMarket[] = raw.map((c, i) => ({
    rank: i + 1,
    id: c.id as string,
    symbol: ((c.symbol as string) || '').toUpperCase(),
    name: c.name as string,
    image: c.image as string,
    price: (c.current_price as number) || 0,
    marketCap: (c.market_cap as number) || 0,
    change24h: (c.price_change_percentage_24h as number) || 0,
    change7d: (c.price_change_percentage_7d_in_currency as number) || 0,
    change30d: (c.price_change_percentage_30d_in_currency as number) || 0,
    volume24h: (c.total_volume as number) || 0,
    ...(sparkline && c.sparkline_in_7d
      ? { sparkline: ((c.sparkline_in_7d as { price: number[] }).price) }
      : {}),
  }));

  memSet(key, coins, ttl);
  await redisPersist(key, staleKey, coins, ttl);
  return coins;
}

/**
 * Full coin detail for a single coin (used in /rankings/crypto/[symbol]).
 * Falls back to stale cache on 429.
 */
export async function getCoinDetail(id: string): Promise<CoinDetail | null> {
  const key = `cg:detail:${id}`;
  const staleKey = `cg:stale:detail:${id}`;
  const ttl = cacheTtlSeconds();

  const mem = memGet<CoinDetail>(key);
  if (mem) return mem;

  const cached = await redisGet<CoinDetail>(key);
  if (cached) { memSet(key, cached, Math.min(ttl, 60)); return cached; }

  const raw = await cgFetch<CoinDetail>(
    `${CG_BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  );

  if (!raw) {
    const stale = await redisGet<CoinDetail>(staleKey);
    if (stale) {
      const staleWithFlag = { ...stale, stale: true };
      memSet(key, staleWithFlag, 60);
      return staleWithFlag;
    }
    return null;
  }

  memSet(key, raw, ttl);
  await redisPersist(key, staleKey, raw, ttl);
  return raw;
}

/**
 * Top 10 gainers and losers by 24h change. Falls back to stale on 429.
 */
export async function getCryptoGainersLosers(): Promise<GainersLosers> {
  const key = 'cg:gainers-losers';
  const staleKey = 'cg:stale:gainers-losers';
  const ttl = cacheTtlSeconds();

  const mem = memGet<GainersLosers>(key);
  if (mem) return mem;

  const cached = await redisGet<GainersLosers>(key);
  if (cached) { memSet(key, cached, Math.min(ttl, 60)); return cached; }

  const raw = await cgFetch<Record<string, unknown>[]>(
    `${CG_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&price_change_percentage=24h,7d,30d`
  );

  if (!Array.isArray(raw)) {
    const stale = await redisGet<GainersLosers>(staleKey);
    if (stale) {
      const staleWithFlag = { ...stale, stale: true };
      memSet(key, staleWithFlag, 60);
      return staleWithFlag;
    }
    return { gainers: [], losers: [], lastUpdated: new Date().toISOString(), stale: true };
  }

  const coins: CoinMarket[] = raw.map((c, i) => ({
    rank: i + 1,
    id: c.id as string,
    symbol: ((c.symbol as string) || '').toUpperCase(),
    name: c.name as string,
    image: c.image as string,
    price: (c.current_price as number) || 0,
    marketCap: (c.market_cap as number) || 0,
    change24h: (c.price_change_percentage_24h as number) || 0,
    change7d: (c.price_change_percentage_7d_in_currency as number) || 0,
    change30d: (c.price_change_percentage_30d_in_currency as number) || 0,
    volume24h: (c.total_volume as number) || 0,
  }));

  const sorted = [...coins].sort((a, b) => b.change24h - a.change24h);
  const result: GainersLosers = {
    gainers: sorted.slice(0, 10),
    losers: sorted.slice(-10).reverse(),
    lastUpdated: new Date().toISOString(),
  };

  memSet(key, result, ttl);
  await redisPersist(key, staleKey, result, ttl);
  return result;
}

/**
 * OHLC candlestick data for a single coin. Falls back to stale on 429.
 * CoinGecko endpoint: /coins/{id}/ohlc?vs_currency=usd&days={days}
 * Returns [[ts_ms, open, high, low, close], ...]
 */
export async function getCoinOHLC(id: string, days: number = 30): Promise<OHLCPoint[]> {
  const key = `cg:ohlc:${id}:${days}`;
  const staleKey = `cg:stale:ohlc:${id}:${days}`;
  const ttl = days <= 7 ? 600 : 3600; // OHLC candles are daily, less volatile

  const mem = memGet<OHLCPoint[]>(key);
  if (mem) return mem;

  const cached = await redisGet<OHLCPoint[]>(key);
  if (cached) { memSet(key, cached, Math.min(ttl, 120)); return cached; }

  const raw = await cgFetch<[number, number, number, number, number][]>(
    `${CG_BASE}/coins/${id}/ohlc?vs_currency=usd&days=${days}`
  );

  if (!Array.isArray(raw)) {
    const stale = await redisGet<OHLCPoint[]>(staleKey);
    if (stale) { memSet(key, stale, 120); return stale; }
    return [];
  }

  const points: OHLCPoint[] = raw
    .filter(c => c.length === 5 && c[1] > 0)
    .map(([ts, open, high, low, close]) => ({ ts, open, high, low, close }));

  memSet(key, points, ttl);
  await redisPersist(key, staleKey, points, ttl);
  return points;
}

/**
 * Price history for a single coin. Falls back to stale on 429.
 */
export async function getCoinChart(id: string, days: number | 'max' = 30): Promise<CoinChartPoint[]> {
  const key = `cg:chart:${id}:${days}`;
  const staleKey = `cg:stale:chart:${id}:${days}`;
  const ttl = days === 1 ? 300 : 1800;

  const mem = memGet<CoinChartPoint[]>(key);
  if (mem) return mem;

  const cached = await redisGet<CoinChartPoint[]>(key);
  if (cached) { memSet(key, cached, Math.min(ttl, 120)); return cached; }

  const raw = await cgFetch<{ prices: [number, number][] }>(
    `${CG_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );

  if (!raw?.prices) {
    const stale = await redisGet<CoinChartPoint[]>(staleKey);
    if (stale) { memSet(key, stale, 120); return stale; }
    return [];
  }

  const prices = raw.prices;
  const step = Math.max(1, Math.floor(prices.length / 90));
  const points: CoinChartPoint[] = prices
    .filter((_, i) => i % step === 0)
    .map(([ts, price]) => ({ ts, price }));

  memSet(key, points, ttl);
  await redisPersist(key, staleKey, points, ttl);
  return points;
}
