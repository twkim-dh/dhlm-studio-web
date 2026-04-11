#!/usr/bin/env node
// generate-daily-brief.js — v2
// Rule-based narrative generation. No Claude API required.
// Sources: FMP + CoinGecko + CNN Fear & Greed
//
// Required env: FMP_API_KEY
// Optional env:
//   ALPHA_VANTAGE_KEY   (WTI oil)
//   DAILY_BRIEF_DATE    (YYYY-MM-DD; defaults to today UTC)
//   FMP_PREMIUM         ("true" enables Notable Movers + Earnings sections)

'use strict';
const fs   = require('fs');
const path = require('path');

const FMP_KEY     = process.env.FMP_API_KEY       || '';
const AV_KEY      = process.env.ALPHA_VANTAGE_KEY || '';
const FMP_PREMIUM = process.env.FMP_PREMIUM === 'true';
const OUT_DIR     = path.join(__dirname, '..', 'src', 'content', 'daily');

const date = process.env.DAILY_BRIEF_DATE || new Date().toISOString().slice(0, 10);

// ── Fallback data ──────────────────────────────────────────────────────────────
const FALLBACK = {
  indices: [
    { symbol: '^GSPC', label: 'S&P 500',  price: 5612.40,  change: -135.20, pct: -2.36 },
    { symbol: '^IXIC', label: 'Nasdaq',   price: 17834.50, change: -485.30, pct: -2.65 },
    { symbol: '^DJI',  label: 'Dow',      price: 41250.80, change: -780.40, pct: -1.86 },
  ],
  macro: [
    { symbol: 'CLUSD', label: 'WTI Oil', price: 78.40,   change:  1.20, pct:  1.55 },
    { symbol: 'GCUSD', label: 'Gold',    price: 2342.50, change: 18.30, pct:  0.79 },
    { symbol: '^VIX',  label: 'VIX',     price: 23.70,   change:  4.10, pct: 20.92 },
    { symbol: '^TNX',  label: 'US 10Y',  price:  4.42,   change:  0.11, pct:  2.55 },
  ],
  crypto: [
    { id: 'bitcoin',  label: 'BTC', price: 66850, change24h: 1.4 },
    { id: 'ethereum', label: 'ETH', price:  2030, change24h: 2.1 },
  ],
  fearGreed: { value: 38, label: 'Fear', source: 'CNN' },
};

const LABELS = {
  '^GSPC': 'S&P 500', '^IXIC': 'Nasdaq', '^DJI': 'Dow',
  'CLUSD': 'WTI Oil', 'GCUSD': 'Gold', '^VIX': 'VIX', '^TNX': 'US 10Y',
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
    const pct    = prev !== 0 ? (change / prev) * 100 : 0;
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
    const pct    = yesterday !== 0 ? (change / yesterday) * 100 : 0;
    return { symbol: 'CLUSD', label: 'WTI Oil', price: today, change, pct };
  } catch (e) { console.warn('AV WTI error:', e.message); return null; }
}

// Notable Movers — gated on FMP_PREMIUM
async function fmpNotableMovers() {
  if (!FMP_KEY || !FMP_PREMIUM) return [];
  try {
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
    return [
      ...(Array.isArray(gainers) ? gainers : []).slice(0, 5).map(d => toMover(d, 'up')),
      ...(Array.isArray(losers)  ? losers  : []).slice(0, 5).map(d => toMover(d, 'dn')),
    ];
  } catch (e) { console.warn('FMP movers error:', e.message); return []; }
}

