// /api/markets/ohlc — OHLC candles, Top30 tickers only.
//
// FMP historical-price-full is a per-symbol API — ~1 call per chart view.
// Restricted to TOP_30_TICKERS whitelist to cap FMP usage. Any symbol not in the
// whitelist returns 403 to prevent open-ended FMP quota consumption.
//
// Future: serve from Redis (store OHLC series in daily cron). For now, FMP is
// called per request but only for the 30 allowed symbols.

import { NextResponse } from 'next/server';
import { TOP_30_TICKERS } from '@/lib/top-tickers';
import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';

export const dynamic = 'force-dynamic';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/api/v3';

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

  // Whitelist gate — only Top30 tickers allowed
  if (!TOP30_SET.has(symbol)) {
    return NextResponse.json(
      { error: `OHLC is only available for Top 30 tickers. '${symbol}' is not in the list.`, candles: [] },
      { status: 403 }
    );
  }

  if (!FMP_KEY) return NextResponse.json({ candles: [], symbol });

  if (!(await fmpCanCall())) {
    return NextResponse.json({ candles: [], symbol, error: 'FMP daily budget exhausted' }, { status: 429 });
  }

  try {
    const res = await fetch(
      `${FMP_BASE}/historical-price-full/${encodeURIComponent(symbol)}?timeseries=${days}&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    await fmpTrackCall();
    if (!res.ok) return NextResponse.json({ candles: [], symbol });
    const data = await res.json();

    const raw: { date: string; open: number; high: number; low: number; close: number; volume: number }[] =
      data?.historical ?? [];

    // FMP returns newest first — reverse to chronological order
    const candles: OHLCCandle[] = raw
      .slice(0, days)
      .reverse()
      .map(c => ({
        date:   c.date,
        open:   Number(c.open)   || 0,
        high:   Number(c.high)   || 0,
        low:    Number(c.low)    || 0,
        close:  Number(c.close)  || 0,
        volume: Number(c.volume) || 0,
      }));

    return NextResponse.json({ candles, symbol });
  } catch {
    return NextResponse.json({ candles: [], symbol });
  }
}
