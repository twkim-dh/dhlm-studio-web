import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

// Diagnostic endpoint — confirms Redis connectivity and reports key counts
// without exposing any subscriber data. Hit /api/redis-health from a browser
// after deployment to verify the integration is wired correctly.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const result: Record<string, unknown> = {
    hasEnv: Boolean(process.env.REDIS_URL),
    envHostHint: process.env.REDIS_URL ? new URL(process.env.REDIS_URL.replace('redis://', 'http://')).host.split('@').pop() : null,
  };

  if (!process.env.REDIS_URL) {
    return NextResponse.json({ ok: false, error: 'REDIS_URL not set in environment', ...result }, { status: 500 });
  }

  try {
    const redis = getRedis();
    const start = Date.now();
    const pong = await redis.ping();
    const pingMs = Date.now() - start;
    const subscriberCount = await redis.scard('subscribers:emails');
    const requestCount = await redis.zcard('request:counts');
    return NextResponse.json({
      ok: true,
      ping: pong,
      pingMs,
      subscriberCount,
      requestCount,
      ...result,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? (e.stack || '').split('\n').slice(0, 4).join(' | ') : '';
    return NextResponse.json({ ok: false, error: msg, stack, ...result }, { status: 500 });
  }
}
