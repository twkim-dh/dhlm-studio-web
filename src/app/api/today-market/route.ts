// /api/today-market — Redis read-only endpoint for home page TODAY'S MARKET section.
//
// Data flow:
//   1. market-snapshot cron (UTC 20:30 weekdays) writes today-market:snapshot:v1
//      with EOD close data (indices, macro) from AV + FMP.
//   2. This endpoint reads that key and layers live crypto (CoinGecko) +
//      live Fear & Greed (CNN) on top. No FMP calls ever.
//
// Fallback: if Redis key is empty (first run, weekend, or cron failed),
//   serves a static snapshot so the home page never shows broken UI.
//
// Free live APIs refreshed every request (no FMP quota consumed):
//   - CoinGecko simple/price → BTC, ETH
//   - CNN Business Fear & Greed

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Static fallback (updated 2026-04-17) ─────────────────────────────────────

const FALLBACK: Omit<TodayMarketPayload, 'asOf' | 'source' | 'verdict'> = {
  indices: [
    { symbol: '^GSPC', price: 0, change: 0, changesPercentage:  1.17 },
    { symbol: '^IXIC', price: 0, change: 0, changesPercentage:  1.96 },
    { symbol: '^DJI',  price: 0, change: 0, changesPercentage:  0.66 },
  ],
  macro: [
    { symbol: 'CLUSD', price:   62.47, change: -0.36, changesPercentage: -0.57 },
    { symbol: 'GCUSD', price: 3238.50, change: 12.10, changesPercentage:  0.37 },
    { symbol: '^VIX',  price:   30.89, change: -2.40, changesPercentage: -7.21 },
    { symbol: '^TNX',  price:    4.26, change:  0.05, changesPercentage:  1.19 },
  ],
  crypto: [
    { id: 'bitcoin',  price: 74659, change24h:  0.36 },
    { id: 'ethereum', price:  2336, change24h: -1.42 },
  ],
  fearGreed: { value: 47, label: 'Neutral', source: 'CNN' },
};

// Redis key written by the market-snapshot cron (20:30 UTC weekdays).
const SNAPSHOT_KEY = 'today-market:snapshot:v1';

// ── Live free-API fetchers ────────────────────────────────────────────────────

async function fetchCoinGecko(): Promise<CryptoPrice[] | null> {
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

async function fetchCNNFearGreed(): Promise<FearGreed | null> {
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
    if (!res.ok) return null;
    const data = await res.json();
    const fg = data?.fear_and_greed;
    if (!fg) return null;
    const score = Math.round(Number(fg.score) || 50);
    const label = String(fg.rating || 'Neutral').replace(/\b\w/g, (c: string) => c.toUpperCase());
    return { value: score, label, source: 'CNN' };
  } catch { return null; }
}

// ── Verdict generator ────────────────────────────────────────────────────────

function generateVerdict(d: Pick<TodayMarketPayload, 'indices' | 'macro' | 'crypto' | 'fearGreed'>): { text: string; trigger: string } {
  const sp500 = d.indices.find(x => x.symbol === '^GSPC');
  const vix   = d.macro.find(x => x.symbol === '^VIX');
  const oil   = d.macro.find(x => x.symbol === 'CLUSD');
  const btc   = d.crypto.find(x => x.id === 'bitcoin');
  const fg    = d.fearGreed;

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
  const sp = sp500 && sp500.changesPercentage !== 0 ? `${sp500.changesPercentage >= 0 ? '+' : ''}${sp500.changesPercentage.toFixed(2)}%` : 'flat';
  return { trigger: 'neutral',
    text: `S&P 500 ${sp}, VIX ${vix ? vix.price.toFixed(1) : '—'}, Bitcoin ${btc ? '$' + Math.round(btc.price).toLocaleString() : '—'} — markets are quiet, which is exactly when the next catalyst is being written into a Bloomberg terminal nobody has read yet.` };
}

// ── Route ────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const url = new URL(request.url);
  const debug = url.searchParams.get('debug');

  // 1. Read stock/macro/index snapshot from Redis (written by market-snapshot cron)
  let snapshotEntry: { data: Partial<TodayMarketPayload>; ts: number } | null = null;
  try {
    const redis = getRedis();
    const raw = await redis.get(SNAPSHOT_KEY);
    if (raw) snapshotEntry = JSON.parse(raw);
  } catch { /* Redis unavailable — proceed to fallback */ }

  // 2. Fetch live free APIs in parallel
  const [liveCrypto, liveFearGreed] = await Promise.all([
    fetchCoinGecko(),
    fetchCNNFearGreed(),
  ]);

  const snapshot = snapshotEntry?.data;
  const hasSnapshot = Boolean(snapshot?.indices?.length);

  const payload: TodayMarketPayload = {
    asOf: snapshot?.asOf ?? new Date().toISOString(),
    indices:   hasSnapshot ? (snapshot!.indices   as Quote[])       : FALLBACK.indices,
    macro:     hasSnapshot ? (snapshot!.macro     as Quote[])       : FALLBACK.macro,
    crypto:    liveCrypto  ?? (snapshot?.crypto   as CryptoPrice[]) ?? FALLBACK.crypto,
    fearGreed: liveFearGreed ?? FALLBACK.fearGreed,
    verdict:   { text: '', trigger: '' },
    source:    hasSnapshot ? 'cached' : 'fallback',
  };
  payload.verdict = generateVerdict(payload);

  if (debug === '1') {
    return NextResponse.json({
      ...payload,
      _debug: {
        snapshotAge: snapshotEntry ? Math.floor((Date.now() - snapshotEntry.ts) / 1000) + 's' : null,
        snapshotKey: SNAPSHOT_KEY,
        liveCrypto:   Boolean(liveCrypto),
        liveFearGreed: Boolean(liveFearGreed),
      },
    });
  }

  return NextResponse.json(payload);
}