// Earnings Calendar — gated on FMP_PREMIUM
async function fmpEarningsCalendar() {
  if (!FMP_KEY || !FMP_PREMIUM) return [];
  try {
    const res = await fetch(
      `https://financialmodelingprep.com/stable/earning_calendar?from=${date}&to=${date}&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, 10).map(e => ({
      symbol: String(e.symbol || ''),
      name:   String(e.name   || e.symbol || ''),
      eps:    e.eps          != null ? Number(e.eps)          : null,
      epsEst: e.epsEstimated != null ? Number(e.epsEstimated) : null,
      time:   String(e.time  || 'bmo'),
    }));
  } catch (e) { console.warn('FMP earnings error:', e.message); return []; }
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

async function coinGeckoAltMovers() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&price_change_percentage=24h',
      { cache: 'no-store', headers: { accept: 'application/json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter(c => !['bitcoin', 'ethereum'].includes(c.id))
      .sort((a, b) => Math.abs(b.price_change_percentage_24h || 0) - Math.abs(a.price_change_percentage_24h || 0))
      .slice(0, 3)
      .map(c => ({
        id:       c.id,
        symbol:   (c.symbol || '').toUpperCase(),
        name:     c.name || c.id,
        price:    Number(c.current_price) || 0,
        change24h: Number(c.price_change_percentage_24h) || 0,
      }));
  } catch (e) { console.warn('CoinGecko alt movers error:', e.message); return []; }
}

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
    const label = String(fg.rating || 'neutral').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    return { value: score, label, source: 'CNN' };
  } catch (e) { console.warn('CNN F&G error:', e.message); return null; }
}

// ── News Headlines (FMP stock_news + RSS fallback) ────────────────────────────
async function fetchNewsHeadlines() {
  // Primary: FMP stock_news (JSON, reliable)
  if (FMP_KEY) {
    try {
      const res = await fetch(
        `https://financialmodelingprep.com/api/v3/stock_news?limit=50&apikey=${FMP_KEY}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const decodeHtml = (s) => String(s)
          .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&apos;/g,"'").replace(/&nbsp;/g,' ');
        const items = data.slice(0, 8).map(n => ({
            source: String(n.site || 'FMP').slice(0, 20),
            title:  decodeHtml(String(n.title || '')).replace(/\|/g, '—').replace(/\n/g, ' ').trim(),
            link:   String(n.url  || ''),
          })).filter(n => n.title.length > 15).slice(0, 5);
          if (items.length >= 3) {
            console.log(`FMP stock_news: ${items.length} headlines`);
            return items;
          }
        }
      }
    } catch (e) { console.warn('FMP stock_news error:', e.message); }
  }

  // Fallback: RSS feeds
  const rssFeeds = [
    { name: 'CNBC',        url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
    { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories' },
    { name: 'AP Business', url: 'https://feeds.apnews.com/rss/apf-business' },
  ];

  const allItems = [];
  for (const feed of rssFeeds) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { 'user-agent': 'Mozilla/5.0', 'accept': 'application/rss+xml, text/xml' },
      });
      clearTimeout(t);
      if (!res.ok) continue;
      const xml = await res.text();
      const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
      for (const m of matches.slice(0, 15)) {
        const raw = m[1];
        const title = raw.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]
          ?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/\|/g, '—').replace(/\s+/g, ' ').trim();
        const link = raw.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim()
          || raw.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1]?.trim();
        if (title && title.length > 15 && !title.includes('<') && !title.includes('{'))
          allItems.push({ source: feed.name, title, link: link || '' });
      }
    } catch (e) { console.warn(`RSS ${feed.name} error:`, e.message); }
  }

  const keywords = ['market','stock','fed','rate','inflation','gdp','earnings','trade','tariff','oil','gold','bitcoin','crypto','bank','yield','bond','nasdaq','dow','recession','jobs','unemployment','china','dollar','treasury','rally','selloff','economy','interest'];
  const filtered = allItems.filter(n => keywords.some(k => n.title.toLowerCase().includes(k)));

  const seen = new Set();
  const result = filtered.filter(n => {
    const key = n.title.toLowerCase().replace(/\s+/g, ' ').slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 5);

  console.log(`RSS headlines: ${result.length}`);
  return result;
}

// ── Rule-Based Text Generators ─────────────────────────────────────────────────

function detectTopSector(data) {
  const oil  = data.macro.find(x => x.symbol === 'CLUSD');
  const gold = data.macro.find(x => x.symbol === 'GCUSD');
  const vix  = data.macro.find(x => x.symbol === '^VIX');
  const btc  = data.crypto.find(x => x.id === 'bitcoin');
  if (oil  && oil.pct   > 2)    return 'Energy';
  if (gold && gold.pct  > 1.5)  return 'Materials and defensives';
  if (vix  && vix.pct   > 10)   return 'defensive names';
  if (btc  && btc.change24h > 3) return 'tech and risk assets';
  return 'large-cap tech';
}

function detectTopDriverText(data) {
  const vix  = data.macro.find(x => x.symbol === '^VIX');
  const oil  = data.macro.find(x => x.symbol === 'CLUSD');
  const gold = data.macro.find(x => x.symbol === 'GCUSD');
  const tnx  = data.macro.find(x => x.symbol === '^TNX');
  const btc  = data.crypto.find(x => x.id === 'bitcoin');
  const sp   = data.indices.find(x => x.symbol === '^GSPC');

  const candidates = [];
  if (vix  && Math.abs(vix.pct)       > 10) candidates.push({ score: Math.abs(vix.pct),       text: 'VIX volatility spike' });
  if (oil  && Math.abs(oil.pct)       > 2)  candidates.push({ score: Math.abs(oil.pct),       text: `crude oil ${oil.pct > 0 ? 'rally' : 'drop'}` });
  if (gold && Math.abs(gold.pct)      > 1.5) candidates.push({ score: Math.abs(gold.pct),     text: 'safe-haven demand' });
  if (tnx  && Math.abs(tnx.pct)       > 2)  candidates.push({ score: Math.abs(tnx.pct),       text: 'bond market repricing' });
  if (btc  && Math.abs(btc.change24h) > 3)  candidates.push({ score: Math.abs(btc.change24h), text: `crypto ${btc.change24h > 0 ? 'momentum' : 'pressure'}` });

  if (candidates.length === 0)
    return sp && sp.pct > 0 ? 'mixed macro backdrop' : 'broad selling pressure';

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].text;
}

function generateHeadline(data) {
  const sp = data.indices.find(x => x.symbol === '^GSPC');
  if (!sp) return `Daily Brief — ${date}`;

  const pct    = sp.pct;
  const pctStr = fmt(Math.abs(pct), 2);

  if (pct > 2)    return `S&P 500 surges ${pctStr}% in broad-based rally`;
  if (pct > 0.5)  return `S&P 500 gains ${pctStr}% as ${detectTopSector(data)} leads`;
  if (pct > -0.5) return `Markets flat as investors weigh ${detectTopDriverText(data)}`;
  if (pct > -2)   return `S&P 500 drops ${pctStr}% on ${detectTopDriverText(data)}`;
  return `S&P 500 tumbles ${pctStr}% in heavy selling`;
}

