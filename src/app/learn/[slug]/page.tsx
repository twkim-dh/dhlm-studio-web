import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import ContentDisclaimer from '@/components/ContentDisclaimer';
import path from 'path';

const LEARN_DIR = path.join(process.cwd(), 'src/content/learn');

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const HERO_MAP: Record<string, string> = {
  'quantum-101-part1-superconducting-qubits':   '/images/content/quantum-101-part1-hero.webp',
  'quantum-101-part2-trapped-ion':              '/images/content/quantum-101-part2-hero.webp',
  'quantum-101-part3-neutral-atom':             '/images/content/quantum-101-part3-hero.webp',
  'quantum-101-part4-photonic':                 '/images/content/quantum-101-part4-hero.webp',
  'quantum-101-part5-silicon-spin':             '/images/content/quantum-101-part5-hero.webp',
  'quantum-101-part6-topological':              '/images/content/quantum-101-part6-hero.webp',
  'quantum-101-part7-quantum-annealing':        '/images/content/quantum-101-part7-hero.webp',
  'quantum-101-part8-software-cloud':           '/images/content/quantum-101-part8-hero.webp',
  'quantum-101-part9-quantum-security':         '/images/content/quantum-101-part9-hero.webp',
  'quantum-101-part10-quantum-applications':    '/images/content/quantum-101-part10-hero.webp',
  'quantum-101-part11-investing-framework':     '/images/content/quantum-101-part11-hero.webp',
  'quantum-101-part12-watchlist':               '/images/content/quantum-101-part12-hero.webp',
  'investing-101-beginner-w1-what-is-a-stock-really':            '/images/content/investing-101-beginner-w1-what-is-a-stock-hero.webp',
  'investing-101-beginner-w2-how-the-market-actually-works':     '/images/content/investing-101-beginner-w2-how-market-works-hero.webp',
  'investing-101-beginner-w3-opening-your-first-brokerage-account': '/images/content/investing-101-beginner-w3-brokerage-account-hero.webp',
  'investing-101-beginner-w4-reading-income-statement':          '/images/content/investing-101-beginner-w4-income-statement-hero.webp',
  'investing-101-beginner-w5-reading-balance-sheet':             '/images/content/investing-101-beginner-w5-balance-sheet-hero.webp',
  'investing-101-beginner-w6-reading-cash-flow-statement':       '/images/content/investing-101-beginner-w6-cash-flow-statement-hero.webp',
  'investing-101-beginner-w7-what-is-a-business-model':          '/images/content/investing-101-beginner-w7-business-model-hero.webp',
  'investing-101-beginner-w8-valuation-basics':                  '/images/content/investing-101-beginner-w8-valuation-basics-hero.webp',
  'investing-101-beginner-w9-dividends-and-total-return':        '/images/content/investing-101-beginner-w9-dividends-total-return-hero.webp',
  'investing-101-beginner-w10-diversification-portfolio-basics': '/images/content/investing-101-beginner-w10-diversification-portfolio-hero.webp',
  'investing-101-beginner-w11-investors-mind':                   '/images/content/investing-101-beginner-w11-investors-mind-hero.webp',
  'investing-101-beginner-w12-your-first-five-years':            '/images/content/investing-101-beginner-w12-five-year-roadmap-hero.webp',
  'investing-101-intermediate-w13-three-valuations':  '/images/content/INV-101-W13.webp',
  'investing-101-intermediate-w14-dcf-lies':          '/images/content/INV-101-W14.webp',
  'investing-101-intermediate-w15-multiples':         '/images/content/INV-101-W15.webp',
  'investing-101-intermediate-w16-five-moats':        '/images/content/INV-101-W16.webp',
  'investing-101-intermediate-w17-moat-erosion':      '/images/content/INV-101-W17.webp',
  'investing-101-intermediate-w18-new-tech-moats':    '/images/content/INV-101-W18.webp',
  'investing-101-intermediate-w19-10k-forensics':     '/images/content/INV-101-W19.webp',
  'investing-101-intermediate-w20-earnings-calls':    '/images/content/INV-101-W20.webp',
  'investing-101-intermediate-w21-proxy-statements':  '/images/content/INV-101-W21.webp',
  'investing-101-intermediate-w22-position-sizing':   '/images/content/INV-101-W22.webp',
  'investing-101-intermediate-w23-correlation-risk':  '/images/content/INV-101-W23.webp',
  'investing-101-intermediate-w24-when-to-sell':      '/images/content/INV-101-W24.webp',
  'masters-livermore':      '/images/content/livermore-masters-hero.webp',
  'masters-druckenmiller':  '/images/content/druckenmiller-masters-hero.webp',
  'masters-lynch-1':        '/images/content/masters-peter-lynch-part1-ten-bagger-hero.webp',
  'masters-lynch-2':        '/images/content/masters-peter-lynch-part2-categories-hero.webp',
  'masters-lynch-3':        '/images/content/masters-peter-lynch-part3-cocktail-party-hero.webp',
  'masters-lynch-4':        '/images/content/masters-peter-lynch-part4-numbers-hero.webp',
  'masters-lynch-5':        '/images/content/masters-peter-lynch-part5-2026-hero.webp',
  'masters-munger-1':       '/images/content/masters-charlie-munger-part1-stupidity-hero.webp',
  'masters-munger-2':       '/images/content/masters-charlie-munger-part2-ego-hero.webp',
  'masters-munger-3':       '/images/content/masters-charlie-munger-part3-safety-hero.webp',
  'masters-munger-4':       '/images/content/masters-charlie-munger-part4-leverage-hero.webp',
  'masters-munger-5':       '/images/content/masters-charlie-munger-part5-compounding-hero.webp',
};

