import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

// /api/subscribe — newsletter subscriber list backed by Upstash Redis.
//
// POST body: { email: string, source?: string }
//   - Validates email
//   - Adds to SET subscribers:emails (deduped)
//   - Records first-seen ISO timestamp in HASH subscribers:meta
//   - Records source (homepage, daily, request-form, report) in HASH subscribers:source
//
// GET (admin) returns counts only — no email export over public API.
//
// DELETE body: { email } removes subscriber (CAN-SPAM unsubscribe).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = new Set(['homepage', 'daily', 'request-form', 'report', 'about', 'unknown']);

const SET_KEY = 'subscribers:emails';
const META_KEY = 'subscribers:meta';
const SRC_KEY = 'subscribers:source';

export async function POST(req: Request) {
  let body: { email?: unknown; source?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }); }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }
  const sourceRaw = typeof body.source === 'string' ? body.source.trim().toLowerCase() : 'unknown';
  const source = ALLOWED_SOURCES.has(sourceRaw) ? sourceRaw : 'unknown';

  try {
    const redis = getRedis();
    const added = await redis.sadd(SET_KEY, email);
    if (added > 0) {
      await redis.hset(META_KEY, email, new Date().toISOString());
      await redis.hset(SRC_KEY, email, source);
    }
    const total = await redis.scard(SET_KEY);
    return NextResponse.json({ ok: true, alreadySubscribed: added === 0, total });
  } catch (e) {
    console.error('subscribe POST failed:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const redis = getRedis();
    const total = await redis.scard(SET_KEY);
    return NextResponse.json({ total });
  } catch {
    return NextResponse.json({ total: 0 });
  }
}

export async function DELETE(req: Request) {
  let body: { email?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }); }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }
  try {
    const redis = getRedis();
    const removed = await redis.srem(SET_KEY, email);
    if (removed > 0) {
      await redis.hdel(META_KEY, email);
      await redis.hdel(SRC_KEY, email);
    }
    return NextResponse.json({ ok: true, removed: removed > 0 });
  } catch (e) {
    console.error('subscribe DELETE failed:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
