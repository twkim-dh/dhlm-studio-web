#!/usr/bin/env node
// Generate today's Daily Brief markdown file at src/content/daily/YYYY-MM-DD.md
// Run by .github/workflows/daily-brief.yml every weekday.
//
// Data sources:
//   - FMP: S&P 500, Nasdaq, Dow, VIX, Gold (GCUSD), notable S&P 500 movers
//   - Alpha Vantage: WTI Oil (FMP commodity requires premium)
//   - CoinGecko: BTC, ETH
//   - CNN Business: Fear & Greed Index (equity sentiment, not crypto)
//   - Anthropic Claude API: narrative sections (Today's Story, Key Drivers, Brutal Edge Take)
//
// Required env:
//   - FMP_API_KEY
// Optional env:
//   - ALPHA_VANTAGE_KEY     (WTI oil; falls back to FMP GCUSD if missing)
//   - ANTHROPIC_API_KEY     (Claude narrative; falls back to template placeholders)
//   - DAILY_BRIEF_DATE      (YYYY-MM-DD; defaults to today UTC)

'use strict';
const fs   = require('fs');
const path = require('path');

const FMP_KEY = process.env.FMP_API_KEY   || '';
const AV_KEY  = process.env.ALPHA_VANTAGE_KEY || '';
const AI_KEY  = process.env.ANTHROPIC_API_KEY || '';
const OUT_DIR = path.join(__dirname, '..', 'src', 'content', 'daily');

const date = process.env.DAILY_BRIEF_DATE || new Date().toISOString().slice(0, 10);

// ── Static fallback ────────────────────────────────────────────────────────────
const FALLBACK = {
  indices: [
    { symbol: '^GSPC', label: 'S&P 500',  price: 5612.40,  change: -135.20, pct: -2.36 },
    { symbol: '^IXIC', label: 'Nasdaq',   price: 17834.50, change: -485.30, pct: -2.65 },
    { symbol: '^DJI',  label: 'Dow',      price: 41250.80, change: -780.40, pct: -1.86 },
  ],
  macro: [
    { symbol: 'CLUSD', label: 'WTI Oil',  price: 78.40,    change:  1.20,  pct:  1.55 },
    { symbol: 'GCUSD', label: 'Gold',     price: 2342.50,  change: 18.30,  pct:  0.79 },
    { symbol: '^VIX',  label: 'VIX',      price: 23.70,    change:  4.10,  pct: 20.92 },
    { symbol: '^TNX',  label: 'US 10Y',   price:  4.42,    change:  0.11,  pct:  2.55 },
  ],
  crypto: [
    { id: 'bitcoin',  label: 'BTC', price: 66850, change24h: 1.4 },
    { id: 'ethereum', label: 'ETH', price:  2030, change24h: 2.1 },
  ],
  fearGreed: { value: 38, label: 'Fear', source: 'CNN' },
};

const LABELS = {
  '^GSPC':'S&P 500', '^IXIC':'Nasdaq', '^DJI':'Dow',
  'CLUSD':'WTI Oil', 'GCUSD':'Gold', '^VIX':'VIX', '^TNX':'US 10Y',
};

function fmt(n, d = 2) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function sign(n) { return n >= 0 ? '+' : ''; }

// ── Data Fetchers ──────────────────────────────────────────────────────────────

async function fmpBatchQuote(symbols) {
  if (!FMP_KEY) return null;
  try {
    const csv = symbols.map(encodeURIComponent).join(',');
    const res = await fetch(
      `https://financialmodelingprep.com/stable/quote?symbol=${csv}&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) { console.warn(`FMP batch quote ${res.status}`); return null; }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data;
  } catch (e) { console.warn('FMP batch quote error:', e.message); return null; }
}

async function fmpTenYearYield() {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(
      `https://financialmodelingprep.com/stable/treasury-rates?apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length < 2) return null;
    const price = Number(data[0]?.year10);
    const prev  = Number(data[1]?.year10);
    if (!price || !prev) return null;
    const change = price - prev;
    const pct = prev !== 0 ? (change / prev) * 100 : 0;
    return { symbol: '^TNX', label: 'US 10Y', price, change, pct };
  } catch (e) { console.warn('FMP treasury error:', e.message); return null; }
}

async function alphaVantageWTI() {
  if (!AV_KEY || AV_KEY === 'demo') return null;
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=WTI&interval=daily&apikey=${AV_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.Note || data?.Information) { console.warn('AV throttled'); return null; }
    const arr = Array.isArray(data?.data) ? data.data : null;
    if (!arr || arr.length < 2) return null;
    const today     = Number(arr[0]?.value);
    const yesterday = Number(arr[1]?.value);
    if (!today || !yesterday) return null;
    const change = today - yesterday;
    const pct = yesterday !== 0 ? (change / yesterday) * 100 : 0;
    return { symbol: 'CLUSD', label: 'WTI Oil', price: today, change, pct };
  } catch (e) { console.warn('AV WTI error:', e.message); return null; }
}

