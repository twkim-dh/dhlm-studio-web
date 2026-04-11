import { NextResponse } from 'next/server';

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/api/v3';

export const revalidate = 3600; // 1-hour cache — OHLC data doesn't need 5-min refresh

export interface OHLCCandle {
  date:   string;
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || '^GSPC';
  const days   = Math.min(Number(searchParams.get('days') || 30), 90);

  if (!FMP_KEY) return NextResponse.json({ candles: [], symbol });

  try {
    const res = await fetch(
      `${FMP_BASE}/historical-price-full/${encodeURIComponent(symbol)}?timeseries=${days}&apikey=${FMP_KEY}`,
      { next: { revalidate: 3600 } }
    );
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
