#!/usr/bin/env node
// IndexNow notifier — pings Bing/Yandex/etc. with newly published URLs.
//
// Usage:
//   node scripts/notify-indexnow.js https://dhlm-studio.com/daily/2026-04-08 https://...
//   node scripts/notify-indexnow.js   (reads URLs from INDEXNOW_URLS env, comma-separated)
//
// Reference: https://www.indexnow.org/documentation
// Endpoint accepts up to 10,000 URLs per request. Bing endpoint propagates to
// IndexNow ecosystem (Yandex, Seznam, etc.).
//
// Required:
//   - public/<KEY>.txt must exist with the same key as a single-line value.
//   - All submitted URLs must belong to the same host.

const HOST = 'dhlm-studio.com';
const KEY  = '6f96b83afd67324845d3cb1986e48b9c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

async function main() {
  const cliUrls = process.argv.slice(2);
  const envUrls = (process.env.INDEXNOW_URLS || '').split(',').map(s => s.trim()).filter(Boolean);
  const urls = [...new Set([...cliUrls, ...envUrls])].filter(u => u.startsWith(`https://${HOST}`));

  if (urls.length === 0) {
    console.log('IndexNow: no URLs to submit. Skipping.');
    return;
  }

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log(`IndexNow: submitting ${urls.length} URL${urls.length > 1 ? 's' : ''} to ${ENDPOINT}`);
  for (const u of urls) console.log('  -', u);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    // Acceptable success: 200 OK or 202 Accepted
    if (res.status === 200 || res.status === 202) {
      console.log(`IndexNow: success (HTTP ${res.status})`);
      return;
    }
    const text = await res.text().catch(() => '');
    console.error(`IndexNow: HTTP ${res.status} — ${text}`);
    process.exit(1);
  } catch (e) {
    console.error('IndexNow: request failed —', e.message);
    process.exit(1);
  }
}

main();
