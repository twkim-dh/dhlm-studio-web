#!/usr/bin/env node
// Comment moderation core logic.
// Reads a single Discussion comment body via stdin or env var COMMENT_BODY,
// returns one of: { tier: 'pass' | 'flag' | 'hide' | 'delete', matched: [...] }
//
// Used by .github/workflows/moderate-comments.yml. Can also be invoked
// locally for spot-checking:
//   echo "this is fucking spam telegram.me/abc" | node scripts/moderate-comment.js
//
// Output is single-line JSON to stdout. Exit code 0 always (the workflow
// decides what to do with the verdict, this script never throws).

const fs = require('fs');
const path = require('path');

const KEYWORDS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src/data/moderation-keywords.json'), 'utf8'));

// Normalize obfuscation: lowercase, strip simple character substitutions.
function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\*/g, '')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a')
    .replace(/!/g, 'i')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't');
}

function countUrls(text) {
  const matches = String(text || '').match(/https?:\/\/[^\s)]+/gi) || [];
  return matches.length;
}

function flatList(group) {
  const out = [];
  for (const [k, v] of Object.entries(group)) {
    if (k.startsWith('_')) continue;
    if (Array.isArray(v)) out.push(...v.map((s) => String(s).toLowerCase()));
  }
  return out;
}

function matches(normalized, list) {
  const hits = [];
  for (const kw of list) {
    if (normalized.includes(kw)) hits.push(kw);
  }
  return hits;
}

function moderate(rawBody) {
  const normalized = normalize(rawBody);
  const urlCount = countUrls(rawBody);

  const deleteHits = matches(normalized, flatList(KEYWORDS.auto_delete || {}));
  if (deleteHits.length > 0) {
    return { tier: 'delete', matched: deleteHits, urlCount };
  }

  const hideHits = matches(normalized, flatList(KEYWORDS.auto_hide || {}));
  if (hideHits.length > 0) {
    return { tier: 'hide', matched: hideHits, urlCount };
  }

  const maxUrls = (KEYWORDS.flag_for_review && KEYWORDS.flag_for_review.url_density_threshold && KEYWORDS.flag_for_review.url_density_threshold.max_urls_allowed) || 1;
  if (urlCount > maxUrls) {
    return { tier: 'hide', matched: ['url_density:' + urlCount], urlCount };
  }

  const flagGroup = Object.assign({}, KEYWORDS.flag_for_review);
  delete flagGroup.url_density_threshold;
  const flagHits = matches(normalized, flatList(flagGroup));
  if (flagHits.length > 0) {
    return { tier: 'flag', matched: flagHits, urlCount };
  }

  return { tier: 'pass', matched: [], urlCount };
}

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(''));
  });
}

async function main() {
  let body = process.env.COMMENT_BODY || '';
  if (!body && !process.stdin.isTTY) {
    body = await readStdin();
  }
  const verdict = moderate(body);
  console.log(JSON.stringify(verdict));
}

if (require.main === module) {
  main();
}

module.exports = { moderate, normalize, countUrls };