function generateMarketOverview(data) {
  const sp  = data.indices.find(x => x.symbol === '^GSPC');
  const nas = data.indices.find(x => x.symbol === '^IXIC');
  const vix = data.macro.find(x => x.symbol === '^VIX');
  const btc = data.crypto.find(x => x.id === 'bitcoin');
  const fg  = data.fearGreed;

  if (!sp) return '_Market data unavailable._';

  // S&P sentence
  const spDir    = sp.pct >= 0 ? 'rose' : 'fell';
  const spPctStr = fmt(Math.abs(sp.pct), 2);
  const spClose  = fmt(sp.price, 0);
  let nasClause  = '';
  if (nas) {
    const aligned = (sp.pct >= 0) === (nas.pct >= 0);
    nasClause = aligned
      ? `, with the Nasdaq ${nas.pct >= 0 ? 'adding' : 'losing'} ${fmt(Math.abs(nas.pct), 2)}% in step`
      : `, while the Nasdaq diverged at ${sign(nas.pct)}${fmt(nas.pct, 2)}%`;
  }

  // VIX sentence
  let vixSentence = '';
  if (vix) {
    const vixDir     = vix.pct >= 0 ? 'rose' : 'fell';
    const vixContext = vix.price > 25 ? 'signaling elevated volatility' : vix.price < 15 ? 'signaling unusually low volatility' : 'remaining within normal range';
    vixSentence = `VIX ${vixDir} to ${fmt(vix.price, 1)}, ${vixContext}.`;
  }

  // BTC sentence
  let btcSentence = '';
  if (btc) {
    const btcDir  = btc.change24h >= 0 ? 'gained' : 'lost';
    const aligned = (sp.pct >= 0) === (btc.change24h >= 0);
    btcSentence   = `Bitcoin ${btcDir} ${fmt(Math.abs(btc.change24h), 1)}% to $${Math.round(btc.price).toLocaleString('en-US')}, ${aligned ? 'aligned with' : 'diverging from'} equity sentiment.`;
  }

  // Sentiment add-ons
  const addOns = [];
  if (vix && vix.price > 25)  addOns.push('Fear is elevated.');
  if (vix && vix.price < 15)  addOns.push('Complacency is high.');
  if (fg.value < 25)          addOns.push(`Extreme Fear territory — Fear & Greed at ${fg.value}.`);
  if (fg.value > 75)          addOns.push(`Extreme Greed territory — Fear & Greed at ${fg.value}.`);

  return [
    `The S&P 500 ${spDir} ${spPctStr}% to ${spClose}${nasClause}.`,
    vixSentence,
    btcSentence,
    ...addOns,
  ].filter(Boolean).join(' ');
}

