import Link from 'next/link';
import LikeButton from '@/components/LikeButton';
import type { RankingItem } from '@/data/rankings';

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };
const YEAR = new Date().getFullYear();

interface Props {
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  items: RankingItem[];
  pageId: string;
  valueLabel?: string;
}

export default function RankingPage({ tag, tagColor, title, description, items, pageId, valueLabel }: Props) {
  const max = items.length;
  const usCount = items.filter(r => r.flag === '🇺🇸').length;

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: tagColor, letterSpacing: 3, marginBottom: 6 }}>{tag} · {YEAR}</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>{title}</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', marginTop: 4 }}>{description}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LikeButton pageId={pageId} />
            <Link href="/rankings" style={{ fontSize: 12, color: '#64748B' }}>← Rankings</Link>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { href: '/rankings/billionaires', label: 'Billionaires', c: '#D4A843' },
            { href: '/rankings/companies', label: 'Companies', c: '#3B82F6' },
            { href: '/rankings/gdp', label: 'GDP', c: '#00D474' },
            { href: '/rankings/population', label: 'Population', c: '#A78BFA' },
            { href: '/rankings/sports', label: 'Sports', c: '#EF4444' },
            { href: '/rankings/crypto', label: 'Crypto', c: '#F59E0B' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 11, color: l.c, padding: '4px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>{l.label}</Link>
          ))}
        </div>

        {/* Table */}
        <div style={card}>
          {valueLabel && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 22px', borderBottom: '1px solid #1E293B' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#475569' }}>{valueLabel}</span>
            </div>
          )}
          {items.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px',
              borderBottom: i < items.length - 1 ? '1px solid #1E293B' : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: i < 3 ? '#D4A84315' : '#111827',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 800,
                color: i < 3 ? '#D4A843' : '#475569',
                border: i < 3 ? '1px solid #D4A84330' : 'none',
              }}>{r.rank}</div>
              <span style={{ fontSize: 18 }}>{r.flag}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>{r.name}</span>
                {r.sub && <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569', marginTop: 2 }}>{r.sub}</div>}
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>{r.value}</span>
              {r.delta && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, minWidth: 48, textAlign: 'right' as const,
                  color: r.delta.startsWith('+') ? '#00D474' : r.delta.startsWith('-') ? '#FF4545' : '#64748B' }}>{r.delta}</span>
              )}
            </div>
          ))}
        </div>

        {/* USA dominance */}
        {usCount >= max * 0.5 && (
          <div style={{ marginTop: 16, padding: '10px 16px', borderRadius: 10, background: '#3B82F608', border: '1px solid #3B82F615', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600 }}>🇺🇸 {usCount} of {max} are American — data speaks for itself.</span>
          </div>
        )}

        {/* Internal links */}
        <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Link href="/markets" style={{ fontSize: 11, color: '#00D474', padding: '4px 10px', borderRadius: 6, background: '#00D47410', border: '1px solid #00D47420' }}>Markets</Link>
          <Link href="/blog" style={{ fontSize: 11, color: '#A78BFA', padding: '4px 10px', borderRadius: 6, background: '#A78BFA10', border: '1px solid #A78BFA20' }}>Blog</Link>
          <Link href="/rankings/crypto" style={{ fontSize: 11, color: '#F59E0B', padding: '4px 10px', borderRadius: 6, background: '#F59E0B10', border: '1px solid #F59E0B20' }}>Crypto Rankings</Link>
        </div>
      </div>
    </div>
  );
}
