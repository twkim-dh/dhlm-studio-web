/**
 * validate-and-crop.mjs
 * Ensures all WebP images in public/images/content/ are 16:9 (1200×675).
 * Re-crops from PNG/JPG source (preferred) or existing WebP (fallback).
 * Safe to run repeatedly — skips already-correct 16:9 files.
 *
 * Usage: node scripts/validate-and-crop.mjs
 */
import sharp from 'sharp';
import { readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const DIR = join(ROOT, 'public/images/content');
const TARGET_W = 1200;
const TARGET_H = 675;
const QUALITY = 80;
const TARGET_RATIO = TARGET_W / TARGET_H; // 1.7778
const TOLERANCE = 0.05; // ±5%

// UI/icon images — NOT card thumbnails, skip 16:9 enforcement
const SKIP = new Set([
  'daily-bull.webp', 'daily-bear.webp', 'daily-mixed.webp',
  'market-close.webp', 'pre-market.webp',
  'spotlight-stock.webp', 'spotlight-crypto.webp',
  'weekly-recap.webp', 'weekend-read.webp',
  'brutal-edge-academy-banner.webp', 'learn-hero-banner.webp',
  'crypto-101.webp',
]);

const files = readdirSync(DIR).filter(f => f.endsWith('.webp'));
let processed = 0, already = 0, uiSkipped = 0, errors = 0;

console.log('Validating 16:9 compliance for', files.length, 'WebP files...\n');

for (const file of files) {
  if (SKIP.has(file)) { uiSkipped++; continue; }

  const webpPath = join(DIR, file);
  const base = file.slice(0, -5);
  const pngPath = join(DIR, base + '.png');
  const jpgPath = join(DIR, base + '.jpg');
  const src = existsSync(pngPath) ? pngPath
            : existsSync(jpgPath) ? jpgPath
            : webpPath;

  try {
    const webpBuf = readFileSync(webpPath);
    const { width, height } = await sharp(webpBuf).metadata();
    const ratio = width / height;

    if (Math.abs(ratio - TARGET_RATIO) <= TOLERANCE) {
      already++;
      continue;
    }

    const srcBuf = src === webpPath ? webpBuf : readFileSync(src);
    const outBuf = await sharp(srcBuf)
      .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'centre' })
      .webp({ quality: QUALITY })
      .toBuffer();
    writeFileSync(webpPath, outBuf);

    const srcLabel = src.endsWith('.png') ? 'PNG' : src.endsWith('.jpg') ? 'JPG' : 'WebP';
    console.log(`✅ ${file}  ${width}×${height} → ${TARGET_W}×${TARGET_H}  [${srcLabel}]`);
    processed++;
  } catch (err) {
    console.error(`❌ ${file}:`, err.message);
    errors++;
  }
}

console.log(`\nDone: ${processed} re-cropped | ${already} already 16:9 | ${uiSkipped} UI skipped | ${errors} errors`);
if (errors > 0) process.exit(1);
