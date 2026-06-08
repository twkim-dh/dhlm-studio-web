#!/usr/bin/env node
/**
 * Pre-Publication Market Check
 *
 * Usage: node scripts/pre-publish-check.js [slug]
 *        node scripts/pre-publish-check.js --list-upcoming
 *
 * Reads a report's frontmatter and body, extracts:
 *   - Tickers, crypto assets
 *   - Price mentions and key figures from body text
 *   - Publication date
 *   - Content type (for check intensity)
 *
 * Then Claude Code manually performs WebSearch to verify current prices
 * and reports in the required format before pushing to git.
 *
 * CHECK INTENSITY:
 *   STRONG: Deep Dive, Special Report (all 5 checklist items)
 *   BASIC:  Framework/Theory, Mental Game, Masters (items 2+5+tone)
 *
 * KST/ET NOTE:
 *   KST is UTC+9. US Eastern is UTC-4/5.
 *   KST publication time ≈ ET previous day evening.
 *   "Current price" = most recent ET trading session close.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '..', 'src', 'content', 'reports');
const TODAY_KST   = (() => {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
})();

// ─── Frontmatter parser ───────────────────────────────────────────────────────
function parseFm(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    fm[kv[1]] = v;
  }
  // Parse inline array tags
  const tagM = m[1].match(/^tags:\s*(\[.*?\])/m);
  if (tagM) try { fm.tags = JSON.parse(tagM[1]); } catch { /* ignore */ }
  const tickerM = m[1].match(/^tickers:\s*(\[.*?\])/m);
  if (tickerM) try { fm.tickers = JSON.parse(tickerM[1]); } catch { /* ignore */ }
  return { fm, body: m[2] };
}

// ─── Price mention extractor ──────────────────────────────────────────────────
function extractPriceMentions(body) {
  const mentions = [];

  // Dollar prices: $XX, $X,XXX, $X.Xk, $X billion/trillion
  const priceRe = /\$(\d[\d,]*(?:\.\d+)?(?:\s*(?:billion|trillion|million|B|T|M|K|k))?)/g;
  let m;
  while ((m = priceRe.exec(body)) !== null) {
    const ctx = body.substring(Math.max(0, m.index - 60), m.index + 60).replace(/\n/g, ' ');
    mentions.push({ value: '$' + m[1], context: ctx.trim() });
  }

  // BTC price mentions
  const btcRe = /(?:bitcoin|btc)[^\n]*?(\$[\d,]+)/gi;
  while ((m = btcRe.exec(body)) !== null) {
    const ctx = body.substring(Math.max(0, m.index - 40), m.index + 80).replace(/\n/g, ' ');
    mentions.push({ value: m[1] + ' (BTC)', context: ctx.trim() });
  }

  // Deduplicate by value
  const seen = new Set();
  return mentions.filter(p => {
    if (seen.has(p.value)) return false;
    seen.add(p.value);
    return true;
  }).slice(0, 15); // cap at 15 most relevant
}

// ─── Company name → ticker mapping ────────────────────────────────────────────
const TAG_TO_TICKER = {
  'NVIDIA': 'NVDA', 'GOOGLE': 'GOOGL', 'ALPHABET': 'GOOGL', 'MICROSOFT': 'MSFT',
  'AMAZON': 'AMZN', 'TESLA': 'TSLA', 'META': 'META', 'APPLE': 'AAPL',
  'NETFLIX': 'NFLX', 'PALANTIR': 'PLTR', 'INTEL': 'INTC', 'COINBASE': 'COIN',
  'MICROSTRATEGY': 'MSTR', 'STRATEGY': 'MSTR', 'MARATHON': 'MARA',
  'IONQ': 'IONQ', 'RIGETTI': 'RGTI', 'DWAVE': 'QBTS', 'ROCKET-LAB': 'RKLB',
  'AST-SPACEMOBILE': 'ASTS', 'INTUITIVE-MACHINES': 'LUNR', 'NIKE': 'NKE',
  'JPMORGAN': 'JPM', 'INNODATA': 'INOD', 'CIRCLE': 'CRCL', 'NAVITAS': 'NVTS',
  'REDWIRE': 'RDW', 'BROADCOM': 'AVGO', 'COHERENT': 'COHR',
};

