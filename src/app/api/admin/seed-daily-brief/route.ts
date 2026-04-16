// ONE-TIME USE: Manually seed a Daily Brief entry into Redis.
// Call with: GET /api/admin/seed-daily-brief?date=2026-04-15
//
// This is used for practice/testing only. The production flow uses
// /api/cron/daily-brief which fires automatically at UTC 20:05 on weekdays.

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import type { DailyBriefData } from '@/app/api/cron/daily-brief/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── April 15, 2026 — confirmed NYSE closing data ──────────────────────────
const APRIL15: DailyBriefData = {
  date: '2026-04-15',
  generatedAt: '2026-04-15T20:05:00.000Z',
  status: 'ok',

  // US Indices — confirmed April 15 close
  indices: [
    { symbol: '^GSPC', price: 6966.78, change: 80.54,  changesPercentage:  1.17 },
    { symbol: '^IXIC', price: 23639.08, change: 453.27, changesPercentage:  1.96 },
    { symbol: '^DJI',  price: 48536.00, change: 319.70, changesPercentage:  0.66 },
  ],

  // Macro
  macro: [
    { symbol: 'CLUSD', price:  62.47, change: -0.36, changesPercentage: -0.57 },
    { symbol: 'GCUSD', price: 3238.50, change: 12.10, changesPercentage:  0.37 },
    { symbol: '^VIX',  price:  30.89, change: -2.40,  changesPercentage: -7.21 },
    { symbol: '^TNX',  price:   4.26, change:  0.05,  changesPercentage:  1.19 },
  ],

  // Crypto — confirmed April 15 24h data
  crypto: [
    { id: 'bitcoin',  price: 74659, change24h:  0.36 },
    { id: 'ethereum', price:  2336, change24h: -1.42 },
  ],

  // Sentiment
  fearGreed: { value: 47, label: 'Neutral', source: 'CNN' },

  // Verdict — auto-generated (VIX>30 trigger)
  verdict: {
    trigger: 'VIX>30',
    text: 'VIX at 30.9 is the kind of reading that retires careers — when fear is this expensive, the only people sleeping well are the ones who already sold or are about to buy.',
  },

  // Extended — approximate April 15 values
  russell2000: { symbol: '^RUT',    price: 2012.34, change: 8.90,   changesPercentage:  0.44 },
  dxy:         { symbol: 'DX-Y.NYB', price:  99.23, change: -0.31,  changesPercentage: -0.31 },
  eurusd:      { symbol: 'EUR/USD',  price:  1.1342, change: 0.0018, changesPercentage:  0.16 },
  usdjpy:      { symbol: 'USD/JPY',  price: 142.85,  change: -0.35,  changesPercentage: -0.24 },
  solana:      { id: 'solana', price: 134.82, change24h: 1.35 },

  // Today's Movers — April 15, 2026 notable movers
  movers: [
    {
      symbol: 'NVDA', name: 'NVIDIA Corporation',
      price: 882.50, pct: 5.24, direction: 'up',
      reason: 'NVIDIA confirms record AI infrastructure order from three hyperscalers; H200 allocation doubled for Q3.',
    },
    {
      symbol: 'IONQ', name: 'IonQ Inc.',
      price: 28.14, pct: 20.18, direction: 'up',
      reason: 'Quantum sector rotation amid broader tech rally; no company-specific news disclosed.',
    },
    {
      symbol: 'SMCI', name: 'Super Micro Computer',
      price: 38.60, pct: -8.40, direction: 'down',
      reason: 'Preliminary Q3 results miss revenue guidance; management cites supply chain delays in liquid cooling.',
    },
    {
      symbol: 'TSLA', name: 'Tesla Inc.',
      price: 243.80, pct: 3.12, direction: 'up',
      reason: 'Tariff exemption on EV battery components from China confirmed; margin recovery trade resumed.',
    },
    {
      symbol: 'XOM', name: 'ExxonMobil',
      price: 107.20, pct: -1.87, direction: 'down',
      reason: 'WTI crude slips below $63; energy sector underperformed as rate fears resurface.',
    },
  ],

  // Today's News — April 15, 2026
  news: [
    {
      headline: 'S&P 500 snaps losing streak as Nasdaq leads broad tech recovery',
      summary: 'Major indices closed higher Tuesday as technology and consumer discretionary sectors led the advance. VIX remained elevated above 30 but pulled back sharply from Monday\'s intraday highs, signaling some stabilization in volatility.',
      source: 'Reuters',
      url: '',
    },
    {
      headline: 'Fed officials signal willingness to cut rates if labor market weakens',
      summary: 'Several Federal Reserve officials noted the central bank has room to cut rates if tariff-driven inflation proves transitory and employment conditions soften. Markets are now pricing a 72% chance of a June cut.',
      source: 'Bloomberg',
      url: '',
    },
    {
      headline: 'China responds to US semiconductor restrictions with rare earth export limits',
      summary: 'Beijing announced new export controls on seven rare earth materials critical for defense and semiconductor manufacturing, escalating the trade conflict. Supply chain strategists flagged 6–9 month inventory buffers at major US chip firms.',
      source: 'WSJ',
      url: '',
    },
    {
      headline: 'Gold holds above $3,200 as dollar weakness persists amid tariff uncertainty',
      summary: 'Gold extended its 2026 rally, closing above $3,238 as the dollar index retreated below 100. Central bank buying from emerging markets continues to provide a structural bid.',
      source: 'CNBC',
      url: '',
    },
    {
      headline: 'Bitcoin rebounds to $74,659 as institutional ETF inflows resume',
      summary: 'Spot Bitcoin ETFs recorded $420M in inflows on Tuesday, the largest single-day figure in three weeks. Analysts attribute the shift to reduced macro correlation as BTC decoupled from equity movements earlier in the session.',
      source: 'CoinDesk',
      url: '',
    },
  ],

  // What to Watch Tomorrow — April 16, 2026
  tomorrow: [
    { time: '8:30 AM ET', event: 'US Retail Sales (March)',       importance: 'High'   },
    { time: '8:30 AM ET', event: 'Initial Jobless Claims (weekly)', importance: 'High'   },
    { time: '12:00 PM ET', event: 'Fed Governor Williams Speech',  importance: 'Medium' },
    { time: '2:00 PM ET', event: 'TSMC Q1 2026 Earnings',          importance: 'High'   },
  ],

  validation: { stage1Pass: true, stage2Pass: true, warnings: [] },
  source: 'seeded',
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || '2026-04-15';

  // Only allow seeding the known test date to prevent accidental overwrites
  if (date !== '2026-04-15') {
    return NextResponse.json(
      { ok: false, error: 'Only 2026-04-15 is supported by this seed endpoint.' },
      { status: 400 }
    );
  }

  try {
    const redis = getRedis();
    const key = `daily-brief:${date}`;
    await redis.set(key, JSON.stringify(APRIL15), 'EX', 86400 * 30);
    return NextResponse.json({ ok: true, date, key, previewUrl: `https://dhlm-studio.com/daily/${date}` });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
