import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedWisdom, WISDOM } from '@/data/wisdom';

export const metadata: Metadata = {
  title: 'Daily Wall Street Wisdom — Investment Quotes | DHLM Studio',
  description: 'A new investing quote every day from Warren Buffett, Charlie Munger, Peter Lynch, and more. 100 timeless pieces of Wall Street wisdom.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export const dynamic = 'force-dynamic'; // recalculate published list on each request

export default function WisdomListPage() {
  const published = getPublishedWisdom();
  const total = WISDOM.length;

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#D4A843', letterSpacing: 3, marginBottom: 6 }}>💡 DAILY WALL STREET WISDOM</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Investment Wisdom</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', marginTop: 4 }}>
              A new quote every day · {published.length} of {total} published
            </p>
          </div>
          <Link href="/blog" style={{ fontSize: 12, color: '#64748B' }}>← Blog</Link>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, borderRadius: 2, background: '#1E293B', marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #D4A843, #E8C86A)', width: `${(published.length / total) * 100}%`, transition: 'width 0.5s' }} />
        </div>

        {/* Published quotes — newest first */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...published].reverse().map((w) => {
            const id = String(w.id).padStart(3, '0');
            return (
              <Link key={w.id} href={`/blog/wisdom/${id}`} style={{
                display: 'block', padding: '16px 18px', borderRadius: 14,
                background: '#111827', border: '1px solid #1E293B', textDecoration: 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843' }}>#{id}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>{w.category}</span>
                </div>
                <p style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.5, margin: '0 0 8px', fontStyle: 'italic' }}>
                  &ldquo;{w.quote.length > 80 ? w.quote.slice(0, 80) + '...' : w.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12 }}>{w.flag}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>{w.author}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Upcoming teaser */}
        {published.length < total && (
          <div style={{ marginTop: 20, padding: '16px 18px', borderRadius: 14, background: '#D4A84308', border: '1px dashed #D4A84325', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#D4A843', fontWeight: 600 }}>🔒 {total - published.length} more quotes coming — one new quote every day</div>
          </div>
        )}
      </div>
    </div>
  );
}
