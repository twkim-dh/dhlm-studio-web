import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentDisclaimer from '@/components/ContentDisclaimer';
import ContentSources from '@/components/ContentSources';
import fs from 'fs';
import path from 'path';
import LikeButton from '@/components/LikeButton';
import { fmtDateLong } from '@/lib/fmt-date';
import ListenButton from '@/components/ListenButton';
import ReportPDF from '@/components/ReportPDF';

import TickerLogo from '@/components/TickerLogo';
import BeafRadarChart, { type BeafAxisScore } from '@/components/BeafRadarChart';
import unsplashManifest from '@/data/unsplash-manifest.json';

const REPORTS_DIR = path.join(process.cwd(), 'src/content/reports');

interface FaqItem { q: string; a: string }

interface ReportFrontmatter {
  title: string;
  slug: string;
  ticker: string;
  date: string;
  readTime: string;
  category: string;
  catColor: string;
  grade: string;
  beafScore: number;
  description: string;
  // Optional SEO + cross-link fields (added April 2026)
  seoTitle?: string;
  seoDescription?: string;
  relatedSlugs?: string[];
  faqs?: FaqItem[];
  heroImage?: string;
  // Hot Sector / Hidden Gem report support (April 8, 2026 — PART 2-7)
  /** "deep-dive" (default) | "hot-sector" | "hidden-gem" */
  type?: string;
  /** Alternative to type — some reports use badge instead of type */
  badge?: string;
  /** For hot-sector reports: covered industry e.g. "Energy" */
  sector?: string;
  /** For hot-sector reports: array of tickers covered */
  tickers?: string[];
  /** Primary sources cited in this report */
  sources?: string[];
}

function parseMarkdown(content: string): { frontmatter: ReportFrontmatter; body: string } {
  // Normalize CRLF → LF so Windows-saved files parse correctly
  const normalised = content.replace(/\r\n/g, '\n');
  const fmMatch = normalised.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return { frontmatter: {} as ReportFrontmatter, body: normalised };

  const fmLines = fmMatch[1].split('\n');
  const fm: Record<string, unknown> = {};
  fmLines.forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) return;
    const key = m[1];
    let raw = m[2].trim();
    // JSON array / object
    if (raw.startsWith('[') || raw.startsWith('{')) {
      try { fm[key] = JSON.parse(raw); return; } catch { /* fall through */ }
    }
    // Quoted string
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      raw = raw.slice(1, -1);
      fm[key] = raw;
      return;
    }
    // Number
    if (raw !== '' && !isNaN(Number(raw))) { fm[key] = Number(raw); return; }
    fm[key] = raw;
  });

  return { frontmatter: fm as unknown as ReportFrontmatter, body: fmMatch[2] };
}

