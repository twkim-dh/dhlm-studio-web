import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

// /api/request-deepdive
//
// POST  body: { ticker: string, email?: string }
//   - Validates ticker (1-10 uppercase letters/digits/dots/hyphens)
//   - Increments ZSET request:counts (member=ticker, score+=1)
//   - Stores email in SET request:emails:<ticker> if provided
//   - Stores last request timestamp in HASH request:meta
//
// GET   returns the top 10 most-requested tickers
//   - Reads ZREVRANGE request:counts WITHSCORES → array of {ticker, count}
//
// All keys are namespaced under "request:" so the same Redis can host
// /api/subscribe data without collision.

const TICKER_RE = /^[A-Z][A-Z0-9.-]{0,9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ZSET_KEY = 'request:counts';
const META_KEY = 'request:meta';
const emailSetKey = (ticker: string) => `request:emails:${ticker}`;

export async function POST(req: Request) {
  let body: { ticker?: unknown; email?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }); }

  const tickerRaw = typeof body.ticker === 'string' ? body.ticker.trim().toUpperCase() : '';
  if (!tickerRaw || !TICKER_RE.test(tickerRaw)) {
    return NextResponse.json({ error: 'invalid ticker' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }

  try {
    const redis = getRedis();
    const pipeline = redis.pipeline();
    pipeline.zincrby(ZSET_KEY, 1, tickerRaw);
    pipeline.hset(META_KEY, tickerRaw, new Date().toISOString());
    if (email) pipeline.sadd(emailSetKey(tickerRaw), email);
    await pipeline.exec();

    const newCount = await redis.zscore(ZSET_KEY, tickerRaw);
    return NextResponse.json({ ok: true, ticker: tickerRaw, count: Number(newCount) || 1 });
  } catch (e) {
    console.error('request-deepdive POST failed:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const redis = getRedis();
    const raw = await redis.zrevrange(ZSET_KEY, 0, 9, 'WITHSCORES');
    // raw = [ticker1, score1, ticker2, score2, ...]
    const top: { ticker: string; count: number }[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      top.push({ ticker: raw[i], count: Number(raw[i + 1]) || 0 });
    }
    return NextResponse.json({ top });
  } catch (e) {
    console.error('request-deepdive GET failed:', e);
    return NextResponse.json({ top: [] });
  }
}
