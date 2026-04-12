import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const FMP_RATE_LIMIT_KEY = 'fmp:rate-limited';

/**
 * POST /api/fmp-reset
 * Manually clears the FMP circuit breaker from Redis.
 * The in-memory flag on warm serverless instances will persist until cold-start,
 * but new invocations will check Redis and proceed normally.
 */
export async function POST() {
  try {
    const redis = getRedis();
    await redis.del(FMP_RATE_LIMIT_KEY);
    return NextResponse.json({
      ok: true,
      message: 'FMP circuit breaker cleared. New requests will proceed normally.',
      clearedAt: new Date().toISOString(),
      note: 'Warm serverless instances may retain the in-memory flag until cold-restart (typically < 5 min on Vercel).',
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : 'Redis unavailable',
    }, { status: 500 });
  }
}

/** GET — show current circuit breaker state only (no side effects) */
export async function GET() {
  try {
    const redis = getRedis();
    const [flagRaw, ttl] = await Promise.all([
      redis.get(FMP_RATE_LIMIT_KEY),
      redis.ttl(FMP_RATE_LIMIT_KEY),
    ]);
    const active = Boolean(flagRaw);
    const expiresAt = active && ttl > 0
      ? new Date(Date.now() + ttl * 1000).toISOString()
      : null;
    return NextResponse.json({
      rateLimited: active,
      ttlSeconds: ttl > 0 ? ttl : null,
      expiresAt,
      hint: active ? `POST /api/fmp-reset to clear immediately` : 'No active rate limit.',
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Redis unavailable' }, { status: 500 });
  }
}
