import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentDisclaimer from '@/components/ContentDisclaimer';
import ContentSources from '@/components/ContentSources';
import fs from 'fs';
import path from 'path';
import { fmtDateLong } from '@/lib/fmt-date';
import ReportPDF from '@/components/ReportPDF';
import TickerLogo from '@/components/TickerLogo';
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
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedSlugs?: string[];
  faqs?: FaqItem[];
  heroImage?: string;
  type?: string;
  badge?: string;
  sector?: string;
  tickers?: string[];
  sources?: string[];
  dataAsOf?: string;
  updatedDate?: string;
}

function parseMarkdown(content: string): { frontmatter: ReportFrontmatter; body: string } {
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
    if (raw.startsWith('[') || raw.startsWith('{')) {
      try { fm[key] = JSON.parse(raw); return; } catch { /* fall through */ }
    }
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      raw = raw.slice(1, -1);
      fm[key] = raw;
      return;
    }
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
  if (!report) return { title: 'Report Not Found', robots: { index: false, follow: false } };
  const fm = report.frontmatter;
  const title = fm.seoTitle || `${fm.title} | DHLM Studio`;
  const description = fm.seoDescription || fm.description;
  const url = `https://dhlm-studio.com/reports/${slug}`;
  const manifest = unsplashManifest as Record<string, { src: string }>;
  const BASE = 'https://dhlm-studio.com';
  const rawImage = manifest[slug]?.src || fm.heroImage;
  const ogImage = rawImage
    ? rawImage.startsWith('http') ? rawImage : `${BASE}${rawImage}`
    : `${BASE}/opengraph-image`;
  const isLocalPng = rawImage && !rawImage.startsWith('http') && rawImage.endsWith('.png');
  const [ogW, ogH] = isLocalPng ? [1536, 1024] : [1200, 630];
  const images = [{ url: ogImage, width: ogW, height: ogH }];
  return {
    title: title.includes('DHLM Studio') ? title : `${title} | DHLM Studio`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: 'article', publishedTime: fm.date, url, images },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

function processInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2D2F8F;text-decoration:underline">$1</a>');
}