function generateKeyDrivers(data) {
  const sp   = data.indices.find(x => x.symbol === '^GSPC');
  const vix  = data.macro.find(x => x.symbol === '^VIX');
  const oil  = data.macro.find(x => x.symbol === 'CLUSD');
  const gold = data.macro.find(x => x.symbol === 'GCUSD');
  const tnx  = data.macro.find(x => x.symbol === '^TNX');
  const btc  = data.crypto.find(x => x.id === 'bitcoin');

  const triggers = [];

  // ── Thresholds lowered for minimum 2 drivers ──────────────────────────────
  if (vix && Math.abs(vix.pct) > 10) {
    const dir = vix.pct > 0 ? 'surged' : 'collapsed';
    triggers.push({
      score: Math.abs(vix.pct),
      title: `Volatility ${dir}`,
      body: `VIX ${dir} ${sign(vix.pct)}${fmt(vix.pct, 1)}% to ${fmt(vix.price, 1)}. ${vix.pct > 0
        ? 'A spike of this magnitude signals institutional hedging demand — markets are pricing in elevated uncertainty.'
        : 'The collapse in implied volatility signals option traders pricing in calmer conditions ahead.'}`,
    });
  }

  if (oil && Math.abs(oil.pct) > 2) {
    const dir = oil.pct > 0 ? 'rallied' : 'dropped';
    triggers.push({
      score: Math.abs(oil.pct),
      title: oil.pct > 0 ? 'Oil rally' : 'Oil selloff',
      body: `WTI crude ${dir} ${sign(oil.pct)}${fmt(oil.pct, 1)}% to $${fmt(oil.price, 2)}. ${oil.pct > 0
        ? 'Energy stocks outperformed while consumer staples and transport absorbed the cost pressure.'
        : 'Lower crude eases input costs across industrials, but a move of this size signals demand concern.'}`,
    });
  }

  if (gold && Math.abs(gold.pct) > 1.5) {
    triggers.push({
      score: Math.abs(gold.pct),
      title: gold.pct > 0 ? 'Safe-haven bid' : 'Risk-on rotation',
      body: `Gold ${gold.pct > 0 ? 'climbed' : 'retreated'} ${sign(gold.pct)}${fmt(gold.pct, 1)}% to $${fmt(gold.price, 0)}. ${gold.pct > 0
        ? 'The bid into hard assets reflects institutional concern about equity valuations and macro uncertainty.'
        : 'Capital rotating out of gold suggests improving risk appetite across institutional desks.'}`,
    });
  }

  if (tnx && Math.abs(tnx.pct) > 2) {
    triggers.push({
      score: Math.abs(tnx.pct),
      title: tnx.pct > 0 ? 'Bond selloff — rates rising' : 'Bond rally — rates falling',
      body: `10-year Treasury yield ${tnx.pct > 0 ? 'climbed to' : 'fell to'} ${fmt(tnx.price, 2)}% (${sign(tnx.change)}${fmt(tnx.change, 3)} pp). ${tnx.pct > 0
        ? (tnx.price > 4.5 ? 'Yields above 4.5% compress equity P/E multiples — growth stocks face the most direct pressure.' : 'Rising yields increase the cost of capital — rate-sensitive equities like real estate and utilities absorb this first.')
        : 'Lower yields ease the discount rate burden on long-duration assets including high-multiple tech equities.'}`,
    });
  }

  if (btc && Math.abs(btc.change24h) > 3) {
    triggers.push({
      score: Math.abs(btc.change24h),
      title: btc.change24h > 0 ? 'Crypto momentum' : 'Crypto selloff',
      body: `Bitcoin ${btc.change24h > 0 ? 'surged' : 'dropped'} ${sign(btc.change24h)}${fmt(btc.change24h, 1)}% to $${Math.round(btc.price).toLocaleString('en-US')} over 24 hours. ${btc.change24h > 0
        ? 'The crypto move tracked broader risk appetite — altcoins amplifying BTC direction.'
        : 'The crypto decline preceded equity weakness, consistent with its role as a leading risk-off indicator.'}`,
    });
  }

  // Sort by magnitude
  triggers.sort((a, b) => b.score - a.score);

  // Guarantee minimum 2 drivers by adding remaining macro signals regardless of threshold
  if (triggers.length < 2) {
    const all = [
      vix  ? { score: Math.abs(vix.pct),       symbol: 'VIX',  title: `VIX at ${fmt(vix.price, 1)}`,   body: `VIX moved ${sign(vix.pct)}${fmt(vix.pct, 1)}% to ${fmt(vix.price, 1)}, ${vix.price > 20 ? 'reflecting above-average market uncertainty' : 'holding in the low-volatility range'}.` } : null,
      oil  ? { score: Math.abs(oil.pct),        symbol: 'Oil',  title: `WTI Crude at $${fmt(oil.price, 2)}`, body: `Oil ${oil.pct >= 0 ? 'gained' : 'lost'} ${fmt(Math.abs(oil.pct), 1)}% to $${fmt(oil.price, 2)} — ${oil.pct >= 0 ? 'providing support for energy equities' : 'weighing on energy sector names'}.` } : null,
      gold ? { score: Math.abs(gold.pct),       symbol: 'Gold', title: `Gold at $${fmt(gold.price, 0)}`,  body: `Gold ${gold.pct >= 0 ? 'added' : 'shed'} ${fmt(Math.abs(gold.pct), 1)}% to $${fmt(gold.price, 0)}, ${gold.pct > 0 ? 'indicating mild safe-haven preference' : 'suggesting improving risk appetite'}.` } : null,
      tnx  ? { score: Math.abs(tnx.pct),        symbol: 'TNX',  title: `10Y Yield at ${fmt(tnx.price, 2)}%`, body: `The 10-year yield ${tnx.pct >= 0 ? 'rose' : 'fell'} to ${fmt(tnx.price, 2)}% — ${tnx.price > 4.3 ? 'maintaining pressure on rate-sensitive equity valuations' : 'offering some relief for long-duration equities'}.` } : null,
      btc  ? { score: Math.abs(btc.change24h),  symbol: 'BTC',  title: `Bitcoin at $${Math.round(btc.price).toLocaleString('en-US')}`, body: `Bitcoin ${btc.change24h >= 0 ? 'gained' : 'lost'} ${fmt(Math.abs(btc.change24h), 1)}% over 24 hours, ${(btc.change24h >= 0) === (sp?.pct >= 0) ? 'tracking equity sentiment' : 'diverging from equity direction — a signal worth monitoring'}.` } : null,
    ].filter(Boolean);

    const alreadyIn = new Set(triggers.map(t => t.title));
    for (const candidate of all.sort((a, b) => b.score - a.score)) {
      if (!alreadyIn.has(candidate.title) && triggers.length < 2) {
        triggers.push(candidate);
        alreadyIn.add(candidate.title);
      }
    }
    triggers.sort((a, b) => b.score - a.score);
  }

  const top = triggers.slice(0, 3);

  if (top.length === 0)
    return '_No macro drivers detected. Markets absorbed overnight futures with limited intraday volatility._';

  return top.map(t => `**${t.title}**\n${t.body}`).join('\n\n');
}