const BEGINNER_ORDER = [
  'investing-101-beginner-w1-what-is-a-stock-really', 'investing-101-beginner-w2-how-the-market-actually-works',
  'investing-101-beginner-w3-opening-your-first-brokerage-account', 'investing-101-beginner-w4-reading-income-statement',
  'investing-101-beginner-w5-reading-balance-sheet', 'investing-101-beginner-w6-reading-cash-flow-statement',
  'investing-101-beginner-w7-what-is-a-business-model', 'investing-101-beginner-w8-valuation-basics',
  'investing-101-beginner-w9-dividends-and-total-return', 'investing-101-beginner-w10-diversification-portfolio-basics',
  'investing-101-beginner-w11-investors-mind', 'investing-101-beginner-w12-your-first-five-years',
];

const INTERMEDIATE_ORDER = [
  'investing-101-intermediate-w13-three-valuations', 'investing-101-intermediate-w14-dcf-lies',
  'investing-101-intermediate-w15-multiples', 'investing-101-intermediate-w16-five-moats',
  'investing-101-intermediate-w17-moat-erosion', 'investing-101-intermediate-w18-new-tech-moats',
  'investing-101-intermediate-w19-10k-forensics', 'investing-101-intermediate-w20-earnings-calls',
  'investing-101-intermediate-w21-proxy-statements', 'investing-101-intermediate-w22-position-sizing',
  'investing-101-intermediate-w23-correlation-risk', 'investing-101-intermediate-w24-when-to-sell',
];

const QUANTUM_ORDER = [
  'quantum-101-part1-superconducting-qubits', 'quantum-101-part2-trapped-ion', 'quantum-101-part3-neutral-atom',
  'quantum-101-part4-photonic', 'quantum-101-part5-silicon-spin', 'quantum-101-part6-topological',
  'quantum-101-part7-quantum-annealing', 'quantum-101-part8-software-cloud', 'quantum-101-part9-quantum-security',
  'quantum-101-part10-quantum-applications', 'quantum-101-part11-investing-framework', 'quantum-101-part12-watchlist',
];

