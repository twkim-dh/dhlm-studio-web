import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cost of Living Comparison | DHLM Studio",
  description: "Compare cost of living between cities. Rent, food, transport, and more — side by side.",
};

const YEAR = new Date().getFullYear();

const comparisons = [
  { city1: 'New York', city2: 'Los Angeles', flag1: '🗽', flag2: '🌴', diff: '-14%', cheaper: 'LA' },
  { city1: 'London', city2: 'Tokyo', flag1: '🇬🇧', flag2: '🇯🇵', diff: '-8%', cheaper: 'Tokyo' },
  { city1: 'San Francisco', city2: 'Austin', flag1: '🌉', flag2: '🤠', diff: '-32%', cheaper: 'Austin' },
  { city1: 'Singapore', city2: 'Bangkok', flag1: '🇸🇬', flag2: '🇹🇭', diff: '-58%', cheaper: 'Bangkok' },
  { city1: 'Dubai', city2: 'Istanbul', flag1: '🇦🇪', flag2: '🇹🇷', diff: '-62%', cheaper: 'Istanbul' },
  { city1: 'Sydney', city2: 'Seoul', flag1: '🇦🇺', flag2: '🇰🇷', diff: '-22%', cheaper: 'Seoul' },
  { city1: 'Berlin', city2: 'Lisbon', flag1: '🇩🇪', flag2: '🇵🇹', diff: '-18%', cheaper: 'Lisbon' },
  { city1: 'Toronto', city2: 'Mexico City', flag1: '🇨🇦', flag2: '🇲🇽', diff: '-55%', cheaper: 'Mexico City' },
];

const ITEMS = [
  { item: 'Latte (Café)', ny: '$5.80', la: '$5.50', diff: '-5%', icon: '☕' },
  { item: 'Rent (1BR, Center)', ny: '$3,200', la: '$2,400', diff: '-25%', icon: '🏠' },
  { item: 'Monthly Transit Pass', ny: '$127', la: '$100', diff: '-21%', icon: '🚇' },
  { item: 'Dinner (2 People)', ny: '$110', la: '$95', diff: '-14%', icon: '🍽️' },
  { item: 'Internet (Monthly)', ny: '$70', la: '$65', diff: '-7%', icon: '📶' },
  { item: 'Gym Membership', ny: '$95', la: '$55', diff: '-42%', icon: '💪' },
  { item: 'Groceries (Weekly)', ny: '$120', la: '$100', diff: '-17%', icon: '🛒' },
];

const card = { background: '#111827', borderRadius: 18, border: '1px solid #1E293B', overflow: 'hidden' as const };

export default function ComparePage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#3B82F6', letterSpacing: 3, marginBottom: 6 }}>COST OF LIVING · {YEAR}</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Compare Cities</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', marginTop: 4 }}>Side-by-side cost comparison across 200+ cities</p>
          </div>
          <Link href="/" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Home</Link>
        </div>

        {/* Featured: NYC vs LA */}
        <div style={{ ...card, marginBottom: 24 }}>
          <div style={{ padding: '20px 22px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ textAlign: 'center' as const }}><div style={{ fontSize: 11, color: '#64748B' }}>🗽 New York</div><div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', marginTop: 2 }}>Index 100</div></div>
              <div style={{ width: 1, background: '#1E293B' }} />
              <div style={{ textAlign: 'center' as const }}><div style={{ fontSize: 11, color: '#64748B' }}>🌴 Los Angeles</div><div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', marginTop: 2 }}>Index 86</div></div>
            </div>
            <div style={{ padding: '8px 16px', borderRadius: 10, background: '#00D47414', border: '1px solid #00D47420' }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, color: '#00D474' }}>LA is <span style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>14%</span> cheaper</span>
            </div>
          </div>
          {ITEMS.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 70px', gap: 8, padding: '12px 22px', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : '#0D111B' }}>
              <span style={{ fontSize: 13, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}><span>{r.icon}</span>{r.item}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.ny}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.la}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FF6B6B', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.diff}</span>
            </div>
          ))}
        </div>

        {/* Other comparisons */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 3, marginBottom: 16 }}>POPULAR COMPARISONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
          {comparisons.map(c => (
            <Link key={`${c.city1}-${c.city2}`} href={`/compare/${c.city1.toLowerCase().replace(/ /g,'-')}-vs-${c.city2.toLowerCase().replace(/ /g,'-')}`} style={{ ...card, padding: '18px 20px', borderRadius: 14, textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0', fontFamily: 'var(--sans)' }}>{c.flag1} {c.city1}</span>
                  <span style={{ color: '#475569', margin: '0 8px', fontSize: 12 }}>vs</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0', fontFamily: 'var(--sans)' }}>{c.flag2} {c.city2}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#00D474', fontFamily: 'var(--mono)' }}>{c.diff}</span>
              </div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 6, fontFamily: 'var(--sans)' }}>{c.cheaper} is cheaper</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
