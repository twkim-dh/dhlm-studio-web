#!/usr/bin/env node
/**
 * fetch-unsplash-images.js
 *
 * Fetches hero images from Unsplash API for all content that lacks heroImage.
 * Generates / updates src/data/unsplash-manifest.json with CDN URLs + attribution.
 *
 * ▸ Get a free key at https://unsplash.com/developers (50 req/hour, commercial use OK)
 * ▸ Add to .env.local:  UNSPLASH_ACCESS_KEY=your_key
 * ▸ Run:                node scripts/fetch-unsplash-images.js
 *
 * Re-run safely: existing manifest entries are preserved (only fetches missing slugs).
 * Rate: 1.5s delay between requests → ~60 slugs ≈ 2 min total.
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ─── Load API key from env or .env.local ──────────────────────────────────────
function loadApiKey() {
  if (process.env.UNSPLASH_ACCESS_KEY) return process.env.UNSPLASH_ACCESS_KEY;
  try {
    const raw = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^UNSPLASH_ACCESS_KEY\s*=\s*(.+)$/);
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch { /* .env.local not found */ }
  return null;
}

const ACCESS_KEY = loadApiKey();

if (!ACCESS_KEY) {
  console.error('\n✖ Missing UNSPLASH_ACCESS_KEY');
  console.error('  1. Get a free key at https://unsplash.com/developers');
  console.error('  2. Add to .env.local: UNSPLASH_ACCESS_KEY=your_key');
  console.error('  3. Run: node scripts/fetch-unsplash-images.js\n');
  process.exit(1);
}

// ─── Keyword mapping ──────────────────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  'Markets':        'stock market trading wall street finance',
  'Crypto':         'cryptocurrency bitcoin blockchain digital',
  'Rankings':       'global data rankings numbers chart',
  'Creators':       'content creator youtube social media studio',
  'Cost of Living': 'city downtown urban skyline apartments',
  'Data':           'data visualization analytics dashboard',
  'Sentiment':      'market sentiment trading screen',
  'Default':        'finance market business data analytics',
};