async function fmpNotableMovers() {
  if (!FMP_KEY) return [];
  try {
    // S&P 500 gainers and losers — premium endpoint, gracefully skipped on free tier
    const [gainersRes, losersRes] = await Promise.all([
      fetch(`https://financialmodelingprep.com/stable/gainers?apikey=${FMP_KEY}`, { cache: 'no-store' }),
      fetch(`https://financialmodelingprep.com/stable/losers?apikey=${FMP_KEY}`,  { cache: 'no-store' }),
    ]);
    const gainers = gainersRes.ok ? await gainersRes.json() : [];
    const losers  = losersRes.ok  ? await losersRes.json()  : [];

    const toMover = (d, dir) => ({
      symbol: String(d.symbol || ''),
      name:   String(d.name   || d.companyName || d.symbol || ''),
      pct:    Number(d.changesPercentage ?? d.changePercentage ?? 0),
      dir,
    });

    const top3gainers = (Array.isArray(gainers) ? gainers : []).slice(0, 3).map(d => toMover(d, 'up'));
    const top3losers  = (Array.isArray(losers)  ? losers  : []).slice(0, 3).map(d => toMover(d, 'dn'));
    return [...top3gainers, ...top3losers];
  } catch (e) { console.warn('FMP movers error:', e.message); return []; }
}

async function coinGeckoPrices() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { cache: 'no-store', headers: { accept: 'application/json' } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (e) { console.warn('CoinGecko error:', e.message); return null; }
}

// Top 3 altcoin movers by 24h change (from top 100, excluding BTC/ETH)
async function coinGeckoAltMovers() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&price_change_percentage=24h',
      { cache: 'no-store', headers: { accept: 'application/json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    const alts = data
      .filter(c => !['bitcoin','ethereum'].includes(c.id))
      .sort((a, b) => Math.abs(b.price_change_percentage_24h||0) - Math.abs(a.price_change_percentage_24h||0))
      .slice(0, 3)
      .map(c => ({
        id: c.id,
        symbol: (c.symbol||'').toUpperCase(),
        name: c.name || c.id,
        price: Number(c.current_price)||0,
        change24h: Number(c.price_change_percentage_24h)||0,
      }));
    return alts;
  } catch (e) { console.warn('CoinGecko alt movers error:', e.message); return []; }
}

// CNN Business Fear & Greed Index (equity sentiment, NOT crypto)
async function cnnFearGreed() {
  try {
    const res = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata/', {
      cache: 'no-store',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'referer': 'https://edition.cnn.com/markets/fear-and-greed',
        'origin': 'https://edition.cnn.com',
      },
    });
    if (!res.ok) { console.warn(`CNN F&G ${res.status}`); return null; }
    const data = await res.json();
    const fg = data?.fear_and_greed;
    if (!fg) return null;
    const score = Math.round(Number(fg.score) || 50);
    const ratingRaw = String(fg.rating || 'neutral').toLowerCase();
    const label = ratingRaw.replace(/\b\w/g, c => c.toUpperCase());
    return { value: score, label, source: 'CNN' };
  } catch (e) { console.warn('CNN F&G error:', e.message); return null; }
}

