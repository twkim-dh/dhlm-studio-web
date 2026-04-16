/**
 * build-search-index.js
 * Generates /public/search-index.json from all site content:
 *   - src/content/reports/*.md   → category: "Reports"
 *   - src/content/research/*.md  → category: "Learn", subCategory: "Paper vs Profit"
 *   - src/data/blog-posts.ts     → category: "Blog" or "Learn" (Crypto 101 / Investing 101)
 */

const fs   = require('fs');
const path = require('path');

const ROOT   = path.join(__dirname, '..');
const OUT    = path.join(ROOT, 'public', 'search-index.json');
const EXCERPT_LEN = 200;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse YAML-ish frontmatter from a markdown file (no deps). */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { fm: {}, body: raw };
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Skip complex values (arrays / objects start with [ or {)
    if (val.startsWith('[') || val.startsWith('{')) continue;
    fm[key] = val;
  }
  const body = raw.slice(match[0].length).trim();
  return { fm, body };
}

/** First N chars of body text, stripping markdown syntax. */
function excerpt(str, n = EXCERPT_LEN) {
  if (!str) return '';
  return str.replace(/#{1,6}\s*/g, '').replace(/[*_`[\]]/g, '').trim().slice(0, n);
}

const items = [];

// ─── Reports (/reports/*) ─────────────────────────────────────────────────────

const reportsDir = path.join(ROOT, 'src', 'content', 'reports');
for (const file of fs.readdirSync(reportsDir).filter(f => f.endsWith('.md'))) {
  const raw = fs.readFileSync(path.join(reportsDir, file), 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const slug = fm.slug || file.replace(/\.md$/, '');
  items.push({
    title:       fm.title       || slug,
    slug,
    category:    'Reports',
    subCategory: fm.category    || fm.type || 'Report',
    tags:        fm.tickers     ? [fm.tickers, fm.ticker].flat().filter(Boolean) : (fm.ticker ? [fm.ticker] : []),
    excerpt:     fm.description ? fm.description.slice(0, EXCERPT_LEN) : excerpt(body),
    publishDate: fm.date        || '',
    url:         `/reports/${slug}`,
  });
}

// ─── Paper vs Profit (/learn/paper-vs-profit/*) ───────────────────────────────

const researchDir = path.join(ROOT, 'src', 'content', 'research');
for (const file of fs.readdirSync(researchDir).filter(f => f.endsWith('.md'))) {
  const raw = fs.readFileSync(path.join(researchDir, file), 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const slug = fm.slug || file.replace(/\.md$/, '');
  items.push({
    title:       fm.title       || slug,
    slug,
    category:    'Learn',
    subCategory: 'Paper vs Profit',
    tags:        [],
    excerpt:     fm.description ? fm.description.slice(0, EXCERPT_LEN) : excerpt(body),
    publishDate: fm.date        || '',
    url:         `/learn/paper-vs-profit/${slug}`,
  });
}

// ─── Blog posts + Learn (from blog-posts.ts) ──────────────────────────────────

const blogSrc = fs.readFileSync(path.join(ROOT, 'src', 'data', 'blog-posts.ts'), 'utf8');

// Split on object boundaries: each entry starts with `  {` on its own line.
// We'll extract fields via regex per entry.
const entryPattern = /\{\s*\n\s+slug:\s*'([^']+)'([\s\S]*?)\n\s{2}\}/g;
let m;
while ((m = entryPattern.exec(blogSrc)) !== null) {
  const slug     = m[1];
  const block    = m[0];

  const getField = (key) => {
    const r = new RegExp(`${key}:\\s*'([^']*)'`);
    const hit = block.match(r);
    return hit ? hit[1] : '';
  };

  const title       = getField('title');
  const category    = getField('category');
  const description = getField('description');
  const date        = getField('date');

  // Determine URL and search category
  let url, searchCategory, subCategory;
  if (category === 'Crypto 101') {
    url = `/learn/crypto-101/${slug}`;
    searchCategory = 'Learn';
    subCategory = 'Crypto 101';
  } else if (category === 'Investing 101') {
    url = `/learn/investing-101/${slug}`;
    searchCategory = 'Learn';
    subCategory = 'Investing 101';
  } else {
    url = `/blog/${slug}`;
    searchCategory = 'Blog';
    subCategory = category;
  }

  // Skip if noindex
  if (/noindex:\s*true/.test(block)) continue;

  items.push({
    title,
    slug,
    category:    searchCategory,
    subCategory,
    tags:        [],
    excerpt:     description.slice(0, EXCERPT_LEN),
    publishDate: date,
    url,
  });
}

// ─── Sort by date desc ────────────────────────────────────────────────────────

items.sort((a, b) => b.publishDate.localeCompare(a.publishDate));

fs.writeFileSync(OUT, JSON.stringify(items, null, 2), 'utf8');
console.log(`✅ search-index.json — ${items.length} items → ${OUT}`);
