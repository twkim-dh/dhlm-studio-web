import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/data/blog/korea-posts.ts', 'utf-8');

// Map: slug → section index → image
const sectionImages = {
  'red-ink-death': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&q=75', alt: 'Red ink calligraphy' },
  ],
  'fan-death': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=700&q=75', alt: 'Electric fan in Korean room' },
  ],
  'number-four': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=700&q=75', alt: 'Korean elevator buttons' },
  ],
  'korean-bbq-guide': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=700&q=75', alt: 'Korean BBQ grilling meat' },
    { idx: 1, img: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=700&q=75', alt: 'Korean BBQ lettuce wrap' },
    { idx: 2, img: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=700&q=75', alt: 'Soju pouring at dinner' },
  ],
  'soju-drinking-rules': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=700&q=75', alt: 'Soju bottles and glasses' },
  ],
  'street-food-top10': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1632209710624-a25cc47e4e3a?w=700&q=75', alt: 'Korean street food tteokbokki' },
    { idx: 1, img: 'https://images.unsplash.com/photo-1583224994076-1a72e3a0ed83?w=700&q=75', alt: 'Korean food market stalls' },
  ],
  'korean-fried-chicken': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=700&q=75', alt: 'Korean fried chicken' },
    { idx: 1, img: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=700&q=75', alt: 'Chicken and beer delivery' },
  ],
  'kpop-trainee-life': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=700&q=75', alt: 'Korean entertainment district' },
  ],
  'seoul-neighborhoods': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=700&q=75', alt: 'Seoul cityscape at night' },
  ],
  'jeju-island-guide': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=700&q=75', alt: 'Jeju Island coastline' },
    { idx: 1, img: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=700&q=75', alt: 'Jeju tangerines and food' },
  ],
  'korean-temple-stay': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=700&q=75', alt: 'Korean Buddhist temple' },
    { idx: 1, img: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=700&q=75', alt: 'Temple food spread' },
  ],
  'hangul-one-hour': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=700&q=75', alt: 'Hangul Korean alphabet' },
  ],
  'hallyu-wave': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=700&q=75', alt: 'Seoul K-Pop district' },
  ],
  'korean-cafe-culture': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=700&q=75', alt: 'Korean cafe interior' },
    { idx: 1, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=75', alt: 'Korean coffee and dessert' },
  ],
  'korean-delivery-culture': [
    { idx: 1, img: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=700&q=75', alt: 'Han River picnic with delivery food' },
  ],
  'dmz-visit-guide': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1591116303850-aa959bf6dad3?w=700&q=75', alt: 'DMZ border area' },
  ],
  'korean-jjimjilbang': [
    { idx: 1, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=700&q=75', alt: 'Korean spa relaxation' },
  ],
  'korea-vs-japan': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=700&q=75', alt: 'Seoul vs Tokyo comparison' },
  ],
  'korean-beauty-skincare': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a0d519?w=700&q=75', alt: 'Korean skincare products' },
  ],
  'han-river-culture': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=700&q=75', alt: 'Han River park in Seoul' },
  ],
  'kakao-everything': [
    { idx: 0, img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&q=75', alt: 'Korean smartphone apps' },
  ],
};

// For each post with section images, add image/imageAlt fields
for (const [slug, images] of Object.entries(sectionImages)) {
  for (const { idx, img, alt } of images) {
    // Find the section pattern: after slug match, find the nth "heading:" and add image before body
    const slugRegex = new RegExp(`slug: '${slug}'`);
    const slugIdx = c.search(slugRegex);
    if (slugIdx === -1) continue;

    // Find sections array for this post
    let searchFrom = slugIdx;
    let sectionCount = 0;
    let pos = searchFrom;

    while (sectionCount <= idx) {
      const headingIdx = c.indexOf("{ heading:", pos);
      if (headingIdx === -1 || headingIdx > slugIdx + 5000) break;
      if (sectionCount === idx) {
        // Find the "body:" in this section
        const bodyIdx = c.indexOf("body:", headingIdx);
        if (bodyIdx !== -1 && bodyIdx < headingIdx + 500) {
          // Check if image already exists
          const sectionEnd = c.indexOf("}", bodyIdx);
          const sectionContent = c.substring(headingIdx, sectionEnd);
          if (!sectionContent.includes("image:")) {
            // Insert image and imageAlt before "body:"
            const insertStr = `image: '${img}', imageAlt: '${alt}', `;
            c = c.substring(0, bodyIdx) + insertStr + c.substring(bodyIdx);
          }
        }
        break;
      }
      pos = c.indexOf("}", pos) + 1;
      sectionCount++;
    }
  }
}

writeFileSync('src/data/blog/korea-posts.ts', c);
console.log('Done - added section images');
