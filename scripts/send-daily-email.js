#!/usr/bin/env node
// Send the day's Daily Brief to every subscriber via Resend.
// Run by .github/workflows/daily-brief.yml after the markdown is committed
// and Vercel has had time to rebuild.
//
// Required env:
//   - REDIS_URL          (Upstash, used to read subscriber list)
//   - RESEND_API_KEY     (Resend account API key)
// Optional env:
//   - DAILY_BRIEF_DATE   (YYYY-MM-DD; defaults to today UTC)
//   - RESEND_FROM        (default: 'Brutal AI <daily@dhlm-studio.com>')
//   - DRY_RUN=1          (logs but does not send)
//
// Resend API allows up to 100 recipients per single send. We chunk
// the subscriber list into batches of 90 to leave headroom and avoid
// triggering provider-level deduplication.

const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');
const { Resend } = require('resend');

const HOST = 'dhlm-studio.com';
const SUBSCRIBERS_KEY = 'subscribers:emails';
const BATCH = 90;

const date = process.env.DAILY_BRIEF_DATE || new Date().toISOString().slice(0, 10);
const dryRun = process.env.DRY_RUN === '1';

function loadBrief() {
  const fp = path.join(__dirname, '..', 'src', 'content', 'daily', `${date}.md`);
  if (!fs.existsSync(fp)) throw new Error(`Daily brief not found: ${fp}`);
  const raw = fs.readFileSync(fp, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('Invalid frontmatter');
  const fm = {};
  for (const line of m[1].split('\n')) {
    const lm = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (lm) fm[lm[1]] = lm[2];
  }
  return { fm, body: m[2] };
}

function buildSubject(fm) {
  // Per format proposal §4.4 (subject line emoji approved): 🔥 prefix
  return `🔥 Brutal AI Daily — ${fm.date}: ${(fm.title || '').replace(/^Daily Brief — \S+\s*/, '')}`.trim();
}

function buildHtml(fm, body) {
  // Convert markdown body to a minimal HTML email. Stays inline-styled to
  // survive Gmail/Outlook email-client mangling. Heavy styling lives on the
  // web — the email is the trailer for the web version.
  const url = `https://${HOST}/daily/${date}`;

  // Take the first ~300 words of the body for a teaser, strip markdown.
  const teaser = body
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/^#+\s.*$/gm, '')
    .replace(/[*_`>|]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 300)
    .join(' ') + '…';

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#0B0F19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#E2E8F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr><td>
      <div style="font-family:Georgia,serif;font-size:11px;font-weight:800;color:#C73E3A;letter-spacing:3px;margin-bottom:12px;">🔥 BRUTAL AI&trade; DAILY</div>
      <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:900;color:#F1F5F9;margin:0 0 12px;line-height:1.3;">${fm.title || 'Daily Brief'}</h1>
      <div style="font-size:12px;color:#94A3B8;margin-bottom:20px;">${fm.date} · AI-assisted analysis under human editorial oversight</div>

      <div style="font-size:14px;color:#94A3B8;line-height:1.7;margin-bottom:20px;">${teaser}</div>

      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#C73E3A;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">Read full brief →</a>

      <hr style="border:none;border-top:1px solid #1E293B;margin:32px 0;">

      <div style="font-size:11px;color:#64748B;line-height:1.7;">
        DHLM Studio · Dream · Horizon · Link · Media<br>
        AI-assisted analysis under human editorial oversight, for informational and educational purposes.<br>
        NOT investment advice. Always do your own research.<br>
        <br>
        <a href="https://${HOST}/api/subscribe?email={{email}}" style="color:#64748B;text-decoration:underline;">Unsubscribe</a>
      </div>
    </td></tr>
  </table>
</body></html>`;
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error('REDIS_URL is not set');

  console.log(`Sending Daily Brief for ${date}…`);
  const { fm, body } = loadBrief();
  const subject = buildSubject(fm);
  const html = buildHtml(fm, body);

  const redis = new Redis(redisUrl, { connectTimeout: 5000, maxRetriesPerRequest: 3 });
  const emails = await redis.smembers(SUBSCRIBERS_KEY);
  await redis.quit();

  if (emails.length === 0) {
    console.log('No subscribers. Skipping send.');
    return;
  }
  console.log(`Subscribers: ${emails.length}`);

  if (dryRun) {
    console.log('DRY_RUN=1 — would send to:');
    for (const e of emails.slice(0, 5)) console.log('  -', e);
    if (emails.length > 5) console.log(`  …and ${emails.length - 5} more`);
    console.log(`Subject: ${subject}`);
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM || 'Brutal AI <daily@dhlm-studio.com>';

  // Chunk into batches; send each batch with bcc to obscure recipient list.
  const chunks = [];
  for (let i = 0; i < emails.length; i += BATCH) chunks.push(emails.slice(i, i + BATCH));

  let sent = 0; let failed = 0;
  for (const chunk of chunks) {
    try {
      const r = await resend.emails.send({
        from,
        to: from, // Resend requires a valid to: when using bcc-only
        bcc: chunk,
        subject,
        html,
      });
      if (r.error) { console.error('Resend error:', r.error); failed += chunk.length; }
      else { sent += chunk.length; console.log(`✓ batch sent (${chunk.length})`); }
    } catch (e) {
      console.error('Batch send failed:', e.message);
      failed += chunk.length;
    }
  }
  console.log(`Done. sent=${sent} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
