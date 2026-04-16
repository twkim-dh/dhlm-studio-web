import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import FadeIn from '@/components/FadeIn';
import NewsletterCTA from '@/components/NewsletterCTA';
import TodayMarket from '@/components/TodayMarket';
import { blogPosts } from '@/data/blog-posts';
import TickerLogo from '@/components/TickerLogo';

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: 'DHLM Studio — Brutal Edge™ Market Intelligence',
  description: `Market data and analysis serious investors check before making a move. 3,000+ word Deep Dive reports with BEAF scoring. Real-time market intelligence. ${YEAR}.`,
  alternates: { canonical: 'https://dhlm-studio.com' },
};

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

/* ═══ Data helpers ═══ */
interface ReportMeta {
  title: string; slug: string; ticker: string; date: string; readTime: string;
  category: string; catColor: string; grade: string; beafScore: number;
  description: string; type?: string; tickers?: string[]; homeRank?: number;
}

/** Days since a date string (negative = future) */
function daysAgo(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000); }

function getAllReports(): ReportMeta[] {
  try {
    const dir = path.join(process.cwd(), 'src/content/reports');
    return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) return null;
      const fm: Record<string, unknown> = {};
      fmMatch[1].split('\n').forEach(line => {
        const m = line.match(/^(\w+):\s*(.+)$/);
        if (!m) return;
        let raw = m[2].trim();
        if (raw.startsWith('[') || raw.startsWith('{')) { try { fm[m[1]] = JSON.parse(raw); return; } catch { /* fall through */ } }
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1);
        fm[m[1]] = raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw;
      });
      return fm as unknown as ReportMeta;
    }).filter(Boolean).sort((a, b) => (b!.date > a!.date ? 1 : -1)) as ReportMeta[];
  } catch { return []; }
}

/** Max 2 featured reports with active badge (≤14 days old).
 *  Reports with homeRank are pinned first (lower number = higher priority);
 *  unranked reports fall back to date-desc ordering. */
function getFeatured(all: ReportMeta[]): ReportMeta[] {
  return all.filter(r =>
    (r.type === 'hot-sector' || r.type === 'hidden-gem' || r.type === 'special-report') &&
    daysAgo(r.date) <= 14
  ).sort((a, b) => {
    const ra = a.homeRank ?? 99, rb = b.homeRank ?? 99;
    if (ra !== rb) return ra - rb;
    return b.date > a.date ? 1 : -1;
  }).slice(0, 2);
}

/** Combined 4-item latest feed: reports + blog posts, sorted by date desc.
 *  featuredSlugs: slugs already shown in Featured Analysis — excluded to avoid duplicates. */
function getLatest(all: ReportMeta[], featuredSlugs: string[]) {
  const reports = all.filter(r => !featuredSlugs.includes(r.slug)).map(r => ({ kind: 'report' as const, slug: r.slug, title: r.title, date: r.date, readTime: r.readTime, description: r.description, category: r.category, catColor: r.catColor, ticker: r.ticker, grade: r.grade, beafScore: r.beafScore, type: r.type }));
  const posts = blogPosts.filter(p => !p.noindex).map(p => ({ kind: 'blog' as const, slug: p.slug, title: p.title, date: p.date, readTime: p.readTime, description: p.description, category: p.category, catColor: p.catColor, ticker: '', grade: '', beafScore: 0, type: undefined }));
  return [...reports, ...posts].sort((a, b) => b.date > a.date ? 1 : -1).slice(0, 4);
}