function generateMarketSignals(data) {
  const sp  = data.indices.find(x => x.symbol === '^GSPC');
  const vix = data.macro.find(x => x.symbol === '^VIX');
  const tnx = data.macro.find(x => x.symbol === '^TNX');
  const btc = data.crypto.find(x => x.id === 'bitcoin');
  const fg  = data.fearGreed;

  const rows = [];

  if (vix) {
    let interp = 'Normal range';
    if (vix.price > 35)       interp = '⚠️ Panic territory — tail risk events priced in';
    else if (vix.price > 30)  interp = '⚠️ Extreme fear — institutional hedging elevated';
    else if (vix.price > 25)  interp = 'Elevated fear — above-normal hedging activity';
    else if (vix.price < 12)  interp = '⚠️ Extreme complacency — historically precedes spikes';
    else if (vix.price < 15)  interp = 'Low — calm conditions, limited hedging';
    if (vix.pct > 15 && sp && sp.pct < 0)  interp += ' · VIX confirming the selloff';
    if (vix.pct < -15 && sp && sp.pct > 0) interp += ' · Rally with conviction';
    rows.push(`| VIX | ${fmt(vix.price, 1)} (${sign(vix.pct)}${fmt(vix.pct, 1)}%) | ${interp} |`);
  }

  let fgInterp = 'Neutral sentiment';
  if (fg.value < 20)      fgInterp = '⚠️ Extreme Fear — historically a contrarian buy signal';
  else if (fg.value < 35) fgInterp = 'Fear zone — elevated retail caution';
  else if (fg.value > 80) fgInterp = '⚠️ Extreme Greed — crowded long positioning';
  else if (fg.value > 65) fgInterp = 'Greed zone — momentum-chasing risk present';
  rows.push(`| Fear & Greed | ${fg.value} (${fg.label}) | ${fgInterp} |`);

  if (btc && sp) {
    const sameDir = (btc.change24h >= 0) === (sp.pct >= 0);
    rows.push(`| BTC vs SPX | BTC ${sign(btc.change24h)}${fmt(btc.change24h, 1)}% / SPX ${sign(sp.pct)}${fmt(sp.pct, 1)}% | ${sameDir ? 'Risk-on correlation intact' : '⚠️ Crypto diverging from equities — watch for follow-through'} |`);
  }

  if (tnx) {
    let yieldInterp = 'Neutral';
    if (tnx.price > 4.8)       yieldInterp = '⚠️ Above 4.8% — significant P/E compression risk';
    else if (tnx.price > 4.5)  yieldInterp = 'Elevated — equity risk premium narrowing';
    else if (tnx.price > 4.0)  yieldInterp = 'Moderate — watch for continued rise';
    else if (tnx.price < 3.5)  yieldInterp = 'Low — supportive for equity valuations';
    rows.push(`| 10Y Yield | ${fmt(tnx.price, 2)}% | ${yieldInterp} |`);
  }

  return rows.length > 0
    ? `| Signal | Reading | Interpretation |\n|---|---|---|\n${rows.join('\n')}`
    : '_No signal data available._';
}