// ─── Ticker extractor from tags ───────────────────────────────────────────────
function extractTickers(fm) {
  const tickers = new Set();
  const NOISE = new Set(['M7', 'AI', 'IEA', 'SEC', 'AGI', 'HBM', 'ML',
                          'API', 'CPU', 'GPU', 'LLM', 'AGI', 'ASI', 'ARC',
                          'DLR', 'CEG', 'GEV', 'CPO', 'GRID', 'POWER']);

  // From explicit tickers field
  if (Array.isArray(fm.tickers)) fm.tickers.forEach(t => tickers.add(t));

  // From tags
  if (Array.isArray(fm.tags)) {
    fm.tags.forEach(tag => {
      const upper = tag.toUpperCase().replace(/-/g, '-');
      // Direct ticker (1-5 uppercase chars, not noise)
      if (/^[A-Z]{1,5}$/.test(tag) && !NOISE.has(tag)) tickers.add(tag);
      // Crypto assets
      if (['BTC', 'ETH', 'XRP', 'SOL', 'USDC', 'USDT', 'MATIC'].includes(tag)) tickers.add(tag);
      // Company name → ticker mapping
      if (TAG_TO_TICKER[upper]) tickers.add(TAG_TO_TICKER[upper]);
    });
  }

  // From title/description for known tickers
  const text = (fm.title || '') + ' ' + (fm.description || '') + ' ' + (fm.slug || '');
  Object.entries(TAG_TO_TICKER).forEach(([name, ticker]) => {
    if (text.toUpperCase().includes(name.replace(/-/g, ' '))) tickers.add(ticker);
  });

  // Remove company-name strings only when they map to a DIFFERENT ticker
  // e.g. APPLE→AAPL: remove APPLE; META→META: keep META
  const aliasOnly = new Set(
    Object.entries(TAG_TO_TICKER)
      .filter(([name, ticker]) => name !== ticker)
      .map(([name]) => name)
  );
  return [...tickers]
    .filter(t => !NOISE.has(t))
    .filter(t => !aliasOnly.has(t.toUpperCase()))
    .sort();
}

// ─── Check intensity ──────────────────────────────────────────────────────────
function checkIntensity(fm) {
  const badge = (fm.badge || fm.type || '').toLowerCase();
  const subcategory = (fm.subcategory || fm.category || '').toLowerCase();
  const tags = Array.isArray(fm.tags) ? fm.tags.join(' ').toLowerCase() : '';

  const isFramework = tags.includes('framework') || tags.includes('architecture') ||
                      tags.includes('mental-game') || tags.includes('masters');
  const isResearch   = subcategory.includes('mental') || subcategory.includes('structural');

  if (isFramework || isResearch) return 'BASIC';
  return 'STRONG';
}

// ─── Upcoming reports ─────────────────────────────────────────────────────────
function listUpcoming() {
  const files = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.md'));
  const upcoming = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join(REPORTS_DIR, f), 'utf8');
    const { fm } = parseFm(raw);
    const d = (fm.date || '').slice(0, 10);
    if (d > TODAY_KST) {
      upcoming.push({
        date: d,
        slug: f.replace('.md', ''),
        category: fm.subcategory || fm.category || '-',
        tickers: extractTickers(fm).join(', ') || '-',
      });
    }
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  console.log('\n📅 Upcoming Scheduled Reports\n');
  console.log('Date       | Slug                                          | Cat              | Tickers');
  console.log('-----------+-----------------------------------------------+------------------+---------');
  for (const r of upcoming) {
    const slug = r.slug.padEnd(45);
    const cat  = r.category.padEnd(16);
    console.log(`${r.date} | ${slug} | ${cat} | ${r.tickers}`);
  }
  console.log(`\nToday (KST): ${TODAY_KST}`);
}

