import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { fmtDateShort } from '@/lib/fmt-date';
import unsplashManifest from '@/data/unsplash-manifest.json';

export const metadata: Metadata = {
  title: 'The Mental Game | Brutal Edge™ | DHLM Studio',
  description: 'Psychology, philosophy, and structural frameworks for long-term investors. The Mental Game and The Structural View — by Brutal Edge.',
  alternates: { canonical: 'https://dhlm-studio.com/research' },
  openGraph: {
    title: 'The Mental Game | Brutal Edge™',
    description: 'Psychology and structural frameworks for serious investors.',
    type: 'website',
    url: 'https://dhlm-studio.com/research',
  },
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content/research');

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
type ManifestEntry = { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null };
const manifest = unsplashManifest as Record<string, ManifestEntry>;

interface ArticleMeta {
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  badge?: string;
  date: string;
  readTime: string;
  verdict?: string;
  description: string;
  heroImage?: string;
  thumb?: string;
}

function getArticles(): ArticleMeta[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const today = todayKST();
    return fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.md') && !f.startsWith('paper-vs-profit'))
      .map(f => {
        const content = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8');
        const m = content.match(/^---\n([\s\S]*?)\n---/);
        if (!m) return null;
        const fm: Record<string, unknown> = {};
        for (const line of m[1].split('\n')) {
          const lm = line.match(/^(\w+):\s*(.+)$/);
          if (!lm) continue;
          let raw = lm[2].trim();
          if (raw.startsWith('"') && raw.endsWith('"')) raw = raw.slice(1, -1);
          fm[lm[1]] = raw;
        }
        const pubDate = String(fm['publishDate'] || fm['date'] || '');
        if (pubDate > today) return null;
        const slug = String(fm['slug'] || '');
        const entry = manifest[slug];
        return { ...fm, thumb: entry?.src || (fm['heroImage'] as string) || undefined } as unknown as ArticleMeta;
      })
      .filter(Boolean)
      .sort((a, b) => (b!.date > a!.date ? 1 : -1)) as ArticleMeta[];
  } catch { return []; }
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

function seriesColor(badge?: string) {
  if (badge === 'mental-game') return { fg: '#A78BFA', bg: '#7C3AED18', border: '#7C3AED40' };
  if (badge === 'structural-view') return { fg: '#38BDF8', bg: '#0EA5E918', border: '#0EA5E940' };
  return { fg: '#94A3B8', bg: '#1E293B18', border: '#1E293B40' };
}

function ArticleCard({ a }: { a: ArticleMeta }) {
  const c = seriesColor(a.badge);
  return (
    <Link href={`/research/${a.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', overflow: 'hidden', borderColor: c.border }}>
      {a.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.thumb} alt={a.title} loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', display: 'block', background: '#0f172a' }} />
      ) : (
        <div style={{ width: '100%', aspectRatio: '16/9', background: `linear-gradient(135deg, ${c.bg}, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 28 }}>🧠</span>
        </div>
      )}
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          {a.subcategory && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: c.bg, color: c.fg, border: `1px solid ${c.border}`, letterSpacing: 1 }}>
              {a.subcategory.toUpperCase()}
            </span>
          )}
          <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>
            {fmtDateShort(a.date)} · {a.readTime}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 6 }}>{a.title}</div>
        <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.55 }}>{a.description}</p>
      </div>
    </Link>
  );
}

export default function ResearchPage() {
  const articles = getArticles();
  const mentalGame = articles.filter(a => a.badge === 'mental-game');
  const structuralView = articles.filter(a => a.badge === 'structural-view');
  const other = articles.filter(a => a.badge !== 'mental-game' && a.badge !== 'structural-view');

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>🧠 BRUTAL EDGE™</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 10px', lineHeight: 1.2 }}>
            The Mental Game
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
            Psychology, philosophy, and structural frameworks for long-term investors. The edge most investors ignore.
          </p>
        </div>

        <style>{`
          .research-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          @media (min-width: 560px) {
            .research-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (min-width: 900px) {
            .research-grid { grid-template-columns: repeat(3, 1fr); }
          }
        `}</style>

        {mentalGame.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#A78BFA', letterSpacing: 2, marginBottom: 14 }}>THE MENTAL GAME</div>
            <div className="research-grid">
              {mentalGame.map(a => <ArticleCard key={a.slug} a={a} />)}
            </div>
          </section>
        )}

        {structuralView.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#38BDF8', letterSpacing: 2 }}>THE STRUCTURAL VIEW</div>
              <Link href="/research/structural-view" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#38BDF8', textDecoration: 'none', fontWeight: 700 }}>
                Full Archive →
              </Link>
            </div>
            <div className="research-grid">
              {structuralView.map(a => <ArticleCard key={a.slug} a={a} />)}
            </div>
          </section>
        )}

        {other.length > 0 && (
          <section>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#475569', letterSpacing: 2, marginBottom: 14 }}>RESEARCH</div>
            <div className="research-grid">
              {other.map(a => <ArticleCard key={a.slug} a={a} />)}
            </div>
          </section>
        )}

        {articles.length === 0 && (
          <div style={{ ...card, padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🧠</div>
            <p style={{ fontSize: 14, color: '#64748B' }}>Coming soon.</p>
          </div>
        )}

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 40 }}>
          For informational and educational purposes only. Not investment advice.
        </p>
      </div>
    </div>
  );
}