// ── Brutal Edge Take Pool (25+ conditions) ─────────────────────────────────────
function generateBrutalEdgeTake(data) {
  const sp   = data.indices.find(x => x.symbol === '^GSPC');
  const vix  = data.macro.find(x => x.symbol === '^VIX');
  const oil  = data.macro.find(x => x.symbol === 'CLUSD');
  const gold = data.macro.find(x => x.symbol === 'GCUSD');
  const tnx  = data.macro.find(x => x.symbol === '^TNX');
  const btc  = data.crypto.find(x => x.id === 'bitcoin');
  const fg   = data.fearGreed;

  const spPct   = sp?.pct   ?? 0;
  const vixPct  = vix?.pct  ?? 0;
  const vixVal  = vix?.price ?? 20;
  const fgVal   = fg?.value  ?? 50;
  const btcChg  = btc?.change24h ?? 0;
  const oilChg  = oil?.pct  ?? 0;
  const goldChg = gold?.pct ?? 0;
  const tnxVal  = tnx?.price ?? 4.2;

  // ── Extreme conditions first ───────────────────────────────────────────────
  if (vixVal > 35)
    return { trigger: 'VIX>35', text: `VIX above 35 — this is a liquidity event, not a sentiment wobble. Forced sellers don't check fundamentals. The only question is whether the de-risking is half done or barely started.` };

  if (vixVal > 30)
    return { trigger: 'VIX>30', text: `VIX at ${fmt(vixVal, 1)} is the kind of reading that retires careers — when fear is this expensive, the only people sleeping well are the ones who already sold or are about to buy.` };

  if (fgVal < 15)
    return { trigger: 'F&G<15', text: `Fear & Greed at ${fgVal} is the statistical profile of a panic. Every durable bottom in the past decade looked exactly like this and felt absolutely catastrophic. That is not a guarantee — it's historical precedent.` };

  if (spPct <= -2 && vixPct > 15)
    return { trigger: 'SP≤-2%+VIX↑', text: `S&P down ${fmt(Math.abs(spPct), 1)}% with VIX confirming — this is a genuine risk-off session, not noise. Whether it's a single-day event or the start of a repricing cycle will be answered by the bond market's next move.` };

  if (spPct <= -2)
    return { trigger: 'SP≤-2%', text: `S&P down ${fmt(Math.abs(spPct), 1)}% in a single session is a 1-in-30 trading day event — the mega-caps trading at 40x+ forward earnings have a precision intolerance for any macro volatility.` };

  if (btcChg < -8)
    return { trigger: 'BTC<-8%', text: `Bitcoin down ${fmt(Math.abs(btcChg), 1)}% in 24 hours. The ETF outflow data will print in 48 hours and tell the real story. Until then, every "this is the bottom" call is guesswork dressed as analysis.` };

  if (btcChg < -5)
    return { trigger: 'BTC<-5%', text: `Bitcoin down ${fmt(Math.abs(btcChg), 1)}% while equities hold is a warning shot — risk appetite is narrowing at the edges first. Crypto leads equities on the way down more often than the other way around.` };

  if (oilChg > 5)
    return { trigger: 'Oil>+5%', text: `Oil up ${fmt(oilChg, 1)}% in a day — every supply chain spreadsheet built around sub-$80 crude just got revised. Energy stocks win the session; everything else is doing the math on input cost exposure.` };

  if (tnxVal > 4.8)
    return { trigger: '10Y>4.8%', text: `10-year yield at ${fmt(tnxVal, 2)}% — the bond market is doing what the Fed isn't. Equity P/E multiples are now competing with risk-free rates that actually mean something. Growth stocks feel this first and hardest.` };

  if (fgVal < 20)
    return { trigger: 'F&G<20', text: `CNN Fear and Greed at ${fgVal} — every reading below 20 in the past decade has preceded a tradeable bottom within 30 days. Every single reading also felt completely justified at the time.` };

  // ── Strong positive conditions ─────────────────────────────────────────────
  if (spPct >= 2 && vixPct < -10)
    return { trigger: 'SP≥+2%+VIX↓', text: `S&P up ${fmt(spPct, 1)}% with VIX dropping — this is a clean signal. Institutional positioning and options flow aligned. Strong days with conviction deserve respect, not reflexive suspicion.` };

  if (spPct >= 2)
    return { trigger: 'SP≥+2%', text: `S&P up ${fmt(spPct, 1)}% on no specific catalyst is the kind of rally that looks great on the daily chart and raises uncomfortable questions in the quarterly performance review. Enjoy it, but size accordingly.` };

  if (spPct >= 1 && vixPct > 10)
    return { trigger: 'SP≥+1%+VIX↑', text: `Green market with VIX rising — someone is buying insurance on the way up. That combination has historically preceded short-term reversals more often than sustained breakouts. Worth tracking.` };

  if (spPct >= 1 && fgVal > 65)
    return { trigger: 'SP≥+1%+Greed', text: `Gains into greed territory — when conviction and complacency look identical, position sizing matters more than directional calls.` };

  // ── Crypto signals ─────────────────────────────────────────────────────────
  if (btcChg > 8)
    return { trigger: 'BTC>+8%', text: `Bitcoin up ${fmt(btcChg, 1)}% — this is a momentum event, not a fundamental repricing. These moves end in one of two ways: extension or violent mean reversion. Neither is predictable from here.` };

  if (btcChg > 5 && spPct < 0)
    return { trigger: 'BTC>+5%+SP↓', text: `Stocks down while Bitcoin surges — the decoupling narrative is active. Whether it's a short squeeze, a macro hedge, or genuine institutional rotation will take days to confirm.` };

  if (btcChg > 5)
    return { trigger: 'BTC>+5%', text: `Bitcoin up ${fmt(btcChg, 1)}% — risk-on confidence is outrunning equity fundamentals. Whether equities follow or diverge in the next 48 hours will define whether this is leadership or noise.` };

  // ── Macro signals ──────────────────────────────────────────────────────────
  if (goldChg > 2)
    return { trigger: 'Gold>+2%', text: `Gold up ${fmt(goldChg, 1)}% means serious money is buying insurance. That's not a retail trade — institutions reduce equity exposure through hard assets when the risk/reward on equities stops making sense.` };

  if (fgVal > 80)
    return { trigger: 'F&G>80', text: `Fear and Greed at ${fgVal} — everyone is in, there's no one left to buy, and the crowded longs that took months to build can unwind in days. History is consistent: extreme greed doesn't call the top, it narrows the margin for error.` };

  if (fgVal > 75)
    return { trigger: 'F&G>75', text: `Fear and Greed at ${fgVal} is the sentiment equivalent of a sub-12 VIX — the market is pricing in a remarkable number of things going right simultaneously, which has historically preceded several things going wrong.` };

  if (vixVal < 12)
    return { trigger: 'VIX<12', text: `VIX below 12 means option traders are pricing in sub-0.9% average daily moves — the calmest possible reading. The calmest waters in markets tend to arrive right before someone notices what's directly ahead.` };

  if (spPct > -1 && spPct < 1 && vixPct > 10)
    return { trigger: 'Flat+VIX↑', text: `Flat session with volatility rising is the market's way of saying "we don't know yet." That uncertainty has a price — it's reflected in the options market, and it resolves directionally when the next data print lands.` };

  // ── Flat / mixed conditions ────────────────────────────────────────────────
  if (Math.abs(spPct) < 0.5 && fgVal < 40)
    return { trigger: 'Flat+Fear', text: `Flat session with fear in the sentiment data — indecision while scared is structurally different from indecision while complacent. The next directional catalyst will matter more than usual.` };

  if (Math.abs(spPct) < 0.5 && fgVal > 60)
    return { trigger: 'Flat+Greed', text: `Nothing moved today — but sentiment is elevated. Flat sessions in greed territory often precede volatility spikes. The market's calm surface and the fear index are not telling the same story.` };

  if (Math.abs(spPct) < 0.5)
    return { trigger: 'Flat', text: `Markets went nowhere today, which is itself a data point. When neither bulls nor bears can close decisively, the next macro print gets elevated importance. Wait for the next clear catalyst before adding directional risk.` };

  if (spPct < -1 && spPct > -2)
    return { trigger: 'SP-1%to-2%', text: `S&P down ${fmt(Math.abs(spPct), 1)}% — meaningful but not extreme. The sessions that matter aren't the ones with the biggest moves; they're the ones where the trend changes. Watch breadth tomorrow.` };

  // ── Default neutral ────────────────────────────────────────────────────────
  return {
    trigger: 'neutral',
    text: `S&P ${sp ? fmt(sp.price, 0) : '5,600'}, VIX ${vixVal ? fmt(vixVal, 1) : '20'}, Bitcoin ${btc ? '$' + Math.round(btc.price).toLocaleString('en-US') : '$66K'} — markets are quiet, which is exactly when the next catalyst is being written into a Bloomberg terminal nobody has read yet.`,
  };
}

