import { NextResponse } from 'next/server';
import { fmpCallsToday } from '@/lib/fmp-tracker';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

// FMP rate-limit flag key (mirrors today-market route)
const FMP_RATE_LIMIT_KEY = 'fmp:rate-limited';
const LARGECAP_REDIS_KEY = 'fmp:largecap-data:v1';

export async function GET() {
  const { used, budget, remaining } = await fmpCallsToday();

  let rateLimited = false;
  let largeCapCachedAt: string | null = null;

  try {
    const redis = getRedis();
    const [flagRaw, largeCapRaw] = await Promise.all([
      redis.get(FMP_RATE_LIMIT_KEY),
      redis.get(LARGECAP_REDIS_KEY),
    ]);
    rateLimited = Boolean(flagRaw);
    if (largeCapRaw) {
      const parsed = JSON.parse(largeCapRaw) as { ts: number };
      largeCapCachedAt = new Date(parsed.ts).toISOString();
    }
  } catch { /* Redis unavailable */ }

  const pct = budget > 0 ? Math.round((used / budget) * 100) : 0;
  const status = rateLimited ? 'RATE_LIMITED' : remaining === 0 ? 'EXHAUSTED' : used >= 200 ? 'WARN' : 'OK';

  return NextResponse.json({
    status,
    used,
    budget,
    remaining,
    usedPct: `${pct}%`,
    rateLimited,
    largeCapScreenerCachedAt: largeCapCachedAt,
    note: status === 'RATE_LIMITED'
      ? '⛔ FMP circuit breaker active — all calls blocked until TTL expires'
      : status === 'EXHAUSTED'
      ? '⚠️ Daily budget exhausted — serving stale cache only'
      : status === 'WARN'
      ? `⚠️ ${remaining} calls remaining — approaching limit`
      : `✅ ${remaining} calls remaining`,
    asOf: new Date().toISOString(),
  });
}
