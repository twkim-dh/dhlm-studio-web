#!/usr/bin/env node
/**
 * DHLM Studio — Report PDF Generator
 *
 * Usage:  node scripts/generate-report-pdf.js [slug]
 * Output: public/pdf/[slug].pdf
 *
 * Requires: pdfkit  (npm install --save-dev pdfkit)
 *
 * Design goals
 * ────────────
 * • Tables are standalone bordered blocks — NEVER mixed with paragraph text
 * • Paragraphs flow naturally; inline **bold** and *italic* are preserved
 * • Sections separated by visual rule; natural page breaks when full
 * • Cover page + body pages + DHLM branding
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// ─── Page geometry (A4) ───────────────────────────────────────────────────────
const PW = 595.28;   // A4 width  (points)
const PH = 841.89;   // A4 height (points)
const ML = 58;       // margin left
const MR = 58;       // margin right
const MT = 56;       // margin top
const MB = 56;       // margin bottom
const CW = PW - ML - MR;           // usable content width  (479.28)
const BOTTOM = PH - MB;            // lowest allowed y before footer

// ─── Built-in PDF standard fonts (no file embedding needed) ──────────────────
const BODY    = 'Times-Roman';
const BODY_B  = 'Times-Bold';
const BODY_I  = 'Times-Italic';
const BODY_BI = 'Times-BoldItalic';
const SANS    = 'Helvetica';
const SANS_B  = 'Helvetica-Bold';
const SANS_I  = 'Helvetica-Oblique';

// ─── Markdown: frontmatter parser ────────────────────────────────────────────
function parseFm(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: src };
  const fm = {};
  m[1].split('\n').forEach(l => {
    const kv = l.match(/^(\w+):\s*(.+)$/);
    if (!kv) return;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    fm[kv[1]] = v;
  });
  return { fm, body: m[2] };
}

// ─── Markdown: body → blocks ──────────────────────────────────────────────────
/**
 * Returns array of blocks:
 *  { type:'h1'|'h2'|'h3'|'h4', text }
 *  { type:'paragraph'|'italic_para', text }
 *  { type:'bullets', items:[] }
 *  { type:'table', headers:[], rows:[[]] }
 *  { type:'hr' }
 */
