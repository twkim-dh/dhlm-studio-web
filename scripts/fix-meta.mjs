// Fix script: remove the stray comma before openGraph
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const TOOLS_DIR = join(process.cwd(), 'src/app/tools');

function findPageFiles(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) findPageFiles(full, results);
    else if (entry === 'page.tsx') results.push(full);
  }
  return results;
}

let fixed = 0;
for (const f of findPageFiles(TOOLS_DIR)) {
  let content = readFileSync(f, 'utf-8');

  // Fix pattern: description content followed by \n, then \n,\n  openGraph
  // The issue is: ...description text",\n,\n  openGraph
  // Should be:    ...description text",\n  openGraph
  if (content.includes(',\n  openGraph')) {
    // Fix: remove the duplicate comma line
    // Pattern: the description line ends, then there's a lone comma, then openGraph
    const fixed_content = content.replace(/",\n,\n  openGraph/g, '",\n  openGraph')
                                 .replace(/\.\n,\n  openGraph/g, '.",\n  openGraph')
                                 .replace(/。\n,\n  openGraph/g, '。",\n  openGraph');

    if (fixed_content !== content) {
      writeFileSync(f, fixed_content, 'utf-8');
      fixed++;
    }
  }
}
console.log(`Fixed ${fixed} files`);