// ─── Main check ───────────────────────────────────────────────────────────────
function runCheck(slug) {
  const mdPath = path.join(REPORTS_DIR, `${slug}.md`);
  if (!fs.existsSync(mdPath)) {
    console.error(`✗  Report not found: ${mdPath}`);
    process.exit(1);
  }

  const raw      = fs.readFileSync(mdPath, 'utf8');
  const { fm, body } = parseFm(raw);
  const pubDate  = (fm.date || '').slice(0, 10);
  const pubKST   = fm.date ? fm.date.replace('T', ' ').replace('Z', ' UTC') : 'unknown';
  const tickers  = extractTickers(fm);
  const prices   = extractPriceMentions(body);
  const intensity = checkIntensity(fm);

  // KST publish time
  const pubDateObj = fm.date ? new Date(fm.date) : null;
  const pubKSTStr  = pubDateObj
    ? new Date(pubDateObj.getTime() + 9 * 3600000).toISOString().replace('T', ' ').slice(0, 16) + ' KST'
    : 'unknown';
  const pubETStr   = pubDateObj
    ? new Date(pubDateObj.getTime() - 4 * 3600000).toISOString().replace('T', ' ').slice(0, 16) + ' ET'
    : 'unknown';

  const now = new Date();
  const nowKSTStr = new Date(now.getTime() + 9 * 3600000).toISOString().replace('T', ' ').slice(0, 16) + ' KST';

  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  [발행 전 시황 점검] Pre-Publication Market Check');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  대상:      ${fm.title || slug}`);
  console.log(`  Slug:      ${slug}`);
  console.log(`  발행 예정: ${pubKSTStr} (${pubETStr})`);
  console.log(`  점검 시각: ${nowKSTStr}`);
  console.log(`  점검 강도: ${intensity === 'STRONG' ? '🚨 STRONG (5개 항목 전부)' : '🟡 BASIC (항목 2+5+톤)'}`);
  console.log('───────────────────────────────────────────────────────────────');

  // Tickers to check
  console.log('\n📊 확인 필요 종목/자산:');
  if (tickers.length > 0) {
    tickers.forEach(t => console.log(`   • ${t}`));
  } else {
    console.log('   (티커 없음 — 거시/프레임워크 리포트)');
  }

  // Key price mentions from body
  if (prices.length > 0 && intensity === 'STRONG') {
    console.log('\n💰 본문 가격 언급 (검증 필요):');
    prices.slice(0, 8).forEach(p => {
      const ctx = p.context.length > 80 ? p.context.slice(0, 80) + '…' : p.context;
      console.log(`   ${p.value.padEnd(20)} | "${ctx}"`);
    });
  }

  // Check template
  console.log('\n');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('  점검 결과 (Claude Code가 채워야 함):');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('  | 항목                | 보고서 값 | 현재 값 | 판정     |');
  console.log('  |---------------------|-----------|---------|----------|');
  tickers.forEach(t => {
    console.log(`  | ${('가격: ' + t).padEnd(19)} | $???      | $???    | ✅/🚨    |`);
  });
  console.log('  | 주요 사건 발생      | 없음 가정 | ???     | ✅/🚨    |');
  console.log('  | 핵심 수치 노후      | -         | -       | ✅/🚨    |');
  console.log('  | 톤-시장 정합성      | -         | -       | ✅/🚨    |');
  console.log('  | 기준일 정확성       | -         | -       | ✅/🚨    |');
  console.log('');
  console.log('  종합 판정: A(발행 진행) / B(보류+김실장 보고) / C(중대보류)');
  console.log('  조치:');
  console.log('');

  // FLAG thresholds
  console.log('───────────────────────────────────────────────────────────────');
  console.log('  FLAG 기준:');
  console.log('  🚨 가격 ±10% 이상 차이');
  console.log('  🚨 핵심 내러티브 변경 사건 (실적/M&A/자산매각/규제)');
  console.log('  🚨 "never-sell" 같은 핵심 주장 무효화 사건');
  console.log('  🚨 강세론 톤 + 당일 폭락 (톤-시장 정면 충돌)');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('  KST/ET 시차: KST 발행 ≈ ET 직전일 저녁 시황 기준');
  console.log('  의심스러우면 = 발행 말고 보류 + 김실장 보고 (일단 발행 금지)');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// ─── Entry point ──────────────────────────────────────────────────────────────
const arg = process.argv[2];
if (!arg || arg === '--list-upcoming' || arg === '-l') {
  listUpcoming();
} else {
  runCheck(arg);
}
