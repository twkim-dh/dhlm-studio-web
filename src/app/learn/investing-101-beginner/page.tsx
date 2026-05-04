import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Investing 101 Beginner Series — 12 Lessons | DHLM Studio',
  description: 'A 12-week beginner series covering stocks, market structure, financial statements, valuation, and your first investment framework. Data-driven, zero hype.',
  alternates: { canonical: 'https://dhlm-studio.com/learn/investing-101-beginner' },
};

const HERO_MAP: Record<string, string> = {
  'investing-101-beginner-w1-what-is-a-stock-really':          '/images/content/investing-101-beginner-w1-what-is-a-stock-hero.webp',
  'investing-101-beginner-w2-how-the-market-actually-works':   '/images/content/investing-101-beginner-w2-how-market-works-hero.webp',
  'investing-101-beginner-w3-opening-your-first-brokerage-account': '/images/content/investing-101-beginner-w3-brokerage-account-hero.webp',
  'investing-101-beginner-w4-reading-income-statement':        '/images/content/investing-101-beginner-w4-income-statement-hero.webp',
  'investing-101-beginner-w5-reading-balance-sheet':           '/images/content/investing-101-beginner-w5-balance-sheet-hero.webp',
  'investing-101-beginner-w6-reading-cash-flow-statement':     '/images/content/investing-101-beginner-w6-cash-flow-statement-hero.webp',
  'investing-101-beginner-w7-what-is-a-business-model':        '/images/content/investing-101-beginner-w7-business-model-hero.webp',
  'investing-101-beginner-w8-valuation-basics':                '/images/content/investing-101-beginner-w8-valuation-basics-hero.webp',
  'investing-101-beginner-w9-dividends-and-total-return':      '/images/content/investing-101-beginner-w9-dividends-total-return-hero.webp',
  'investing-101-beginner-w10-diversification-portfolio-basics': '/images/content/investing-101-beginner-w10-diversification-portfolio-hero.webp',
  'investing-101-beginner-w11-investors-mind':                 '/images/content/investing-101-beginner-w11-investors-mind-hero.webp',
  'investing-101-beginner-w12-your-first-five-years':          '/images/content/investing-101-beginner-w12-five-year-roadmap-hero.webp',
};

interface Lesson {
  week: number;
  slug: string;
  title: string;
  description: string;
  readingTime: string;
}

const PHASES = [
  {
    phase: 1, title: 'Foundations', color: '#00D474',
    lessons: [
      { week: 1, slug: 'investing-101-beginner-w1-what-is-a-stock-really', title: 'What Is a Stock, Really?', description: 'Forget the ticker symbols and price charts for a moment. A stock is a legal claim on a living business. Understand that, and everything else follows.', readingTime: '12 min' },
      { week: 2, slug: 'investing-101-beginner-w2-how-the-market-actually-works', title: 'How the Market Actually Works', description: 'Click "buy" and a share appears in your account in seconds. Behind that click is a hundred-year-old system of exchanges, market makers, and clearinghouses.', readingTime: '13 min' },
      { week: 3, slug: 'investing-101-beginner-w3-opening-your-first-brokerage-account', title: 'Opening Your First Brokerage Account', description: 'Choosing a broker, account types, and the first decisions every new investor faces before placing a single trade.', readingTime: '13 min' },
    ],
  },
  {
    phase: 2, title: 'Reading Companies', color: '#3B82F6',
    lessons: [
      { week: 4, slug: 'investing-101-beginner-w4-reading-income-statement', title: 'Reading a Company (Part 1): The Income Statement', description: 'Revenue, gross profit, operating income, net income — what each number actually tells you and which ones investors watch most.', readingTime: '14 min' },
      { week: 5, slug: 'investing-101-beginner-w5-reading-balance-sheet', title: 'Reading a Company (Part 2): The Balance Sheet', description: 'Assets, liabilities, equity — the snapshot of what a company owns, what it owes, and what is left for shareholders.', readingTime: '14 min' },
      { week: 6, slug: 'investing-101-beginner-w6-reading-cash-flow-statement', title: 'Reading a Company (Part 3): The Cash Flow Statement', description: 'Why free cash flow matters more than earnings, and how to tell a profitable business from a cash-burning one.', readingTime: '14 min' },
      { week: 7, slug: 'investing-101-beginner-w7-what-is-a-business-model', title: 'What Is a Business Model?', description: 'How a company actually makes money — subscription, marketplace, advertising, hardware, licensing — and why the model shapes everything.', readingTime: '13 min' },
      { week: 8, slug: 'investing-101-beginner-w8-valuation-basics', title: 'Valuation Basics: P/E, P/B, PEG', description: 'What does it mean for a stock to be "expensive" or "cheap"? Three core multiples and how to use them without fooling yourself.', readingTime: '14 min' },
    ],
  },
  {
    phase: 3, title: 'Strategy', color: '#D4A843',
    lessons: [
      { week: 9, slug: 'investing-101-beginner-w9-dividends-and-total-return', title: 'Dividends and Total Return', description: 'Yield, payout ratio, dividend growth — and why total return (not just dividends) is the only number that matters.', readingTime: '13 min' },
      { week: 10, slug: 'investing-101-beginner-w10-diversification-portfolio-basics', title: 'Diversification and Portfolio Basics', description: 'Why spreading risk works, how much diversification is enough, and building a portfolio that can survive a crash.', readingTime: '14 min' },
      { week: 11, slug: 'investing-101-beginner-w11-investors-mind', title: "The Investor's Mind: Fear, Greed, Patience", description: 'The behavioral traps that destroy returns — panic selling, FOMO, overconfidence — and how to recognize them before they cost you.', readingTime: '14 min' },
      { week: 12, slug: 'investing-101-beginner-w12-your-first-five-years', title: 'Your First 5 Years: A Realistic Roadmap', description: 'A concrete action plan from Day 1 through Year 5. No platitudes — just what to do, in what order, with what goals.', readingTime: '14 min' },
    ],
  },
];

