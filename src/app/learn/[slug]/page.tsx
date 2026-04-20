import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

const LEARN_DIR = path.join(process.cwd(), 'src/content/learn');

const HERO_MAP: Record<string, string> = {
  'investing-101-beginner-w1-what-is-a-stock-really':          '/images/content/investing-101-beginner-w1-what-is-a-stock-hero.png',
  'investing-101-beginner-w2-how-the-market-actually-works':   '/images/content/investing-101-beginner-w2-how-market-works-hero.png',
  'investing-101-beginner-w3-opening-your-first-brokerage-account': '/images/content/investing-101-beginner-w3-brokerage-account-hero.png',
  'investing-101-beginner-w4-reading-income-statement':        '/images/content/investing-101-beginner-w4-income-statement-hero.png',
  'investing-101-beginner-w5-reading-balance-sheet':           '/images/content/investing-101-beginner-w5-balance-sheet-hero.png',
  'investing-101-beginner-w6-reading-cash-flow-statement':     '/images/content/investing-101-beginner-w6-cash-flow-statement-hero.png',
  'investing-101-beginner-w7-what-is-a-business-model':        '/images/content/investing-101-beginner-w7-business-model-hero.png',
  'investing-101-beginner-w8-valuation-basics':                '/images/content/investing-101-beginner-w8-valuation-basics-hero.png',
  'investing-101-beginner-w9-dividends-and-total-return':      '/images/content/investing-101-beginner-w9-dividends-total-return-hero.png',
  'investing-101-beginner-w10-diversification-portfolio-basics': '/images/content/investing-101-beginner-w10-diversification-portfolio-hero.png',
  'investing-101-beginner-w11-investors-mind':                 '/images/content/investing-101-beginner-w11-investors-mind-hero.png',
  'investing-101-beginner-w12-your-first-five-years':          '/images/content/investing-101-beginner-w12-five-year-roadmap-hero.png',
};

const SERIES_ORDER = [
  'investing-101-beginner-w1-what-is-a-stock-really',
  'investing-101-beginner-w2-how-the-market-actually-works',
  'investing-101-beginner-w3-opening-your-first-brokerage-account',
  'investing-101-beginner-w4-reading-income-statement',
  'investing-101-beginner-w5-reading-balance-sheet',
  'investing-101-beginner-w6-reading-cash-flow-statement',
  'investing-101-beginner-w7-what-is-a-business-model',
  'investing-101-beginner-w8-valuation-basics',
  'investing-101-beginner-w9-dividends-and-total-return',
  'investing-101-beginner-w10-diversification-portfolio-basics',
  'investing-101-beginner-w11-investors-mind',
  'investing-101-beginner-w12-your-first-five-years',
];

interface LessonFrontmatter {
  title: string;
  slug: string;
  week: number;
  description: string;
  publishDate: string;
  readingTime: string;
  series: string;
  tags: string[];
}

function parseLesson(content: string): { fm: LessonFrontmatter; body: string } | null {
  const normalised = content.replace(/\r\n/g, '\n');
  const m = normalised.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const raw: Record<string, unknown> = {};
  for (const line of m[1].split('\n')) {
    const lm = line.match(/^(\w+):\s*(.+)$/);
    if (!lm) continue;
    let val = lm[2].trim();
    if (val.startsWith('[')) { try { raw[lm[1]] = JSON.parse(val); continue; } catch { /* ignore */ } }
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    else if (val !== '' && !isNaN(Number(val))) { raw[lm[1]] = Number(val); continue; }
    raw[lm[1]] = val;
  }
  return { fm: raw as unknown as LessonFrontmatter, body: m[2] };
}

function getLesson(slug: string) {
  try {
    const content = fs.readFileSync(path.join(LEARN_DIR, `${slug}.md`), 'utf8');
    return parseLesson(content);
  } catch { return null; }
}

function getLessonSlugs(): string[] {
  try {
    return fs.readdirSync(LEARN_DIR).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
  } catch { return []; }
}

