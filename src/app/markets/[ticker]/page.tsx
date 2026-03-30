import type { Metadata } from 'next';
import Link from 'next/link';
import { stocks, getStockByTicker } from '@/data/markets';

export function generateStaticParams() {
  return stocks.map(s => ({ ticker: s.ticker.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  const stock = getStockByTicker(ticker);
  if (!stock) return { title: 'Stock Not Found' };
  return {
    title: `${stock.ticker} — ${stock.name} Stock Profile`,
    description: `${stock.name} (${stock.ticker}) stock analysis: $${stock.price}, +${stock.change}%, market cap ${stock.cap}. ${stock.catalyst}`,
  };
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default async function StockPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const stock = getStockByTicker(ticker);

  if (!stock) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28 }}>Stock Not Found</h1>
        <Link href="/markets" style={{ color: '#64748B', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← Back to Markets</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/markets" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Markets</Link>

        {/* Header */}
        <div style={{ marginTop: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 800, color: '#60A5FA' }}>{stock.ticker}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>{stock.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 36, fontWeight: 900, color: '#F1F5F9' }}>${stock.price}</span>
            <span style={{ fontSize: 16, fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: '#00D4741A', color: '#00D474', fontFamily: 'var(--mono)' }}>+{stock.change}%</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {stock.tags.map(t => <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: '#6B728014', color: '#6B7280', fontFamily: 'var(--mono)' }}>{t}</span>)}
            <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--sans)', padding: '4px 0' }}>· {stock.sector} · {stock.cap}</span>
          </div>
        </div>

        {/* Why It Moved */}
        <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 8 }}>WHY IT MOVED</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#E2E8F0', lineHeight: 1.7, margin: 0 }}>{stock.catalyst}</p>
        </div>

        {/* Company Overview */}
        <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 8 }}>COMPANY OVERVIEW</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>{stock.description}</p>
        </div>

        {/* Key Metrics */}
        <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 12 }}>KEY METRICS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { label: 'Market Cap', value: stock.cap },
              { label: 'P/E Ratio', value: stock.pe },
              { label: 'Revenue', value: stock.revenue },
              { label: 'CEO', value: stock.ceo },
              { label: 'Founded', value: String(stock.founded) },
              { label: 'HQ', value: stock.hq },
              { label: 'Employees', value: stock.employees },
              { label: 'Website', value: stock.website },
            ].map(m => (
              <div key={m.label} style={{ padding: '10px 0', borderBottom: '1px solid #1E293B' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>{m.label}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color: '#E2E8F0', marginTop: 2 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: 24, lineHeight: 1.6, textAlign: 'center' }}>
          Market data is for informational purposes only and does not constitute investment advice.<br />
          Past performance is not indicative of future results. Always do your own research.
        </p>
      </div>
    </div>
  );
}