const MASTERS_ORDER = [
  'masters-livermore', 'masters-druckenmiller',
  'masters-lynch-1', 'masters-lynch-2', 'masters-lynch-3', 'masters-lynch-4', 'masters-lynch-5',
  'masters-munger-1', 'masters-munger-2', 'masters-munger-3', 'masters-munger-4', 'masters-munger-5',
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

function isMasters(slug: string) { return slug.startsWith('masters-'); }
function isIntermediate(slug: string) { return slug.startsWith('investing-101-intermediate'); }
function isQuantum(slug: string) { return slug.startsWith('quantum-101-'); }

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

export const dynamicParams = true;
export const revalidate = 86400;

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
  const quantum = isQuantum(slug);
  const inter = isIntermediate(slug);
  const masters = isMasters(slug);
  const seriesLabel = masters ? 'The Masters' : quantum ? 'Quantum Computing 101' : inter ? 'Investing 101 Intermediate' : 'Investing 101 Beginner';
  const today = todayKST();
  const isFuture = (inter || quantum) && fm.publishDate && fm.publishDate > today;
  const ogW = quantum ? 1920 : 1672;
  const ogH = quantum ? 1080 : 941;
  return {
    title: `${fm.title} | ${seriesLabel}`,
    description: fm.description,
    alternates: { canonical: `${BASE}/learn/${slug}` },
    openGraph: {
      title: fm.title, description: fm.description,
      type: 'article', publishedTime: fm.publishDate,
      url: `${BASE}/learn/${slug}`,
      images: [{ url: ogImage, width: ogW, height: ogH }],
    },
    twitter: { card: 'summary_large_image', title: fm.title, description: fm.description, images: [ogImage] },
    ...(isFuture ? { robots: { index: false, follow: true } } : {}),
  };
}

function processInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#F0F0EC;padding:2px 6px;font-family:var(--mono);font-size:0.88em;color:#16161A">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2D2F8F;text-decoration:underline">$1</a>');
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
  let inCodeFence = false;
  let codeFenceLines: string[] = [];

  const flushTable = () => {
    if (tableRows.length < 2) { tableRows = []; return; }
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2);
    elements.push(
      <div key={key++} style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--mono)' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  padding: '8px 12px', borderBottom: '2px solid #E8E8E4',
                  background: '#FAFAF8', color: '#5B6470',
                  textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap'
                }} dangerouslySetInnerHTML={{ __html: processInline(h.trim()) }} />
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '7px 12px', borderBottom: '1px solid #F0F0EC', color: '#374151'
                  }} dangerouslySetInnerHTML={{ __html: processInline(cell.trim()) }} />
                ))}
              </tr>
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
      <blockquote key={key++} style={{
        margin: '24px 0', paddingLeft: 20,
        borderLeft: '2px solid #16161A'
      }}>
        {blockquoteLines.map((l, i) => (
          <p key={i} style={{
            margin: 0, fontFamily: 'var(--serif)', fontSize: 18,
            fontWeight: 300, fontStyle: 'italic', color: '#16161A',
            lineHeight: 1.6, letterSpacing: '-0.01em'
          }} dangerouslySetInnerHTML={{ __html: processInline(l) }} />
        ))}
      </blockquote>
    );
    blockquoteLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    elements.push(
      <ul key={key++} style={{ margin: '8px 0 16px 0', paddingLeft: 20 }}>
        {listItems.map((item, i) => (
          <li key={i} style={{
            fontFamily: 'var(--sans)', fontSize: 15, color: '#374151',
            lineHeight: 1.85, marginBottom: 4
          }} dangerouslySetInnerHTML={{ __html: processInline(item) }} />
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeFence) {
        elements.push(
          <pre key={key++} style={{
            background: '#FAFAF8', border: '1px solid #E8E8E4',
            padding: '16px 18px', overflowX: 'auto', margin: '20px 0',
            fontFamily: 'var(--mono)', fontSize: 13, color: '#374151', lineHeight: 1.7
          }}>
            <code>{codeFenceLines.join('\n')}</code>
          </pre>
        );
        codeFenceLines = [];
        inCodeFence = false;
      } else {
        if (inTable) { inTable = false; flushTable(); }
        if (inBlockquote) { flushBlockquote(); inBlockquote = false; }
        if (inList) { flushList(); inList = false; }
        inCodeFence = true;
      }
      continue;
    }
    if (inCodeFence) { codeFenceLines.push(line); continue; }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inBlockquote) { flushBlockquote(); inBlockquote = false; }
      if (inList) { flushList(); inList = false; }
      inTable = true;
      const cells = line.split('|').slice(1, -1);
      if (!cells.every(c => /^[\s:-]+$/.test(c))) tableRows.push(cells);
      else tableRows.push(cells);
      continue;
    } else if (inTable) { inTable = false; flushTable(); }

    if (line.startsWith('> ')) {
      if (inList) { flushList(); inList = false; }
      inBlockquote = true;
      blockquoteLines.push(line.slice(2));
      continue;
    } else if (inBlockquote) { flushBlockquote(); inBlockquote = false; }

    if (line.match(/^[-*] /)) {
      inList = true;
      listItems.push(line.slice(2));
      continue;
    } else if (inList && line.trim() === '') {
      flushList(); inList = false;
    } else if (inList) { flushList(); inList = false; }

    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      elements.push(
        <figure key={key++} style={{ margin: '28px 0', overflow: 'hidden', border: '1px solid #E8E8E4' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
        </figure>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} style={{
          fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400,
          color: '#16161A', margin: '40px 0 16px', lineHeight: 1.2, letterSpacing: '-0.02em'
        }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} style={{
          fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500,
          color: '#16161A', margin: '36px 0 14px',
          paddingBottom: 10, borderBottom: '1px solid #E8E8E4',
          letterSpacing: '-0.01em'
        }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} style={{
          fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500,
          color: '#2D2F8F', margin: '28px 0 10px', letterSpacing: '-0.01em'
        }}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={key++} style={{
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
          color: '#5B6470', margin: '20px 0 8px', letterSpacing: 1.5, textTransform: 'uppercase'
        }}>
          {line.slice(5)}
        </h4>
      );
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid #E8E8E4', margin: '32px 0' }} />);
    } else if (line.trim() === '') {
      // skip
    } else {
      elements.push(
        <p key={key++} style={{
          fontFamily: 'var(--sans)', fontSize: 16, color: '#374151',
          lineHeight: 1.9, margin: '0 0 14px'
        }}
          dangerouslySetInnerHTML={{ __html: processInline(line) }}
        />
      );
    }
  }

  if (inTable) flushTable();
  if (inBlockquote) flushBlockquote();
  if (inList) flushList();
  if (inCodeFence && codeFenceLines.length) {
    elements.push(
      <pre key={key++} style={{
        background: '#FAFAF8', border: '1px solid #E8E8E4',
        padding: '16px 18px', overflowX: 'auto', margin: '20px 0',
        fontFamily: 'var(--mono)', fontSize: 13, color: '#374151', lineHeight: 1.7
      }}>
        <code>{codeFenceLines.join('\n')}</code>
      </pre>
    );
  }

  return elements;
}