export function generateStaticParams() {
  return getLessonSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: 'Lesson Not Found', robots: { index: false, follow: false } };
  const { fm } = lesson;
  const heroSrc = HERO_MAP[slug];
  const BASE = 'https://dhlm-studio.com';
  const ogImage = heroSrc ? `${BASE}${heroSrc}` : `${BASE}/opengraph-image`;
  return {
    title: `${fm.title} | Investing 101 Beginner | DHLM Studio`,
    description: fm.description,
    alternates: { canonical: `${BASE}/learn/${slug}` },
    openGraph: {
      title: fm.title, description: fm.description,
      type: 'article', publishedTime: fm.publishDate,
      url: `${BASE}/learn/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 800 }],
    },
    twitter: { card: 'summary_large_image', title: fm.title, description: fm.description, images: [ogImage] },
  };
}

function processInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#1E293B;padding:2px 6px;border-radius:4px;font-family:var(--mono);font-size:0.9em">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#60A5FA;text-decoration:underline">$1</a>');
}

function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;
  let inTable = false;
  let tableRows: string[][] = [];
  let inBlockquote = false;
  let blockquoteLines: string[] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushTable = () => {
    if (tableRows.length < 2) { tableRows = []; return; }
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2);
    elements.push(
      <div key={key++} style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--mono)' }}>
          <thead>
            <tr>{headers.map((h, i) => <th key={i} style={{ padding: '8px 12px', borderBottom: '2px solid #1E293B', color: '#94A3B8', textAlign: 'left', fontWeight: 700 }}>{h.trim()}</th>)}</tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: '7px 12px', borderBottom: '1px solid #1E293B20', color: '#E2E8F0' }} dangerouslySetInnerHTML={{ __html: processInline(cell.trim()) }} />)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  const flushBlockquote = () => {
    if (!blockquoteLines.length) return;
    elements.push(
      <blockquote key={key++} style={{ margin: '20px 0', padding: '14px 20px', borderLeft: '3px solid #00D474', background: '#00D47408', borderRadius: '0 8px 8px 0' }}>
        {blockquoteLines.map((l, i) => <p key={i} style={{ margin: 0, fontSize: 15, color: '#CBD5E1', lineHeight: 1.8, fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: processInline(l) }} />)}
      </blockquote>
    );
    blockquoteLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    elements.push(
      <ul key={key++} style={{ margin: '8px 0 16px 0', paddingLeft: 20 }}>
        {listItems.map((item, i) => (
          <li key={i} style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.85, marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: processInline(item) }} />
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    // Table
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inBlockquote) { flushBlockquote(); inBlockquote = false; }
      if (inList) { flushList(); inList = false; }
      inTable = true;
      const cells = line.split('|').slice(1, -1);
      if (!cells.every(c => /^[\s:-]+$/.test(c))) tableRows.push(cells);
      else tableRows.push(cells);
      continue;
    } else if (inTable) { inTable = false; flushTable(); }

    // Blockquote
    if (line.startsWith('> ')) {
      if (inList) { flushList(); inList = false; }
      inBlockquote = true;
      blockquoteLines.push(line.slice(2));
      continue;
    } else if (inBlockquote) { flushBlockquote(); inBlockquote = false; }

    // List
    if (line.match(/^[-*] /)) {
      inList = true;
      listItems.push(line.slice(2));
      continue;
    } else if (inList && line.trim() === '') {
      flushList(); inList = false;
    } else if (inList) { flushList(); inList = false; }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: '36px 0 14px', lineHeight: 1.25 }}>{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#E2E8F0', margin: '32px 0 12px', borderBottom: '1px solid #1E293B', paddingBottom: 8 }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#00D474', margin: '24px 0 8px' }}>{line.slice(4)}</h3>);
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={key++} style={{ fontSize: 14, fontWeight: 700, color: '#CBD5E1', margin: '16px 0 6px', fontFamily: 'var(--mono)', letterSpacing: 0.5 }}>{line.slice(5)}</h4>);
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid #1E293B', margin: '28px 0' }} />);
    } else if (line.trim() === '') {
      // skip blank
    } else {
      elements.push(<p key={key++} style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.9, margin: '0 0 14px' }} dangerouslySetInnerHTML={{ __html: processInline(line) }} />);
    }
  }

  if (inTable) flushTable();
  if (inBlockquote) flushBlockquote();
  if (inList) flushList();

  return elements;
}

export default async function LearnLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);

  if (!lesson) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28 }}>Lesson Not Found</h1>
        <Link href="/learn/investing-101-beginner" style={{ color: '#00D474', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← Back to Series</Link>
      </div>
    );
  }

  const { fm, body } = lesson;
  const heroSrc = HERO_MAP[slug];
  const seriesIndex = SERIES_ORDER.indexOf(slug);
  const prevSlug = seriesIndex > 0 ? SERIES_ORDER[seriesIndex - 1] : null;
  const nextSlug = seriesIndex < SERIES_ORDER.length - 1 ? SERIES_ORDER[seriesIndex + 1] : null;

  const prevLesson = prevSlug ? getLesson(prevSlug) : null;
  const nextLesson = nextSlug ? getLesson(nextSlug) : null;

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: fm.title, description: fm.description,
    datePublished: fm.publishDate,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
    isPartOf: { '@type': 'Course', name: 'Investing 101 — Beginner' },
  };

  const phaseColor = fm.week <= 3 ? '#00D474' : fm.week <= 7 ? '#3B82F6' : '#D4A843';
  const phaseLabel = fm.week <= 3 ? 'PHASE 1 · FOUNDATIONS' : fm.week <= 7 ? 'PHASE 2 · READING COMPANIES' : 'PHASE 3 · STRATEGY';

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 11, fontFamily: 'var(--mono)', color: '#475569', flexWrap: 'wrap' }}>
          <Link href="/learn" style={{ color: '#475569', textDecoration: 'none' }}>Brutal Edge Academy</Link>
          <span>/</span>
          <Link href="/learn/investing-101-beginner" style={{ color: '#475569', textDecoration: 'none' }}>Investing 101 Beginner</Link>
          <span>/</span>
          <span style={{ color: '#64748B' }}>Week {fm.week}</span>
        </div>

        {/* Hero image */}
        {heroSrc && (
          <div style={{ width: '100%', aspectRatio: '3/2', borderRadius: 14, overflow: 'hidden', marginBottom: 28, border: '1px solid #1E293B', position: 'relative', background: '#0f172a' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroSrc} alt={fm.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.9 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #00D47420 0%, transparent 50%)' }} />
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: '#00D47418', color: '#00D474', border: '1px solid #00D47430', letterSpacing: 1 }}>
              INVESTING 101 BEGINNER
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${phaseColor}14`, color: phaseColor }}>
              {phaseLabel}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#1E293B', color: '#64748B' }}>
              WEEK {fm.week} / 12
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 14px', lineHeight: 1.2 }}>
            {fm.title}
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, margin: '0 0 16px' }}>{fm.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#475569', fontFamily: 'var(--mono)' }}>
            <span>🕐 {fm.readingTime}</span>
            <span>·</span>
            <span>Investing 101 — Beginner Series</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32, padding: '12px 16px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569' }}>SERIES PROGRESS</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#475569' }}>W{fm.week} / 12</span>
          </div>
          <div style={{ height: 4, background: '#1E293B', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(fm.week / 12) * 100}%`, background: 'linear-gradient(90deg, #00D474, #059952)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Body */}
        <div style={{ lineHeight: 1.9 }}>
          {renderMarkdown(body)}
        </div>

        {/* Tags */}
        {fm.tags && fm.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 32 }}>
            {fm.tags.map((tag: string) => (
              <span key={tag} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 5, background: '#1E293B', color: '#475569', letterSpacing: 0.5 }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #1E293B', margin: '36px 0' }} />

        {/* Prev / Next navigation */}
        <div style={{ display: 'grid', gridTemplateColumns: prevLesson ? (nextLesson ? '1fr 1fr' : '1fr') : (nextLesson ? '1fr' : 'none'), gap: 12, marginBottom: 32 }}>
          {prevLesson && (
            <Link href={`/learn/${prevSlug}`} style={{ textDecoration: 'none', padding: '14px 16px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B', display: 'block' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', marginBottom: 4 }}>← PREV · WEEK {prevLesson.fm.week}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{prevLesson.fm.title}</div>
            </Link>
          )}
          {nextLesson && (
            <Link href={`/learn/${nextSlug}`} style={{ textDecoration: 'none', padding: '14px 16px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B', display: 'block', textAlign: prevLesson ? 'right' : 'left' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', marginBottom: 4 }}>NEXT · WEEK {nextLesson.fm.week} →</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{nextLesson.fm.title}</div>
            </Link>
          )}
        </div>

        {/* Back links */}
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/learn/investing-101-beginner" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← Series Index</Link>
          <Link href="/learn" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← Brutal Edge Academy</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', marginTop: 24, textAlign: 'center' }}>
          Educational content only. Not investment advice. Always do your own research.
        </p>
      </article>
    </div>
  );
}
