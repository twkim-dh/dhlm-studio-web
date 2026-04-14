import type { Metadata } from 'next';
import Link from 'next/link';
import unsplashManifest from '@/data/unsplash-manifest.json';

type ManifestEntry = { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } };
const manifest = unsplashManifest as Record<string, ManifestEntry>;

export const metadata: Metadata = {
  title: 'Investing 101 — Stock Market Fundamentals | DHLM Studio',
  description: 'Learn how the stock market actually works. Financial statements, valuation, earnings analysis, and building a real investment framework. Coming April 21, 2026.',
  alternates: { canonical: 'https://dhlm-studio.com/learn/investing-101' },
};

interface Lesson {
  week: number;
  title: string;
  description: string;
}

interface Phase {
  phase: number;
  title: string;
  color: string;
  lessons: Lesson[];
}

const CURRICULUM: Phase[] = [
  {
    phase: 1,
    title: 'Foundations',
    color: '#00D474',
    lessons: [
      {
        week: 1,
        title: 'How the Stock Market Actually Works',
        description: 'What you\'re actually buying when you buy a stock. How exchanges, brokers, and market makers fit together. Why prices move.',
      },
      {
        week: 2,
        title: 'Reading Financial Statements: Revenue, Profit, Cash Flow',
        description: 'Income statement, balance sheet, cash flow statement — and why most beginners read only one of the three.',
      },
      {
        week: 3,
        title: 'Valuation 101: P/E, EV/EBITDA, and Price-to-Book',
        description: 'What "expensive" and "cheap" actually mean in markets. Three core multiples and when each one matters.',
      },
      {
        week: 4,
        title: 'Risk, Return, and Portfolio Construction',
        description: 'Volatility vs. risk. Diversification math. The relationship between what you own and how much you can lose.',
      },
    ],
  },
  {
    phase: 2,
    title: 'Analysis',
    color: '#3B82F6',
    lessons: [
      {
        week: 5,
        title: 'Fundamental vs. Technical Analysis — When Each Works',
        description: 'What fundamentals tell you, what charts tell you, and why treating them as rivals is a mistake.',
      },
      {
        week: 6,
        title: 'Industry and Competitive Analysis: Moats, TAM, and Market Share',
        description: 'Porter\'s five forces, economic moats, total addressable market — and why most "TAM" estimates are fiction.',
      },
      {
        week: 7,
        title: 'Reading an Earnings Report Like a Professional',
        description: 'EPS beats, revenue guidance, operating leverage, management commentary — what to look for in 15 minutes.',
      },
      {
        week: 8,
        title: 'Macro Indicators Investors Actually Use',
        description: 'Fed funds rate, CPI, employment, yield curve — the six macro indicators that actually move stock prices.',
      },
    ],
  },
  {
    phase: 3,
    title: 'Strategy',
    color: '#D4A843',
    lessons: [
      {
        week: 9,
        title: 'Growth vs. Value vs. Dividend Investing',
        description: 'The evidence for each style. When growth outperforms, when value outperforms, and the myth of the permanent winner.',
      },
      {
        week: 10,
        title: 'ETFs vs. Individual Stocks: The Evidence',
        description: 'What the data says about active vs. passive investing. When individual stock selection makes sense.',
      },
      {
        week: 11,
        title: 'Taxes, Accounts, and Compounding: The Hidden Advantages',
        description: '401(k), IRA, taxable accounts. Long-term vs. short-term capital gains. How account structure affects real returns.',
      },
      {
        week: 12,
        title: 'Building Your Investment Framework — From Analysis to Decision',
        description: 'Position sizing, conviction scale, decision checklist, and when to sell. A complete framework you can actually use.',
      },
    ],
  },
];

export default function Investing101Page() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <Link href="/learn" style={{ fontSize: 11, color: '#475569', textDecoration: 'none', fontFamily: 'var(--mono)' }}>
            ← Brutal Edge Academy
          </Link>
        </div>

        {/* Hero image */}
        {manifest['learn-investing-101']?.src && (
          <div style={{ width: '100%', height: 180, borderRadius: 14, overflow: 'hidden', marginBottom: 28, position: 'relative', border: '1px solid #1E293B' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={manifest['learn-investing-101'].src} alt={manifest['learn-investing-101'].alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.6 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #00D47430 0%, transparent 60%)' }} />
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#00D474', letterSpacing: 3, marginBottom: 10 }}>📈 INVESTING 101</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 14px', lineHeight: 1.2 }}>
            Stock Market Fundamentals
          </h1>
          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 600 }}>
            How markets actually work. Financial statements, valuation, earnings analysis, and building a real investment framework. No beginner fluff — just what you need to know.
          </p>

          {/* Coming Soon Banner */}
          <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #D4A84330', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 20 }}>⏳</div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#D4A843', marginBottom: 2 }}>COMING WEEK 1 — APRIL 21, 2026</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>First lesson drops April 21. Subscribe below to get it in your inbox.</div>
            </div>
          </div>
        </div>

        {/* Full curriculum preview */}
        {CURRICULUM.map(phase => (
          <div key={phase.phase} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 5, background: `${phase.color}18`, color: phase.color, border: `1px solid ${phase.color}30`, letterSpacing: 1 }}>
                PHASE {phase.phase}
              </span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#E2E8F0' }}>{phase.title}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {phase.lessons.map(lesson => (
                <div key={lesson.week} style={{
                  background: '#111827', borderRadius: 12, border: '1px solid #1E293B',
                  padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14, opacity: 0.65,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: '#1E293B', border: '1px solid #334155',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#475569',
                  }}>
                    W{lesson.week}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#64748B', lineHeight: 1.3 }}>{lesson.title}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#1E293B', color: '#475569', fontFamily: 'var(--mono)', flexShrink: 0 }}>COMING SOON</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>{lesson.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Subscribe CTA */}
        <div style={{ marginTop: 8, padding: '24px', borderRadius: 14, background: 'linear-gradient(135deg, #00D47408, #00D47403)', border: '1px solid #00D47420', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 8 }}>📬 GET NOTIFIED</div>
          <p style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 14px' }}>
            Investing 101 launches April 21. Subscribe to get the first lesson in your inbox.
          </p>
          <Link href="/#subscribe" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: '#00D474', color: '#0B0F19', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
            Notify Me →
          </Link>
        </div>

        <div style={{ marginTop: 24 }}>
          <Link href="/learn" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← Back to Academy</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', marginTop: 20, textAlign: 'center' }}>
          Educational content only. Not investment advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
