// /api/markets/movers — Top 30 based gainers / losers / most-active.
//
// Derives movers from the market:snapshot top30 array — zero additional
// API calls. Replaces /api/markets (which depended on AV TOP_GAINERS_LOSERS,
// a 25-call/day limited endpoint that frequently returned "unavailable").
//
// Response:
//   { gainers: StockQuote[], losers: StockQuote[], actives: StockQuote[],
//     tradingDate, asOf, stale: false }
// On miss:
//   { gainers: [], losers: [], actives: [], stale: true, reason: string }

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import type { MarketSnapshot, StockQuote } from '@/app/api/cron/market-snapshot/route';

export const dynamic = 'force-dynamic';

// Top 30 company names for display (mirrors TOP_30_TICKERS order)
const TICKER_NAMES: Record<string, string> = {
  AAPL: 'Apple',        MSFT: 'Microsoft',   NVDA: 'NVIDIA',
  GOOGL: 'Alphabet',   AMZN: 'Amazon',       META: 'Meta',
  TSLA: 'Tesla',        'BRK-B': 'Berkshire', AVGO: 'Broadcom',
  LLY: 'Eli Lilly',    JPM: 'JPMorgan',      V: 'Visa',
  WMT: 'Walmart',       XOM: 'ExxonMobil',    UNH: 'UnitedHealth',
  MA: 'Mastercard',     ORCL: 'Oracle',       JNJ: 'Johnson & J.',
  COST: 'Costco',       PG: 'P&G',            HD: 'Home Depot',
  NFLX: 'Netflix',      ABBV: 'AbbVie',       BAC: 'Bank of Amer.',
  KO: 'Coca-Cola',      CVX: 'Chevron',       CRM: 'Salesforce',
  TMUS: 'T-Mobile',     AMD: 'AMD',           PLTR: 'Palantir',
};

function enrichTicker(s: StockQuote) {
  return { ...s, name: TICKER_NAMES[s.symbol] || s.symbol };
}

export async function GET() {
  try {
    const redis = getRedis();

    const latestDate = await redis.get('market:snapshot:latest');
    if (!latestDate) {
      return NextResponse.json({ gainers: [], losers: [], actives: [], stale: true, reason: 'no-snapshot' });
    }

    const raw = await redis.get(`market:snapshot:${latestDate}`);
    if (!raw) {
      return NextResponse.json({ gainers: [], losers: [], actives: [], stale: true, reason: 'snapshot-expired' });
    }

    const snapshot = JSON.parse(raw) as MarketSnapshot;
    const top30 = snapshot.top30.filter(s => s.price > 0);

    if (top30.length === 0) {
      return NextResponse.json({ gainers: [], losers: [], actives: [], stale: true, reason: 'top30-empty' });
    }

    // Sort by % change
    const sorted = [...top30].sort((a, b) => b.changePercent - a.changePercent);
    const gainers = sorted.filter(s => s.changePercent > 0).slice(0, 10).map(enrichTicker);
    const losers  = sorted.filter(s => s.changePercent < 0).reverse().slice(0, 10).map(enrichTicker);

    // Most active: highest absolute % change (most volatile, regardless of direction)
    const actives = [...top30]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 10)
      .map(enrichTicker);

    return NextResponse.json({
      gainers,
      losers,
      actives,
      tradingDate: snapshot.tradingDate,
      asOf:        snapshot.asOf,
      stale:       false,
    });
  } catch (e) {
    console.error('[markets/movers] Redis error:', e);
    return NextResponse.json({ gainers: [], losers: [], actives: [], stale: true, reason: 'redis-error' });
  }
}
