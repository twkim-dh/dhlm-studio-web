import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// /api/fear-greed — full CNN Fear & Greed payload (current + 1W/1M/3M/1Y +
// historical series for chart). Cached in Redis to limit CDN hits.

const REDIS_KEY = 'fear-greed:cache:v1';
const CACHE_TTL = 60 * 60; // 1 hour

interface HistoryPoint { x: number; y: number }
interface FngPayload {
  asOf: string;
  current: { score: number; rating: string };
  ago: { week: number; month: number; threeMonth: number; year: number };
  history: HistoryPoint[]; // last ~year
  source: 'live' | 'cached' | 'fallback';
}

const FALLBACK: Omit<FngPayload, 'source'> = {
  asOf: new Date().toISOString(),
  current: { score: 50, rating: 'Neutral' },
  ago: { week: 50, month: 50, threeMonth: 50, year: 50 },
  history: [],
};

async function fetchCnn(): Promise<Omit<FngPayload, 'source'> | null> {
  try {
    const res = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata/', {
      cache: 'no-store',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'referer': 'https://edition.cnn.com/markets/fear-and-greed',
        'origin': 'https://edition.cnn.com',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const fg = data?.fear_and_greed;
    if (!fg) return null;
    const titleCase = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());
    const round = (v: unknown) => Math.round(Number(v) || 0);
    // CNN history is in fear_and_greed_historical.data with {x: timestamp_ms, y: score}
    const history: HistoryPoint[] = Array.isArray(data?.fear_and_greed_historical?.data)
      ? data.fear_and_greed_historical.data
          .map((p: { x: number; y: number }) => ({ x: Number(p.x) || 0, y: Number(p.y) || 0 }))
          .filter((p: HistoryPoint) => p.x > 0)
      : [];
    return {
      asOf: new Date().toISOString(),
      current: { score: round(fg.score), rating: titleCase(String(fg.rating || 'neutral')) },
      ago: {
        week: round(fg.previous_1_week),
        month: round(fg.previous_1_month),
        threeMonth: round(fg.previous_3_month),
        year: round(fg.previous_1_year),
      },
      history,
    };
  } catch { return null; }
}

export async function GET() {
  // Read cache
  try {
    const redis = getRedis();
    const raw = await redis.get(REDIS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return NextResponse.json({ ...parsed, source: 'cached' });
    }
  } catch { /* fall through */ }

  const live = await fetchCnn();
  if (live) {
    const payload: FngPayload = { ...live, source: 'live' };
    try { const redis = getRedis(); await redis.set(REDIS_KEY, JSON.stringify(live), 'EX', CACHE_TTL); } catch { /* ignore */ }
    return NextResponse.json(payload);
  }

  return NextResponse.json({ ...FALLBACK, source: 'fallback' });
}
