import type { Metadata } from 'next';
import Link from 'next/link';
import { WISDOM, getWisdomById } from '@/data/wisdom';

export function generateStaticParams() {
  return WISDOM.map(w => ({ id: String(w.id).padStart(3, '0') }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const w = getWisdomById(parseInt(id));
  if (!w) return { title: 'Wisdom Not Found' };
  return {
    title: `"${w.quote.slice(0, 60)}${w.quote.length > 60 ? '...' : ''}" — ${w.author} | Wall Street Wisdom`,
    description: `${w.author}: "${w.quote}" — ${w.explanation.slice(0, 140)}`,
    robots: { index: false, follow: true },
  };
}

export default async function WisdomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = parseInt(id);
  const w = getWisdomById(num);

  if (!w) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28 }}>Wisdom Not Found</h1>
        <Link href="/blog" style={{ color: '#64748B', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← Blog</Link>
      </div>
    );
  }

  const prev = num > 1 ? String(num - 1).padStart(3, '0') : null;
  const next = num < WISDOM.length ? String(num + 1).padStart(3, '0') : null;
  const related = WISDOM.filter(x => x.category === w.category && x.id !== w.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${w.quote.slice(0, 100)} — ${w.author}`,
    description: w.explanation,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
    mainEntityOfPage: `https://dhlm-studio.com/blog/wisdom/${id}`,
  };

  const shareText = `"${w.quote}"\n— ${w.author} ${w.flag}\n\nDaily Wall Street Wisdom #${String(w.id).padStart(3, '0')}\n#investing #stocks #wallstreet`;

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/blog" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Blog</Link>

        {/* Header */}
        <div style={{ marginTop: 20, marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 3 }}>
            DAILY WALL STREET WISDOM · #{String(w.id).padStart(3, '0')}
          </div>
        </div>

        {/* Quote Card */}
        <div style={{
          padding: '40px 32px', borderRadius: 18,
          background: 'linear-gradient(135deg, #D4A84310, #D4A84305)',
          border: '1px solid #D4A84320', textAlign: 'center', marginBottom: 32,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💡</div>
          <blockquote style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 3.5vw, 28px)',
            fontWeight: 800, color: '#F1F5F9', lineHeight: 1.5, margin: '0 0 20px',
            fontStyle: 'italic',
          }}>
            &ldquo;{w.quote}&rdquo;
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{w.flag}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 700, color: '#D4A843' }}>{w.author}</span>
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#64748B', marginTop: 4 }}>{w.role}</div>
        </div>

        {/* WHO SAID IT */}
        <div style={{ padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 10 }}>WHO SAID IT</div>
          <p style={{ fontSize: 14, color: '#E2E8F0', fontWeight: 600, margin: '0 0 4px' }}>{w.flag} {w.author}</p>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 8px' }}>{w.role}</p>
          {w.ticker && (
            <Link href={`/reports`} style={{ fontSize: 11, color: '#60A5FA', fontFamily: 'var(--mono)' }}>
              See {w.ticker} Reports →
            </Link>
          )}
        </div>

        {/* WHAT IT MEANS */}
        <div style={{ padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 10 }}>WHAT IT MEANS</div>
          <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>{w.explanation}</p>
        </div>

        {/* Category tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: '#D4A84314', color: '#D4A843', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>{w.category}</span>
        </div>

        {/* Share */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(`https://dhlm-studio.com/blog/wisdom/${id}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ padding: '8px 16px', borderRadius: 8, background: '#1D9BF0', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            Share on 𝕏
          </a>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid #1E293B' }}>
          {prev ? <Link href={`/blog/wisdom/${prev}`} style={{ fontSize: 12, color: '#64748B' }}>← #{prev}</Link> : <span />}
          {next ? <Link href={`/blog/wisdom/${next}`} style={{ fontSize: 12, color: '#64748B' }}>#{next} →</Link> : <span />}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #1E293B' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 12 }}>MORE {w.category.toUpperCase()} WISDOM</div>
            {related.map(r => (
              <Link key={r.id} href={`/blog/wisdom/${String(r.id).padStart(3, '0')}`}
                style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #1E293B', textDecoration: 'none' }}>
                <span style={{ fontSize: 13, color: '#E2E8F0', fontStyle: 'italic' }}>&ldquo;{r.quote.slice(0, 60)}...&rdquo;</span>
                <span style={{ fontSize: 11, color: '#64748B', marginLeft: 8 }}>— {r.author}</span>
              </Link>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
