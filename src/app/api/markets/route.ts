// /api/markets — Thin proxy to /api/markets/movers (Redis snapshot read).
//
// Legacy route used by /markets/gainers, /markets/losers, /markets/most-active sub-pages.
// Previously called AV TOP_GAINERS_LOSERS + FMP stock-screener on every request.
// Now delegates to the movers route which reads market:snapshot:* from Redis — zero API calls.

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import type { MarketSnapshot, StockQuote } from '@/app/api/cron/market-snapshot/route';

export const dynamic = 'force-dynamic';

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

    const sorted = [...top30].sort((a, b) => b.changePercent - a.changePercent);
    const gainers = sorted.filter(s => s.changePercent > 0).slice(0, 10).map(enrichTicker);
    const losers  = sorted.filter(s => s.changePercent < 0).reverse().slice(0, 10).map(enrichTicker);
    const actives = [...top30]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 10)
      .map(enrichTicker);

    return NextResponse.json({
      gainers,
      losers,
      actives,
      date: snapshot.tradingDate,
      lastUpdated: snapshot.asOf,
      stale: false,
    });
  } catch {
    return NextResponse.json({ gainers: [], losers: [], actives: [], stale: true, reason: 'redis-error' });
  }
}
