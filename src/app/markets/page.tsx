import type { Metadata } from "next";
import Link from "next/link";
import { stocks } from "@/data/markets";

export const metadata: Metadata = {
  title: "Today's Top Stock Movers | DHLM Studio",
  description: "Daily US stock market top gainers with company profiles, catalysts, and key metrics. Updated every trading day.",
};

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function MarketsPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 6 }}>US MARKET · TODAY</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Top Movers</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', marginTop: 4 }}>Daily top gainers on NASDAQ & NYSE</p>
          </div>
          <Link href="/" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Home</Link>
        </div>

        <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#334155', marginBottom: 24 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · Data for informational purposes only. Not investment advice.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stocks.map((s, i) => (
            <Link key={s.ticker} href={`/markets/${s.ticker.toLowerCase()}`} style={{ ...card, display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 14, padding: '18px 20px', alignItems: 'center', textDecoration: 'none' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 800, color: i < 3 ? '#D4A843' : '#475569', textAlign: 'center' }}>#{i + 1}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: '#60A5FA' }}>{s.ticker}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: '#475569' }}>· {s.cap} · {s.sector}</span>
                </div>
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 1.5 }}>{s.catalyst}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  {s.tags.map(t => <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: '#6B728014', color: '#6B7280', fontFamily: 'var(--mono)' }}>{t}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 800, color: '#F1F5F9' }}>${s.price}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: '#00D4741A', color: '#00D474', fontFamily: 'var(--mono)' }}>+{s.change}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Market data is for informational purposes only and does not constitute investment advice.
        </p>
      </div>
    </div>
  );
}
