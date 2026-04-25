import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') ?? '';
  const secret = process.env.ADMIN_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const redis = getRedis();
    const [emails, meta, source] = await Promise.all([
      redis.smembers('subscribers:emails'),
      redis.hgetall('subscribers:meta'),
      redis.hgetall('subscribers:source'),
    ]);

    return NextResponse.json({
      total: emails.length,
      emails: emails.sort(),
      meta: meta ?? {},
      source: source ?? {},
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
