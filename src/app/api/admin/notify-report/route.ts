import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SENT_KEY = 'notify:sent';

function buildHtml(title: string, description: string, url: string, email: string): string {
  const unsubUrl = `https://dhlm-studio.com/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const rows = [
    ['BEAF-Scored', 'Every report graded across Growth, Profitability, Moat, Valuation, Risk & Momentum.'],
    ['DHLM Studio', 'Independent investor analysis. No hype, no noise.'],
  ].map(([t, d]) => `
    <tr><td style="padding:8px 0;vertical-align:top;">
      <span style="color:#C73E3A;font-weight:800;font-size:14px;margin-right:10px;">→</span>
      <strong style="color:#F1F5F9;font-size:13px;">${t}:</strong>
      <span style="color:#64748B;font-size:12px;"> ${d}</span>
    </td></tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0B0F19;font-family:-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F19;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="padding:0 24px 24px;">
    <div style="font-family:Georgia,serif;font-size:13px;font-weight:800;color:#2D2F8F;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">DHLM STUDIO — NEW REPORT</div>
    <div style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#F1F5F9;line-height:1.25;margin-bottom:10px;">${title}</div>
    ${description ? `<p style="font-size:13px;color:#94A3B8;line-height:1.7;margin:0 0 20px;">${description}</p>` : ''}
    <a href="${url}" style="display:inline-block;padding:13px 24px;background:#2D2F8F;color:#fff;font-size:13px;font-weight:800;text-decoration:none;border-radius:8px;">Read Full Report →</a>
  </td></tr>

  <tr><td style="background:#111827;border-radius:12px;padding:20px 24px;margin:0 24px;">
    <table cellpadding="0" cellspacing="0" style="width:100%;">${rows}</table>
  </td></tr>

  <tr><td style="padding:24px 24px 0;text-align:center;">
    <div style="font-size:11px;color:#475569;line-height:1.8;">
      <a href="https://dhlm-studio.com" style="color:#64748B;text-decoration:none;">dhlm-studio.com</a>
      &nbsp;·&nbsp;DHLM Studio, Seoul, Republic of Korea<br/>
      <a href="${unsubUrl}" style="color:#475569;">Unsubscribe</a>
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') ?? '';
  const secret = process.env.NOTIFY_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { slug?: unknown; title?: unknown; description?: unknown; url?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }); }

  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const url = typeof body.url === 'string' ? body.url.trim() : '';

  if (!slug || !title || !url) {
    return NextResponse.json({ error: 'slug, title, url required' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });

  const redis = getRedis();

  // Dedup: skip if already sent for this slug
  const alreadySent = await redis.sismember(SENT_KEY, slug);
  if (alreadySent) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'already sent for this slug' });
  }

  const subscribers = await redis.smembers('subscribers:emails');
  if (subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: 'no subscribers' });
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? 'DHLM Studio <daily@dhlm-studio.com>';

  const results = await Promise.allSettled(
    subscribers.map(email =>
      resend.emails.send({
        from,
        to: email,
        subject: `New Report: ${title}`,
        html: buildHtml(title, description, url, email),
      })
    )
  );

  const sent = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  if (sent > 0) {
    await redis.sadd(SENT_KEY, slug);
  }

  console.log(`[notify-report] slug=${slug} sent=${sent} failed=${failed}`);
  return NextResponse.json({ ok: true, sent, failed, total: subscribers.length });
}
