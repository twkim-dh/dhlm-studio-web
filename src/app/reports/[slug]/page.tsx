import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import LikeButton from '@/components/LikeButton';

const REPORTS_DIR = path.join(process.cwd(), 'src/content/reports');

interface ReportFrontmatter {
  title: string;
  slug: string;
  ticker: string;
  date: string;
  readTime: string;
  category: string;
  catColor: string;
  grade: string;
  baafScore: number;
  description: string;
}

function parseMarkdown(content: string): { frontmatter: ReportFrontmatter; body: string } {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return { frontmatter: {} as ReportFrontmatter, body: content };

  const fmLines = fmMatch[1].split('\n');
  const fm: Record<string, string | number> = {};
  fmLines.forEach(line => {
    const match = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (match) fm[match[1]] = isNaN(Number(match[2])) ? match[2] : Number(match[2]);
  });

  return { frontmatter: fm as unknown as ReportFrontmatter, body: fmMatch[2] };
}

function getReportSlugs(): string[] {
  try {
    return fs.readdirSync(REPORTS_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
  } catch { return []; }
}

function getReport(slug: string): { frontmatter: ReportFrontmatter; body: string } | null {
  try {
    const filePath = path.join(REPORTS_DIR, `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf8');
    return parseMarkdown(content);
  } catch { return null; }
}

export function generateStaticParams() {
  return getReportSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) return { title: 'Report Not Found' };
  return {
    title: `${report.frontmatter.title} | DHLM Studio`,
    description: report.frontmatter.description,
  };
}

// Simple Markdown to HTML (headings, bold, italic, tables, paragraphs)
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let key = 0;

  const processInline = (text: string) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#60A5FA">$1</a>');
  };

  const flushTable = () => {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2); // skip separator
    elements.push(
      <div key={key++} style={{ overflowX: 'auto', margin: '16px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--mono)' }}>
          <thead>
            <tr>
              {headers.map((h, i) => <th key={i} style={{ padding: '8px 10px', borderBottom: '2px solid #1E293B', color: '#94A3B8', textAlign: i === 0 ? 'left' : 'right', fontWeight: 700 }}>{h.trim()}</th>)}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => <td key={ci} style={{ padding: '6px 10px', borderBottom: '1px solid #1E293B15', color: '#E2E8F0', textAlign: ci === 0 ? 'left' : 'right' }}>{cell.trim()}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  lines.forEach(line => {
    // Table row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      const cells = line.split('|').filter(c => c.trim() !== '');
      if (!cells.every(c => /^[\s-:]+$/.test(c))) { // skip separator detection
        tableRows.push(cells);
      } else {
        tableRows.push(cells); // keep separator for indexing
      }
      return;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    // Headings
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#E2E8F0', margin: '32px 0 12px' }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#D4A843', margin: '24px 0 8px' }}>{line.slice(4)}</h3>);
    } else if (line.trim() === '') {
      // skip
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid #1E293B', margin: '24px 0' }} />);
    } else {
      elements.push(<p key={key++} style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.9, margin: '0 0 12px' }} dangerouslySetInnerHTML={{ __html: processInline(line) }} />);
    }
  });

  if (inTable) flushTable();
  return elements;
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = getReport(slug);

  if (!report) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28 }}>Report Not Found</h1>
        <Link href="/reports" style={{ color: '#C73E3A', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← All Reports</Link>
      </div>
    );
  }

  const { frontmatter: fm, body } = report;

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: fm.title, description: fm.description, datePublished: fm.date,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/reports" style={{ fontSize: 12, color: '#64748B' }}>← Reports</Link>

        {/* Brutal AI Header */}
        <div style={{ marginTop: 20, padding: '20px 22px', borderRadius: 14, background: 'linear-gradient(135deg, #C73E3A08, #C73E3A03)', border: '1px solid #C73E3A20', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>BRUTAL AI™ DEEP DIVE</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic' }}>AI-generated analysis. Data-driven. Zero feelings.</div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${fm.catColor}14`, color: fm.catColor }}>{fm.category}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>BAAF: {fm.baafScore}/100 ({fm.grade})</span>
            <span style={{ fontSize: 11, color: '#475569' }}>Published {fm.date} · {fm.readTime} read</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, margin: 0 }}>{fm.title}</h1>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, marginTop: 12 }}>{fm.description}</p>
          <div style={{ marginTop: 12 }}><LikeButton pageId={`report-${slug}`} /></div>
        </div>

        {/* Body */}
        <div>{renderMarkdown(body)}</div>

        {/* Brutal AI Footer */}
        <div style={{ marginTop: 40, padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 6 }}>🔥 ANALYZED BY BRUTAL AI™</div>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>DHLM Studio&apos;s AI Analysis Engine</div>
          <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>
            Data: Financial Modeling Prep, Alpha Vantage, CoinGecko<br />
            NOT investment advice. Always do your own research.
          </div>
        </div>
      </article>
    </div>
  );
}