export default function Home() {
  const all = getAllReports();
  const featured = getFeatured(all);
  const latest = getLatest(all, featured.map(r => r.slug));

  return (
    <div style={{ background: '#0B0F19', color: '#F1F5F9', minHeight: '100vh' }}>

      {/* ── SECTION 1: HERO ── */}
      <section style={{ padding: '72px 24px 48px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 16 }}>DHLM STUDIO · BRUTAL EDGE™</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.15, letterSpacing: -1, margin: '0 0 20px' }}>
          Market data and analysis<br />serious investors check<br /><span style={{ color: '#00D474' }}>before making a move.</span>
        </h1>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/reports" style={{ display: 'inline-block', padding: '11px 22px', borderRadius: 8, background: '#C73E3A', color: '#fff', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Explore Reports
          </Link>
          <Link href="/daily" style={{ display: 'inline-block', padding: '11px 22px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Daily Brief
          </Link>
        </div>
      </section>

      {/* ── SECTION 2: TODAY'S MARKET ── */}
      <div style={{ height: 16 }} />
      <TodayMarket />

      {/* ── SECTION 3: FEATURED (max 2 active-badge reports) ── */}
      {featured.length > 0 && (
        <FadeIn>
          <section style={{ padding: '0 24px 48px', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 4 }}>🔥 BRUTAL EDGE™</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Featured Analysis</h2>
              </div>
              <Link href="/reports" style={{ fontSize: 12, color: '#C73E3A', fontWeight: 600, fontFamily: 'var(--sans)' }}>All Reports →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {featured.map(r => {
                const typeLabel = r.type === 'hot-sector' ? '🔥 HOT SECTOR' : r.type === 'hidden-gem' ? '💎 HIDDEN GEM' : '⚡ SPECIAL REPORT';
                const tickers = Array.isArray(r.tickers) ? r.tickers : (r.ticker ? [r.ticker] : []);
                return (
                  <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: '20px 22px', textDecoration: 'none', display: 'block', borderColor: `${r.catColor}40`, background: `linear-gradient(135deg, ${r.catColor}0A, #111827)`, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: r.catColor }} />
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: `${r.catColor}20`, color: r.catColor, letterSpacing: 1 }}>{typeLabel}</span>
                      {tickers.slice(0, 5).map(t => (
                        <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: r.catColor }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.3, marginBottom: 6 }}>{r.title}</div>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 10px', lineHeight: 1.5 }}>{r.description?.length > 130 ? r.description.slice(0, 130) + '...' : r.description}</p>
                    <span style={{ fontSize: 11, color: r.catColor, fontWeight: 700 }}>Read Report →</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── SECTION 4: LATEST (4 combined reports + blog) ── */}
      <FadeIn delay={0.05}>
        <section style={{ padding: '0 24px 48px', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 4 }}>LATEST</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Reports &amp; Insights</h2>
            </div>
            <Link href="/reports" style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600, fontFamily: 'var(--sans)' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {latest.map(item => (
              <Link
                key={`${item.kind}-${item.slug}`}
                href={item.kind === 'report' ? `/reports/${item.slug}` : `/blog/${item.slug}`}
                style={{ ...card, padding: '16px 20px', textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'flex-start' }}
              >
                {item.kind === 'report' && item.ticker && <TickerLogo ticker={item.ticker} size={40} />}
                {item.kind === 'blog' && (
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${item.catColor}18`, border: `1px solid ${item.catColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 18 }}>📝</span>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    {item.kind === 'report' && item.ticker && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 800, color: '#60A5FA' }}>{item.ticker}</span>
                    )}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${item.catColor}14`, color: item.catColor }}>{item.category}</span>
                    {item.kind === 'report' && item.beafScore > 0 && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>BEAF {item.beafScore}/100 ({item.grade})</span>
                    )}
                    <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{item.date} · {item.readTime}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.35 }}>{item.title}</div>
                  <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>{item.description?.length > 100 ? item.description.slice(0, 100) + '...' : item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── SECTION 5: NEWSLETTER CTA ── */}
      <section style={{ padding: '0 24px 64px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ ...card, padding: '32px 28px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 8 }}>NEWSLETTER</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: '0 0 6px' }}>Free market analysis.</h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', margin: '0 0 20px' }}>Every morning.</p>
          <NewsletterCTA source="homepage" />
        </div>
      </section>

    </div>
  );
}
