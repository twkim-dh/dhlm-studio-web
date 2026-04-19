import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import FadeIn from '@/components/FadeIn';
import NewsletterCTA from '@/components/NewsletterCTA';
import { blogPosts } from '@/data/blog-posts';
import TickerLogo from '@/components/TickerLogo';
import { fmtDateShort } from '@/lib/fmt-date';

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: 'DHLM Studio — Brutal Edge™ Financial Analysis',
  description: `Deep Dive reports, The Mental Game, and data-driven investing education. For serious long-term investors. ${YEAR}.`,
  alternates: { canonical: 'https://dhlm-studio.com' },
};

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

/* ═══ Data helpers ═══ */
interface ReportMeta {
  title: string; slug: string; ticker: string; date: string; readTime: string;
  category: string; catColor: string; grade: string; beafScore: number;
  description: string; type?: string; tickers?: string[]; homeRank?: number;
}

interface ResearchMeta {
  slug: string; title: string; date: string; readTime: string;
  description: string; badge?: string; subcategory?: string;
}

function daysAgo(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000); }

function getAllReports(): ReportMeta[] {
  try {
    const dir = path.join(process.cwd(), 'src/content/reports');
    const today = new Date().toISOString().slice(0, 10);
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
      const pubDate = String(fm['publishDate'] || fm['date'] || '');
      if (pubDate > today) return null;
      return fm as unknown as ReportMeta;
    }).filter(Boolean).sort((a, b) => (b!.date > a!.date ? 1 : -1)) as ReportMeta[];
  } catch { return []; }
}

function getAllResearch(): ResearchMeta[] {
  try {
    const dir = path.join(process.cwd(), 'src/content/research');
    const today = new Date().toISOString().slice(0, 10);
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.md') && !f.startsWith('paper-vs-profit'))
      .map(f => {
        const content = fs.readFileSync(path.join(dir, f), 'utf8');
        const m = content.match(/^---\n([\s\S]*?)\n---/);
        if (!m) return null;
        const fm: Record<string, unknown> = {};
        m[1].split('\n').forEach(line => {
          const lm = line.match(/^(\w+):\s*(.+)$/);
          if (!lm) return;
          let raw = lm[2].trim();
          if (raw.startsWith('"') && raw.endsWith('"')) raw = raw.slice(1, -1);
          fm[lm[1]] = raw;
        });
        const pubDate = String(fm['publishDate'] || fm['date'] || '');
        if (pubDate > today) return null;
        return fm as unknown as ResearchMeta;
      })
      .filter(Boolean)
      .sort((a, b) => (b!.date > a!.date ? 1 : -1)) as ResearchMeta[];
  } catch { return []; }
}

function getFeatured(all: ReportMeta[]): ReportMeta[] {
  return all.filter(r =>
    (r.type === 'hot-sector' || r.type === 'hidden-gem' || r.type === 'special-report') &&
    daysAgo(r.date) <= 14
  ).sort((a, b) => {
    const ra = a.homeRank ?? 99, rb = b.homeRank ?? 99;
    if (ra !== rb) return ra - rb;
    return b.date > a.date ? 1 : -1;
  }).slice(0, 3);
}

function seriesColor(badge?: string) {
  if (badge === 'mental-game') return { fg: '#A78BFA', bg: '#7C3AED18', border: '#7C3AED40', label: 'THE MENTAL GAME' };
  if (badge === 'structural-view') return { fg: '#38BDF8', bg: '#0EA5E918', border: '#0EA5E940', label: 'THE STRUCTURAL VIEW' };
  return { fg: '#94A3B8', bg: '#1E293B18', border: '#1E293B40', label: 'RESEARCH' };
}

