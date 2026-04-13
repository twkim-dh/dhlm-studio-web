'use client';
/**
 * ReportPDF — generates a clean white-background PDF from report/research content.
 * Uses html2pdf.js (loaded dynamically on click — zero bundle cost until needed).
 * Completely bypasses the dark site layout; produces a professional document.
 */
import { useState } from 'react';

export interface ReportPDFProps {
  title: string;
  date: string;
  description: string;
  category: string;
  ticker?: string;
  beafScore?: number;
  grade?: string;
  /** "deep-dive" | "hot-sector" | "hidden-gem" | undefined */
  type?: string;
  body: string;
}

// ─── Emoji stripping ─────────────────────────────────────────────────────────
const EMOJI_RE = /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}⬇→←✓✗★☆📋📄🔑]/gu;
function stripEmoji(s: string): string {
  return s.replace(EMOJI_RE, '').replace(/\s{2,}/g, ' ').trim();
}

// ─── Markdown → PDF HTML ──────────────────────────────────────────────────────
function mdToPdfHtml(md: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const inline = (s: string) =>
    esc(stripEmoji(s))
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="font-family:monospace;font-size:10px;background:#f3f4f6;padding:1px 4px;border-radius:2px">$1</code>')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // links → text only

  const parts: string[] = [];
  const lines = stripEmoji(md).split('\n');
  let inTable = false;
  let tableRows: string[][] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (!listItems.length) return;
    parts.push(
      `<ul style="margin:8px 0 12px 20px;padding:0">` +
        listItems.map(li => `<li style="font-size:11px;line-height:1.8;color:#333;margin:3px 0">${li}</li>`).join('') +
      `</ul>`
    );
    listItems = [];
    inList = false;
  };

  const flushTable = () => {
    if (tableRows.length < 2) { tableRows = []; inTable = false; return; }
    const headers = tableRows[0];
    const data = tableRows.filter((_, i) => i !== 1); // skip separator row
    let t = `<table style="width:100%;border-collapse:collapse;font-size:10px;font-family:Arial,sans-serif;margin:14px 0;page-break-inside:avoid;break-inside:avoid">`;
    t += '<thead><tr>';
    headers.forEach(h =>
      t += `<th style="padding:6px 8px;background:#f3f4f6;border:1px solid #d1d5db;font-weight:700;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:0.4px;white-space:nowrap">${inline(h.trim())}</th>`
    );
    t += '</tr></thead><tbody>';
    data.slice(1).forEach((row, ri) => {
      t += `<tr style="background:${ri % 2 === 0 ? '#fff' : '#f9fafb'}">`;
      row.forEach(cell =>
        t += `<td style="padding:5px 8px;border:1px solid #e5e7eb;vertical-align:top">${inline(cell.trim())}</td>`
      );
      t += '</tr>';
    });
    t += '</tbody></table>';
    parts.push(t);
    tableRows = [];
    inTable = false;
  };

  lines.forEach(line => {
    const trimmed = line.trim();

    // ── Table
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (inList) flushList();
      inTable = true;
      const cells = trimmed.split('|').slice(1, -1); // strip outer pipes
      tableRows.push(cells);
      return;
    }
    if (inTable) flushTable();

    // ── Headings
    if (trimmed.startsWith('### ')) {
      if (inList) flushList();
      parts.push(`<h3 style="font-family:Georgia,serif;font-size:13px;font-weight:bold;color:#222;margin:22px 0 7px;page-break-after:avoid;break-after:avoid">${inline(trimmed.slice(4))}</h3>`);
      return;
    }
    if (trimmed.startsWith('## ')) {
      if (inList) flushList();
      parts.push(`<h2 style="font-family:Georgia,serif;font-size:16px;font-weight:bold;color:#1a1a1a;margin:28px 0 10px;padding-top:2px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;page-break-after:avoid;break-after:avoid">${inline(trimmed.slice(3))}</h2>`);
      return;
    }
    if (trimmed.startsWith('# ')) {
      if (inList) flushList();
      parts.push(`<h1 style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#1a1a1a;margin:0 0 14px">${inline(trimmed.slice(2))}</h1>`);
      return;
    }

    // ── List item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(inline(trimmed.slice(2)));
      return;
    }
    if (inList && trimmed === '') {
      flushList();
      return;
    }

    // ── HR
    if (trimmed === '---' || trimmed === '***') {
      if (inList) flushList();
      parts.push('<hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0" />');
      return;
    }

    // ── Empty line
    if (trimmed === '') {
      if (inList) flushList();
      return;
    }

    // ── Paragraph
    if (inList) flushList();
    parts.push(`<p style="font-size:11px;line-height:1.85;color:#333;margin:0 0 10px;font-family:Georgia,serif">${inline(trimmed)}</p>`);
  });

  if (inTable) flushTable();
  if (inList) flushList();
  return parts.join('\n');
}

