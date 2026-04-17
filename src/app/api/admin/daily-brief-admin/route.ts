// Admin endpoint for Daily Brief management.
// GET /api/admin/daily-brief-admin?action=list          — list all briefs in Redis
// GET /api/admin/daily-brief-admin?action=delete&date=2026-04-16  — delete one
// GET /api/admin/daily-brief-admin?action=deleteAll     — delete ALL (danger)

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import type { DailyBriefData } from '@/app/api/cron/daily-brief/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'list';
  const date = url.searchParams.get('date');

  try {
    const redis = getRedis();

    // ── LIST ──────────────────────────────────────────────────────────────────
    if (action === 'list') {
      const keys: string[] = [];
      let cursor = '0';
      do {
        const [nextCursor, found] = await redis.scan(cursor, 'MATCH', 'daily-brief:*', 'COUNT', 100);
        cursor = nextCursor;
        keys.push(...found);
      } while (cursor !== '0');

      const raws = await Promise.all(keys.map(k => redis.get(k)));
      const briefs = keys.map((k, i) => {
        const raw = raws[i];
        if (!raw) return null;
        try {
          const d = JSON.parse(raw) as DailyBriefData;
          const sp = d.indices?.find(q => q.symbol === '^GSPC');
          const oil = d.macro?.find(q => q.symbol === 'CLUSD');
          return {
            key: k,
            date: d.date,
            status: d.status,
            source: d.source,
            generatedAt: d.generatedAt,
            sp500: sp ? `${sp.price} (${sp.changesPercentage > 0 ? '+' : ''}${sp.changesPercentage.toFixed(2)}%)` : 'N/A',
            oil: oil ? `$${oil.price}` : 'N/A',
            warnings: d.validation?.warnings || [],
          };
        } catch { return { key: k, error: 'Malformed JSON' }; }
      }).filter(Boolean);

      briefs.sort((a, b) => ((b?.date || '') > (a?.date || '') ? 1 : -1));
      return NextResponse.json({ ok: true, count: briefs.length, briefs });
    }

    // ── DELETE ONE ────────────────────────────────────────────────────────────
    if (action === 'delete') {
      if (!date) return NextResponse.json({ ok: false, error: 'date param required' }, { status: 400 });
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ ok: false, error: 'date must be YYYY-MM-DD' }, { status: 400 });
      const key = `daily-brief:${date}`;
      const existed = await redis.del(key);
      return NextResponse.json({ ok: true, key, deleted: existed === 1 });
    }

    // ── DELETE ALL ────────────────────────────────────────────────────────────
    if (action === 'deleteAll') {
      const keys: string[] = [];
      let cursor = '0';
      do {
        const [nextCursor, found] = await redis.scan(cursor, 'MATCH', 'daily-brief:*', 'COUNT', 100);
        cursor = nextCursor;
        keys.push(...found);
      } while (cursor !== '0');
      if (keys.length === 0) return NextResponse.json({ ok: true, deleted: 0 });
      const count = await redis.del(...keys);
      return NextResponse.json({ ok: true, deleted: count, keys });
    }

    return NextResponse.json({ ok: false, error: `Unknown action: ${action}` }, { status: 400 });

  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