export default async function LearnLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);

  if (!lesson) notFound();

  const { fm, body } = lesson;
  const heroSrc = HERO_MAP[slug];
  const inter = isIntermediate(slug);
  const quantum = isQuantum(slug);
  const masters = isMasters(slug);
  if ((quantum || inter) && fm.publishDate && fm.publishDate > todayKST()) notFound();

  const ORDER = masters ? MASTERS_ORDER : quantum ? QUANTUM_ORDER : inter ? INTERMEDIATE_ORDER : BEGINNER_ORDER;
  const seriesIndex = ORDER.indexOf(slug);
  const prevSlug = seriesIndex > 0 ? ORDER[seriesIndex - 1] : null;
  const nextSlug = seriesIndex < ORDER.length - 1 ? ORDER[seriesIndex + 1] : null;
  const seriesTotal = inter ? 24 : 12;
  const seriesIndexPage = masters ? '/learn' : quantum ? '/learn/quantum-101' : inter ? '/learn/investing-101-intermediate' : '/learn/investing-101-beginner';
  const seriesBadgeLabel = masters ? 'THE MASTERS' : quantum ? 'QUANTUM 101' : inter ? 'INVESTING 101 INTERMEDIATE' : 'INVESTING 101 BEGINNER';
  const seriesLineLabel = masters ? 'The Masters — Investor Biographies' : quantum ? 'Quantum Computing 101' : inter ? 'Investing 101 — Intermediate Series' : 'Investing 101 — Beginner Series';
  const partLabel = (quantum || masters) ? 'PART' : 'WEEK';
  const seriesColor = masters ? '#B5860D' : quantum ? '#5B3FB5' : inter ? '#2D2F8F' : '#2A7A4C';

  const prevLesson = prevSlug ? getLesson(prevSlug) : null;
  const nextLesson = nextSlug ? getLesson(nextSlug) : null;

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: fm.title, description: fm.description,
    datePublished: fm.publishDate,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
    isPartOf: { '@type': 'Course', name: fm.series },
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 28px 80px' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
          fontFamily: 'var(--mono)', fontSize: 10, color: '#8A929C', flexWrap: 'wrap'
        }}>
          <Link href="/learn" style={{ color: '#8A929C', textDecoration: 'none' }}>Academy</Link>
          <span>/</span>
          <Link href={seriesIndexPage} style={{ color: '#8A929C', textDecoration: 'none' }}>{seriesLineLabel}</Link>
          <span>/</span>
          <span>{(quantum || masters) ? 'Part' : 'Week'} {fm.week}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
              padding: '3px 8px', border: `1px solid ${seriesColor}40`,
              color: seriesColor, letterSpacing: 1
            }}>
              {seriesBadgeLabel}
            </span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, padding: '3px 8px',
              border: '1px solid #E8E8E4', color: '#8A929C', letterSpacing: 1
            }}>
              {partLabel} {fm.week} / {seriesTotal}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4.5vw, 38px)',
            fontWeight: 400, color: '#16161A', margin: '0 0 16px',
            lineHeight: 1.2, letterSpacing: '-0.02em'
          }}>
            {fm.title}
          </h1>

          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#5B6470', lineHeight: 1.7, margin: '0 0 16px' }}>
            {fm.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--mono)', fontSize: 10, color: '#B0B8C1' }}>
            <span>{fm.readingTime}</span>
            <span>·</span>
            <span style={{ color: '#8A929C' }}>By DHLM Studio</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32, padding: '14px 18px', border: '1px solid #E8E8E4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: seriesColor, letterSpacing: 1 }}>
              SERIES PROGRESS
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#8A929C' }}>
              {quantum ? 'P' : 'W'}{fm.week} / {seriesTotal}
            </span>
          </div>
          <div style={{ height: 2, background: '#F0F0EC', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(fm.week / seriesTotal) * 100}%`,
              background: seriesColor, transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Hero image */}
        {heroSrc && (
          <div style={{ marginBottom: 40, overflow: 'hidden', border: '1px solid #E8E8E4' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroSrc} alt={fm.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        {/* Body */}
        <div style={{ lineHeight: 1.9 }}>
          {renderMarkdown(body)}
        </div>

        {/* Tags */}
        {fm.tags && fm.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 32 }}>
            {fm.tags.map((tag: string) => (
              <span key={tag} style={{
                fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600,
                padding: '3px 8px', border: '1px solid #E8E8E4', color: '#8A929C', letterSpacing: 1
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #E8E8E4', margin: '40px 0' }} />

        {/* Prev / Next navigation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: prevLesson ? (nextLesson ? '1fr 1fr' : '1fr') : (nextLesson ? '1fr' : 'none'),
          gap: 12, marginBottom: 32
        }}>
          {prevLesson && (
            <Link href={`/learn/${prevSlug}`} style={{
              textDecoration: 'none', padding: '16px 18px',
              border: '1px solid #E8E8E4', display: 'block'
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8A929C', marginBottom: 6, letterSpacing: 1 }}>
                ← {partLabel} {prevLesson.fm.week}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: '#16161A', lineHeight: 1.4 }}>
                {prevLesson.fm.title}
              </div>
            </Link>
          )}
          {nextLesson && (
            <Link href={`/learn/${nextSlug}`} style={{
              textDecoration: 'none', padding: '16px 18px',
              border: '1px solid #E8E8E4', display: 'block',
              textAlign: prevLesson ? 'right' : 'left'
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8A929C', marginBottom: 6, letterSpacing: 1 }}>
                {partLabel} {nextLesson.fm.week} →
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: '#16161A', lineHeight: 1.4 }}>
                {nextLesson.fm.title}
              </div>
            </Link>
          )}
        </div>

        {/* Back links */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href={seriesIndexPage} style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#2D2F8F', textDecoration: 'none' }}>
            ← Series Index
          </Link>
          <Link href="/learn" style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#8A929C', textDecoration: 'none' }}>
            ← DHLM Studio Academy
          </Link>
        </div>

        <ContentDisclaimer />

      </article>
    </div>
  );
}
