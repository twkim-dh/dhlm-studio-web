import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import ListenButton from '@/components/ListenButton';
import InlineSubscribe from '@/components/InlineSubscribe';
import GiscusComments from '@/components/GiscusComments';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/daily');

interface DailyBriefFM {
  slug: string;
  date: string;
  title: string;
  description: string;
}

function parseMd(content: string): { frontmatter: DailyBriefFM; body: string } | null {
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const lm = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (lm) fm[lm[1]] = lm[2];
  }
  return { frontmatter: fm as unknown as DailyBriefFM, body: m[2] };
}

function getBrief(slug: string) {
  try {
    const fp = path.join(CONTENT_DIR, `${slug}.md`);
    if (!fs.existsSync(fp)) return null;
    return parseMd(fs.readFileSync(fp, 'utf8'));
  } catch { return null; }
}

export function generateStaticParams() {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    return fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => ({ slug: f.replace(/\.md$/, '') }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brief = getBrief(slug);
  if (!brief) return { title: 'Daily Brief Not Found', robots: { index: false, follow: false } };
  return {
    title: `${brief.frontmatter.title} | DHLM Studio Daily Brief`,
    description: brief.frontmatter.description,
    alternates: { canonical: `https://dhlm-studio.com/daily/${slug}` },
  };
}

// Simple markdown renderer mirroring the style of /reports/[slug]
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let key = 0;

  const inline = (text: string) => text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#60A5FA">$1</a>');

  const flushTable = () => {
    if (tableRows.length < 2) { tableRows = []; return; }
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2);
    elements.push(
      <div key={key++} style={{ overflowX: 'auto', margin: '16px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--mono)' }}>
          <thead>
            <tr>{headers.map((h, i) => <th key={i} style={{ padding: '8px 10px', borderBottom: '2px solid #1E293B', color: '#94A3B8', textAlign: i === 0 ? 'left' : 'right', fontWeight: 700 }}>{h.trim()}</th>)}</tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: '6px 10px', borderBottom: '1px solid #1E293B40', color: '#E2E8F0', textAlign: ci === 0 ? 'left' : 'right' }}>{cell.trim()}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      const cells = line.split('|').filter(c => c.trim() !== '');
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#E2E8F0', margin: '32px 0 12px' }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#D4A843', margin: '24px 0 8px' }}>{line.slice(4)}</h3>);
    } else if (line.trim() === '') {
      // skip
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid #1E293B', margin: '24px 0' }} />);
    } else {
      elements.push(<p key={key++} style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.9, margin: '0 0 12px' }} dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  }
  if (inTable) flushTable();
  return elements;
}

export default async function DailyBriefPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brief = getBrief(slug);

  if (!brief) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28 }}>Daily Brief Not Found</h1>
        <Link href="/daily" style={{ color: '#C73E3A', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← All Daily Briefs</Link>
      </div>
    );
  }

  const fm = brief.frontmatter;

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    dateModified: fm.date,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
    mainEntityOfPage: `https://dhlm-studio.com/daily/${slug}`,
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/daily" style={{ fontSize: 12, color: '#64748B' }}>← All Daily Briefs</Link>

        {/* Brutal AI Header */}
        <div style={{ marginTop: 20, padding: '20px 22px', borderRadius: 14, background: 'linear-gradient(135deg, #C73E3A08, #C73E3A03)', border: '1px solid #C73E3A20', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>BRUTAL AI&trade; DAILY BRIEF</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic' }}>Analysis under editorial oversight. Data-driven. Zero feelings.</div>
        </div>

        {/* Editor Reviewed Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 6, background: '#00D47412', color: '#00D474', border: '1px solid #00D47425' }}>✓ Editor Reviewed</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 6, background: '#3B82F612', color: '#3B82F6', border: '1px solid #3B82F625' }}>✓ Multi-AI Verified</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#C73E3A', marginBottom: 8 }}>{fm.date}</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, margin: 0 }}>{fm.title}</h1>
          {fm.description && <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, marginTop: 12 }}>{fm.description}</p>}
          <div style={{ marginTop: 14 }}><ListenButton text={brief.body} /></div>
        </div>

        {/* Body */}
        <div>{renderMarkdown(brief.body)}</div>

        {/* Newsletter signup */}
        <div style={{ marginTop: 32 }}>
          <InlineSubscribe source="daily" headline="Never miss a brief" description="Tomorrow's Brutal AI Daily lands in your inbox at 7:30 AM ET. Free." />
        </div>

        {/* Comments — Giscus / GitHub Discussions */}
        <GiscusComments slug={`daily:${slug}`} />

        {/* Footer disclaimer */}
        <div style={{ marginTop: 40, padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 6 }}>🔥 PUBLISHED BY BRUTAL AI&trade;</div>
          <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>
            Analysis under editorial oversight, for informational and educational purposes.<br />
            Data: Financial Modeling Prep, Alpha Vantage, CoinGecko, alternative.me<br />
            NOT investment advice. Always do your own research.
          </div>
        </div>
      </article>
    </div>
  );
}
