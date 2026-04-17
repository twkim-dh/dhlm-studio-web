// /api/markets/indices — Redis-only snapshot read.
//
// Reads from the market:snapshot:{date} key written by /api/cron/market-snapshot.
// NEVER calls FMP or Alpha Vantage directly — all external fetching is cron's job.
//
// Response:
//   { indices: IndexQuote[], tradingDate: string, asOf: string, stale: false }
// On miss:
//   { indices: [], stale: true, reason: 'no-snapshot' | 'snapshot-expired' }

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import type { MarketSnapshot } from '@/app/api/cron/market-snapshot/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const redis = getRedis();

    const latestDate = await redis.get('market:snapshot:latest');
    if (!latestDate) {
      return NextResponse.json({ indices: [], stale: true, reason: 'no-snapshot' });
    }

    const raw = await redis.get(`market:snapshot:${latestDate}`);
    if (!raw) {
      return NextResponse.json({ indices: [], stale: true, reason: 'snapshot-expired' });
    }

    const snapshot = JSON.parse(raw) as MarketSnapshot;

    return NextResponse.json({
      indices:     snapshot.indices,
      tradingDate: snapshot.tradingDate,
      asOf:        snapshot.asOf,
      stale:       false,
    });
  } catch (e) {
    console.error('[markets/indices] Redis error:', e);
    return NextResponse.json({ indices: [], stale: true, reason: 'redis-error' });
  }
}