export const revalidate = 3600;
export const dynamicParams = true;

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

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function generateStaticParams() {
  const today = todayKST();
  return getReportSlugs().filter(slug => {
    try {
      const content = fs.readFileSync(path.join(REPORTS_DIR, `${slug}.md`), 'utf8');
      const m = content.match(/^date:\s*"?([^"\n]+)"?/m);
      if (!m) return true;
      return m[1].trim().slice(0, 10) <= today;
    } catch { return true; }
  }).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = getReport(slug);
  // 404 case: explicit noindex so Google does not soft-404 a missing report
  if (!report) return { title: 'Report Not Found', robots: { index: false, follow: false } };
  const fm = report.frontmatter;
  const title = fm.seoTitle || `${fm.title} | DHLM Studio`;
  const description = fm.seoDescription || fm.description;
  const url = `https://dhlm-studio.com/reports/${slug}`;
  // Use Unsplash hero image as og:image if present in manifest
  const manifest = unsplashManifest as Record<string, { src: string }>;
  const BASE = 'https://dhlm-studio.com';
  const rawImage = manifest[slug]?.src || fm.heroImage;
  // Ensure absolute URL — relative paths (e.g. /images/...) won't work for Twitter cards
  const ogImage = rawImage
    ? rawImage.startsWith('http') ? rawImage : `${BASE}${rawImage}`
    : `${BASE}/opengraph-image`; // fallback: branded "Brutal Edge" OG image
  const isLocalPng = rawImage && !rawImage.startsWith('http') && rawImage.endsWith('.png');
  const [ogW, ogH] = isLocalPng ? [1536, 1024] : [1200, 630];
  const images = [{ url: ogImage, width: ogW, height: ogH }];
  return {
    title: title.includes('DHLM Studio') ? title : `${title} | DHLM Studio`,
    description,
    // Self-canonical — every report points to itself, not to the site root.
    // Without this, Google inherits the layout.tsx root canonical and
    // judges every report as a near-duplicate of the home page (Soft 404).
    alternates: { canonical: url },
    openGraph: { title, description, type: 'article', publishedTime: fm.date, url, images },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

/** Extract BEAF axis scores from report body markdown.
 *  Looks for: | **AXIS** | SCORE | MAX | Evidence |
 *  Returns null if no BEAF table found (e.g. hot-sector reports). */
function parseBeafScores(body: string): BeafAxisScore[] | null {
  const AXES = ['GROWTH', 'PROFITABILITY', 'MOAT', 'VALUATION', 'RISK', 'MOMENTUM'];
  const scores: BeafAxisScore[] = [];
  for (const axis of AXES) {
    // Match line like: | **GROWTH** | 22 | 25 | ...
    const re = new RegExp(`\\|\\s*\\*\\*${axis}\\*\\*\\s*\\|\\s*(\\d+)\\s*\\|\\s*(\\d+)\\s*\\|`);
    const m = body.match(re);
    if (!m) return null;
    const raw = Number(m[1]);
    const max = Number(m[2]);
    scores.push({ axis, score: max > 0 ? Math.round((raw / max) * 100) : 0, raw, max });
  }
  return scores.length > 0 ? scores : null;
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
  // Block future-dated reports from direct URL access (KST-based)
  if (String(fm.date || '').slice(0, 10) > todayKST()) notFound();
  const beafScores = parseBeafScores(body);

  // Manifest-first hero image — Unsplash CDN overwrites generic static fallback
  const unsplashEntry = (unsplashManifest as Record<string, { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null }>)[slug];
  const heroSrc = unsplashEntry?.src || fm.heroImage;
  const heroAlt = unsplashEntry?.alt || fm.title;

  // Article schema
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: fm.seoTitle || fm.title,
    description: fm.seoDescription || fm.description,
    datePublished: fm.date,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
  };

  // FAQPage schema (only if FAQs present)
  const faqLd = fm.faqs && fm.faqs.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: fm.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  // Resolve related reports (titles from disk)
  const related = (fm.relatedSlugs || [])
    .map(s => {
      const r = getReport(s);
      return r ? { slug: s, ticker: r.frontmatter.ticker, title: r.frontmatter.title, grade: r.frontmatter.grade, score: r.frontmatter.beafScore } : null;
    })
    .filter(Boolean) as { slug: string; ticker: string; title: string; grade: string; score: number }[];

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
        {/* DHLM masthead — only visible in print */}
        <div className="print-masthead" style={{ display: 'none' }}>
          <div>
            <div className="print-masthead-brand">DHLM STUDIO</div>
            <div className="print-masthead-sub">Brutal Edge™ Analysis</div>
          </div>
          <div className="print-masthead-url">dhlm-studio.com<br />Market Intelligence</div>
        </div>

        <Link href="/reports" className="print-hide" style={{ fontSize: 12, color: '#64748B' }}>← Reports</Link>

        {/* Brutal Edge Header — type-aware */}
        {(() => {
          const isHotSector = fm.type === 'hot-sector' || fm.type === 'hidden-gem';
          const isSpecialReport = fm.type === 'special-report';
          const headerLabel = isHotSector
            ? (fm.type === 'hidden-gem' ? 'BRUTAL EDGE™ HIDDEN GEM' : 'BRUTAL EDGE™ HOT SECTOR')
            : isSpecialReport
              ? 'BRUTAL EDGE™ SPECIAL REPORT'
              : 'BRUTAL EDGE™ DEEP DIVE';
          const headerColor = isHotSector ? '#D4A843' : isSpecialReport ? '#A78BFA' : '#C73E3A';
          return (
            <div className="print-hide" style={{ marginTop: 20, padding: '20px 22px', borderRadius: 14, background: `linear-gradient(135deg, ${headerColor}10, ${headerColor}05)`, border: `1px solid ${headerColor}30`, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🔥</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: headerColor, letterSpacing: 2 }}>{headerLabel}</span>
                {isHotSector && fm.sector && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#0D1117', color: '#94A3B8', marginLeft: 'auto' }}>{fm.sector}</span>}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic' }}>Data-driven. Zero feelings. No BS.</div>
              {isHotSector && Array.isArray(fm.tickers) && fm.tickers.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  {fm.tickers.map(t => (
                    <div key={t} style={{
                      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      padding: '10px 14px', borderRadius: 10,
                      background: '#0D1117', border: '1px solid #1E293B',
                      minWidth: 64,
                    }}>
                      <TickerLogo ticker={t} size={36} />
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#60A5FA' }}>{t}</span>
                    </div>
                  ))}
                </div>
              )}
              {!isHotSector && fm.ticker && (
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <TickerLogo ticker={fm.ticker} size={56} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color: '#60A5FA', letterSpacing: 0.5 }}>{fm.ticker}</span>
                    <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--sans)' }}>Brutal Edge™ analyzed</span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Editor Reviewed Badge */}
        <div className="print-hide" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 6, background: '#00D47412', color: '#00D474', border: '1px solid #00D47425' }}>✓ Editor Reviewed</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 6, background: '#3B82F612', color: '#3B82F6', border: '1px solid #3B82F625' }}>✓ Data Verified</span>
          {(!fm.type || fm.type === 'deep-dive') && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 6, background: '#D4A84312', color: '#D4A843', border: '1px solid #D4A84325' }}>✓ BEAF Scored</span>
          )}
        </div>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${fm.catColor}14`, color: fm.catColor }}>{fm.category}</span>
            {/* BEAF badge: shown only for deep-dive reports that have a score. Guards against missing score and non-deep-dive badge types. */}
            {(fm.type === 'deep-dive' || fm.badge === 'deep-dive') && fm.beafScore && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>BEAF: {fm.beafScore}/100 ({fm.grade})</span>
            )}
            <span style={{ fontSize: 11, color: '#475569' }}>Published {fmtDateLong(fm.date)} · {fm.readTime} read</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, margin: 0 }}>{fm.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#475569' }}>By</span>
            <Link href="/editorial" style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>Brutal Edge Editorial</Link>
            <span style={{ fontSize: 12, color: '#334155' }}>·</span>
            <Link href="/editorial#beaf" style={{ fontSize: 11, color: '#64748B', textDecoration: 'none' }}>Reviewed against BEAF Framework</Link>
          </div>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>{fm.description}</p>
          <div className="print-hide" style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <ListenButton text={body} />
            <ReportPDF
              slug={slug}
              title={fm.title}
              date={fm.date}
              description={fm.description}
              category={fm.category}
              ticker={fm.ticker}
              beafScore={fm.beafScore}
              grade={fm.grade}
              type={fm.type}
              body={body}
            />
            <LikeButton pageId={`report-${slug}`} />
          </div>
        </div>

        {/* Hero Image */}
        {heroSrc && (
          <div style={{ margin: '24px 0' }}>
            <div style={{ background: '#0f172a', borderRadius: 12, overflow: 'hidden', border: '1px solid #1E293B' }}>
              <Image
                src={heroSrc}
                alt={heroAlt}
                width={1200}
                height={800}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            {unsplashEntry?.credit && (
              <div style={{ padding: '3px 8px', textAlign: 'right' }}>
                <span style={{ fontSize: 9, color: '#334155' }}>
                  Photo by <a href={unsplashEntry.credit.authorUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>{unsplashEntry.credit.author}</a> on <a href={unsplashEntry.credit.unsplashUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>Unsplash</a>
                </span>
              </div>
            )}
          </div>
        )}

        {/* BEAF Radar Chart — only for deep-dive reports with sub-scores */}
        {beafScores && beafScores.length > 0 && (fm.type === 'deep-dive' || fm.badge === 'deep-dive') && (
          <BeafRadarChart scores={beafScores} totalScore={fm.beafScore} grade={fm.grade} />
        )}

        {/* Body */}
        <div>{renderMarkdown(body)}</div>

        {/* FAQ Section */}
        {fm.faqs && fm.faqs.length > 0 && (
          <section style={{ marginTop: 40, padding: '24px 22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#3B82F6', letterSpacing: 2, marginBottom: 14 }}>📋 FREQUENTLY ASKED QUESTIONS</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#E2E8F0', margin: '0 0 18px' }}>About {fm.ticker}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {fm.faqs.map((f, i) => (
                <div key={i}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', lineHeight: 1.5, marginBottom: 6 }}>Q. {f.q}</div>
                  <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>{f.a}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Print-only footer */}
        <div className="print-footer" style={{ display: 'none', marginTop: 48, paddingTop: 12, borderTop: '1px solid #d1d5db', fontFamily: 'Arial, sans-serif', fontSize: 8, color: '#888', textAlign: 'center', lineHeight: 1.8 }}>
          dhlm-studio.com &nbsp;·&nbsp; For informational and educational purposes only &nbsp;·&nbsp; NOT investment advice<br />
          © DHLM Studio {new Date(fm.date).getFullYear()} &nbsp;·&nbsp; Brutal Edge™ Analysis &nbsp;·&nbsp; All rights reserved
        </div>

        {/* Related Reports */}
        {related.length > 0 && (
          <section className="print-hide" style={{ marginTop: 32 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 12 }}>🔗 RELATED DEEP DIVES</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {related.map(r => (
                <Link key={r.slug} href={`/reports/${r.slug}`} style={{ display: 'block', padding: '14px 16px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 800, color: '#60A5FA' }}>{r.ticker}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#D4A843', fontWeight: 700 }}>BEAF {r.score} · {r.grade}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>{r.title.replace(/^Deep Dive:\s*/, '')}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {fm.sources && fm.sources.length > 0 && (
          <ContentSources sources={fm.sources} />
        )}

        <ContentDisclaimer />

        {/* Subscribe text link */}
        <div className="print-hide" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1E293B', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>Subscribe to Brutal Edge Weekly →</a>
        </div>

        {/* Brutal Edge Footer */}
        <div className="print-hide" style={{ marginTop: 40, padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 6 }}>🔥 ANALYZED BY BRUTAL EDGE™</div>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>DHLM Studio Analysis Engine</div>
          <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>
            Analysis under editorial oversight, for informational and educational purposes.<br />
            Data: Financial Modeling Prep, Alpha Vantage, CoinGecko<br />
            NOT investment advice. Always do your own research.
          </div>
        </div>
      </article>
    </div>
  );
}
