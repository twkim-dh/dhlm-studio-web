import type { Metadata } from 'next';
import Link from 'next/link';
import { Counter, LiveMarketsPreview, CryptoPreview } from '@/components/HomeClient';
import FadeIn from '@/components/FadeIn';

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `DHLM Studio — The World in Numbers | Real-Time Data ${YEAR}`,
  description: `Real-time stock market movers, trending creators, billionaire rankings, crypto prices, and global data. Updated daily. ${YEAR}.`,
  alternates: { canonical: 'https://dhlm-studio.com' },
};

/* ═══ Data ═══ */
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

const CATEGORIES = [
  { icon: '📈', title: 'Market Movers', desc: 'Daily US stock top gainers', color: '#00D474', count: '365+', unit: 'daily reports', href: '/markets' },
  { icon: '🔥', title: 'Trending Creators', desc: 'Fastest growing across platforms', color: '#A78BFA', count: '4', unit: 'platforms', href: '/creators' },
  { icon: '🏆', title: 'Global Rankings', desc: 'Billionaires, companies, GDP', color: '#D4A843', count: '30+', unit: 'ranking types', href: '/rankings' },
  { icon: '🪙', title: 'Crypto Rankings', desc: 'Live crypto prices & market cap', color: '#F59E0B', count: '100+', unit: 'coins tracked', href: '/rankings/crypto' },
  { icon: '🎯', title: 'Lotto PRO', desc: 'Data-driven lottery analysis', color: '#C73E3A', count: '1,216+', unit: 'rounds analyzed', href: '/lotto' },
  { icon: '🧮', title: 'Tools', desc: 'QR generator & password tool', color: '#64748B', count: '2', unit: 'free tools', href: '/tools' },
];

/* ═══ Helpers ═══ */
function Tag({ children, color = '#6B7280' }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${color}14`, color, fontFamily: 'var(--mono)' }}>{children}</span>;
}

/* ═══ Styles ═══ */
const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };
const section = { padding: '0 24px 48px', maxWidth: 1100, margin: '0 auto' } as const;
const sectionLabel = (color: string) => ({ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color, letterSpacing: 3, marginBottom: 4 } as const);
const sectionTitle = { fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 800, color: '#F1F5F9', margin: 0 } as const;

/* ═══ Page (Server Component) ═══ */
export default function Home() {
  return (
    <div style={{ background: '#0B0F19', color: '#F1F5F9', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <section style={{ padding: '60px 24px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <Tag color="#C73E3A">REAL-TIME DATA · {YEAR}</Tag>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 5.5vw, 58px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.1, letterSpacing: -1.5, margin: '16px 0' }}>
          The World in<br /><span style={{ color: '#00D474' }}>Numbers</span>
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#64748B', lineHeight: 1.7, maxWidth: 460, margin: '0 0 28px' }}>
          Market movers, trending creators, global rankings, cost of living — updated daily.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Top Stock Movers', href: '/markets' },
            { label: 'Trending Creators', href: '/creators' },
            { label: `${YEAR} Billionaire Rankings`, href: '/rankings' },
            { label: 'Crypto Rankings (Live)', href: '/rankings/crypto' },
            { label: 'Lotto PRO', href: '/lotto' },
          ].map(t => (
            <Link key={t.label} href={t.href} style={{ fontSize: 11, color: '#475569', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B', fontFamily: 'var(--sans)' }}>
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats (Counter is client) ── */}
      <div style={{ padding: '0 24px 24px', maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[{ v: 200, s: '+', l: 'Cities', c: '#3B82F6' }, { v: 195, s: '', l: 'Countries', c: '#D4A843' }, { v: 14, s: '', l: 'Languages', c: '#00D474' }, { v: 50000, s: '+', l: 'Data Points', c: '#A78BFA' }].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: d.c }}><Counter to={d.v} suffix={d.s} /></div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#64748B', marginTop: 2 }}>{d.l}</div>
          </div>
        ))}
      </div>

      {/* ── Top Movers (client) ── */}
      <FadeIn>
      <section id="markets" style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={sectionLabel('#C73E3A')}>US MARKET · TODAY</div>
            <h2 style={sectionTitle}>Top Movers</h2>
          </div>
          <Link href="/markets" style={{ fontSize: 12, color: '#C73E3A', fontWeight: 600, fontFamily: 'var(--sans)' }}>View All →</Link>
        </div>
        <LiveMarketsPreview />
      </section>
      </FadeIn>

      {/* ── Creators (static — server rendered) ── */}
      <FadeIn delay={0.1}>
      <section id="creators" style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={sectionLabel('#A78BFA')}>TRENDING CREATORS · THIS WEEK</div>
            <h2 style={sectionTitle}>Fastest Growing</h2>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CREATORS.map((c, i) => (
            <div key={c.handle} style={{ ...card, display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 14, padding: '16px 18px', alignItems: 'center' }}>
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
      </FadeIn>

      {/* ── Rankings (static — server rendered) ── */}
      <FadeIn delay={0.1}>
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
      </FadeIn>

      {/* ── Crypto Preview (client) ── */}
      <FadeIn>
      <section style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={sectionLabel('#F59E0B')}>CRYPTO · LIVE</div>
            <h2 style={sectionTitle}>Crypto Rankings</h2>
          </div>
          <Link href="/rankings/crypto" style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600, fontFamily: 'var(--sans)' }}>View All →</Link>
        </div>
        <CryptoPreview />
      </section>
      </FadeIn>

      {/* ── Categories (static — server rendered) ── */}
      <FadeIn delay={0.1}>
      <section style={section}>
        <div style={sectionLabel('#64748B')}>EXPLORE</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 16 }}>
          {CATEGORIES.map(c => (
            <Link key={c.title} href={c.href} style={{ ...card, padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
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
      </FadeIn>
    </div>
  );
}