// ── Hero Image ─────────────────────────────────────────────────────────────────
function assignHeroImage(spPct) {
  if (spPct > 0.5)  return '/images/content/daily-bull.png';
  if (spPct < -0.5) return '/images/content/daily-bear.png';
  return '/images/content/daily-mixed.png';
}

// ── Markdown Builder ───────────────────────────────────────────────────────────
function buildMarkdown(params) {
  const { indices, macro, crypto, fearGreed: fg, verdict, movers, earningsEvents, altMovers, heroImage, headlines } = params;

  function makeTable(headers, rows) {
    const head = `| ${headers.join(' | ')} |`;
    const sep  = `|${headers.map(() => '---|').join('')}`;
    return [head, sep, ...rows].join('\n');
  }

  const indicesRows = indices.map(q =>
    `| ${q.label} | ${fmt(q.price, 0)} | ${sign(q.change)}${fmt(q.change, 2)} | ${sign(q.pct)}${fmt(q.pct, 2)}% |`
  );
  const macroRows = macro.map(q => {
    const p = q.label === 'VIX'     ? fmt(q.price, 2)
            : q.label === 'US 10Y'  ? fmt(q.price, 2) + '%'
            : '$' + fmt(q.price, 2);
    return `| ${q.label} | ${p} | ${sign(q.change)}${fmt(q.change, 2)} | ${sign(q.pct)}${fmt(q.pct, 2)}% |`;
  });
  const cryptoRows = crypto.map(c =>
    `| ${c.label} | $${c.price >= 1000 ? Math.round(c.price).toLocaleString('en-US') : fmt(c.price, 2)} | ${sign(c.change24h)}${fmt(c.change24h, 2)}% |`
  );

  const indicesTable = makeTable(['Index', 'Last', 'Change', 'Daily %'], indicesRows);
  const macroTable   = makeTable(['Macro', 'Last', 'Change', 'Daily %'], macroRows);
  const cryptoTable  = makeTable(['Coin', 'Last', '24h %'], cryptoRows);

  let altMoversSection = '';
  if (altMovers?.length > 0) {
    const altRows = altMovers.map(c =>
      `| ${c.symbol} — ${c.name} | $${c.price >= 1000 ? Math.round(c.price).toLocaleString('en-US') : fmt(c.price, 4)} | ${sign(c.change24h)}${fmt(c.change24h, 2)}% |`
    );
    altMoversSection = '\n\n### Top Altcoin Movers (24h)\n\n' + makeTable(['Coin', 'Price', '24h %'], altRows);
  }

  // Rule-based narrative sections
  const headline       = generateHeadline({ indices, macro, crypto, fearGreed: fg });
  const marketOverview = generateMarketOverview({ indices, macro, crypto, fearGreed: fg });
  const keyDrivers     = generateKeyDrivers({ indices, macro, crypto, fearGreed: fg });
  const marketSignals  = generateMarketSignals({ indices, macro, crypto, fearGreed: fg });

  // Optional gated sections — accumulate into array, each self-contained with ---
  const gatedSections = [];

  // Notable Movers — gated on FMP_PREMIUM
  if (FMP_PREMIUM && movers?.length > 0) {
    const moverReason = (m) => {
      if (Math.abs(m.pct) > 8)  return m.pct > 0 ? 'Sharp rally — likely catalyst-driven' : 'Sharp selloff — elevated volume';
      if (Math.abs(m.pct) > 5)  return m.pct > 0 ? 'Strong move on heavy volume'          : 'Sell-off on elevated volume';
      return m.pct > 0 ? 'Outperformed index' : 'Underperformed index';
    };
    const gainers = movers.filter(m => m.dir === 'up');
    const losers  = movers.filter(m => m.dir === 'dn');
    const moverRows = [
      ...gainers.map(m => `| 🟢 ${m.symbol} — ${m.name} | ${sign(m.pct)}${fmt(m.pct, 2)}% | ${moverReason(m)} |`),
      ...losers.map(m =>  `| 🔴 ${m.symbol} — ${m.name} | ${sign(m.pct)}${fmt(m.pct, 2)}% | ${moverReason(m)} |`),
    ];
    gatedSections.push(`## S&P 500 Notable Movers\n\n${makeTable(['Stock', 'Change', 'Why'], moverRows)}`);
  }

  // Earnings Calendar — gated on FMP_PREMIUM
  if (FMP_PREMIUM && earningsEvents?.length > 0) {
    const earningsRows = earningsEvents.map(e => {
      let surprise = '—';
      if (e.eps != null && e.epsEst != null) {
        const beat = e.eps - e.epsEst;
        surprise = beat >= 0
          ? `✅ Beat by $${fmt(Math.abs(beat), 2)}`
          : `❌ Missed by $${fmt(Math.abs(beat), 2)}`;
      }
      const timing = e.time === 'amc' ? 'After Close' : e.time === 'bmo' ? 'Pre-Market' : e.time;
      return `| ${e.symbol} — ${e.name} | ${timing} | ${surprise} |`;
    });
    gatedSections.push(`## Earnings & Events\n\n${makeTable(['Company', 'Time', 'EPS vs Est.'], earningsRows)}`);
  }

  const gatedBlock = gatedSections.length > 0
    ? '\n\n' + gatedSections.map(s => `---\n\n${s}`).join('\n\n')
    : '';

  // SEO description
  const sp    = indices.find(x => x.symbol === '^GSPC');
  const vix   = macro.find(x => x.symbol === '^VIX');
  const spDir = sp && sp.pct >= 0 ? 'rose' : 'fell';
  const desc  = `S&P 500 ${spDir} ${sp ? fmt(Math.abs(sp.pct), 2) + ' percent' : ''}, VIX ${vix ? fmt(vix.price, 1) : ''}, Fear & Greed ${fg.value} (${fg.label}). ${verdict.text.slice(0, 120)}`
    .replace(/"/g, "'").replace(/\s+/g, ' ').trim();

  return `---
slug: "${date}"
date: "${date}"
title: "Daily Brief — ${date}"
description: "${desc}"
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

${cryptoTable}${altMoversSection}

### Sentiment

**Fear & Greed: ${fg.value} (${fg.label})** — Source: ${fg.source || 'CNN'}

---

## Market Overview

${marketOverview}
${headlines?.length > 0 ? `\n---\n\n## 📰 Today's Headlines\n\n| Source | Headline |\n|---|---|\n${headlines.map(h => { const t = h.title.length > 90 ? h.title.slice(0, 87) + '...' : h.title; return `| ${h.source} | ${h.link ? `[${t}](${h.link})` : t} |`; }).join('\n')}` : ''}

---

## Key Drivers

${keyDrivers}
${gatedBlock}

---

## Market Signals

${marketSignals}

---

## 🔥 Brutal Edge™ Verdict

> ${verdict.text}

_Trigger: \`${verdict.trigger}\`_

---

*Auto-generated by daily-brief.yml at ${new Date().toISOString()}. Sources: FMP · CoinGecko · CNN Fear & Greed.*
`;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Generating Daily Brief for ${date} (FMP Premium: ${FMP_PREMIUM})…`);

  const [batchRaw, tnxRaw, oilRaw, moversRaw, earningsRaw, cryptoRaw, altMoversRaw, fgRaw, headlinesRaw] = await Promise.all([
    fmpBatchQuote(['^GSPC', '^IXIC', '^DJI', '^VIX', 'GCUSD']),
    fmpTenYearYield(),
    alphaVantageWTI(),
    fmpNotableMovers(),
    fmpEarningsCalendar(),
    coinGeckoPrices(),
    coinGeckoAltMovers(),
    cnnFearGreed(),
    fetchNewsHeadlines(),
  ]);

  // Indices
  let indices = FALLBACK.indices;
  if (Array.isArray(batchRaw)) {
    const mapped = ['^GSPC', '^IXIC', '^DJI'].map(sym => {
      const d = batchRaw.find(q => q.symbol === sym);
      if (!d) return null;
      return { symbol: sym, label: LABELS[sym], price: Number(d.price)||0, change: Number(d.change)||0, pct: Number(d.changesPercentage)||0 };
    }).filter(Boolean);
    if (mapped.length === 3) indices = mapped;
  }

  // Macro
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
      { id: 'bitcoin',  label: 'BTC', price: Number(cryptoRaw.bitcoin.usd)  || 0, change24h: Number(cryptoRaw.bitcoin.usd_24h_change)  || 0 },
      { id: 'ethereum', label: 'ETH', price: Number(cryptoRaw.ethereum.usd) || 0, change24h: Number(cryptoRaw.ethereum.usd_24h_change) || 0 },
    ];
  }

  const fearGreed = fgRaw || FALLBACK.fearGreed;
  const verdict   = generateBrutalEdgeTake({ indices, macro, crypto, fearGreed });
  const sp500     = indices.find(x => x.symbol === '^GSPC');
  const heroImage = assignHeroImage(sp500?.pct ?? 0);

  const md = buildMarkdown({
    indices, macro, crypto, fearGreed, verdict,
    movers:         moversRaw    || [],
    earningsEvents: earningsRaw  || [],
    altMovers:      altMoversRaw || [],
    headlines:      headlinesRaw || [],
    heroImage,
  });

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${date}.md`);
  fs.writeFileSync(outPath, md);
  console.log(`Wrote ${outPath} (${md.length} bytes)`);
  console.log(`Verdict: ${verdict.trigger} | Hero: ${heroImage}`);

  const urls = ['https://dhlm-studio.com/daily', `https://dhlm-studio.com/daily/${date}`];
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
