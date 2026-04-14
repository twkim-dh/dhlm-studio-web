#!/usr/bin/env node
/**
 * fetch-learn-images.js — fetch Unsplash hero images for all /learn pages.
 * Run: node scripts/fetch-learn-images.js
 */
'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function loadApiKey() {
  if (process.env.UNSPLASH_ACCESS_KEY) return process.env.UNSPLASH_ACCESS_KEY;
  try {
    for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^UNSPLASH_ACCESS_KEY\s*=\s*(.+)$/);
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch { /* ignore */ }
  return null;
}

const KEY = loadApiKey();
if (!KEY) { console.error('✖ UNSPLASH_ACCESS_KEY missing'); process.exit(1); }

const TARGETS = [
  // /learn landing card images
  { key: 'learn-card-crypto',    query: 'cryptocurrency bitcoin digital gold coin' },
  { key: 'learn-card-investing', query: 'stock market trading chart bullish finance' },
  { key: 'learn-card-research',  query: 'academic library books research study' },
  // Crypto 101 page hero
  { key: 'learn-crypto-101',     query: 'cryptocurrency blockchain network purple' },
  // Investing 101 page hero
  { key: 'learn-investing-101',  query: 'stock exchange trading floor new york' },
  // Crypto 101 — per-week unique images
  { key: 'learn-w1-blockchain',  query: 'blockchain distributed network nodes technology' },
  { key: 'learn-w2-btc-eth',     query: 'bitcoin ethereum gold coin close up' },
  { key: 'learn-w3-wallets',     query: 'hardware wallet security vault technology' },
  { key: 'learn-w4-buy-crypto',  query: 'crypto exchange phone trading app' },
  { key: 'learn-w5-staking',     query: 'ethereum staking coin reward earn' },
  { key: 'learn-w6-defi',        query: 'decentralized finance protocol smart contract code' },
  { key: 'learn-w7-charts',      query: 'candlestick chart trading screen finance' },
  { key: 'learn-w8-portfolio',   query: 'investment portfolio diversity allocation pie' },
  { key: 'learn-w9-layer2',      query: 'blockchain scaling network speed technology' },
  { key: 'learn-w10-nfts',       query: 'nft digital art colorful abstract token' },
  { key: 'learn-w11-taxes',      query: 'tax document calculator finance government' },
  { key: 'learn-w12-advanced',   query: 'defi yield farming liquidity pool advanced' },
];

async function searchPhoto(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' },
  });
  if (res.status === 403) throw new Error('Rate limit reached (50 req/hour).');
  if (!res.ok) return null;
  const json = await res.json();
  // Pick second result if available (avoids same image as other slugs that might share queries)
  return json.results?.[1] || json.results?.[0] || null;
}

async function triggerDownload(photo) {
  try {
    await fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' },
    });
  } catch { /* non-fatal */ }
}

async function main() {
  const manifestPath = path.join(ROOT, 'src/data/unsplash-manifest.json');
  let manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`\nLoaded manifest: ${Object.keys(manifest).length} entries`);
  } catch { console.log('\nStarting fresh manifest'); }

  const todo = TARGETS.filter(t => !manifest[t.key]);
  console.log(`Need to fetch: ${todo.length} / ${TARGETS.length}\n`);

  if (todo.length === 0) { console.log('✓ All learn images already fetched.\n'); return; }

  let fetched = 0, skipped = 0;

  for (let i = 0; i < todo.length; i++) {
    const { key, query } = todo[i];
    process.stdout.write(`[${i + 1}/${todo.length}] ${key}\n       → "${query}" ... `);

    try {
      const photo = await searchPhoto(query);
      if (!photo) { console.log('no results — skip'); skipped++; continue; }

      await triggerDownload(photo);

      manifest[key] = {
        src: `${photo.urls.raw}&w=720&h=380&fit=crop&q=80&fm=jpg&auto=format`,
        alt: photo.alt_description || photo.description || query,
        credit: {
          author:      photo.user.name,
          authorUrl:   `${photo.user.links.html}?utm_source=dhlm_studio&utm_medium=referral`,
          unsplashUrl: `https://unsplash.com/photos/${photo.id}?utm_source=dhlm_studio&utm_medium=referral`,
        },
      };

      console.log(`✓  by ${photo.user.name}`);
      fetched++;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

      if (i < todo.length - 1) await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.log(`\n  ✖ ${e.message}`);
      if (e.message.includes('Rate limit')) { console.error('\nRate limit — retry in 1 hour.\n'); break; }
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Done. Fetched: ${fetched} | Skipped: ${skipped}\n`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
