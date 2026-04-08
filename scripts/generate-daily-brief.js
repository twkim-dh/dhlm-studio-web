#!/usr/bin/env node
// Generate today's Daily Brief markdown file at src/content/daily/YYYY-MM-DD.md
// Run by .github/workflows/daily-brief.yml every weekday at 11:30 UTC (7:30 AM ET).
//
// Pulls live market data from FMP + CoinGecko + alternative.me, generates a
// Brutal AI verdict using the same trigger logic as /api/today-market, and
// writes a draft markdown file ready for editorial review.
//
// Required env:
//   - FMP_API_KEY        (FMP for indices and macro)
// Optional env:
//   - DAILY_BRIEF_DATE   (YYYY-MM-DD; defaults to today UTC)

const fs = require('fs');
const path = require('path');

const FMP_KEY  = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';
const OUT_DIR  = path.join(__dirname, '..', 'src', 'content', 'daily');

const date = process.env.DAILY_BRIEF_DATE || new Date().toISOString().slice(0, 10);

// ── Static fallback so the brief is never empty even if every API is down. ──
const FALLBACK = {
  indices: [
    { symbol: '^GSPC', label: 'S&P 500',  price: 5612.40,  change: -135.20, pct: -2.36 },
    { symbol: '^IXIC', label: 'Nasdaq',   price: 17834.50, change: -485.30, pct: -2.65 },
    { symbol: '^DJI',  label: 'Dow',      price: 41250.80, change: -780.40, pct: -1.86 },
  ],
  macro: [
    { symbol: 'CLUSD', label: 'WTI Oil',  price: 78.40,    change: 1.20,    pct:  1.55 },
    { symbol: 'GCUSD', label: 'Gold',     price: 2342.50,  change: 18.30,   pct:  0.79 },
    { symbol: '^VIX',  label: 'VIX',      price: 23.70,    change: 4.10,    pct: 20.92 },
    { symbol: '^TNX',  label: 'US 10Y',   price: 4.42,     change: 0.11,    pct:  2.55 },
  ],
  crypto: [
    { id: 'bitcoin',  label: 'BTC', price: 66850, change24h: 1.4 },
    { id: 'ethereum', label: 'ETH', price:  2030, change24h: 2.1 },
  ],
  fearGreed: { value: 38, label: 'Fear' },
};

async function fmpQuote(symbols) {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE}/quote?symbol=${symbols.join(',')}&apikey=${FMP_KEY}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data;
  } catch { return null; }
}

async function coinGeckoPrices() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { cache: 'no-store', headers: { accept: 'application/json' } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function fearAndGreed() {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

const LABELS = { '^GSPC':'S&P 500', '^IXIC':'Nasdaq', '^DJI':'Dow', 'CLUSD':'WTI Oil', 'GCUSD':'Gold', '^VIX':'VIX', '^TNX':'US 10Y' };

function fmt(n, d = 2) { return Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }); }
function sign(n) { return n >= 0 ? '+' : ''; }