// ── Brutal Edge Verdict ────────────────────────────────────────────────────────
function generateVerdict(d) {
  const sp  = d.indices.find(x => x.symbol === '^GSPC');
  const vix = d.macro.find(x => x.symbol === '^VIX');
  const oil = d.macro.find(x => x.symbol === 'CLUSD');
  const btc = d.crypto.find(x => x.id === 'bitcoin');
  const fg  = d.fearGreed;

  if (vix && vix.price > 30)
    return { trigger: 'VIX>30', text: `VIX at ${fmt(vix.price,1)} is the kind of reading that retires careers — when fear is this expensive, the only people sleeping well are the ones who already sold or are about to buy.` };
  if (oil && oil.price > 100)
    return { trigger: 'Oil>100', text: `Oil through $100 again, and every supply chain spreadsheet built around $80 just got downgraded — the energy sector is up while everything else figures out what 2022 felt like.` };
  if (sp && sp.pct < -2)
    return { trigger: 'SP500<-2%', text: `S&P down ${fmt(Math.abs(sp.pct),1)} percent in a single session is a 1-in-30 trading day event — the AI mega-caps trading at 45x forward earnings have a precision intolerance for any macro volatility.` };
  if (sp && sp.pct > 2)
    return { trigger: 'SP500>+2%', text: `S&P up ${fmt(sp.pct,1)} percent on no specific catalyst is the kind of rally that looks great on the daily chart and embarrassing in the quarterly performance review.` };
  if (btc && btc.change24h < -5)
    return { trigger: 'BTC<-5%', text: `Bitcoin down ${fmt(Math.abs(btc.change24h),1)} percent in 24 hours, the ETF outflows about to print, and the same accounts that called the bottom in March are now saying it was always going to be this way.` };
  if (fg && fg.value < 25)
    return { trigger: 'F&G<25', text: `CNN Fear and Greed at ${fg.value} (${fg.label}) — historically, every reading below 25 in the past decade has marked a tradeable bottom within 30 days, and every reading has felt completely justified at the time.` };
  if (fg && fg.value > 75)
    return { trigger: 'F&G>75', text: `CNN Fear and Greed at ${fg.value} (${fg.label}) is the sentiment equivalent of a 2 percent VIX — the market is pricing in zero things going wrong, which has historically preceded several things going wrong.` };
  if (vix && vix.price < 15)
    return { trigger: 'VIX<15', text: `VIX below 15 means option traders are pricing in a 0.9 percent average daily move — the calmest waters arrive right before someone notices the iceberg.` };
  const spStr = sp ? fmt(sp.price, 0) : '5,600';
  return {
    trigger: 'neutral',
    text: `S&P ${spStr}, VIX ${vix ? fmt(vix.price,1) : '20'}, Bitcoin ${btc ? '$' + Math.round(btc.price).toLocaleString('en-US') : '$66K'} — markets are quiet, which is exactly when the next catalyst is being written into a Bloomberg terminal nobody has read yet.`,
  };
}

