// Bulk transform of blog-posts.ts:
//   1. Delete 10 deep-dive-*-april-2026 entries (now lived only at /reports)
//   2. Add `noindex: true,` to 25 thin posts (< 500 words, excluding deep-dives)
// Run: node scripts/transform-blogs.js
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
let src = fs.readFileSync(FILE, 'utf8');

const DEEP_DIVE_SLUGS = [
  'deep-dive-msft-april-2026','deep-dive-amzn-april-2026','deep-dive-meta-april-2026',
  'deep-dive-googl-april-2026','deep-dive-pltr-april-2026','deep-dive-amd-april-2026',
  'deep-dive-btc-april-2026','deep-dive-nvda-april-2026','deep-dive-tsla-april-2026',
  'deep-dive-aapl-april-2026',
];

const NOINDEX_SLUGS = [
  'wall-street-weekly-2026-04-06','crypto-weekly-2026-04-06',
  'top-5-ai-stocks-to-watch-2026','tariff-impact-markets-2026','crypto-market-recovery-2026',
  'ai-stocks-bubble-or-boom','global-gdp-rankings-shift-2026','youtube-vs-tiktok-creator-economy',
  'top-stock-movers-explained','billionaire-rankings-2026','nyc-vs-la-cost-of-living',
  'fastest-growing-creators-march','quantum-computing-stocks','gdp-rankings-2026',
  'cheapest-cities-digital-nomads','mrbeast-growth-analysis','ai-stocks-to-watch',
  'data-visualization-trends','nvidia-3-trillion','richest-self-made-women',
  'tokyo-vs-seoul-cost','tiktok-vs-youtube-creators','sp500-vs-bitcoin',
  'world-population-8-billion','best-cities-tech-workers','youtube-subscriber-milestones',
  'crypto-regulation-2026','global-happiness-index',
];

// Walk through the array and split into post blocks.
// Each post starts at "  {\n" inside `blogPosts: BlogPost[] = [` and ends at "\n  },"
// Easiest: locate the opening `[` after `blogPosts:`, capture until trailing `];`,
// then split by `\n  },\n` while respecting that each block starts with `  {`.
const arrStart = src.indexOf('blogPosts: BlogPost[] = [');
if (arrStart < 0) throw new Error('blogPosts array not found');
const arrOpen = src.indexOf('[', arrStart) + 1;
const arrClose = src.indexOf('\n];', arrOpen);
if (arrClose < 0) throw new Error('blogPosts array close not found');

const head = src.slice(0, arrOpen);
const tail = src.slice(arrClose); // begins with "\n];"
const arrBody = src.slice(arrOpen, arrClose);

// Split into blocks. Use a regex to walk: each block is "\n  {...\n  },"
const blocks = [];
const re = /\n  \{[\s\S]*?\n  \},/g;
let m;
while ((m = re.exec(arrBody))) blocks.push(m[0]);
console.log('Parsed blocks:', blocks.length);

let removed = 0;
let marked = 0;

const transformed = blocks
  .filter(b => {
    const sm = b.match(/slug:\s*'([^']+)'/);
    const slug = sm && sm[1];
    if (slug && DEEP_DIVE_SLUGS.includes(slug)) { removed++; return false; }
    return true;
  })
  .map(b => {
    const sm = b.match(/slug:\s*'([^']+)'/);
    const slug = sm && sm[1];
    if (!slug || !NOINDEX_SLUGS.includes(slug)) return b;
    if (b.includes('noindex:')) return b; // already marked
    // Insert `noindex: true,` after the description: '...' line.
    const updated = b.replace(
      /(description:\s*'(?:[^'\\]|\\.)*',)/,
      (match) => { marked++; return match + '\n    noindex: true,'; }
    );
    return updated;
  });

const newBody = transformed.join('');
fs.writeFileSync(FILE, head + newBody + tail);

console.log('Removed deep-dive entries:', removed);
console.log('Marked noindex entries:   ', marked);
console.log('Final block count:        ', transformed.length);