// Brutal AI verdict — same trigger order as /api/today-market route.
function generateVerdict(d) {
  const sp = d.indices.find(x => x.symbol === '^GSPC');
  const vix = d.macro.find(x => x.symbol === '^VIX');
  const oil = d.macro.find(x => x.symbol === 'CLUSD');
  const btc = d.crypto.find(x => x.id === 'bitcoin');
  const fg  = d.fearGreed;

  if (vix && vix.price > 30) return { trigger:'VIX>30', text:`VIX at ${fmt(vix.price,1)} is the kind of reading that retires careers — when fear is this expensive, the only people sleeping well are the ones who already sold or are about to buy.` };
  if (oil && oil.price > 100) return { trigger:'Oil>100', text:`Oil through $100 again, and every supply chain spreadsheet built around $80 just got downgraded — the energy sector is up while everything else figures out what 2022 felt like.` };
  if (sp && sp.pct < -2) return { trigger:'SP500<-2%', text:`S&P down ${fmt(Math.abs(sp.pct),1)} percent in a single session is a 1-in-30 trading day event — the AI mega-caps trading at 45x forward earnings have a precision intolerance for any macro volatility.` };
  if (sp && sp.pct > 2) return { trigger:'SP500>+2%', text:`S&P up ${fmt(sp.pct,1)} percent on no specific catalyst is the kind of rally that looks great on the daily chart and embarrassing in the quarterly performance review.` };
  if (btc && btc.change24h < -5) return { trigger:'BTC<-5%', text:`Bitcoin down ${fmt(Math.abs(btc.change24h),1)} percent in 24 hours, the ETF outflows about to print, and the same Twitter accounts that called the bottom in March are now saying it was always going to be this way.` };
  if (fg && fg.value < 25) return { trigger:'F&G<25', text:`Fear and Greed at ${fg.value} (${fg.label}) — historically, every reading below 25 in the past decade has marked a tradeable bottom within 30 days, and every reading has felt completely justified at the time.` };
  if (fg && fg.value > 75) return { trigger:'F&G>75', text:`Fear and Greed at ${fg.value} (${fg.label}) is the sentiment equivalent of a 2 percent VIX — the market is pricing in zero things going wrong, which has historically preceded several things going wrong.` };
  if (vix && vix.price < 15) return { trigger:'VIX<15', text:`VIX below 15 means option traders are pricing in a 0.9 percent average daily move — the calmest waters arrive right before someone notices the iceberg.` };
  return { trigger:'neutral', text:`S&P ${sp ? fmt(sp.price,0) : '5,600'}, VIX ${vix ? fmt(vix.price,1) : '20'}, Bitcoin ${btc ? '$' + Math.round(btc.price).toLocaleString() : '$66K'} — markets are quiet, which is exactly when the next catalyst is being written into a Bloomberg terminal nobody has read yet.` };
}

function buildMarkdown(date, indices, macro, crypto, fg, verdict) {
  const indicesTable = [
    `| Symbol | Last | Change | Daily % |`,
    `|---|---|---|---|`,
    ...indices.map(q => `| ${q.label} | ${fmt(q.price, q.label === 'US 10Y' ? 2 : 0)}${q.label === 'US 10Y' ? '%' : ''} | ${sign(q.change)}${fmt(q.change, 2)} | ${sign(q.pct)}${fmt(q.pct, 2)}% |`),
  ].join('\n');

  const macroTable = [
    `| Symbol | Last | Change | Daily % |`,
    `|---|---|---|---|`,
    ...macro.map(q => `| ${q.label} | ${q.label === 'US 10Y' ? fmt(q.price,2)+'%' : fmt(q.price,2)} | ${sign(q.change)}${fmt(q.change,2)} | ${sign(q.pct)}${fmt(q.pct,2)}% |`),
  ].join('\n');

  const cryptoTable = [
    `| Coin | Last | 24h % |`,
    `|---|---|---|`,
    ...crypto.map(c => `| ${c.label} | $${c.price >= 1000 ? Math.round(c.price).toLocaleString() : fmt(c.price,2)} | ${sign(c.change24h)}${fmt(c.change24h,2)}% |`),
  ].join('\n');

  // The "Today's Story" / "Movers" / "Sector Pulse" / "Week Ahead" sections
  // are placeholders for human editor completion. The brief is published as
  // a draft and the editor fills in the narrative before approval.
  const sp500 = indices.find(x => x.symbol === '^GSPC');
  const vix = macro.find(x => x.symbol === '^VIX');
  const direction = sp500 && sp500.pct < 0 ? 'declined' : 'advanced';

  const title = `Daily Brief — ${date}`;
  const description = `S&P 500 ${direction} ${sp500 ? fmt(Math.abs(sp500.pct),2)+' percent' : ''}, VIX ${vix ? fmt(vix.price,1) : ''}, Fear & Greed at ${fg.value} (${fg.label}). ${verdict.text.slice(0, 120)}`.replace(/\s+/g,' ').trim();

  return `---
slug: "${date}"
date: "${date}"
title: "${title}"
description: "${description.replace(/"/g, "'")}"
---

## Market Snapshot

### US Indices

${indicesTable}

### Macro

${macroTable}

### Crypto

${cryptoTable}

### Sentiment

Fear & Greed Index: **${fg.value} (${fg.label})**

---

## Today's Story

> _This section is the human editor's narrative anchor for the day. The auto-generated draft includes the verdict and data tables. Replace this paragraph with 500-800 words explaining what happened overnight, why it happened, and what it means. Include at least 5 specific numbers in the lead 200 words._

Bull and bear cases for the day's central question go here. Equal length. Equal force. Link to relevant /reports/ Deep Dives.

---

## Movers & Shakers

| Stock | Change | Why |
|---|---|---|
| (editor fills in 5 stocks) | ±X.X% | one sentence reason with internal link if Deep Dive exists |

---

## Sector Pulse

**Strongest today:**
- (editor fills in 3 sectors with one-sentence reasons)

**Weakest today:**
- (editor fills in 3 sectors with one-sentence reasons)

---

## Week Ahead

| Date | Event | Why It Matters |
|---|---|---|
| (editor fills in 3-5 upcoming catalysts) | | |

---

## 🔥 Brutal AI Verdict

> ${verdict.text}

_Trigger: \`${verdict.trigger}\`_

---

## Related Deep Dives

- (editor links 2-3 relevant /reports/[slug])

---

*Generated automatically by daily-brief.yml at ${new Date().toISOString()}. Awaiting human editorial review before publication.*
`;
}

