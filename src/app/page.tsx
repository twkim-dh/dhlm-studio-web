'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const YEAR = new Date().getFullYear();

/* ═══ Helpers ═══ */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const s = Date.now();
        const t = () => { const p = Math.min((Date.now() - s) / 1600, 1); setV(Math.floor((1 - (1 - p) ** 3) * to)); if (p < 1) requestAnimationFrame(t); };
        t();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

function Tag({ children, color = '#6B7280' }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${color}14`, color, fontFamily: 'var(--mono)' }}>{children}</span>;
}

function Change({ value }: { value: number }) {
  const up = value > 0;
  return <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: up ? '#00D4741A' : '#FF45451A', color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>{up ? '+' : ''}{value.toFixed(1)}%</span>;
}

/* ═══ Data ═══ */
const MOVERS = [
  { ticker: 'QBTS', name: 'D-Wave Quantum', price: 12.47, change: 34.2, cap: '$3.2B', catalyst: 'Won $150M US DoD quantum computing contract', tags: ['Quantum', 'Defense'] },
  { ticker: 'SMCI', name: 'Super Micro Computer', price: 48.32, change: 28.7, cap: '$28.4B', catalyst: 'Exclusive NVIDIA Blackwell Ultra server supply deal', tags: ['AI', 'Servers'] },
  { ticker: 'IONQ', name: 'IonQ Inc.', price: 42.18, change: 22.4, cap: '$9.1B', catalyst: 'Major European bank quantum finance partnership', tags: ['Quantum', 'FinTech'] },
  { ticker: 'RKLB', name: 'Rocket Lab USA', price: 28.95, change: 18.6, cap: '$14.2B', catalyst: '2 new NASA Artemis satellite launch contracts', tags: ['Space', 'NASA'] },
  { ticker: 'PLTR', name: 'Palantir Technologies', price: 87.43, change: 15.2, cap: '$198B', catalyst: 'US Army extends $480M AI platform contract', tags: ['AI', 'Gov'] },
];

const CREATORS = [
  { rank: 1, name: 'MrBeast', handle: '@MrBeast', platform: 'YouTube', metric: '+2.4M subs', total: '382M', tags: ['Entertainment'], color: '#FF0000' },
  { rank: 2, name: 'Khaby Lame', handle: '@khaborlame', platform: 'TikTok', metric: '+1.8M followers', total: '163M', tags: ['Comedy'], color: '#00F2EA' },
  { rank: 3, name: 'Cristiano Ronaldo', handle: '@cristiano', platform: 'Instagram', metric: '+1.2M followers', total: '648M', tags: ['Sports'], color: '#E4405F' },
  { rank: 4, name: 'Elon Musk', handle: '@elonmusk', platform: 'X', metric: '+890K followers', total: '218M', tags: ['Tech', 'Business'], color: '#F5F5F5' },
  { rank: 5, name: 'IShowSpeed', handle: '@IShowSpeed', platform: 'YouTube', metric: '+680K subs', total: '42M', tags: ['Gaming'], color: '#FF0000' },
];

const RANKINGS = [
  { rank: 1, name: 'Elon Musk', value: '$287B', flag: '🇺🇸', delta: '+12%' },
  { rank: 2, name: 'Bernard Arnault', value: '$241B', flag: '🇫🇷', delta: '-3%' },
  { rank: 3, name: 'Jeff Bezos', value: '$218B', flag: '🇺🇸', delta: '+8%' },
  { rank: 4, name: 'Mark Zuckerberg', value: '$198B', flag: '🇺🇸', delta: '+22%' },
  { rank: 5, name: 'Larry Ellison', value: '$176B', flag: '🇺🇸', delta: '+15%' },
];

const COMPARE = [
  { item: 'Latte (Café)', city1: '$5.80', city2: '$5.50', diff: '-5%', icon: '☕' },
  { item: 'Rent (1BR, Center)', city1: '$3,200', city2: '$2,400', diff: '-25%', icon: '🏠' },
  { item: 'Monthly Transit Pass', city1: '$127', city2: '$100', diff: '-21%', icon: '🚇' },
  { item: 'Dinner (2 People)', city1: '$110', city2: '$95', diff: '-14%', icon: '🍽️' },
  { item: 'Internet (Monthly)', city1: '$70', city2: '$65', diff: '-7%', icon: '📶' },
];

const CATEGORIES = [
  { icon: '📈', title: 'Market Movers', desc: 'Daily US stock top gainers', color: '#00D474', count: '365+', unit: 'daily reports' },
  { icon: '🔥', title: 'Trending Creators', desc: 'Fastest growing across platforms', color: '#A78BFA', count: '4', unit: 'platforms' },
  { icon: '🏆', title: 'Global Rankings', desc: 'Billionaires, companies, GDP', color: '#D4A843', count: '30+', unit: 'ranking types' },
  { icon: '⚖️', title: 'Cost of Living', desc: 'Compare 200+ cities', color: '#3B82F6', count: '10K+', unit: 'city pairs' },
  { icon: '🎯', title: 'Lotto PRO', desc: 'Data-driven lottery analysis', color: '#C73E3A', count: '1,216+', unit: 'rounds analyzed' },
  { icon: '🧮', title: 'Tools', desc: 'Currency, calculators & more', color: '#64748B', count: '80+', unit: 'free tools' },
];

/* ═══ Styles ═══ */
const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };
const section = { padding: '0 24px 48px', maxWidth: 1100, margin: '0 auto' } as const;
const sectionLabel = (color: string) => ({ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color, letterSpacing: 3, marginBottom: 4 } as const);
const sectionTitle = { fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 800, color: '#F1F5F9', margin: 0 } as const;

/* ═══ Page ═══ */
export default function Home() {
  return (
    <div style={{ background: '#0B0F19', color: '#F1F5F9', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />

      {/* ── Hero ── */}
      <section style={{ padding: '60px 24px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <Tag color="#C73E3A">REAL-TIME DATA · {YEAR}</Tag>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 5.5vw, 58px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.1, letterSpacing: -1.5, margin: '16px 0' }}>
          The World in<br /><span style={{ color: '#00D474' }}>Numbers</span>
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#64748B', lineHeight: 1.7, maxWidth: 460, margin: '0 0 28px' }}>
          Market movers, trending creators, global rankings, cost of living — updated daily.
        </p>
        {/* Quick navigation tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Top Stock Movers', href: '/markets' },
            { label: 'Trending Creators', href: '/creators' },
            { label: `${YEAR} Billionaire Rankings`, href: '/rankings' },
            { label: 'NYC vs LA Cost of Living', href: '/compare/new-york-vs-los-angeles' },
            { label: 'Lotto PRO', href: '/lotto' },
          ].map(t => (
            <Link key={t.label} href={t.href} style={{ fontSize: 11, color: '#475569', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B', fontFamily: 'var(--sans)', transition: 'border-color 0.2s' }}>
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ padding: '0 24px 24px', maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[{ v: 200, s: '+', l: 'Cities', c: '#3B82F6' }, { v: 195, s: '', l: 'Countries', c: '#D4A843' }, { v: 14, s: '', l: 'Languages', c: '#00D474' }, { v: 50000, s: '+', l: 'Data Points', c: '#A78BFA' }].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: d.c }}><Counter to={d.v} suffix={d.s} /></div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#64748B', marginTop: 2 }}>{d.l}</div>
          </div>
        ))}
      </div>

      {/* ── Top Movers ── */}
      <section id="markets" style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={sectionLabel('#C73E3A')}>US MARKET · TODAY</div>
            <h2 style={sectionTitle}>Top Movers</h2>
          </div>
          <Link href="/markets" style={{ fontSize: 12, color: '#C73E3A', fontWeight: 600, fontFamily: 'var(--sans)' }}>View All →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOVERS.map((s, i) => (
            <div key={s.ticker} style={{ ...card, display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 14, padding: '16px 18px', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 800, color: i < 3 ? '#D4A843' : '#475569', textAlign: 'center' }}>#{i + 1}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 700, color: '#60A5FA' }}>{s.ticker}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--sans)' }}>· {s.cap}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontFamily: 'var(--sans)', lineHeight: 1.5 }}>{s.catalyst}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>{s.tags.map(t => <Tag key={t} color="#64748B">{t}</Tag>)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 800, color: '#F1F5F9' }}>${s.price}</div>
                <div style={{ marginTop: 4 }}><Change value={s.change} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Creators ── */}
      <section id="creators" style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={sectionLabel('#A78BFA')}>TRENDING CREATORS · THIS WEEK</div>
            <h2 style={sectionTitle}>Fastest Growing</h2>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CREATORS.map((c, i) => (
            <div key={c.handle} style={{ ...card, display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 14, padding: '16px 18px', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 800, color: i < 3 ? '#D4A843' : '#475569', textAlign: 'center' }}>#{c.rank}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{c.name}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#64748B' }}>{c.handle}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: `${c.color}18`, color: c.color, fontFamily: 'var(--mono)' }}>{c.platform}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {c.tags.map(t => <Tag key={t} color="#64748B">{t}</Tag>)}
                  <span style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--sans)', marginLeft: 4 }}>· {c.total} total</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: '#00D474' }}>{c.metric}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rankings ── */}
      <section id="rankings" style={{ padding: '12px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ padding: '20px 22px', marginBottom: 16, background: 'linear-gradient(135deg, #D4A84308, #D4A84303)', borderRadius: 16, border: '1px solid #D4A84315' }}>
          <div style={sectionLabel('#D4A843')}>🏆 GLOBAL RANKINGS · {YEAR}</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>World Rankings</h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>Real-time billionaire wealth, company valuations, and country data</p>
        </div>
        <div style={{ ...card, borderRadius: 18, overflow: 'hidden' }}>
          {RANKINGS.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', borderBottom: i < RANKINGS.length - 1 ? '1px solid #1E293B' : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: i < 3 ? '#D4A84315' : '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 800, color: i < 3 ? '#D4A843' : '#475569', border: i < 3 ? '1px solid #D4A84330' : 'none' }}>{r.rank}</div>
              <span style={{ fontSize: 16 }}>{r.flag}</span>
              <div style={{ flex: 1 }}><span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{r.name}</span></div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800, color: '#F1F5F9' }}>{r.value}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, width: 44, textAlign: 'right' as const, color: r.delta.startsWith('+') ? '#00D474' : '#FF4545' }}>{r.delta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Compare ── */}
      <section id="compare" style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={sectionLabel('#3B82F6')}>COST OF LIVING · {YEAR}</div>
            <h2 style={sectionTitle}>New York vs Los Angeles</h2>
          </div>
        </div>
        <div style={{ ...card, borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ padding: '20px 22px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ textAlign: 'center' as const }}><div style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--sans)' }}>🗽 New York</div><div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', marginTop: 2 }}>Index 100</div></div>
              <div style={{ width: 1, background: '#1E293B' }} />
              <div style={{ textAlign: 'center' as const }}><div style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--sans)' }}>🌴 Los Angeles</div><div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', marginTop: 2 }}>Index 86</div></div>
            </div>
            <div style={{ padding: '8px 16px', borderRadius: 10, background: '#00D47414', border: '1px solid #00D47420' }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, color: '#00D474' }}>LA is <span style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>14%</span> cheaper</span>
            </div>
          </div>
          {COMPARE.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 70px', gap: 8, padding: '12px 22px', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : '#0D111B' }}>
              <span style={{ fontSize: 13, color: '#E2E8F0', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', gap: 8 }}><span>{r.icon}</span>{r.item}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.city1}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.city2}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FF6B6B', fontFamily: 'var(--mono)', textAlign: 'right' as const }}>{r.diff}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={section}>
        <div style={sectionLabel('#64748B')}>EXPLORE</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 16 }}>
          {CATEGORIES.map(c => (
            <Link key={c.title} href={c.title === 'Lotto PRO' ? '/lotto' : c.title === 'Tools' ? '/tools' : c.title === 'Market Movers' ? '/markets' : c.title === 'Trending Creators' ? '/creators' : c.title === 'Global Rankings' ? '/rankings' : c.title === 'Cost of Living' ? '/compare' : '/'}
              style={{ ...card, padding: '22px 20px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: c.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 24 }}>{c.icon}</span>
                  <h3 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 700, color: '#F1F5F9', margin: '8px 0 4px' }}>{c.title}</h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: c.color }}>{c.count}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 9, color: '#475569', marginTop: 2 }}>{c.unit}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