// ─── Filename ─────────────────────────────────────────────────────────────────
function buildFilename(title: string, date: string): string {
  const d = new Date(date);
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  const slug = stripEmoji(title)
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 7)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('-');
  return `DHLM-Studio-${slug}-${month}-${year}.pdf`;
}

// ─── HTML document ────────────────────────────────────────────────────────────
function buildDocument(props: ReportPDFProps): string {
  const { title, date, description, category, beafScore, grade, type, body } = props;
  const d = new Date(date);
  const dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const year = d.getFullYear();
  const showBeaf = (!type || type === 'deep-dive') && beafScore && beafScore > 0;

  const metaLine = [
    category.toUpperCase(),
    dateStr,
    showBeaf ? `BEAF ${beafScore}/100 (${grade})` : null,
  ].filter(Boolean).join('  ·  ');

  return `
<div style="font-family:Georgia,serif;color:#1a1a1a;background:#fff;max-width:170mm;margin:0 auto;padding:0">

  <!-- ── HEADER ── -->
  <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid #1a1a1a;padding-bottom:12px;margin-bottom:24px">
    <div>
      <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;letter-spacing:2px;color:#1a1a1a;line-height:1">DHLM STUDIO</div>
      <div style="font-family:Arial,sans-serif;font-size:8px;color:#777;letter-spacing:3px;text-transform:uppercase;margin-top:3px">Brutal Edge™ Analysis</div>
    </div>
    <div style="font-family:Arial,sans-serif;font-size:9px;color:#aaa;text-align:right">dhlm-studio.com<br>Market Intelligence</div>
  </div>

  <!-- ── TITLE BLOCK ── -->
  <div style="margin-bottom:22px">
    <div style="font-family:Arial,sans-serif;font-size:8.5px;color:#888;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px">${metaLine}</div>
    <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:bold;line-height:1.3;color:#1a1a1a;margin:0 0 14px;page-break-after:avoid;break-after:avoid">${stripEmoji(title)}</h1>
    <div style="background:#f9fafb;border-left:3px solid #1a1a1a;padding:11px 14px;margin-bottom:0">
      <p style="font-family:Arial,sans-serif;font-size:11px;color:#444;line-height:1.65;margin:0">${stripEmoji(description)}</p>
    </div>
  </div>

  <hr style="border:none;border-top:1px solid #d1d5db;margin:0 0 22px" />

  <!-- ── BODY ── -->
  <div>${mdToPdfHtml(body)}</div>

  <!-- ── FOOTER ── -->
  <div style="margin-top:48px;padding-top:12px;border-top:1px solid #d1d5db;font-family:Arial,sans-serif;font-size:9px;color:#aaa;line-height:1.8;text-align:center">
    dhlm-studio.com &nbsp;·&nbsp; For informational and educational purposes only &nbsp;·&nbsp; NOT investment advice<br>
    © DHLM Studio ${year} &nbsp;·&nbsp; Brutal Edge™ Analysis &nbsp;·&nbsp; All rights reserved
  </div>

</div>`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ReportPDF(props: ReportPDFProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Dynamic import — html2pdf.js is ~400KB, loaded only on click
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = ((await import('html2pdf.js')) as any).default;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = buildDocument(props);
      wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;width:210mm;background:#fff;z-index:-999';
      document.body.appendChild(wrapper);

      await html2pdf()
        .set({
          margin:      [15, 18, 20, 18],   // [top, right, bottom, left] mm
          filename:    buildFilename(props.title, props.date),
          image:       { type: 'jpeg', quality: 0.97 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false, backgroundColor: '#ffffff' },
          jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak:   { mode: ['css', 'legacy'], avoid: ['table', 'h2', 'h3', 'ul', 'li'] },
        })
        .from(wrapper.firstElementChild)
        .save();

      document.body.removeChild(wrapper);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
        padding: '8px 14px', borderRadius: 8,
        cursor: loading ? 'wait' : 'pointer',
        background: '#111827', border: '1px solid #1E293B',
        color: loading ? '#475569' : '#94A3B8',
        opacity: loading ? 0.7 : 1,
        transition: 'opacity 0.2s',
      }}
      title="Download as professional PDF"
    >
      {loading ? '⏳ Building PDF...' : '⬇ PDF'}
    </button>
  );
}