function parseBlocks(body) {
  const blocks = [];
  const lines  = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let inTable = false, tableRows = [], bullets = [];

  const flushTable = () => {
    if (tableRows.length < 2) { tableRows = []; inTable = false; return; }
    const sep = tableRows.findIndex(r => r.every(c => /^[\s\-:]+$/.test(c)));
    if (sep < 0) { tableRows = []; inTable = false; return; }
    blocks.push({ type: 'table', headers: tableRows[0], rows: tableRows.slice(sep + 1) });
    tableRows = []; inTable = false;
  };
  const flushBullets = () => {
    if (bullets.length) { blocks.push({ type: 'bullets', items: [...bullets] }); bullets = []; }
  };

  for (const line of lines) {
    const t = line.trim();

    // ── Table row ──
    if (t.startsWith('|') && t.endsWith('|')) {
      flushBullets();
      inTable = true;
      tableRows.push(t.split('|').slice(1, -1));
      continue;
    }
    if (inTable) flushTable();

    if (t === '')                              { flushBullets(); continue; }
    if (/^-{3,}$/.test(t))                    { flushBullets(); blocks.push({ type: 'hr' }); continue; }

    // ── Headings ──
    const hm = t.match(/^(#{1,4})\s+(.*)/);
    if (hm) { flushBullets(); blocks.push({ type: `h${hm[1].length}`, text: hm[2] }); continue; }

    // ── Bullet list ──
    if (t.startsWith('- ') || t.startsWith('* ')) { bullets.push(t.slice(2)); continue; }

    // ── *italic paragraph* (outer stars only, not **bold**) ──
    if (/^\*[^*]/.test(t) && t.endsWith('*') && !t.endsWith('**')) {
      flushBullets(); blocks.push({ type: 'italic_para', text: t.slice(1, -1) }); continue;
    }

    flushBullets();
    blocks.push({ type: 'paragraph', text: t });
  }

  if (inTable)     flushTable();
  if (bullets.length) flushBullets();
  return blocks;
}

// ─── Inline markdown parser ───────────────────────────────────────────────────
/** Returns [{text, bold, italic, code}] */
function inlineRuns(text) {
  // Flatten links → just the link text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const runs = [];
  const re = /(\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let li = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > li) runs.push({ text: text.slice(li, m.index) });
    if (m[1].startsWith('***'))      runs.push({ text: m[2], bold: true,  italic: true  });
    else if (m[1].startsWith('**'))  runs.push({ text: m[3], bold: true,  italic: false });
    else if (m[1].startsWith('*'))   runs.push({ text: m[4], bold: false, italic: true  });
    else                             runs.push({ text: m[5], code: true });
    li = m.index + m[1].length;
  }
  if (li < text.length) runs.push({ text: text.slice(li) });
  return runs.filter(r => r.text.length > 0);
}

/** Strip all inline markers → plain string */
function plain(text) {
  return text
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g,     '$1')
    .replace(/\*([^*]+)\*/g,         '$1')
    .replace(/`([^`]+)`/g,           '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

/** Choose font for a run */
function runFont(r) {
  if (r.code)               return SANS;
  if (r.bold && r.italic)   return BODY_BI;
  if (r.bold)               return BODY_B;
  if (r.italic)             return BODY_I;
  return BODY;
}

// ─── PDF helpers ──────────────────────────────────────────────────────────────
/** Add a new page if `needed` points won't fit on the current page. */
function guard(doc, needed) {
  if (doc.y + needed > BOTTOM) {
    doc.addPage();
  }
}

/** Draw a horizontal rule */
function hline(doc, y, x1 = ML, x2 = ML + CW, lw = 0.5, color = '#d1d5db') {
  doc.save()
     .strokeColor(color).lineWidth(lw)
     .moveTo(x1, y).lineTo(x2, y).stroke()
     .restore();
}

// ─── Paragraph renderer (handles inline bold/italic) ─────────────────────────
/**
 * Renders a paragraph with inline styled runs.
 * opts: { fontSize, color, indent, gapAfter }
 */
function renderPara(doc, text, opts = {}) {
  const {
    fontSize  = 11,
    color     = '#1a1a1a',
    indent    = 0,
    gapAfter  = 9,
  } = opts;

  const x = ML + indent;
  const w = CW - indent;
  const runs = inlineRuns(text);
  if (runs.length === 0) return;

  // Estimate height (using body font as proxy) for page-guard
  doc.font(BODY).fontSize(fontSize);
  const estH = doc.heightOfString(plain(text), { width: w });
  guard(doc, estH + gapAfter + 4);

  const sy = doc.y;

  for (let i = 0; i < runs.length; i++) {
    const r    = runs[i];
    const last = i === runs.length - 1;
    doc.font(runFont(r)).fontSize(fontSize).fillColor(color);
    if (i === 0) {
      doc.text(r.text, x, sy, { width: w, continued: !last });
    } else {
      doc.text(r.text, { continued: !last });
    }
  }

  doc.y += gapAfter;
}

// ─── Heading renderers ────────────────────────────────────────────────────────
function renderH2(doc, text, isFirst) {
  const topGap = isFirst ? 0 : 22;
  guard(doc, topGap + 52); // heading + at least ~3 lines of body
  doc.y += topGap;

  doc.font(SANS_B).fontSize(14).fillColor('#111')
     .text(plain(text), ML, doc.y, { width: CW });
  doc.y += 4;
  hline(doc, doc.y, ML, ML + CW, 1.5, '#111111');
  doc.y += 11;
}

function renderH3(doc, text) {
  guard(doc, 32);
  doc.y += 12;
  doc.font(SANS_B).fontSize(11.5).fillColor('#333')
     .text(plain(text), ML, doc.y, { width: CW });
  doc.y += 8;
}

function renderH4(doc, text) {
  guard(doc, 24);
  doc.y += 8;
  doc.font(SANS_B).fontSize(10.5).fillColor('#444')
     .text(plain(text), ML, doc.y, { width: CW });
  doc.y += 6;
}

// ─── Bullet list renderer ─────────────────────────────────────────────────────
function renderBullets(doc, items) {
  for (const item of items) {
    renderPara(doc, '\u2022  ' + item, { indent: 12, gapAfter: 5 });
  }
  doc.y += 5;
}

// ─── Note / italic paragraph renderer ────────────────────────────────────────
function renderNote(doc, text) {
  guard(doc, 20);
  doc.font(BODY_I).fontSize(9.5).fillColor('#666')
     .text(plain(text), ML, doc.y, { width: CW });
  doc.y += 8;
}

// ─── TABLE renderer ───────────────────────────────────────────────────────────
/**
 * Renders a bordered table as a standalone block.
 * Tables and paragraph text are NEVER mixed — this function fully owns its layout.
 */
function renderTable(doc, headers, rows) {
  const CPAD    = 7;   // cell padding (points)
  const FS_H    = 8;   // header font size
  const FS_C    = 9.5; // cell font size
  const n       = headers.length;

  // ── Column widths ────────────────────────────────────────────────
  // Tuned for the two tables in the ETH report:
  //   3-col  → Metric / Latest Reading / Interpretation
  //   4-col  → Scenario / Probability / Range / What Needs to Happen
  let colW;
  if (n === 3) {
    colW = [134, 126, CW - 260];
  } else if (n === 4) {
    colW = [92, 66, 108, CW - 266];
  } else {
    const base = Math.floor(CW / n);
    colW = Array(n).fill(base);
    colW[n - 1] = CW - base * (n - 1);
  }

  // ── Ensure space for at least header + 1 row ─────────────────────
  guard(doc, 44);
  doc.y += 4; // small gap before table

  let ty = doc.y; // current top-y of the row being drawn

  // ── Header row ───────────────────────────────────────────────────
  const headerH = 20;

  // fill + outer border
  doc.rect(ML, ty, CW, headerH).fill('#f3f4f6');
  doc.rect(ML, ty, CW, headerH).lineWidth(0.5).stroke('#d1d5db');

  let cx = ML;
  headers.forEach((h, i) => {
    doc.rect(cx, ty, colW[i], headerH).lineWidth(0.5).stroke('#d1d5db');
    doc.font(SANS_B).fontSize(FS_H).fillColor('#444444')
       .text(plain(h.trim()).toUpperCase(), cx + CPAD, ty + 6, {
         width: colW[i] - CPAD * 2,
         lineBreak: false,
       });
    cx += colW[i];
  });
  ty += headerH;

  // ── Data rows ────────────────────────────────────────────────────
  rows.forEach((row, ri) => {
    // Pre-calculate row height from tallest cell
    let rowH = FS_C * 1.45 + CPAD * 2;
    row.forEach((cell, ci) => {
      doc.font(ci === 0 ? SANS_B : BODY).fontSize(FS_C);
      const cellH = doc.heightOfString(plain(cell.trim()), {
        width: colW[ci] - CPAD * 2,
      }) + CPAD * 2;
      rowH = Math.max(rowH, cellH);
    });
    rowH = Math.ceil(rowH);

    // Page break inside table: redraw just the header on the new page
    if (ty + rowH > BOTTOM - 4) {
      doc.addPage();
      ty = MT;
      // Re-draw header on new page
      doc.rect(ML, ty, CW, headerH).fill('#f3f4f6');
      doc.rect(ML, ty, CW, headerH).lineWidth(0.5).stroke('#d1d5db');
      cx = ML;
      headers.forEach((h, i) => {
        doc.rect(cx, ty, colW[i], headerH).lineWidth(0.5).stroke('#d1d5db');
        doc.font(SANS_B).fontSize(FS_H).fillColor('#444444')
           .text(plain(h.trim()).toUpperCase(), cx + CPAD, ty + 6, {
             width: colW[i] - CPAD * 2,
             lineBreak: false,
           });
        cx += colW[i];
      });
      ty += headerH;
    }

    // Zebra fill + outer border
    const bg = ri % 2 === 0 ? '#ffffff' : '#f9fafb';
    doc.rect(ML, ty, CW, rowH).fill(bg);
    doc.rect(ML, ty, CW, rowH).lineWidth(0.5).stroke('#e5e7eb');

    // Draw each cell
    cx = ML;
    row.forEach((cell, ci) => {
      // Cell border
      doc.rect(cx, ty, colW[ci], rowH).lineWidth(0.5).stroke('#e5e7eb');

      // Cell text — support inline bold/italic for non-first columns
      const cellText   = cell.trim();
      const textX      = cx + CPAD;
      const textY      = ty + CPAD;
      const textW      = colW[ci] - CPAD * 2;

      if (ci === 0) {
        // First column: always bold sans
        doc.font(SANS_B).fontSize(FS_C).fillColor('#222222')
           .text(plain(cellText), textX, textY, { width: textW });
      } else {
        // Other columns: inline styled text
        const runs = inlineRuns(cellText);
        if (runs.length === 0) { cx += colW[ci]; return; }
        for (let k = 0; k < runs.length; k++) {
          const r    = runs[k];
          const last = k === runs.length - 1;
          doc.font(runFont(r)).fontSize(FS_C).fillColor('#1a1a1a');
          if (k === 0) {
            doc.text(r.text, textX, textY, { width: textW, continued: !last });
          } else {
            doc.text(r.text, { continued: !last });
          }
        }
      }
      cx += colW[ci];
    });
    ty += rowH;
  });

  doc.y = ty + 14; // advance past table + small gap
}

// ─── Cover page ───────────────────────────────────────────────────────────────
function renderCover(doc, fm) {
  let y = 70;

  // ── Brand ──────────────────────────────────────────────────────────────────
  doc.font(SANS_B).fontSize(22).fillColor('#1a1a1a')
     .text('DHLM STUDIO', ML, y, { width: CW, align: 'center' });
  y += 28;
  doc.font(SANS_I).fontSize(8.5).fillColor('#888888')
     .text('BRUTAL EDGE™ ANALYSIS', ML, y, { width: CW, align: 'center', characterSpacing: 2.5 });
  y += 14;
  hline(doc, y, ML, ML + CW, 2, '#1a1a1a');
  y += 22;

  // ── Category + ticker ──────────────────────────────────────────────────────
  const catParts = [fm.category, fm.ticker].filter(Boolean);
  const catStr   = catParts.join('  ·  ').toUpperCase();
  doc.font(SANS).fontSize(8.5).fillColor('#999')
     .text(catStr, ML, y, { width: CW, align: 'center', characterSpacing: 1.5 });
  y += 18;

  // ── Title ──────────────────────────────────────────────────────────────────
  const title = fm.title || '';
  doc.font(BODY_B).fontSize(22).fillColor('#1a1a1a')
     .text(title, ML, y, { width: CW, align: 'center' });
  y = doc.y + 18;

  // ── Date ───────────────────────────────────────────────────────────────────
  const d = new Date(fm.date || Date.now());
  const dateStr = d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.font(SANS).fontSize(9.5).fillColor('#888')
     .text(dateStr, ML, y, { width: CW, align: 'center' });
  y += 22;
  hline(doc, y, ML, ML + CW, 0.5, '#d1d5db');
  y += 20;

  // ── Description callout box ─────────────────────────────────────────────────
  if (fm.description) {
    const boxPad = 16;
    const boxW   = CW;
    doc.font(BODY_I).fontSize(11).fillColor('#333');
    const descH  = doc.heightOfString(fm.description, { width: boxW - boxPad * 2 });
    const boxH   = descH + boxPad * 2;

    doc.rect(ML, y, boxW, boxH).stroke('#d1d5db');
    doc.rect(ML, y, 3, boxH).fill('#1a1a1a');   // left accent bar

    doc.font(BODY_I).fontSize(11).fillColor('#444')
       .text(fm.description, ML + boxPad, y + boxPad, { width: boxW - boxPad * 2 });
    y += boxH + 24;
  }

  // ── Read time / grade badges ───────────────────────────────────────────────
  const badges = [fm.readTime, fm.category].filter(Boolean).join('  ·  ');
  doc.font(SANS).fontSize(8.5).fillColor('#aaa')
     .text(badges, ML, y, { width: CW, align: 'center' });

  // ── Bottom footer ──────────────────────────────────────────────────────────
  const fy = PH - MB + 10;
  hline(doc, fy - 5, ML, ML + CW, 0.5, '#eeeeee');
  doc.font(SANS).fontSize(7.5).fillColor('#aaaaaa')
     .text(
       'dhlm-studio.com  ·  For informational and educational purposes only  ·  NOT investment advice',
       ML, fy, { width: CW, align: 'center' },
     );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  const slug  = process.argv[2] || 'ethereum-special-report-april-2026';
  const mdPath = path.join(__dirname, '..', 'src', 'content', 'reports', `${slug}.md`);

  if (!fs.existsSync(mdPath)) {
    console.error(`✗  Not found: ${mdPath}`);
    process.exit(1);
  }

  const src           = fs.readFileSync(mdPath, 'utf8');
  const { fm, body }  = parseFm(src);
  const blocks        = parseBlocks(body);

  const outDir  = path.join(__dirname, '..', 'public', 'pdf');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.pdf`);

  const doc = new PDFDocument({
    size:          'A4',
    margins:       { top: MT, bottom: MB, left: ML, right: MR },
    autoFirstPage: false,
    info: {
      Title:   fm.title   || slug,
      Author:  'DHLM Studio',
      Subject: fm.description || '',
      Creator: 'DHLM Studio — Brutal Edge™ Analysis',
    },
  });

  const ws = fs.createWriteStream(outPath);
  doc.pipe(ws);

  // ── Page 1: Cover ──────────────────────────────────────────────────────────
  doc.addPage();
  renderCover(doc, fm);

  // ── Page 2+: Body ──────────────────────────────────────────────────────────
  doc.addPage();

  let h2Count = 0;

  for (const block of blocks) {
    switch (block.type) {

      case 'h1':
        // Title already on cover — skip
        break;

      case 'h2':
        renderH2(doc, block.text, h2Count === 0);
        h2Count++;
        break;

      case 'h3':
        renderH3(doc, block.text);
        break;

      case 'h4':
        renderH4(doc, block.text);
        break;

      case 'paragraph':
        renderPara(doc, block.text);
        break;

      case 'italic_para':
        renderNote(doc, block.text);
        break;

      case 'bullets':
        renderBullets(doc, block.items);
        break;

      case 'table':
        renderTable(doc, block.headers, block.rows);
        break;

      case 'hr':
        guard(doc, 18);
        doc.y += 6;
        hline(doc, doc.y, ML, ML + CW, 0.5, '#e5e7eb');
        doc.y += 12;
        break;
    }
  }

  // ── Finalize ───────────────────────────────────────────────────────────────
  doc.end();
  ws.on('finish', () => console.log(`✓  PDF saved → ${outPath}`));
  ws.on('error',  e  => { console.error('✗  Write error:', e.message); process.exit(1); });
}

main();
