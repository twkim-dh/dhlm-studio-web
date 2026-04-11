import type { Metadata } from 'next';
import Link from 'next/link';
import { Counter, LiveMarketsPreview, CryptoPreview } from '@/components/HomeClient';
import FadeIn from '@/components/FadeIn';
import FortuneCookie from '@/components/FortuneCookie';
import NewsletterCTA from '@/components/NewsletterCTA';
import TodayMarket from '@/components/TodayMarket';

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `DHLM Studio — The World in Numbers | Real-Time Data ${YEAR}`,
  description: `Real-time stock market movers, trending creators, billionaire rankings, crypto prices, and global data. Updated daily. ${YEAR}.`,
  alternates: { canonical: 'https://dhlm-studio.com' },
};

/* ═══ Data ═══ */
const CATEGORIES = [
  { icon: '📈', title: 'Market Movers', desc: 'Daily US stock top gainers', color: '#00D474', count: '365+', unit: 'daily reports', href: '/markets' },
  { icon: '🔥', title: 'Trending Creators', desc: 'Fastest growing across platforms', color: '#A78BFA', count: '4', unit: 'platforms', href: '/creators' },
  { icon: '🏆', title: 'Global Rankings', desc: 'Billionaires, companies, GDP', color: '#D4A843', count: '30+', unit: 'ranking types', href: '/rankings' },
  { icon: '🪙', title: 'Crypto Rankings', desc: 'Live crypto prices & market cap', color: '#F59E0B', count: '100+', unit: 'coins tracked', href: '/rankings/crypto' },
  { icon: '🎰', title: 'US Lottery', desc: 'Powerball & Mega Millions jackpots', color: '#C73E3A', count: '$427M', unit: 'Powerball jackpot', href: '/lottery' },
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
          Data-Driven<br /><span style={{ color: '#00D474' }}>Stock Analysis</span>
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#64748B', lineHeight: 1.7, maxWidth: 480, margin: '0 0 28px' }}>
          3,000+ word Deep Dive reports on the world&apos;s biggest stocks, scored on the BEAF 6-axis framework. Real-time market intelligence under editorial oversight. Informational and educational, not investment advice.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Top Stock Movers', href: '/markets' },
            { label: 'Trending Creators', href: '/creators' },
            { label: `${YEAR} Billionaire Rankings`, href: '/rankings' },
            { label: 'Crypto Rankings (Live)', href: '/rankings/crypto' },
            { label: 'US Lottery', href: '/lottery' },
          ].map(t => (
            <Link key={t.label} href={t.href} style={{ fontSize: 11, color: '#475569', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B', fontFamily: 'var(--sans)' }}>
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats (Counter is client) ── */}
      <div style={{ padding: '0 24px 24px', maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[{ v: 500, s: '+', l: 'Stocks', c: '#3B82F6' }, { v: 195, s: '', l: 'Countries', c: '#D4A843' }, { v: 100, s: '+', l: 'Crypto', c: '#F59E0B' }, { v: 830, s: '+', l: 'Pages', c: '#A78BFA' }].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: d.c }}><Counter to={d.v} suffix={d.s} /></div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#64748B', marginTop: 2 }}>{d.l}</div>
          </div>
        ))}
      </div>

      {/* ── TODAY'S MARKET (first thing visitors see) ── */}
      <TodayMarket />

      {/* ── Featured Analysis (Brutal Edge Deep Dives) — TOP PRIORITY ── */}
      <FadeIn>
      <section style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={sectionLabel('#C73E3A')}>🔥 BRUTAL EDGE™ · DEEP DIVE</div>
            <h2 style={sectionTitle}>Featured Analysis</h2>
          </div>
          <Link href="/reports" style={{ fontSize: 12, color: '#C73E3A', fontWeight: 600, fontFamily: 'var(--sans)' }}>All Reports →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {/* Hot Sector cards (THIS WEEK label) — newest first */}
          <Link href="/reports/btc-crossroads-april-2026" style={{ ...card, padding: '20px 20px 18px', textDecoration: 'none', position: 'relative', overflow: 'hidden', display: 'block', borderColor: '#F59E0B40', background: 'linear-gradient(135deg, #F59E0B12, #111827)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#F59E0B' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#F59E0B', letterSpacing: 2 }}>🔥 THIS WEEK</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569' }}>HOT SECTOR</div>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.3, marginBottom: 8 }}>Bitcoin&apos;s April 2026 Crossroads</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
              {['BTC','ETF','HALVING'].map(t => (
                <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: '#0D1117', border: '1px solid #1E293B', color: '#F59E0B' }}>{t}</span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#94A3B8', lineHeight: 1.6, margin: '0 0 12px' }}>BTC at $71K, 43 percent below ATH. ETF cumulative $56B. Conviction 44/60. Repricing, not euphoria.</p>
            <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>Read Hot Sector →</div>
          </Link>

          <Link href="/reports/hot-sector-energy-april-2026" style={{ ...card, padding: '20px 20px 18px', textDecoration: 'none', position: 'relative', overflow: 'hidden', display: 'block', borderColor: '#D4A84340', background: 'linear-gradient(135deg, #D4A84312, #111827)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#D4A843' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#D4A843', letterSpacing: 2 }}>🔥 THIS WEEK</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569' }}>HOT SECTOR</div>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.3, marginBottom: 8 }}>After the Spike: 5 Energy Stocks</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
              {['XOM','CVX','MPC','VLO','OXY'].map(t => (
                <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: '#0D1117', border: '1px solid #1E293B', color: '#60A5FA' }}>{t}</span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#94A3B8', lineHeight: 1.6, margin: '0 0 12px' }}>WTI hit $116. Then the ceasefire dropped. The easy trade is over — refining margins and integrated cash flow now decide who wins.</p>
            <div style={{ fontSize: 11, color: '#D4A843', fontWeight: 700 }}>Read Hot Sector →</div>
          </Link>

          {[
            { ticker: 'NVDA', name: 'NVIDIA Corporation', slug: 'deep-dive-nvda-april-2026', grade: 'B+', score: 83, color: '#76B900', tag: 'AI Infrastructure', hook: '90% AI training share. P/E 65 vs industry 25. The CUDA moat is real — but so is the price.' },
            { ticker: 'MSFT', name: 'Microsoft', slug: 'deep-dive-msft-april-2026', grade: 'A-', score: 86, color: '#00A4EF', tag: 'Cloud + AI', hook: 'Azure growing 30%+ on OpenAI tailwind. Most boring monopoly money in the S&P 500.' },
            { ticker: 'TSLA', name: 'Tesla, Inc.', slug: 'deep-dive-tsla-april-2026', grade: 'B-', score: 71, color: '#E31937', tag: 'EV + Robotaxi', hook: 'Auto margins compressing. Energy + FSD optionality. Priced like a software company, sells like a carmaker.' },
          ].map(r => (
            <Link key={r.ticker} href={`/reports/${r.slug}`} style={{ ...card, padding: '20px 20px 18px', textDecoration: 'none', position: 'relative', overflow: 'hidden', display: 'block' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: r.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800, color: r.color }}>{r.ticker}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#64748B', marginTop: 2 }}>{r.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: '#F1F5F9', lineHeight: 1 }}>{r.grade}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#475569', marginTop: 2 }}>BEAF {r.score}/100</div>
                </div>
              </div>
              <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: `${r.color}18`, color: r.color, fontFamily: 'var(--mono)', marginBottom: 10 }}>{r.tag}</div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#94A3B8', lineHeight: 1.6, margin: '0 0 12px' }}>{r.hook}</p>
              <div style={{ fontSize: 11, color: '#C73E3A', fontWeight: 700 }}>Read Deep Dive →</div>
            </Link>
          ))}
        </div>
      </section>
      </FadeIn>

      {/* ── Market Leaders (Top 10 by Market Cap) ── */}
      <FadeIn delay={0.05}>
      <section id="markets" style={section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={sectionLabel('#3B82F6')}>US MARKET · LARGE CAP</div>
            <h2 style={sectionTitle}>Market Leaders</h2>
          </div>
          <Link href="/markets" style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, fontFamily: 'var(--sans)' }}>View All →</Link>
        </div>
        <LiveMarketsPreview />
      </section>
      </FadeIn>

      {/* ── Fortune Cookie (post-Market Leaders) ── */}
      <section style={{ padding: '0 24px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ padding: '24px', borderRadius: 16, background: '#111827', border: '1px solid #1E293B' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 3, textAlign: 'center', marginBottom: 12 }}>🥠 DAILY FORTUNE COOKIE</div>
          <FortuneCookie />
        </div>
      </section>

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

      {/* ── Newsletter CTA ── */}
      <section style={{ padding: '0 24px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <NewsletterCTA />
      </section>
    </div>
  );
}

