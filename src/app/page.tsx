import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import FadeIn from '@/components/FadeIn';
import { blogPosts } from '@/data/blog-posts';
import { fmtDateShort } from '@/lib/fmt-date';
import NewsletterCTAWrapper from './NewsletterCTAWrapper';

const YEAR = new Date().getFullYear();

export const revalidate = 3600;

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
  heroImage?: string;
}

interface ResearchMeta {
  slug: string; title: string; date: string; readTime: string;
  description: string; badge?: string; subcategory?: string;
  heroImage?: string;
}

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

export default function Home() {
  const allReports = getAllReports();
  const featuredReports = allReports.slice(0, 3);
  const latestReports = allReports.slice(3, 7);
  const latestBlog = blogPosts.filter(p => !p.noindex).slice(0, 4);
  const latestResearch = getAllResearch().slice(0, 4);

  return (
    <div style={{ background: '#0B0F19', color: '#F1F5F9', minHeight: '100vh' }}>
      <style>{`
        .home-featured-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 560px) {
          .home-featured-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 860px) {
          .home-featured-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .home-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 560px) {
          .home-content-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ padding: '72px 24px 56px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 16 }}>DHLM STUDIO · BRUTAL EDGE™</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.15, letterSpacing: -0.5, margin: '0 0 16px' }}>
          For the edge that<br /><span style={{ color: '#C73E3A' }}>cuts the noise.</span>
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#64748B', lineHeight: 1.7, maxWidth: 520, margin: '0 0 24px' }}>
          Deep Dive reports, The Mental Game, and data-driven investing education. No hype. No noise. Just analysis that holds up.
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

      {/* ── FEATURED REPORTS (3-col image grid) — no FadeIn: LCP section must not be wrapped in client component ── */}
      {featuredReports.length > 0 && (
        <section style={{ padding: '0 24px 48px', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 4 }}>🔥 BRUTAL EDGE™</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Featured Reports</h2>
            </div>
            <Link href="/reports" style={{ fontSize: 12, color: '#C73E3A', fontWeight: 600, fontFamily: 'var(--sans)' }}>All Reports →</Link>
          </div>
          <div className="home-featured-grid">
            {featuredReports.map((r, idx) => {
              const tickers = Array.isArray(r.tickers) ? r.tickers : (r.ticker ? [r.ticker] : []);
              return (
                <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', borderColor: `${r.catColor}40`, overflow: 'hidden' }}>
                  {r.heroImage ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#0f172a' }}>
                      <Image src={r.heroImage} alt={r.title} fill quality={65} priority={idx === 0} unoptimized={idx === 0} loading={idx === 0 ? 'eager' : 'lazy'} sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 860px) calc(50vw - 32px), 246px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: `linear-gradient(135deg, ${r.catColor}20, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 900, color: `${r.catColor}80` }}>{r.ticker || '—'}</span>
                    </div>
                  )}
                  <div style={{ padding: '14px 16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${r.catColor}20`, color: r.catColor, letterSpacing: 1 }}>
                        {r.category.toUpperCase()}
                      </span>
                      {tickers.slice(0, 3).map(t => (
                        <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: r.catColor }}>{t}</span>
                      ))}
                      <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 6 }}>{r.title}</div>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 6px', lineHeight: 1.5 }}>{r.description?.length > 90 ? r.description.slice(0, 90) + '...' : r.description}</p>
                    <span style={{ fontSize: 10, color: '#475569' }}>{r.readTime}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── LATEST REPORTS (2-col image grid) ── */}
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
            <div className="home-content-grid">
              {latestReports.map(r => (
                <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
                  {r.heroImage ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#0f172a' }}>
                      <Image src={r.heroImage} alt={r.title} fill quality={65} loading="lazy" sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 800px) calc(50vw - 32px), 376px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: `linear-gradient(135deg, ${r.catColor}18, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color: `${r.catColor}70` }}>{r.ticker || '—'}</span>
                    </div>
                  )}
                  <div style={{ padding: '12px 16px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${r.catColor}14`, color: r.catColor }}>{r.category}</span>
                      <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.35 }}>{r.title}</div>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>{r.description?.length > 80 ? r.description.slice(0, 80) + '...' : r.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── THE MENTAL GAME (2-col image grid) ── */}
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
            <div className="home-content-grid">
              {latestResearch.map(a => {
                const c = a.badge === 'mental-game'
                  ? { fg: '#A78BFA', bg: '#7C3AED18', border: '#7C3AED40' }
                  : a.badge === 'structural-view'
                  ? { fg: '#38BDF8', bg: '#0EA5E918', border: '#0EA5E940' }
                  : { fg: '#94A3B8', bg: '#1E293B18', border: '#1E293B40' };
                return (
                  <Link key={a.slug} href={`/research/${a.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', overflow: 'hidden', borderColor: c.border }}>
                    {a.heroImage ? (
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#0f172a' }}>
                        <Image src={a.heroImage} alt={a.title} fill quality={65} loading="lazy" sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 800px) calc(50vw - 32px), 376px" style={{ objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '100%', aspectRatio: '16/9', background: `linear-gradient(135deg, ${c.bg}, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 28 }}>🧠</span>
                      </div>
                    )}
                    <div style={{ padding: '12px 16px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        {a.subcategory && (
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: c.bg, color: c.fg, border: `1px solid ${c.border}`, letterSpacing: 1 }}>
                            {a.subcategory.toUpperCase()}
                          </span>
                        )}
                        <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(a.date)} · {a.readTime}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.35, marginBottom: 4 }}>{a.title}</div>
                      <p style={{ fontSize: 11, color: '#64748B', margin: 0, lineHeight: 1.4 }}>{a.description?.length > 80 ? a.description.slice(0, 80) + '...' : a.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── BLOG (2-col image grid) ── */}
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
            <div className="home-content-grid">
              {latestBlog.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
                  {p.heroImage ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#0f172a' }}>
                      <Image src={p.heroImage} alt={p.title} fill quality={65} loading="lazy" sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 800px) calc(50vw - 32px), 376px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: `${p.catColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 28 }}>📝</span>
                    </div>
                  )}
                  <div style={{ padding: '12px 16px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${p.catColor}14`, color: p.catColor }}>{p.category}</span>
                      <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(p.date)} · {p.readTime}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.35 }}>{p.title}</div>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>{p.description?.length > 80 ? p.description.slice(0, 80) + '...' : p.description}</p>
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
          <NewsletterCTAWrapper source="homepage" />
        </div>
      </section>

    </div>
  );
}
