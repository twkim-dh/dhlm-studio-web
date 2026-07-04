/**
 * compress-images.mjs
 * Converts all large PNG/JPG files in /public/images/content to WebP at quality 80,
 * max 1200px wide. Creates .webp files alongside originals.
 * Run: node scripts/compress-images.mjs
 */
import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const INPUT_DIR = new URL('../public/images/content', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const QUALITY = 80;
const MAX_WIDTH = 1200;
const SKIP_BELOW_KB = 150; // skip files already small

let converted = 0;
let skipped = 0;
let errors = 0;

async function processFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const base = basename(filePath, ext);
  const dir = filePath.replace(`${base}${ext}`, '');
  const webpPath = join(dir, `${base}.webp`);

  // Skip if already converted
  if (existsSync(webpPath)) {
    const existingSize = statSync(webpPath).size;
    if (existingSize > 0) { skipped++; return; }
  }

  const originalSize = statSync(filePath).size;
  if (originalSize < SKIP_BELOW_KB * 1024) { skipped++; return; }

  try {
    const info = await sharp(filePath)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(webpPath);

    const savedKB = Math.round((originalSize - info.size) / 1024);
    const ratio = Math.round((1 - info.size / originalSize) * 100);
    console.log(`✓ ${base}${ext} → ${base}.webp  (${Math.round(originalSize/1024)}KB → ${Math.round(info.size/1024)}KB, -${ratio}%)`);
    converted++;
  } catch (err) {
    console.error(`✗ ${filePath}: ${err.message}`);
    errors++;
  }
}

async function main() {
  console.log(`Scanning: ${INPUT_DIR}\n`);

  const files = readdirSync(INPUT_DIR).map(f => join(INPUT_DIR, f));

  for (const file of files) {
    try {
      const stat = statSync(file);
      if (stat.isFile()) await processFile(file);
    } catch { /* skip */ }
  }

  console.log(`\nDone: ${converted} converted, ${skipped} skipped, ${errors} errors`);
}

main().catch(console.error);
