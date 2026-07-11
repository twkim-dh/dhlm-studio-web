import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ContentDisclaimer from '@/components/ContentDisclaimer';
import fs from 'fs';
import path from 'path';
import { fmtDateShort } from '@/lib/fmt-date';
import ReportPDF from '@/components/ReportPDF';

import unsplashManifest from '@/data/unsplash-manifest.json';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/research');

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

interface FaqItem { q: string; a: string }

interface ResearchFrontmatter {
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  badge?: string;
  date: string;
  readTime: string;
  verdict?: string;
  description: string;
  paperTitle?: string;
  paperAuthors?: string;
  paperYear?: number;
  paperInstitution?: string;
  paperAdvisor?: string;
  seoTitle?: string;
  seoDescription?: string;
  faqs?: FaqItem[];
  heroImage?: string;
}

function parseMd(content: string): { fm: ResearchFrontmatter; body: string } | null {
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm: Record<string, unknown> = {};
  for (const line of m[1].split('\n')) {
    const lm = line.match(/^(\w+):\s*(.+)$/);
    if (!lm) continue;
    let raw = lm[2].trim();
    if (raw.startsWith('[') || raw.startsWith('{')) {
      try { fm[lm[1]] = JSON.parse(raw); continue; } catch { /* ignore */ }
    }
    if (raw.startsWith('"') && raw.endsWith('"')) raw = raw.slice(1, -1);
    fm[lm[1]] = raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw;
  }
  return { fm: fm as unknown as ResearchFrontmatter, body: m[2] };
}

function getArticle(slug: string) {
  try {
    const fp = path.join(CONTENT_DIR, `${slug}.md`);
    if (!fs.existsSync(fp)) return null;
    return parseMd(fs.readFileSync(fp, 'utf8'));
  } catch { return null; }
}

export function generateStaticParams() {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const today = todayKST();
    return fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.md') && !f.startsWith('paper-vs-profit'))
      .map(f => f.replace(/\.md$/, ''))
      .filter(slug => {
        const a = getArticle(slug);
        if (!a) return true;
        const pubDate = (a.fm as unknown as Record<string, string>)['publishDate'] || a.fm.date;
        return pubDate <= today;
      })
      .map(slug => ({ slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: 'Not Found', robots: { index: false, follow: false } };
  const title = a.fm.seoTitle || a.fm.title;
  const description = a.fm.seoDescription || a.fm.description;
  const BASE = 'https://dhlm-studio.com';
  const rawHero = (unsplashManifest as Record<string, { src: string }>)[slug]?.src || a.fm.heroImage;
  const ogImage = rawHero
    ? (rawHero.startsWith('http') ? rawHero : `${BASE}${rawHero}`)
    : `${BASE}/opengraph-image`;
  return {
    title: title.includes('DHLM Studio') ? title : `${title} | DHLM Studio`,
    description,
    alternates: { canonical: `https://dhlm-studio.com/research/${slug}` },
    openGraph: { title, description, type: 'article', publishedTime: a.fm.date, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

function seriesColor(badge?: string) {
  if (badge === 'mental-game') return { fg: '#A78BFA', bg: '#7C3AED18', border: '#7C3AED40', label: 'THE MENTAL GAME' };
  if (badge === 'structural-view') return { fg: '#38BDF8', bg: '#0EA5E918', border: '#0EA5E940', label: 'THE STRUCTURAL VIEW' };
  return { fg: '#94A3B8', bg: '#1E293B18', border: '#1E293B40', label: 'RESEARCH' };
}

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
            <tr>{headers.map((h, i) => <th key={i} style={{ padding: '8px 10px', borderBottom: '2px solid #334155', borderRight: i < headers.length - 1 ? '1px solid #1E293B' : undefined, background: '#111827', color: '#94A3B8', textAlign: i === 0 ? 'left' : 'right', fontWeight: 700, whiteSpace: 'nowrap' }} dangerouslySetInnerHTML={{ __html: inline(h.trim()) }} />)}</tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: '6px 10px', borderBottom: '1px solid #1E293B', borderRight: ci < row.length - 1 ? '1px solid #1E293B' : undefined, color: '#E2E8F0', textAlign: ci === 0 ? 'left' : 'right' }} dangerouslySetInnerHTML={{ __html: inline(cell.trim()) }} />)}</tr>
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
      tableRows.push(line.split('|').filter(c => c.trim() !== ''));
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
      // skip blank lines
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid #1E293B', margin: '24px 0' }} />);
    } else {
      elements.push(<p key={key++} style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.9, margin: '0 0 12px' }} dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  }
  if (inTable) flushTable();
  return elements;
}

