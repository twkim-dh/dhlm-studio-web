// Audit blog post word counts. Run: node scripts/audit-blogs.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/../src/data/blog-posts.ts', 'utf8');

// Walk forward, picking out each slug + the body strings up to the next slug.
const posts = [];
const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)];
for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i][1];
  const start = slugs[i].index;
  const end = i + 1 < slugs.length ? slugs[i + 1].index : src.length;
  const block = src.slice(start, end);
  {
    const _ = block; // keep diff small
  }
  const after = block;
  // Extract all body: '...' or body: "..." (handle escaped quotes)
  const bodyRegex = /body:\s*(['"])((?:\\.|(?!\1).)*)\1/g;
  let m;
  let text = '';
  while ((m = bodyRegex.exec(after))) {
    text += ' ' + m[2];
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  posts.push({ slug, words });
}

console.log('TOTAL POSTS:', posts.length);
const buckets = { lt500: [], lt800: [], lt1500: [], ge1500: [] };
for (const p of posts) {
  if (p.words < 500) buckets.lt500.push(p);
  else if (p.words < 800) buckets.lt800.push(p);
  else if (p.words < 1500) buckets.lt1500.push(p);
  else buckets.ge1500.push(p);
}
console.log('< 500 (noindex 후보):', buckets.lt500.length);
console.log('500-799 (보강 대상):', buckets.lt800.length);
console.log('800-1499 (적정):    ', buckets.lt1500.length);
console.log('>= 1500 (장문):     ', buckets.ge1500.length);

const print = (label, arr) => {
  console.log('\n=== ' + label + ' ===');
  for (const p of arr) console.log(String(p.words).padStart(4), ' ', p.slug);
};
print('UNDER 500', buckets.lt500);
print('500-799',  buckets.lt800);
print('800-1499', buckets.lt1500);
print('>= 1500',  buckets.ge1500);
