import type { Metadata } from 'next';
import Link from 'next/link';
import { comparisons, getComparisonBySlug } from '@/data/compare';

const YEAR = new Date().getFullYear();

export function generateStaticParams() {
  return comparisons.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cmp = getComparisonBySlug(slug);
  if (!cmp) return { title: 'Comparison Not Found' };
  return {
    title: `${cmp.city1.name} vs ${cmp.city2.name}: Cost of Living ${YEAR}`,
    description: `Compare cost of living: ${cmp.city1.name} vs ${cmp.city2.name}. Rent, food, transport, and more — ${cmp.summary}.`,
  };
}

const card = { background: '#111827', borderRadius: 18, border: '1px solid #1E293B', overflow: 'hidden' as const };

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cmp = getComparisonBySlug(slug);

  if (!cmp) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28 }}>Comparison Not Found</h1>
        <Link href="/compare" style={{ color: '#64748B', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← Back to Compare</Link>
      </div>
    );
  }

  const c1 = cmp.city1, c2 = cmp.city2;
  const diffPct = Math.round((1 - c2.index / c1.index) * 100);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/compare" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← All Comparisons</Link>

        <div style={{ marginTop: 24, marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#3B82F6', letterSpacing: 3, marginBottom: 8 }}>COST OF LIVING · {YEAR}</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>
            {c1.flag} {c1.name} vs {c2.flag} {c2.name}
          </h1>
        </div>

        <div style={card}>
          {/* Summary */}
          <div style={{ padding: '20px 22px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>{c1.flag} {c1.name}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#F1F5F9', marginTop: 2 }}>Index {c1.index}</div>
              </div>
              <div style={{ width: 1, background: '#1E293B' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>{c2.flag} {c2.name}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#F1F5F9', marginTop: 2 }}>Index {c2.index}</div>
              </div>
            </div>
            <div style={{ padding: '10px 18px', borderRadius: 10, background: '#00D47414', border: '1px solid #00D47420' }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700, color: '#00D474' }}>
                {c2.name} is <span style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{diffPct}%</span> cheaper
              </span>
            </div>
          </div>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 70px', gap: 8, padding: '10px 22px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', letterSpacing: 1 }}>ITEM</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', textAlign: 'right' as const, letterSpacing: 1 }}>{c1.name.toUpperCase()}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', textAlign: 'right' as const, letterSpacing: 1 }}>{c2.name.toUpperCase()}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', textAlign: 'right' as const, letterSpacing: 1 }}>DIFF</span>
          </div>

          {/* Data rows */}
          {cmp.items.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 70px', gap: 8, padding: '14px 22px', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : '#0D111B' }}>
              <span style={{ fontSize: 14, color: '#E2E8F0', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{r.icon}</span>{r.item}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.price1}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.price2}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FF6B6B', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.diff}</span>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: 24, lineHeight: 1.6, textAlign: 'center' }}>
          Cost of living data is based on publicly available sources and may not reflect individual circumstances.<br />
          Prices are estimates and may vary. Last updated: {YEAR}.
        </p>
      </div>
    </div>
  );
}
