import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { Resend } from 'resend';

// Force the Node.js runtime — ioredis uses raw TCP and cannot run on edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

async function sendWelcomeEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? 'DHLM Studio <daily@dhlm-studio.com>';

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0B0F19;font-family:-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F19;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="padding:0 24px 32px;">
    <div style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#F1F5F9;line-height:1.2;">
      Welcome to<br/><span style="color:#3B4A99;">DHLM Studio.</span>
    </div>
    <div style="font-size:12px;color:#64748B;margin-top:8px;letter-spacing:2px;text-transform:uppercase;">Independent investor research.</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#111827;border-radius:12px;padding:28px 24px;margin:0 24px;">
    <p style="font-size:14px;color:#CBD5E1;line-height:1.7;margin:0 0 20px;">
      You&rsquo;re in. Here&rsquo;s what you&rsquo;ll receive as a subscriber:
    </p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      ${[
        ['Weekly Deep Dives', 'Institutional-grade analysis on AI, semiconductors, and quantum computing stocks.'],
        ['BEAF-Scored Reports', 'Every report scored across Growth, Profitability, Moat, Valuation, Risk, and Momentum.'],
        ['Early Access', 'New reports delivered to subscribers 24 hours before public release.'],
      ].map(([title, desc]) => `
      <tr>
        <td style="padding:8px 0;vertical-align:top;">
          <div style="display:flex;">
            <span style="color:#C73E3A;font-weight:800;font-size:14px;margin-right:10px;line-height:1.5;">→</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#F1F5F9;margin-bottom:2px;">${title}</div>
              <div style="font-size:12px;color:#64748B;line-height:1.5;">${desc}</div>
            </div>
          </div>
        </td>
      </tr>`).join('')}
    </table>

    <div style="font-size:12px;font-weight:800;color:#3B4A99;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Start here — 3 most-read reports</div>
    ${[
      ['Anthropic: Private Investor Report', 'https://dhlm-studio.com/reports/anthropic-private-investor-report-april-2026', 'The $18.4B valuation case — who wins when trust becomes infrastructure.'],
      ['SpaceX IPO: The $1.75 Trillion Question', 'https://dhlm-studio.com/reports/spacex-ipo-special-report', 'The most anticipated private-to-public transition in history.'],
      ['NVIDIA: Building the AI Factory', 'https://dhlm-studio.com/reports/deep-dive-nvda-april-2026', 'BEAF 83/100 — why NVIDIA is more defensible than it looks.'],
    ].map(([title, url, desc]) => `
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:10px;background:#0D1117;border-radius:8px;border:1px solid #1E293B;">
      <tr><td style="padding:14px 16px;">
        <a href="${url}" style="font-size:13px;font-weight:700;color:#F1F5F9;text-decoration:none;">${title}</a>
        <div style="font-size:11px;color:#64748B;margin-top:4px;line-height:1.4;">${desc}</div>
        <a href="${url}" style="display:inline-block;margin-top:8px;font-size:11px;font-weight:700;color:#3B4A99;text-decoration:none;">Read report →</a>
      </td></tr>
    </table>`).join('')}

    <p style="font-size:12px;color:#64748B;line-height:1.6;margin:20px 0 0;">
      Got questions? Reply to this email — it goes directly to the team.
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:24px 24px 0;text-align:center;">
    <div style="font-size:11px;color:#475569;line-height:1.6;">
      You subscribed at dhlm-studio.com<br/>
      DHLM Studio · Seoul, Republic of Korea<br/>
      <a href="https://dhlm-studio.com/api/unsubscribe?email=${encodeURIComponent(email)}" style="color:#475569;">Unsubscribe</a>
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  await resend.emails.send({
    from,
    to: email,
    subject: 'Welcome to DHLM Studio — You\'re in.',
    html,
  });
}

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
      // Fire-and-forget welcome email — subscription succeeds even if email fails
      sendWelcomeEmail(email).catch(e => console.error('[resend] welcome email failed:', e instanceof Error ? e.message : e));
    }
    const total = await redis.scard(SET_KEY);
    return NextResponse.json({ ok: true, alreadySubscribed: added === 0, total });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('subscribe POST failed:', msg);
    return NextResponse.json({ error: 'server error', detail: msg }, { status: 500 });
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
    const msg = e instanceof Error ? e.message : String(e);
    console.error('subscribe DELETE failed:', msg);
    return NextResponse.json({ error: 'server error', detail: msg }, { status: 500 });
  }
}