// Slug-specific overrides (priority over category keywords)
const SLUG_KEYWORDS = {
  // ── Stocks / Companies
  'nvidia-worlds-most-valuable-company-2026':             'nvidia gpu semiconductor chip technology',
  'nvidia-3-trillion':                                    'nvidia technology chip semiconductor',
  'top-5-ai-stocks-to-watch-2026':                        'artificial intelligence robot technology future',
  'nvidia-vs-apple-vs-microsoft-ai-stock-showdown-2026':  'tech stocks trading compare',
  'quantum-computing-stocks':                             'quantum computing processor technology',
  'ai-stocks-bubble-or-boom':                             'artificial intelligence technology server',
  'ai-stocks-to-watch':                                   'technology stocks trading screen',
  'top-stock-gainers-today-how-to-spot-winners-2026':     'stock market bull trading chart',
  'most-shorted-stocks-2026-short-squeeze-candidates':    'stock market bearish trading',
  'dividend-aristocrats-2026-consecutive-increases':      'dividend passive income investment',
  'sp500-sector-performance-2026-which-sectors-leading':  'stock market index performance',
  'pre-market-movers-why-stocks-gap-up-down-before-open': 'pre-market trading early morning',
  'top-stock-movers-explained':                           'stock market movers screen',

  // ── Kim Siljang crypto posts (April 2026)
  'bitcoin-deep-dive-april-2026':     'bitcoin cryptocurrency coin gold digital',
  'ethereum-deep-dive-april-2026':    'ethereum blockchain network smart contract',
  'best-crypto-during-crash':         'stock market crash red decline bear',
  'crypto-fear-greed-explained':      'fear greed emotion trading sentiment',
  'ai-crypto-tokens-2026':            'artificial intelligence gpu server chip',
  'crypto-101-what-is-blockchain':    'blockchain network nodes technology distributed',
  'crypto-101-bitcoin-vs-ethereum':   'bitcoin ethereum comparison cryptocurrency',

  // ── Crypto
  'bitcoin-price-prediction-2026-expert-analysis':        'bitcoin gold digital currency bull',
  'top-10-cryptocurrencies-market-cap-2026-guide':         'cryptocurrency trading portfolio',
  'ethereum-vs-solana-2026-which-blockchain-wins':         'ethereum blockchain network nodes',
  'bitcoin-vs-ethereum-differences-explained':             'bitcoin ethereum cryptocurrency compare',
  'top-crypto-gainers-this-month-april-2026':              'cryptocurrency gains bull market green',
  'crypto-market-recovery-2026':                           'cryptocurrency recovery uptrend',

  // ── Macro / Economy
  'how-tariffs-affect-stock-prices-data-driven-analysis': 'global trade containers shipping port tariff',
  'tariff-impact-markets-2026':                           'global trade shipping freight',
  'top-10-countries-gdp-world-economy-2026':              'world globe economy finance',
  'global-gdp-rankings-shift-2026':                       'global economy emerging markets',
  'gdp-rankings-2026':                                    'economy finance city skyline',
  'gdp-per-capita-rankings-2026-richest-countries':       'wealth prosperity city skyscraper',
  'fastest-growing-economies-2026-emerging-markets':      'emerging market city growth construction',

  // ── Finance guides
  'what-is-pe-ratio-beginners-guide':                     'financial education stock analysis learning',
  'how-to-read-stock-market-data-guide':                  'stock market data screen reading',
  'how-tariffs-affect-stock-prices-data-driven-analysis': 'tariffs trade policy economy',

  // ── Rankings
  'us-dominates-global-wealth-billionaires-2026':         'wealth skyscraper luxury city',
  'worlds-richest-people-2026-billionaire-rankings':      'wealth luxury billionaire mansion',
  'billionaire-rankings-2026':                            'wealth luxury city buildings',
  'largest-companies-by-market-cap-2026-trillion-dollar-club': 'corporate skyscraper business tower',
  'most-valuable-brands-2026-global-brand-power':         'brand identity luxury design logo',
  'highest-paid-nba-players-2025-26':                     'basketball court nba game',
  'highest-paid-athletes-2026-sports-salary-rankings':    'sports athlete stadium trophy',

  // ── Creators
  'most-subscribed-youtube-channels-2026-rankings':       'youtube content creator studio camera',
  'tiktok-vs-youtube-vs-instagram-creator-earnings-2026': 'social media influencer smartphone filming',
  'how-mrbeast-makes-money-business-behind-382m-subscribers': 'youtube studio filming production',
  'youtube-vs-tiktok-creator-economy':                    'content creator video production camera',
  'fastest-growing-creators-march':                       'social media growth analytics dashboard',
  'mrbeast-growth-analysis':                              'youtube video production studio',

  // ── Lottery
  'powerball-vs-mega-millions-better-odds':               'lottery ticket jackpot numbers',

  // ── Cost of Living
  'nyc-vs-la-cost-of-living':                             'new york city skyline manhattan',
  'cheapest-cities-digital-nomads':                       'nomad laptop travel cafe city',

  // ── Reports
  'deep-dive-nvda-april-2026':    'nvidia gpu semiconductor technology',
  'deep-dive-aapl-april-2026':    'apple iphone design technology product',
  'deep-dive-amd-april-2026':     'amd semiconductor chip processor',
  'deep-dive-amzn-april-2026':    'amazon warehouse ecommerce delivery',
  'deep-dive-btc-april-2026':     'bitcoin cryptocurrency digital gold coin',
  'deep-dive-googl-april-2026':   'internet technology data server cloud',
  'deep-dive-meta-april-2026':    'meta social media virtual reality',
  'deep-dive-msft-april-2026':    'microsoft cloud technology office software',
  'deep-dive-pltr-april-2026':    'data analytics surveillance intelligence',
  'deep-dive-tsla-april-2026':    'tesla supercharger station electric',
  'btc-crossroads-april-2026':    'bitcoin price chart crossroads analysis',
  'ethereum-special-report-april-2026': 'ethereum blockchain digital currency network glow',
  'hot-sector-energy-april-2026': 'oil refinery energy industrial power',

  // ── Research
  'fear-greed-index-stock-prediction': 'fear greed market sentiment dial',
  'intraday-ml-stock-prediction':      'machine learning algorithm stock chart prediction',
};

// ─── Collect all slugs that need images ───────────────────────────────────────
function collectSlugs() {
  const items = [];

  // 1. blog-posts.ts — regex-parse to find slug / category / heroImage / noindex
  const blogTs = fs.readFileSync(path.join(ROOT, 'src/data/blog-posts.ts'), 'utf8');
  // Each entry starts with "slug:" — grab the surrounding block
  const blocks = [...blogTs.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  for (const m of blocks) {
    const start = m.index;
    // grab ~300 chars around the slug to find category/heroImage/noindex
    const snippet = blogTs.slice(Math.max(0, start - 50), start + 350);
    const slug = m[1];
    const catM = snippet.match(/category:\s*['"]([^'"]+)['"]/);
    const category = catM ? catM[1] : 'Markets';
    const hasHeroImage = /heroImage:/.test(snippet);
    const noindex = /noindex:\s*true/.test(snippet);
    if (!noindex) items.push({ slug, category, hasHeroImage, type: 'blog' });
  }

  // 2. .md files in src/content/{research,reports}
  for (const dir of ['research', 'reports']) {
    const dirPath = path.join(ROOT, 'src/content', dir);
    if (!fs.existsSync(dirPath)) continue;
    for (const file of fs.readdirSync(dirPath).filter(f => f.endsWith('.md'))) {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
      const fmM = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmM) continue;
      const fm = fmM[1];
      const slugM = fm.match(/slug:\s*["']?([^"'\n]+)["']?/);
      const catM  = fm.match(/category:\s*["']?([^"'\n]+)["']?/);
      if (!slugM) continue;
      const slug = slugM[1].trim();
      const category = catM ? catM[1].trim() : 'Markets';
      const hasHeroImage = /heroImage:/.test(fm);
      items.push({ slug, category, hasHeroImage, type: dir });
    }
  }

  // Deduplicate by slug (keep last)
  const seen = new Map();
  for (const item of items) seen.set(item.slug, item);
  return [...seen.values()];
}