async function main() {
  console.log(`Generating Daily Brief for ${date}…`);

  const [indicesRaw, macroRaw, cryptoRaw, fgRaw] = await Promise.all([
    fmpQuote(['^GSPC', '^IXIC', '^DJI']),
    fmpQuote(['CLUSD', 'GCUSD', '^VIX', '^TNX']),
    coinGeckoPrices(),
    fearAndGreed(),
  ]);

  const indices = (indicesRaw && indicesRaw.length === 3)
    ? indicesRaw.map(d => ({ symbol: d.symbol, label: LABELS[d.symbol] || d.symbol, price: Number(d.price)||0, change: Number(d.change)||0, pct: Number(d.changesPercentage)||0 }))
    : FALLBACK.indices;

  const macro = (macroRaw && macroRaw.length === 4)
    ? macroRaw.map(d => ({ symbol: d.symbol, label: LABELS[d.symbol] || d.symbol, price: Number(d.price)||0, change: Number(d.change)||0, pct: Number(d.changesPercentage)||0 }))
    : FALLBACK.macro;

  const crypto = (cryptoRaw && cryptoRaw.bitcoin && cryptoRaw.ethereum)
    ? [
        { id:'bitcoin',  label:'BTC', price:Number(cryptoRaw.bitcoin.usd)||0,  change24h:Number(cryptoRaw.bitcoin.usd_24h_change)||0 },
        { id:'ethereum', label:'ETH', price:Number(cryptoRaw.ethereum.usd)||0, change24h:Number(cryptoRaw.ethereum.usd_24h_change)||0 },
      ]
    : FALLBACK.crypto;

  const fg = (fgRaw && fgRaw.data && fgRaw.data[0])
    ? { value: Number(fgRaw.data[0].value)||50, label: fgRaw.data[0].value_classification || 'Neutral' }
    : FALLBACK.fearGreed;

  const verdict = generateVerdict({ indices, macro, crypto, fearGreed: fg });
  const md = buildMarkdown(date, indices, macro, crypto, fg, verdict);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${date}.md`);
  fs.writeFileSync(outPath, md);
  console.log(`Wrote ${outPath} (${md.length} bytes)`);
  console.log(`Verdict trigger: ${verdict.trigger}`);

  // Emit URL list for the IndexNow notify step (consumed via INDEXNOW_URLS env).
  const urls = [
    'https://dhlm-studio.com/daily',
    `https://dhlm-studio.com/daily/${date}`,
  ];
  console.log('::set-output name=urls::' + urls.join(','));
  // GitHub Actions modern syntax:
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `urls=${urls.join(',')}\n`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
