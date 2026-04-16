import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Types (mirrors today-market) ───────────────────────────────────────────
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

export interface DailyBriefData {
  date: string;          // ET date  "2026-04-15"
  generatedAt: string;   // ISO UTC timestamp
  status: 'ok' | 'maintenance';
  maintenanceReason?: string;
  indices: Quote[];
  macro: Quote[];
  crypto: CryptoPrice[];
  fearGreed: FearGreed;
  verdict: { text: string; trigger: string };
  validation: {
    stage1Pass: boolean;
    stage2Pass: boolean;
    warnings: string[];
  };
  source: string;
}

// ─── ET Date helper ──────────────────────────────────────────────────────────
// Cron fires at UTC 20:05 (4:05 PM ET). At that point the trading day is done
// and we want the ET calendar date — not UTC which may already be the next day.
function getETDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

// ─── Stage 1: Range sanity ───────────────────────────────────────────────────
// Hard limits — any price outside these ranges is almost certainly bad data.
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
    if (r && (q.price < r[0] || q.price > r[1])) {
      warnings.push(`${q.symbol} price ${q.price.toFixed(2)} out of expected range [${r[0]}, ${r[1]}]`);
    }
  }
  const btc = d.crypto.find(c => c.id === 'bitcoin');
  const eth = d.crypto.find(c => c.id === 'ethereum');
  if (btc && (btc.price < 5_000 || btc.price > 500_000))
    warnings.push(`BTC price ${btc.price} out of range [5000, 500000]`);
  if (eth && (eth.price < 100 || eth.price > 50_000))
    warnings.push(`ETH price ${eth.price} out of range [100, 50000]`);
  if (d.fearGreed.value < 1 || d.fearGreed.value > 100)
    warnings.push(`Fear & Greed score ${d.fearGreed.value} out of range [1, 100]`);
  return { pass: warnings.length === 0, warnings };
}

// ─── Stage 2: Daily volatility thresholds ────────────────────────────────────
// A single-session move beyond these thresholds is almost certainly stale or
// bad data rather than a real market event. Real circuit-breaker events (±20%)
// are handled by exchange halts before close.
function stage2Check(d: TodayMarketPayload): { pass: boolean; warnings: string[] } {
  const warnings: string[] = [];
  for (const q of d.indices) {
    if (Math.abs(q.changesPercentage) > 10)
      warnings.push(`${q.symbol} single-day move ${q.changesPercentage.toFixed(2)}% exceeds ±10% threshold`);
  }
  const vix = d.macro.find(q => q.symbol === '^VIX');
  if (vix && Math.abs(vix.changesPercentage) > 50)
    warnings.push(`VIX daily change ${vix.changesPercentage.toFixed(2)}% exceeds ±50% threshold`);
  for (const c of d.crypto) {
    if (Math.abs(c.change24h) > 30)
      warnings.push(`${c.id} 24h change ${c.change24h.toFixed(2)}% exceeds ±30% threshold`);
  }
  return { pass: warnings.length === 0, warnings };
}

// ─── Cron handler ────────────────────────────────────────────────────────────
// Schedule: 5 20 * * 1-5  (UTC 20:05 = ET 16:05, just after NYSE close)
// Reads market data from the Redis cache written by /api/today-market cron
// (also at UTC 20:05), runs validation, and stores the day's brief.
//
// Redis key: daily-brief:YYYY-MM-DD (ET date)
// TTL: 7 days (auto-expires old briefs to avoid unbounded growth)
export async function GET() {
  const redis = getRedis();
  const etDate = getETDate();
  const briefKey = `daily-brief:${etDate}`;

  try {
    // Read market data from the shared today-market Redis cache.
    // Both crons run at UTC 20:05; today-market cron is listed first in
    // vercel.json so its cache write should complete before this handler fires.
    const raw = await redis.get('today-market:cache:v5');

    if (!raw) {
      // Cache is empty — market data cron didn't run or failed.
      // Store a maintenance record so the page shows a clean error state.
      await redis.set(briefKey, JSON.stringify({
        date: etDate,
        generatedAt: new Date().toISOString(),
        status: 'maintenance',
        maintenanceReason: 'Market data cache empty at generation time.',
        indices: [], macro: [], crypto: [],
        fearGreed: { value: 50, label: 'Neutral', source: 'CNN' },
        verdict: { text: '', trigger: '' },
        validation: { stage1Pass: false, stage2Pass: false, warnings: ['Cache empty'] },
        source: 'none',
      } satisfies DailyBriefData), 'EX', 86400 * 7);

      return NextResponse.json({ ok: false, date: etDate, reason: 'Market data cache empty' });
    }

    const parsed = JSON.parse(raw) as { data: TodayMarketPayload; ts: number };
    const market = parsed.data;

    // 3-stage validation
    const s1 = stage1Check(market);
    const s2 = stage2Check(market);
    const allWarnings = [...s1.warnings, ...s2.warnings];
    const allPass = s1.pass && s2.pass;

    if (!allPass) {
      await redis.set(briefKey, JSON.stringify({
        date: etDate,
        generatedAt: new Date().toISOString(),
        status: 'maintenance',
        maintenanceReason: allWarnings.join(' | '),
        indices: market.indices,
        macro: market.macro,
        crypto: market.crypto,
        fearGreed: market.fearGreed,
        verdict: market.verdict,
        validation: { stage1Pass: s1.pass, stage2Pass: s2.pass, warnings: allWarnings },
        source: market.source,
      } satisfies DailyBriefData), 'EX', 86400 * 7);

      return NextResponse.json({ ok: false, date: etDate, warnings: allWarnings });
    }

    // All clear — store validated brief
    await redis.set(briefKey, JSON.stringify({
      date: etDate,
      generatedAt: new Date().toISOString(),
      status: 'ok',
      indices: market.indices,
      macro: market.macro,
      crypto: market.crypto,
      fearGreed: market.fearGreed,
      verdict: market.verdict,
      validation: { stage1Pass: true, stage2Pass: true, warnings: [] },
      source: market.source,
    } satisfies DailyBriefData), 'EX', 86400 * 7);

    return NextResponse.json({ ok: true, date: etDate, source: market.source });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[daily-brief cron] error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