export default function Investing101BeginnerPage() {
  const allLessons: Lesson[] = PHASES.flatMap(p => p.lessons);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <Link href="/learn" style={{ fontSize: 11, color: '#475569', textDecoration: 'none', fontFamily: 'var(--mono)' }}>
            ← Brutal Edge Academy
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#00D474', letterSpacing: 3, marginBottom: 10 }}>
            📈 INVESTING 101 — BEGINNER SERIES
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 14px', lineHeight: 1.2 }}>
            Stock Market Fundamentals
          </h1>
          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 600 }}>
            12 lessons. 3 phases. Start with what a stock actually is. End with a real investment framework you can use on Day 1.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'LESSONS', value: '12' },
              { label: 'PHASES', value: '3' },
              { label: 'LEVEL', value: 'Beginner' },
              { label: 'PUBLISHED', value: 'Apr 20, 2026' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800, color: '#00D474' }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, color: '#475569', letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Start CTA */}
        <Link href={`/learn/${allLessons[0].slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: '#00D474', color: '#0B0F19', fontSize: 14, fontWeight: 800, textDecoration: 'none', marginBottom: 40 }}>
          Start Week 1 →
        </Link>

        {/* Curriculum by phase */}
        {PHASES.map(phase => (
          <div key={phase.phase} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 5, background: `${phase.color}18`, color: phase.color, border: `1px solid ${phase.color}30`, letterSpacing: 1 }}>
                PHASE {phase.phase}
              </span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#E2E8F0' }}>{phase.title}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {phase.lessons.map(lesson => {
                const hero = HERO_MAP[lesson.slug];
                return (
                  <Link key={lesson.week} href={`/learn/${lesson.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#111827', borderRadius: 12,
                      border: `1px solid ${phase.color}25`,
                      padding: hero ? 0 : '16px 18px',
                      display: 'flex', alignItems: hero ? 'stretch' : 'flex-start',
                      gap: hero ? 0 : 14, overflow: 'hidden',
                      transition: 'border-color 0.15s',
                    }}>
                      {hero && (
                        <div style={{ width: 100, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={hero} alt={lesson.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: 0.7 }} />
                        </div>
                      )}
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                          background: `${phase.color}18`, border: `1px solid ${phase.color}40`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: phase.color,
                        }}>
                          W{lesson.week}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', lineHeight: 1.3 }}>{lesson.title}</span>
                            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${phase.color}18`, color: phase.color, fontFamily: 'var(--mono)', flexShrink: 0 }}>READ →</span>
                          </div>
                          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 4px', lineHeight: 1.5 }}>{lesson.description}</p>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#475569' }}>🕐 {lesson.readingTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Philosophy */}
        <div style={{ padding: '22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B', marginTop: 8, marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 12 }}>THE BRUTAL EDGE APPROACH</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { icon: '📊', label: 'Data First', desc: 'Every claim backed by numbers, not vibes.' },
              { icon: '🚫', label: 'Zero Hype', desc: "We say what won't work, not just what will." },
              { icon: '⚡', label: 'Opinionated', desc: 'We give verdicts. Not just "it depends."' },
            ].map(p => (
              <div key={p.label}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{p.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0', marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
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