export default async function ResearchArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const today = todayKST();
  const publishDate = (a.fm as unknown as Record<string, string>)['publishDate'] || a.fm.date;
  if (publishDate > today) notFound();

  const fm = a.fm;
  const series = seriesColor(fm.badge);

  const unsplashEntry = (unsplashManifest as Record<string, { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null }>)[slug];
  const heroSrc = unsplashEntry?.src || fm.heroImage;

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: fm.seoTitle || fm.title,
    description: fm.seoDescription || fm.description,
    datePublished: fm.date,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
    ...(fm.paperTitle ? { citation: `${fm.paperAuthors} (${fm.paperYear}). ${fm.paperTitle}.` } : {}),
  };
  const faqLd = fm.faqs && fm.faqs.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: fm.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/research" style={{ fontSize: 12, color: '#64748B' }}>← The Mental Game</Link>

        <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 12, background: series.bg, border: `1px solid ${series.border}`, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>🧠</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: series.fg, letterSpacing: 2 }}>DHLM STUDIO — {series.label}</span>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: series.bg, color: series.fg, border: `1px solid ${series.border}` }}>{fm.category}</span>
            <span style={{ fontSize: 11, color: '#475569' }}>Published {fmtDateShort(fm.date)} · {fm.readTime}</span>
            {(fm as unknown as Record<string, string>).dataAsOf && <span style={{ fontSize: 11, color: '#475569' }}>· Data as of {(fm as unknown as Record<string, string>).dataAsOf}</span>}
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, margin: 0 }}>{fm.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#475569' }}>By</span>
            <Link href="/editorial" style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>DHLM Studio Team</Link>
            <span style={{ fontSize: 12, color: '#334155' }}>·</span>
            <Link href="/editorial#beaf" style={{ fontSize: 11, color: '#64748B', textDecoration: 'none' }}>Reviewed against Analysis Framework</Link>
          </div>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>{fm.description}</p>
          <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <ReportPDF title={fm.title} date={fm.date} description={fm.description} category={fm.category} body={a.body} />
          </div>
        </div>

        {heroSrc && (
          <div style={{ margin: '24px 0' }}>
            <div style={{ background: '#0f172a', borderRadius: 12, overflow: 'hidden', border: '1px solid #1E293B' }}>
              <Image
                src={heroSrc}
                alt={unsplashEntry?.alt || fm.title}
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

        {fm.paperTitle && (
          <div style={{ padding: '14px 18px', borderRadius: 12, background: '#0D1117', border: '1px solid #1E293B', marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, marginBottom: 6 }}>📄 SOURCE PAPER</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4, marginBottom: 4 }}>{fm.paperTitle}</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>{fm.paperAuthors} ({fm.paperYear}){fm.paperInstitution && ` · ${fm.paperInstitution}`}</div>
            {fm.paperAdvisor && <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Advisor: {fm.paperAdvisor}</div>}
          </div>
        )}

        <div>{renderMarkdown(a.body)}</div>

        {fm.faqs && fm.faqs.length > 0 && (
          <section style={{ marginTop: 40, padding: '24px 22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: series.fg, letterSpacing: 2, marginBottom: 14 }}>📋 FREQUENTLY ASKED QUESTIONS</div>
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

        <ContentDisclaimer />

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1E293B', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>Subscribe to DHLM Studio Weekly →</a>
        </div>

        <div style={{ marginTop: 40, padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: series.fg, letterSpacing: 2, marginBottom: 6 }}>🧠 DHLM STUDIO — {series.label}</div>
          <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>
            For informational and educational purposes only. Not financial advice.
          </div>
        </div>
      </article>
    </div>
  );
}
