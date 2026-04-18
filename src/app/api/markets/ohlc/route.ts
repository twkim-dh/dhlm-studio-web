// /api/markets/ohlc — OHLC candles, Top30 tickers only.
//
// Data is pre-populated daily by /api/cron/market-snapshot (step 7).
// Reads Redis key ohlc:{symbol}:90 and slices to requested days.
// No FMP calls from user-triggered paths.

import { NextResponse } from 'next/server';
import { TOP_30_TICKERS } from '@/lib/top-tickers';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export interface OHLCCandle {
  date:   string;
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
}

const TOP30_SET = new Set(TOP_30_TICKERS as readonly string[]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get('symbol') || '').toUpperCase();
  const days   = Math.min(Number(searchParams.get('days') || 30), 90);

  if (!symbol) return NextResponse.json({ error: 'symbol required', candles: [] }, { status: 400 });

  if (!TOP30_SET.has(symbol)) {
    return NextResponse.json(
      { error: `OHLC is only available for Top 30 tickers. '${symbol}' is not in the list.`, candles: [] },
      { status: 403 }
    );
  }

  try {
    const redis = getRedis();
    const raw = await redis.get(`ohlc:${symbol}:90`);
    if (raw) {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const allCandles = (parsed.candles ?? []) as OHLCCandle[];
      const candles = allCandles.slice(-days);
      return NextResponse.json({ candles, symbol });
    }
  } catch { /* redis error, fall through */ }

  return NextResponse.json({
    candles: [],
    symbol,
    error: 'OHLC data updates daily after market close.',
  });
}
