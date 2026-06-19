import type { Metadata } from 'next';
import Link from 'next/link';
import unsplashManifest from '@/data/unsplash-manifest.json';

type ManifestEntry = { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null };
const manifest = unsplashManifest as Record<string, ManifestEntry>;

export const metadata: Metadata = {
  title: 'Investing 101 — Stock Market Fundamentals | DHLM Studio',
  description: 'Learn how the stock market actually works. Financial statements, valuation, earnings analysis, and building a real investment framework. 12 lessons now live.',
  alternates: { canonical: 'https://dhlm-studio.com/learn/investing-101' },
};

interface Lesson {
  week: number;
  title: string;
  description: string;
  slug?: string;
  isLearnRoute?: boolean;
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
      { week: 1, title: 'What Is a Stock, Really?', slug: 'investing-101-beginner-w1-what-is-a-stock-really', description: 'Forget the ticker symbols. A stock is a legal claim on a living business. Understand that, and everything else follows.', isLearnRoute: true },
      { week: 2, title: 'How the Market Actually Works', slug: 'investing-101-beginner-w2-how-the-market-actually-works', description: 'Exchanges, market makers, clearinghouses — what actually happens between "buy" and "share in your account."', isLearnRoute: true },
      { week: 3, title: 'Opening Your First Brokerage Account', slug: 'investing-101-beginner-w3-opening-your-first-brokerage-account', description: 'Choosing a broker, account types, and the first decisions every new investor faces before placing a single trade.', isLearnRoute: true },
    ],
  },
  {
    phase: 2,
    title: 'Reading Companies',
    color: '#3B82F6',
    lessons: [
      { week: 4, title: 'Reading a Company (Part 1): The Income Statement', slug: 'investing-101-beginner-w4-reading-income-statement', description: 'Revenue, gross profit, operating income, net income — what each number actually tells you.', isLearnRoute: true },
      { week: 5, title: 'Reading a Company (Part 2): The Balance Sheet', slug: 'investing-101-beginner-w5-reading-balance-sheet', description: 'Assets, liabilities, equity — the snapshot of what a company owns, owes, and what is left for shareholders.', isLearnRoute: true },
      { week: 6, title: 'Reading a Company (Part 3): The Cash Flow Statement', slug: 'investing-101-beginner-w6-reading-cash-flow-statement', description: 'Why free cash flow matters more than earnings, and how to tell a profitable business from a cash-burning one.', isLearnRoute: true },
      { week: 7, title: 'What Is a Business Model?', slug: 'investing-101-beginner-w7-what-is-a-business-model', description: 'How a company actually makes money — and why the model shapes everything about how to value it.', isLearnRoute: true },
      { week: 8, title: 'Valuation Basics: P/E, P/B, PEG', slug: 'investing-101-beginner-w8-valuation-basics', description: 'What does it mean for a stock to be "expensive" or "cheap"? Three core multiples and how to use them.', isLearnRoute: true },
    ],
  },
  {
    phase: 3,
    title: 'Strategy',
    color: '#D4A843',
    lessons: [
      { week: 9, title: 'Dividends and Total Return', slug: 'investing-101-beginner-w9-dividends-and-total-return', description: 'Yield, payout ratio, dividend growth — and why total return is the only number that matters.', isLearnRoute: true },
      { week: 10, title: 'Diversification and Portfolio Basics', slug: 'investing-101-beginner-w10-diversification-portfolio-basics', description: 'Why spreading risk works, how much diversification is enough, and building a portfolio that survives a crash.', isLearnRoute: true },
      { week: 11, title: "The Investor's Mind: Fear, Greed, Patience", slug: 'investing-101-beginner-w11-investors-mind', description: 'The behavioral traps that destroy returns — and how to recognize them before they cost you.', isLearnRoute: true },
      { week: 12, title: 'Your First 5 Years: A Realistic Roadmap', slug: 'investing-101-beginner-w12-your-first-five-years', description: 'A concrete action plan from Day 1 through Year 5. What to do, in what order, with what goals.', isLearnRoute: true },
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
          <div style={{ width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 28, position: 'relative', border: '1px solid #1E293B' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={manifest['learn-investing-101'].src} alt={manifest['learn-investing-101'].alt} style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.6 }} />
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

          {/* Series live banner */}
          <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #00D47430', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 20 }}>📗</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#00D474', marginBottom: 2 }}>12 LESSONS NOW LIVE</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Full beginner series published. Start with Week 1 below.</div>
            </div>
            <Link href="/learn/investing-101-beginner-w1-what-is-a-stock-really" style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 8, background: '#00D474', color: '#0B0F19', fontSize: 12, fontWeight: 800, textDecoration: 'none', flexShrink: 0 }}>
              Start →
            </Link>
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
              {phase.lessons.map(lesson => {
                const isPublished = !!lesson.slug;
                const card = (
                  <div key={lesson.week} style={{
                    background: '#111827', borderRadius: 12,
                    border: `1px solid ${isPublished ? `${phase.color}25` : '#1E293B'}`,
                    padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14,
                    opacity: isPublished ? 1 : 0.65,
                    cursor: isPublished ? 'pointer' : 'default',
                    textDecoration: 'none',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: isPublished ? `${phase.color}20` : '#1E293B',
                      border: `1px solid ${isPublished ? `${phase.color}40` : '#334155'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800,
                      color: isPublished ? phase.color : '#475569',
                    }}>
                      W{lesson.week}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: isPublished ? '#F1F5F9' : '#64748B', lineHeight: 1.3 }}>{lesson.title}</span>
                        {isPublished ? (
                          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${phase.color}18`, color: phase.color, fontFamily: 'var(--mono)', flexShrink: 0 }}>READ →</span>
                        ) : (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#1E293B', color: '#475569', fontFamily: 'var(--mono)', flexShrink: 0 }}>COMING SOON</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: isPublished ? '#64748B' : '#475569', margin: 0, lineHeight: 1.5 }}>{lesson.description}</p>
                    </div>
                  </div>
                );
                const href = `/learn/${lesson.slug}`;
                return isPublished ? (
                  <Link key={lesson.week} href={href} style={{ textDecoration: 'none' }}>{card}</Link>
                ) : (
                  <div key={lesson.week}>{card}</div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Series CTAs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginTop: 8 }}>
          <div style={{ padding: '24px', borderRadius: 14, background: 'linear-gradient(135deg, #00D47408, #00D47403)', border: '1px solid #00D47420', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 8 }}>BEGINNER SERIES · W1–W12</div>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 14px', lineHeight: 1.5 }}>
              12 lessons live. Stocks, statements, valuation basics.
            </p>
            <Link href="/learn/investing-101-beginner" style={{ display: 'inline-block', padding: '9px 20px', borderRadius: 8, background: '#00D474', color: '#0B0F19', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
              View Beginner →
            </Link>
          </div>
          <div style={{ padding: '24px', borderRadius: 14, background: 'linear-gradient(135deg, #60A5FA08, #60A5FA03)', border: '1px solid #60A5FA20', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#60A5FA', letterSpacing: 2, marginBottom: 8 }}>INTERMEDIATE SERIES · W13–W24</div>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 14px', lineHeight: 1.5 }}>
              12 lessons. Valuation, moats, forensics, portfolio sizing.
            </p>
            <Link href="/learn/investing-101-intermediate-w13-three-valuations" style={{ display: 'inline-block', padding: '9px 20px', borderRadius: 8, background: '#60A5FA', color: '#0B0F19', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
              View Intermediate →
            </Link>
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