export default function Home() {
  const allReports = getAllReports();
  const featured = getFeatured(allReports);
  const featuredSlugs = featured.map(r => r.slug);
  const latestReports = allReports.filter(r => !featuredSlugs.includes(r.slug)).slice(0, 4);
  const latestBlog = blogPosts.filter(p => !p.noindex).slice(0, 4);
  const latestResearch = getAllResearch().slice(0, 4);

  return (
    <div style={{ background: '#0B0F19', color: '#F1F5F9', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ padding: '72px 24px 56px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 16 }}>DHLM STUDIO · BRUTAL EDGE™</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.15, letterSpacing: -0.5, margin: '0 0 16px' }}>
          For the edge that<br /><span style={{ color: '#C73E3A' }}>cuts the noise.</span>
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#64748B', lineHeight: 1.7, maxWidth: 520, margin: '0 0 24px' }}>
          Deep Dive reports, The Mental Game, and data-driven investing education. No hype. No auto-generated content. Just analysis that holds up.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/reports" style={{ display: 'inline-block', padding: '11px 22px', borderRadius: 8, background: '#C73E3A', color: '#fff', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Explore Reports
          </Link>
          <Link href="/research" style={{ display: 'inline-block', padding: '11px 22px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            The Mental Game
          </Link>
          <Link href="/learn" style={{ display: 'inline-block', padding: '11px 22px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Learn →
          </Link>
        </div>
      </section>

      {/* ── FEATURED REPORTS ── */}
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
                      <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
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

      {/* ── LATEST REPORTS ── */}
      {latestReports.length > 0 && (
        <FadeIn delay={0.05}>
          <section style={{ padding: '0 24px 48px', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 4 }}>DEEP DIVE</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Latest Reports</h2>
              </div>
              <Link href="/reports" style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600, fontFamily: 'var(--sans)' }}>View All →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {latestReports.map(r => (
                <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: '16px 20px', textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <TickerLogo ticker={r.ticker ?? ''} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 800, color: '#60A5FA' }}>{r.ticker}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${r.catColor}14`, color: r.catColor }}>{r.category}</span>
                      {r.beafScore > 0 && (
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>BEAF {r.beafScore}/100 ({r.grade})</span>
                      )}
                      <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.35 }}>{r.title}</div>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>{r.description?.length > 100 ? r.description.slice(0, 100) + '...' : r.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── LATEST RESEARCH (Mental Game / Structural View) ── */}
      {latestResearch.length > 0 && (
        <FadeIn delay={0.1}>
          <section style={{ padding: '0 24px 48px', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#A78BFA', letterSpacing: 3, marginBottom: 4 }}>🧠 BRUTAL EDGE™</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>The Mental Game</h2>
              </div>
              <Link href="/research" style={{ fontSize: 12, color: '#A78BFA', fontWeight: 600, fontFamily: 'var(--sans)' }}>Full Archive →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {latestResearch.map(a => {
                const s = seriesColor(a.badge);
                return (
                  <Link key={a.slug} href={`/research/${a.slug}`} style={{ ...card, padding: '16px 20px', textDecoration: 'none', display: 'block', borderColor: s.border }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      {a.subcategory && (
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: s.bg, color: s.fg, border: `1px solid ${s.border}`, letterSpacing: 1 }}>
                          {a.subcategory.toUpperCase()}
                        </span>
                      )}
                      <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(a.date)} · {a.readTime}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.35, marginBottom: 4 }}>{a.title}</div>
                    <p style={{ fontSize: 11, color: '#64748B', margin: 0, lineHeight: 1.4 }}>{a.description?.length > 110 ? a.description.slice(0, 110) + '...' : a.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── LATEST BLOG POSTS ── */}
      {latestBlog.length > 0 && (
        <FadeIn delay={0.15}>
          <section style={{ padding: '0 24px 48px', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 4 }}>THE MASTERS · WEEKEND READ</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Blog</h2>
              </div>
              <Link href="/blog" style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600, fontFamily: 'var(--sans)' }}>View All →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {latestBlog.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ ...card, padding: '16px 20px', textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.catColor}18`, border: `1px solid ${p.catColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 18 }}>📝</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${p.catColor}14`, color: p.catColor }}>{p.category}</span>
                      <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(p.date)} · {p.readTime}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.35 }}>{p.title}</div>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>{p.description?.length > 100 ? p.description.slice(0, 100) + '...' : p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── NEWSLETTER CTA ── */}
      <section style={{ padding: '0 24px 64px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ ...card, padding: '32px 28px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 8 }}>NEWSLETTER</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: '0 0 6px' }}>Free market analysis.</h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', margin: '0 0 20px' }}>No daily noise. Just the reports and research that matter.</p>
          <NewsletterCTA source="homepage" />
        </div>
      </section>

    </div>
  );
}