function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let key = 0;

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
                  color: '#5B6470', textAlign: i === 0 ? 'left' : 'right',
                  fontWeight: 700, background: '#FAFAF8'
                }}>
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '7px 12px', borderBottom: '1px solid #F0F0EC',
                    color: '#374151', textAlign: ci === 0 ? 'left' : 'right'
                  }}
                    dangerouslySetInnerHTML={{ __html: processInline(cell.trim()) }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  lines.forEach(line => {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      const cells = line.split('|').filter(c => c.trim() !== '');
      tableRows.push(cells);
      return;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} style={{
          fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500,
          color: '#16161A', margin: '40px 0 14px',
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
    } else if (line.trim() === '') {
      // skip
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid #E8E8E4', margin: '28px 0' }} />);
    } else {
      elements.push(
        <p key={key++} style={{
          fontFamily: 'var(--sans)', fontSize: 15, color: '#374151',
          lineHeight: 1.9, margin: '0 0 14px'
        }}
          dangerouslySetInnerHTML={{ __html: processInline(line) }}
        />
      );
    }
  });

  if (inTable) flushTable();
  return elements;
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = getReport(slug);

  if (!report) notFound();

  const { frontmatter: fm, body } = report;
  if (String(fm.date || '').slice(0, 10) > todayKST()) notFound();

  const unsplashEntry = (unsplashManifest as Record<string, { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null }>)[slug];
  const heroSrc = unsplashEntry?.src || fm.heroImage;
  const heroAlt = unsplashEntry?.alt || fm.title;

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: fm.seoTitle || fm.title,
    description: fm.seoDescription || fm.description,
    datePublished: fm.date,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
  };

  const faqLd = fm.faqs && fm.faqs.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: fm.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  const related = (fm.relatedSlugs || [])
    .map(s => {
      const r = getReport(s);
      return r ? { slug: s, ticker: r.frontmatter.ticker, title: r.frontmatter.title } : null;
    })
    .filter(Boolean) as { slug: string; ticker: string; title: string }[];

  const isHotSector = fm.type === 'hot-sector' || fm.type === 'hidden-gem';
  const isSpecialReport = fm.type === 'special-report';
  const headerLabel = isHotSector
    ? (fm.type === 'hidden-gem' ? 'HIDDEN GEM' : 'HOT SECTOR')
    : isSpecialReport
      ? 'RESEARCH NOTE'
      : 'DEEP DIVE';
  const headerColor = isHotSector ? '#B5860D' : isSpecialReport ? '#6D5BE0' : '#2D2F8F';

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 28px 80px' }}>

        {/* Print masthead — only visible in print */}
        <div className="print-masthead" style={{ display: 'none' }}>
          <div>
            <div className="print-masthead-brand">DHLM STUDIO</div>
            <div className="print-masthead-sub">DHLM Studio Research</div>
          </div>
          <div className="print-masthead-url">dhlm-studio.com<br />Market Intelligence</div>
        </div>

        {/* Back link */}
        <Link href="/reports" className="print-hide" style={{
          fontFamily: 'var(--mono)', fontSize: 11, color: '#8A929C',
          letterSpacing: 1, textDecoration: 'none'
        }}>
          ← Reports
        </Link>

        {/* Report type header — editorial */}
        <div className="print-hide" style={{ marginTop: 32, marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            color: headerColor, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 16
          }}>
            {headerLabel}
            {isHotSector && fm.sector && (
              <span style={{ marginLeft: 12, color: '#8A929C', fontWeight: 500 }}>· {fm.sector}</span>
            )}
          </div>

          {/* Ticker logos */}
          {isHotSector && Array.isArray(fm.tickers) && fm.tickers.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
              {fm.tickers.map(t => (
                <div key={t} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <TickerLogo ticker={t} size={32} />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#2D2F8F' }}>{t}</span>
                </div>
              ))}
            </div>
          )}
          {!isHotSector && fm.ticker && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <TickerLogo ticker={fm.ticker} size={40} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: '#2D2F8F', letterSpacing: '0.04em' }}>{fm.ticker}</span>
            </div>
          )}
        </div>

        {/* Quality badges */}
        <div className="print-hide" style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600, padding: '4px 10px',
            border: '1px solid #E8E8E4', color: '#5B6470', borderRadius: 2, letterSpacing: 1
          }}>
            ✓ Editor Reviewed
          </span>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600, padding: '4px 10px',
            border: '1px solid #E8E8E4', color: '#5B6470', borderRadius: 2, letterSpacing: 1
          }}>
            ✓ Data Verified
          </span>
        </div>

        {/* Title block */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px',
              background: '#EBEBF8', color: '#2D2F8F', borderRadius: 2, letterSpacing: 0.5
            }}>
              {fm.category}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#B0B8C1', letterSpacing: 0.5 }}>
              {fmtDateLong(fm.date)} · {fm.readTime} read
              {fm.updatedDate && ` · Updated ${fmtDateLong(fm.updatedDate)}`}
              {fm.dataAsOf && ` · Data as of ${fm.dataAsOf}`}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 400,
            color: '#16161A',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {fm.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#8A929C', letterSpacing: 1 }}>
              By DHLM Studio
            </span>
          </div>

          <p style={{
            fontFamily: 'var(--sans)', fontSize: 15, color: '#5B6470',
            lineHeight: 1.7, marginTop: 14
          }}>
            {fm.description}
          </p>

          <div className="print-hide" style={{ marginTop: 16 }}>
            <ReportPDF
              slug={slug}
              title={fm.title}
              date={fm.date}
              description={fm.description}
              category={fm.category}
              ticker={fm.ticker}
              grade={fm.grade}
              type={fm.type}
              body={body}
            />
          </div>
        </div>

        {/* Hero Image */}
        {heroSrc && (
          <div style={{ margin: '0 0 40px' }}>
            <div style={{ overflow: 'hidden', border: '1px solid #E8E8E4' }}>
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
              <div style={{ padding: '4px 0', textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#B0B8C1' }}>
                  Photo by <a href={unsplashEntry.credit.authorUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#8A929C', textDecoration: 'none' }}>{unsplashEntry.credit.author}</a>{' '}
                  on <a href={unsplashEntry.credit.unsplashUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#8A929C', textDecoration: 'none' }}>Unsplash</a>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div>{renderMarkdown(body)}</div>

        {/* FAQ Section */}
        {fm.faqs && fm.faqs.length > 0 && (
          <section style={{
            marginTop: 48, padding: '24px 24px',
            border: '1px solid #E8E8E4', borderRadius: 2
          }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              color: '#2D2F8F', letterSpacing: 2, marginBottom: 16
            }}>
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400,
              color: '#16161A', margin: '0 0 20px', letterSpacing: '-0.01em'
            }}>
              About {fm.ticker}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {fm.faqs.map((f, i) => (
                <div key={i} style={{ paddingBottom: 20, borderBottom: i < fm.faqs!.length - 1 ? '1px solid #F0F0EC' : 'none' }}>
                  <div style={{
                    fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
                    color: '#16161A', lineHeight: 1.5, marginBottom: 8
                  }}>
                    {f.q}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#5B6470', lineHeight: 1.7 }}>
                    {f.a}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Print footer */}
        <div className="print-footer" style={{
          display: 'none', marginTop: 48, paddingTop: 12,
          borderTop: '1px solid #d1d5db', fontFamily: 'Arial, sans-serif',
          fontSize: 8, color: '#888', textAlign: 'center', lineHeight: 1.8
        }}>
          dhlm-studio.com · For informational and educational purposes only · NOT investment advice<br />
          © DHLM Studio {new Date(fm.date).getFullYear()} · All rights reserved
        </div>

        {/* Related Reports */}
        {related.length > 0 && (
          <section className="print-hide" style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #E8E8E4' }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: '#8A929C',
              letterSpacing: 2, marginBottom: 20
            }}>
              RELATED REPORTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {related.map((r, i) => (
                <Link key={r.slug} href={`/reports/${r.slug}`} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '16px 0',
                  borderBottom: i < related.length - 1 ? '1px solid #F0F0EC' : 'none',
                  textDecoration: 'none', gap: 12
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                      color: '#2D2F8F', marginBottom: 4, letterSpacing: '0.04em'
                    }}>
                      {r.ticker}
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 15, color: '#16161A', lineHeight: 1.35 }}>
                      {r.title.replace(/^Deep Dive:\s*/, '')}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#B0B8C1', flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {fm.sources && fm.sources.length > 0 && (
          <ContentSources sources={fm.sources} />
        )}

        <ContentDisclaimer />

        {/* Footer */}
        <div className="print-hide" style={{
          marginTop: 48, paddingTop: 24,
          borderTop: '1px solid #E8E8E4', textAlign: 'center'
        }}>
          <Link href="/reports" style={{
            fontFamily: 'var(--sans)', fontSize: 13, color: '#2D2F8F',
            textDecoration: 'none'
          }}>
            ← Back to all reports
          </Link>
        </div>

        <div className="print-hide" style={{ marginTop: 32, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#B0B8C1', letterSpacing: 1.5 }}>
            DHLM STUDIO · INDEPENDENT INVESTOR ANALYSIS
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#B0B8C1', lineHeight: 1.6, marginTop: 8 }}>
            Informational and educational purposes only. Not investment advice.
            Always do your own research.
          </div>
        </div>

      </article>
    </div>
  );
}
