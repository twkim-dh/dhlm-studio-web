/**
 * update-image-refs.mjs
 * Updates all /images/content/*.png and *.jpg references to .webp
 * in src/**\/*.{md,ts,tsx} files.
 * Only updates references where a corresponding .webp file exists.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const WEBP_DIR = join(ROOT, 'public/images/content');
const SRC_DIR = join(ROOT, 'src');

// Build set of .webp files that exist
const webpFiles = new Set(
  readdirSync(WEBP_DIR)
    .filter(f => f.endsWith('.webp'))
    .map(f => f.slice(0, -5)) // strip .webp extension (base name)
);

let totalFiles = 0;
let updatedFiles = 0;
let totalReplacements = 0;

function getSourceFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...getSourceFiles(full));
    else {
      const ext = extname(full).toLowerCase();
      if (['.md', '.ts', '.tsx', '.js', '.mjs'].includes(ext)) results.push(full);
    }
  }
  return results;
}

function updateFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let replacements = 0;

  // Replace /images/content/BASENAME.{png,jpg,jpeg} → .webp (only if .webp exists)
  const updated = content.replace(
    /\/images\/content\/([^"'\s)]+)\.(png|jpg|jpeg)/gi,
    (match, base, ext) => {
      if (webpFiles.has(base)) {
        replacements++;
        return `/images/content/${base}.webp`;
      }
      return match; // no .webp found, leave unchanged
    }
  );

  if (replacements > 0) {
    writeFileSync(filePath, updated, 'utf8');
    const rel = filePath.replace(ROOT, '').replace(/\\/g, '/');
    console.log(`✓ ${rel}  (${replacements} replacement${replacements > 1 ? 's' : ''})`);
    updatedFiles++;
    totalReplacements += replacements;
  }
  totalFiles++;
}

console.log('Updating /images/content/*.{png,jpg,jpeg} → .webp references...\n');
for (const file of getSourceFiles(SRC_DIR)) {
  updateFile(file);
}

console.log(`\nDone: ${updatedFiles}/${totalFiles} files updated, ${totalReplacements} references replaced`);
