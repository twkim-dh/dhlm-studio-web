import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/data/blog/korea-posts.ts', 'utf-8');

const catImages = {
  Beliefs: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75',
  Food: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75',
  'K-Culture': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75',
  Travel: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75',
  Language: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=75',
  Work: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=75',
  Tech: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=75',
  Comparison: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75',
  Lifestyle: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75',
};

// Specific images for some posts
const specificImages = {
  'korean-bbq-guide': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75',
  'soju-drinking-rules': 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=800&q=75',
  'street-food-top10': 'https://images.unsplash.com/photo-1632209710624-a25cc47e4e3a?w=800&q=75',
  'korean-fried-chicken': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=75',
  'seoul-neighborhoods': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75',
  'jeju-island-guide': 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=75',
  'dmz-visit-guide': 'https://images.unsplash.com/photo-1591116303850-aa959bf6dad3?w=800&q=75',
  'hangul-one-hour': 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=75',
  'kakao-everything': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=75',
  'han-river-culture': 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800&q=75',
};

// Add image field after readTime for posts that don't have it
const lines = c.split('\n');
const result = [];
let currentCategory = '';

for (const line of lines) {
  // Track category
  const catMatch = line.match(/category: '([^']+)'/);
  if (catMatch) currentCategory = catMatch[1];

  // Check if this line has readTime but no image on the next logical line
  const slugMatch = line.match(/slug: '([^']+)'/);

  if (line.includes("readTime: '") && !line.includes("image: '")) {
    // Find slug from nearby context
    let slug = '';
    for (let i = result.length - 1; i >= Math.max(0, result.length - 3); i--) {
      const sm = result[i].match(/slug: '([^']+)'/);
      if (sm) { slug = sm[1]; break; }
    }
    const img = specificImages[slug] || catImages[currentCategory] || catImages.Beliefs;
    result.push(line.replace(/readTime: '/, `image: '${img}', readTime: '`));
  } else {
    result.push(line);
  }
}

writeFileSync('src/data/blog/korea-posts.ts', result.join('\n'));
console.log('Done - added images');