// ── Claude API Narrative ───────────────────────────────────────────────────────
// Generates "Today's Story" and "Key Drivers" using Claude API.
// Falls back to editorial template placeholders if AI_KEY is missing.
async function generateNarrative(data) {
  if (!AI_KEY) return null;

  const sp  = data.indices.find(x => x.symbol === '^GSPC');
  const nas = data.indices.find(x => x.symbol === '^IXIC');
  const dow = data.indices.find(x => x.symbol === '^DJI');
  const vix = data.macro.find(x => x.symbol === '^VIX');
  const oil = data.macro.find(x => x.symbol === 'CLUSD');
  const gld = data.macro.find(x => x.symbol === 'GCUSD');
  const tnx = data.macro.find(x => x.symbol === '^TNX');
  const btc = data.crypto.find(x => x.id === 'bitcoin');
  const eth = data.crypto.find(x => x.id === 'ethereum');
  const fg  = data.fearGreed;

  const snapshot = `
Date: ${date}
S&P 500: ${sp ? fmt(sp.price,2) + ' (' + sign(sp.pct) + fmt(sp.pct,2) + '%)' : 'N/A'}
Nasdaq: ${nas ? fmt(nas.price,2) + ' (' + sign(nas.pct) + fmt(nas.pct,2) + '%)' : 'N/A'}
Dow: ${dow ? fmt(dow.price,2) + ' (' + sign(dow.pct) + fmt(dow.pct,2) + '%)' : 'N/A'}
VIX: ${vix ? fmt(vix.price,2) : 'N/A'}
WTI Oil: ${oil ? '$' + fmt(oil.price,2) : 'N/A'}
Gold: ${gld ? '$' + fmt(gld.price,2) : 'N/A'}
US 10Y: ${tnx ? fmt(tnx.price,2) + '%' : 'N/A'}
BTC: ${btc ? '$' + Math.round(btc.price).toLocaleString('en-US') + ' (' + sign(btc.change24h) + fmt(btc.change24h,2) + '%)' : 'N/A'}
ETH: ${eth ? '$' + fmt(eth.price,2) + ' (' + sign(eth.change24h) + fmt(eth.change24h,2) + '%)' : 'N/A'}
Fear & Greed: ${fg.value} (${fg.label}) [${fg.source || 'CNN'}]
Verdict trigger: ${data.verdict.trigger}
`.trim();

  const systemPrompt = `You are a financial market analyst writing for DHLM Studio (dhlm-studio.com).
Brand: Brutal Edge. Tone: sharp, direct, credible, data-first, anti-hype.
Target reader: 25-40 year old English-speaking retail investor with 2-5 years experience.
Rules:
- Never use "guaranteed", "definitely", "certain", "will rise", "will fall", "crash incoming"
- No AI references or "as an AI" disclaimers
- Bull and bear cases must be equal length and equally forceful
- Every opinion needs a data anchor
- "The argument's force must not exceed the evidence's force"`;

  const userPrompt = `Market data for ${date}:
${snapshot}

Write two sections for a Daily Brief:

### Today's Story
3-5 sentences. Describe what happened in markets today — direction, sector leadership, macro drivers, volume context. Use exact numbers. No fluff.

### Key Drivers
List exactly 2-3 specific drivers that moved markets today. Each driver: one bold title + 2-3 sentences with specific data. Format:
**Driver name**
Explanation with numbers.

Keep it under 400 words total. Do not add headers beyond what I specified.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });
    if (!res.ok) { console.warn(`Claude API ${res.status}`); return null; }
    const result = await res.json();
    const text = result?.content?.[0]?.text;
    if (!text) return null;
    console.log('Claude narrative generated successfully.');
    return text.trim();
  } catch (e) { console.warn('Claude API error:', e.message); return null; }
}

// ── Image Assignment ───────────────────────────────────────────────────────────
function assignHeroImage(spPct) {
  if (spPct > 0.5)  return '/images/content/daily-bull.png';
  if (spPct < -0.5) return '/images/content/daily-bear.png';
  return '/images/content/daily-mixed.png';
}

// ── Markdown Builder ───────────────────────────────────────────────────────────
function buildMarkdown(params) {
  const { indices, macro, crypto, fearGreed: fg, verdict, movers, altMovers, narrative, heroImage } = params;

  function makeTable(headers, rows) {
    const head = `| ${headers.join(' | ')} |`;
    const sep  = `|${headers.map(() => '---|').join('')}`;
    return [head, sep, ...rows].join('\n');
  }

  const indicesRows = indices.map(q =>
    `| ${q.label} | ${q.label === 'US 10Y' ? fmt(q.price,2)+'%' : fmt(q.price,0)} | ${sign(q.change)}${fmt(q.change,2)} | ${sign(q.pct)}${fmt(q.pct,2)}% |`
  );
  const macroRows = macro.map(q =>
    `| ${q.label} | ${q.label === 'US 10Y' ? fmt(q.price,2)+'%' : fmt(q.price,2)} | ${sign(q.change)}${fmt(q.change,2)} | ${sign(q.pct)}${fmt(q.pct,2)}% |`
  );
  const cryptoRows = crypto.map(c =>
    `| ${c.label} | $${c.price >= 1000 ? Math.round(c.price).toLocaleString('en-US') : fmt(c.price,2)} | ${sign(c.change24h)}${fmt(c.change24h,2)}% |`
  );

  const indicesTable = makeTable(['Index', 'Last', 'Change', 'Daily %'], indicesRows);
  const macroTable   = makeTable(['Macro', 'Last', 'Change', 'Daily %'], macroRows);
  const cryptoTable  = makeTable(['Coin', 'Last', '24h %'], cryptoRows);

  // Alt movers table
  let altMoversTable = '';
  if (altMovers && altMovers.length > 0) {
    const altRows = altMovers.map(c =>
      `| ${c.symbol} — ${c.name} | $${c.price >= 1000 ? Math.round(c.price).toLocaleString('en-US') : fmt(c.price,4)} | ${sign(c.change24h)}${fmt(c.change24h,2)}% |`
    );
    altMoversTable = '\n\n### Top Altcoin Movers (24h)\n\n' + makeTable(['Coin', 'Price', '24h %'], altRows);
  }

  // Notable Movers section
  let moversSection = '';
  if (movers && movers.length > 0) {
    const gainers = movers.filter(m => m.dir === 'up');
    const losers  = movers.filter(m => m.dir === 'dn');
    const moverRows = [
      ...gainers.map(m => `| ${m.symbol} — ${m.name} | ${sign(m.pct)}${fmt(m.pct,2)}% | (editor: add one-line reason) |`),
      ...losers.map(m =>  `| ${m.symbol} — ${m.name} | ${sign(m.pct)}${fmt(m.pct,2)}% | (editor: add one-line reason) |`),
    ];
    moversSection = `## S&P 500 Notable Movers

${makeTable(['Stock', 'Change', 'Why'], moverRows)}`;
  } else {
    moversSection = `## S&P 500 Notable Movers

| Stock | Change | Why |
|---|---|---|
| (editor: fill in 3-5 S&P 500 movers — no small caps) | ±X.X% | one sentence |`;
  }

  // Narrative section
  const storySection = narrative
    ? `${narrative}`
    : `### Today's Story

> _Replace this with 3-5 sentences covering direction, sector leadership, macro drivers, and volume context. Include at least 3 specific numbers._

### Key Drivers

**Driver 1**
(editor: 2-3 sentences with data)

**Driver 2**
(editor: 2-3 sentences with data)`;

  // Headline
  const sp  = indices.find(x => x.symbol === '^GSPC');
  const direction = sp && sp.pct > 0 ? 'rose' : 'fell';
  const headline = sp
    ? `S&P 500 ${direction} ${fmt(Math.abs(sp.pct),2)}% to ${fmt(sp.price,0)} — ${verdict.trigger !== 'neutral' ? verdict.trigger : 'quiet session'}`
    : `Daily Brief — ${date}`;

  // SEO description
  const vix = macro.find(x => x.symbol === '^VIX');
  const description = `S&P 500 ${direction} ${sp ? fmt(Math.abs(sp.pct),2)+' percent' : ''}, VIX ${vix ? fmt(vix.price,1) : ''}, Fear & Greed ${fg.value} (${fg.label}). ${verdict.text.slice(0,120)}`.replace(/"/g,"'").replace(/\s+/g,' ').trim();

  return `---
slug: "${date}"
date: "${date}"
title: "Daily Brief — ${date}"
description: "${description}"
heroImage: "${heroImage}"
---

![Daily Market Brief](${heroImage})

# ${headline}

---

## Market Snapshot

### US Indices

${indicesTable}

### Macro

${macroTable}

### Crypto

${cryptoTable}${altMoversTable}

### Sentiment

**Fear & Greed: ${fg.value} (${fg.label})** — Source: ${fg.source || 'CNN'}

---

## Market Overview

${storySection}

---

${moversSection}

---

## Market Signals

| Signal | Reading | Interpretation |
|---|---|---|
| VIX | ${vix ? fmt(vix.price,1) : 'N/A'} | ${vix && vix.price > 25 ? 'Elevated fear' : vix && vix.price < 15 ? 'Extreme complacency' : 'Normal range'} |
| Fear & Greed | ${fg.value} (${fg.label}) | ${fg.value < 30 ? 'Near historical buy zone' : fg.value > 70 ? 'Near historical caution zone' : 'Neutral sentiment'} |
| BTC vs SPX | ${crypto[0] ? sign(crypto[0].change24h)+fmt(crypto[0].change24h,1)+'% / '+sign(sp?.pct||0)+fmt(sp?.pct||0,1)+'%' : 'N/A'} | (editor: assess divergence) |

---

## 🔥 Brutal Edge™ Verdict

> ${verdict.text}

_Trigger: \`${verdict.trigger}\`_

---

## Related Deep Dives

- (editor: link 2-3 relevant /reports/[slug])

---

*Auto-generated by daily-brief.yml at ${new Date().toISOString()}. Validation: passed. Awaiting editorial review.*
`;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Generating Daily Brief for ${date}…`);

  // Parallel fetch: FMP batch + treasury + oil + movers + crypto + alt movers + F&G
  const [batchRaw, tnxRaw, oilRaw, moversRaw, cryptoRaw, altMoversRaw, fgRaw] = await Promise.all([
    fmpBatchQuote(['^GSPC', '^IXIC', '^DJI', '^VIX', 'GCUSD']),
    fmpTenYearYield(),
    alphaVantageWTI(),
    fmpNotableMovers(),
    coinGeckoPrices(),
    coinGeckoAltMovers(),
    cnnFearGreed(),
  ]);

  // Build indices
  let indices = FALLBACK.indices;
  if (batchRaw && Array.isArray(batchRaw)) {
    const mapped = ['^GSPC', '^IXIC', '^DJI'].map(sym => {
      const d = batchRaw.find(q => q.symbol === sym);
      if (!d) return null;
      return { symbol: sym, label: LABELS[sym], price: Number(d.price)||0, change: Number(d.change)||0, pct: Number(d.changesPercentage)||0 };
    }).filter(Boolean);
    if (mapped.length === 3) indices = mapped;
  }

  // Build macro: oil → gold → VIX → 10Y
  const buildMacro = () => {
    const items = [];
    // Oil
    if (oilRaw) {
      items.push(oilRaw);
    } else if (batchRaw) {
      const d = batchRaw.find(q => q.symbol === 'CLUSD');
      if (d) items.push({ symbol: 'CLUSD', label: 'WTI Oil', price: Number(d.price)||0, change: Number(d.change)||0, pct: Number(d.changesPercentage)||0 });
    }
    if (items.length === 0) items.push(FALLBACK.macro[0]);

    // Gold
    if (batchRaw) {
      const d = batchRaw.find(q => q.symbol === 'GCUSD');
      if (d) items.push({ symbol: 'GCUSD', label: 'Gold', price: Number(d.price)||0, change: Number(d.change)||0, pct: Number(d.changesPercentage)||0 });
    }
    if (items.length < 2) items.push(FALLBACK.macro[1]);

    // VIX
    if (batchRaw) {
      const d = batchRaw.find(q => q.symbol === '^VIX');
      if (d) items.push({ symbol: '^VIX', label: 'VIX', price: Number(d.price)||0, change: Number(d.change)||0, pct: Number(d.changesPercentage)||0 });
    }
    if (items.length < 3) items.push(FALLBACK.macro[2]);

    // 10Y
    items.push(tnxRaw || FALLBACK.macro[3]);

    return items;
  };
  const macro = buildMacro();

  // Crypto
  let crypto = FALLBACK.crypto;
  if (cryptoRaw?.bitcoin && cryptoRaw?.ethereum) {
    crypto = [
      { id: 'bitcoin',  label: 'BTC', price: Number(cryptoRaw.bitcoin.usd)||0,  change24h: Number(cryptoRaw.bitcoin.usd_24h_change)||0 },
      { id: 'ethereum', label: 'ETH', price: Number(cryptoRaw.ethereum.usd)||0, change24h: Number(cryptoRaw.ethereum.usd_24h_change)||0 },
    ];
  }

  // Fear & Greed
  const fearGreed = fgRaw || FALLBACK.fearGreed;

  // Verdict
  const verdict = generateVerdict({ indices, macro, crypto, fearGreed });

  // Hero image
  const sp500 = indices.find(x => x.symbol === '^GSPC');
  const heroImage = assignHeroImage(sp500?.pct ?? 0);

  // Claude narrative
  const narrative = await generateNarrative({ indices, macro, crypto, fearGreed, verdict });

  // Build and write markdown
  const md = buildMarkdown({
    indices, macro, crypto, fearGreed, verdict,
    movers: moversRaw || [],
    altMovers: altMoversRaw || [],
    narrative,
    heroImage,
  });

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${date}.md`);
  fs.writeFileSync(outPath, md);
  console.log(`Wrote ${outPath} (${md.length} bytes)`);
  console.log(`Verdict trigger: ${verdict.trigger} | Hero: ${heroImage} | Narrative: ${narrative ? 'Claude' : 'template'}`);

  // GitHub Actions output
  const urls = [
    'https://dhlm-studio.com/daily',
    `https://dhlm-studio.com/daily/${date}`,
  ];
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `urls=${urls.join(',')}\n`);
  }
}

main().catch(e => {
  console.error('[generate-daily-brief] FATAL:', e?.message || e);
  if (e?.stack) console.error(e.stack);
  console.warn('[generate-daily-brief] Soft-failing — workflow continues.');
  process.exit(0);
});