// ─── Unsplash API helpers ─────────────────────────────────────────────────────
async function searchPhoto(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}`, 'Accept-Version': 'v1' },
  });
  if (res.status === 401) throw new Error('Invalid Unsplash API key — check UNSPLASH_ACCESS_KEY');
  if (res.status === 403) throw new Error('Unsplash rate limit reached (50 req/hour). Save and retry later.');
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.results?.length) return null;
  return json.results[0];
}

async function triggerDownload(photo) {
  // Required by Unsplash API guidelines
  try {
    await fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${ACCESS_KEY}`, 'Accept-Version': 'v1' },
    });
  } catch { /* non-fatal */ }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const manifestPath = path.join(ROOT, 'src/data/unsplash-manifest.json');

  // Load existing manifest (preserves previous work on re-runs)
  let manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`\nLoaded existing manifest: ${Object.keys(manifest).length} entries`);
  } catch { console.log('\nStarting fresh manifest'); }

  const items = collectSlugs();
  // For blog: skip if heroImage already set in blog-posts.ts (static image, not a placeholder)
  // For reports/research: always fetch — frontmatter heroImage is a static fallback, not topic-specific
  const todo  = items.filter(i => !manifest[i.slug] && (i.type === 'blog' ? !i.hasHeroImage : true));

  console.log(`Total content: ${items.length} | Already have image: ${items.length - todo.length} | Need to fetch: ${todo.length}\n`);

  if (todo.length === 0) {
    console.log('✓ All content already has images. Nothing to do.\n');
    return;
  }

  let fetched = 0, skipped = 0;

  for (let idx = 0; idx < todo.length; idx++) {
    const item = todo[idx];
    const keywords = SLUG_KEYWORDS[item.slug] || CATEGORY_KEYWORDS[item.category] || CATEGORY_KEYWORDS['Default'];
    const progress = `[${idx + 1}/${todo.length}]`;

    process.stdout.write(`${progress} [${item.type}] ${item.slug}\n       → "${keywords}" ... `);

    try {
      const photo = await searchPhoto(keywords);
      if (!photo) {
        console.log('no results — skipping');
        skipped++;
        // Save progress so far in case of interrupt
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        continue;
      }

      await triggerDownload(photo);

      // Use Unsplash raw URL with custom dimensions for consistent aspect ratio
      const src = `${photo.urls.raw}&w=720&h=380&fit=crop&q=80&fm=jpg&auto=format`;

      manifest[item.slug] = {
        src,
        alt: photo.alt_description || photo.description || `${keywords} photo`,
        credit: {
          author:      photo.user.name,
          authorUrl:   `${photo.user.links.html}?utm_source=dhlm_studio&utm_medium=referral`,
          unsplashUrl: `https://unsplash.com/photos/${photo.id}?utm_source=dhlm_studio&utm_medium=referral`,
        },
      };

      console.log(`✓  by ${photo.user.name}`);
      fetched++;

      // Save progress after every fetch (crash-safe)
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

      // 1.5s delay → ~25 req/min, well under 50/hour free limit
      if (idx < todo.length - 1) await new Promise(r => setTimeout(r, 1500));

    } catch (e) {
      console.log(`\n  ✖ ERROR: ${e.message}`);
      if (e.message.includes('rate limit')) {
        console.error('\nRate limit hit — progress saved. Run the script again after 1 hour.\n');
        break;
      }
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Done. Fetched: ${fetched} | Skipped: ${skipped} | Manifest total: ${Object.keys(manifest).length}`);
  console.log(`  Saved to src/data/unsplash-manifest.json\n`);
  console.log('Next: deploy or run `next build` — images load from Unsplash CDN automatically.\n');
}

main().catch(e => { console.error(e.message); process.exit(1); });
