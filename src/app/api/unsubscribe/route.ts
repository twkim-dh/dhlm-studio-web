import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SET_KEY = 'subscribers:emails';
const META_KEY = 'subscribers:meta';
const SRC_KEY  = 'subscribers:source';

// GET /api/unsubscribe?email=<encoded-email>
// Removes subscriber from Redis then redirects to /unsubscribe?status=success.
// Linked from email footers — must be a plain GET so clicking works in any client.
export async function GET(req: Request) {
  const url   = new URL(req.url);
  const base  = `${url.protocol}//${url.host}`;
  const email = (url.searchParams.get('email') ?? '').trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.redirect(`${base}/unsubscribe?status=invalid`, { status: 302 });
  }

  try {
    const redis   = getRedis();
    const removed = await redis.srem(SET_KEY, email);
    if (removed > 0) {
      await redis.hdel(META_KEY, email);
      await redis.hdel(SRC_KEY,  email);
    }
    return NextResponse.redirect(`${base}/unsubscribe?status=success`, { status: 302 });
  } catch (e) {
    console.error('[unsubscribe] redis error:', e instanceof Error ? e.message : e);
    return NextResponse.redirect(`${base}/unsubscribe?status=error`, { status: 302 });
  }
}
