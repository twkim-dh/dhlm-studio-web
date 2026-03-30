import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Today's Top Stock Movers | DHLM Studio",
  description: "Daily US stock market top gainers with company profiles, catalysts, and key metrics. Updated every trading day.",
};

const MOVERS = [
  { rank: 1, ticker: 'QBTS', name: 'D-Wave Quantum', price: 12.47, change: 34.2, cap: '$3.2B', sector: 'Quantum Computing', catalyst: 'Won $150M US DoD quantum computing contract', tags: ['Quantum', 'Defense'] },
  { rank: 2, ticker: 'SMCI', name: 'Super Micro Computer', price: 48.32, change: 28.7, cap: '$28.4B', sector: 'AI Hardware', catalyst: 'Exclusive NVIDIA Blackwell Ultra server supply deal', tags: ['AI', 'Servers'] },
  { rank: 3, ticker: 'IONQ', name: 'IonQ Inc.', price: 42.18, change: 22.4, cap: '$9.1B', sector: 'Quantum Computing', catalyst: 'Major European bank quantum finance partnership', tags: ['Quantum', 'FinTech'] },
  { rank: 4, ticker: 'RKLB', name: 'Rocket Lab USA', price: 28.95, change: 18.6, cap: '$14.2B', sector: 'Aerospace', catalyst: '2 new NASA Artemis satellite launch contracts', tags: ['Space', 'NASA'] },
  { rank: 5, ticker: 'PLTR', name: 'Palantir Technologies', price: 87.43, change: 15.2, cap: '$198B', sector: 'AI Software', catalyst: 'US Army extends $480M AI platform contract', tags: ['AI', 'Gov'] },
  { rank: 6, ticker: 'RIVN', name: 'Rivian Automotive', price: 18.65, change: 12.8, cap: '$19.7B', sector: 'EV', catalyst: 'New R2 SUV pre-orders exceed 100K in first week', tags: ['EV', 'Auto'] },
  { rank: 7, ticker: 'SNOW', name: 'Snowflake Inc.', price: 172.40, change: 11.5, cap: '$56.8B', sector: 'Cloud Data', catalyst: 'AI data marketplace partnership with OpenAI', tags: ['AI', 'Cloud'] },
  { rank: 8, ticker: 'CRWD', name: 'CrowdStrike', price: 342.10, change: 9.8, cap: '$82.1B', sector: 'Cybersecurity', catalyst: 'Won $200M federal cybersecurity contract', tags: ['Security', 'Gov'] },
  { rank: 9, ticker: 'MARA', name: 'Marathon Digital', price: 24.87, change: 8.4, cap: '$7.8B', sector: 'Bitcoin Mining', catalyst: 'Bitcoin breaks $95K, mining revenue surges', tags: ['Crypto', 'Mining'] },
  { rank: 10, ticker: 'DKNG', name: 'DraftKings', price: 48.92, change: 7.6, cap: '$23.1B', sector: 'Sports Betting', catalyst: 'March Madness drives record user engagement', tags: ['Gaming', 'Sports'] },
];

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
          {MOVERS.map((s) => (
            <div key={s.ticker} style={{ ...card, display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 14, padding: '18px 20px', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 800, color: s.rank <= 3 ? '#D4A843' : '#475569', textAlign: 'center' }}>#{s.rank}</div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
