// /api/markets/sectors — Redis-only snapshot read.
//
// Returns sector ETF daily % change from the latest market snapshot.
// Replaces /api/markets/top20 for the sector heatmap on /markets.
//
// Response:
//   { sectors: StockQuote[], tradingDate, asOf, stale: false }
// On miss:
//   { sectors: [], stale: true, reason: string }

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import type { MarketSnapshot } from '@/app/api/cron/market-snapshot/route';

export const dynamic = 'force-dynamic';

// Sector label map for the 11 SPDR sector ETFs
const SECTOR_LABELS: Record<string, string> = {
  XLK:  'Technology',
  XLF:  'Financials',
  XLV:  'Healthcare',
  XLE:  'Energy',
  XLY:  'Consumer Cyclical',
  XLI:  'Industrials',
  XLP:  'Consumer Staples',
  XLU:  'Utilities',
  XLRE: 'Real Estate',
  XLB:  'Materials',
  XLC:  'Communication',
};

export async function GET() {
  try {
    const redis = getRedis();

    const latestDate = await redis.get('market:snapshot:latest');
    if (!latestDate) {
      return NextResponse.json({ sectors: [], stale: true, reason: 'no-snapshot' });
    }

    const raw = await redis.get(`market:snapshot:${latestDate}`);
    if (!raw) {
      return NextResponse.json({ sectors: [], stale: true, reason: 'snapshot-expired' });
    }

    const snapshot = JSON.parse(raw) as MarketSnapshot;

    const sectors = snapshot.sectors.map(s => ({
      ...s,
      label: SECTOR_LABELS[s.symbol] || s.symbol,
    }));

    return NextResponse.json({
      sectors,
      tradingDate: snapshot.tradingDate,
      asOf:        snapshot.asOf,
      stale:       false,
    });
  } catch (e) {
    console.error('[markets/sectors] Redis error:', e);
    return NextResponse.json({ sectors: [], stale: true, reason: 'redis-error' });
  }
}
