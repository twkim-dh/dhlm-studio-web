import { permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Investing 101 Intermediate Series — 12 Lessons | Brutal Edge',
  description: 'A 12-week intermediate series covering advanced valuation, moat analysis, 10-K forensics, earnings call interpretation, and portfolio management. Applied to real stocks.',
  alternates: { canonical: 'https://dhlm-studio.com/learn/investing-101-intermediate' },
  openGraph: {
    title: 'Investing 101 Intermediate — Brutal Edge',
    description: 'From valuation frameworks to position sizing. 12 lessons. Real companies. Zero hype.',
    images: [{ url: 'https://dhlm-studio.com/images/content/INV-101-W13.webp', width: 1792, height: 1024 }],
  },
};

const PHASES = [
  {
    phase: 1, title: 'Valuation', color: '#60A5FA',
    lessons: [
      {
        week: 13, slug: 'investing-101-intermediate-w13-three-valuations',
        title: 'Three Valuations. Three Answers. Which One Wins?',
        description: 'Tesla through DCF, comparables, and precedent transactions — three methods, three answers, and what the disagreement tells you.',
        readingTime: '17 min',
      },
      {
        week: 14, slug: 'investing-101-intermediate-w14-dcf-lies',
        title: 'DCF: The Spreadsheet That Lies to You',
        description: "NVIDIA's DCF says it's overvalued. The stock has compounded 30% per year for five years. This week we find out why — and what to do instead.",
        readingTime: '16 min',
      },
      {
        week: 15, slug: 'investing-101-intermediate-w15-multiples',
        title: 'Same Industry. Different Multiples. Why?',
        description: 'Microsoft and Alphabet both trade at ~30x. The three layers that explain why identical P/Es reflect completely different businesses.',
        readingTime: '15 min',
      },
    ],
  },
  {
    phase: 2, title: 'Moat Analysis', color: '#A78BFA',
    lessons: [
      {
        week: 16, slug: 'investing-101-intermediate-w16-five-moats',
        title: "Most 'Moats' Aren't Moats. Here Are the Five That Are.",
        description: 'Five structural moats that show up in a decade of compounding ROIC — applied to five real businesses you probably know.',
        readingTime: '16 min',
      },
      {
        week: 17, slug: 'investing-101-intermediate-w17-moat-erosion',
        title: 'Every Moat Dies. The Question Is When.',
        description: 'Intel went from 25%+ ROIC to negative in 20 years. The six-stage erosion sequence — and how to spot it years before it shows in earnings.',
        readingTime: '15 min',
      },
      {
        week: 18, slug: 'investing-101-intermediate-w18-new-tech-moats',
        title: "Moats in Markets That Didn't Exist 5 Years Ago",
        description: "Anthropic's ARR went from $1B to $30B in 18 months. The rebuilt moat framework for AI-native companies — from scratch.",
        readingTime: '15 min',
      },
    ],
  },
  {
    phase: 3, title: 'Document Forensics', color: '#34D399',
    lessons: [
      {
        week: 19, slug: 'investing-101-intermediate-w19-10k-forensics',
        title: "The 10-K Sections Most Investors Skip. Pros Read Them First.",
        description: "Working through Tesla's actual 10-K — risk factors, MD&A footnotes, and the sections that contain the real signals.",
        readingTime: '17 min',
      },
      {
        week: 20, slug: 'investing-101-intermediate-w20-earnings-calls',
        title: "What CEOs Don't Say on Earnings Calls Tells You More",
        description: "Tesla Q1 2026 earnings call — professional framework for reading what management deflects, avoids, and stops mentioning.",
        readingTime: '16 min',
      },
      {
        week: 21, slug: 'investing-101-intermediate-w21-proxy-statements',
        title: 'The Document That Reveals Who Really Runs the Company',
        description: 'Musk vs. Buffett as a governance case study. What the proxy statement actually reveals — and why most investors never read it.',
        readingTime: '16 min',
      },
    ],
  },
  {
    phase: 4, title: 'Portfolio Management', color: '#F59E0B',
    lessons: [
      {
        week: 22, slug: 'investing-101-intermediate-w22-position-sizing',
        title: 'Kelly Criterion for People Who Hate Math',
        description: 'The framework professional gamblers and fund managers both use — applied to NVDA, TSLA, and MSFT with real numbers.',
        readingTime: '17 min',
      },
      {
        week: 23, slug: 'investing-101-intermediate-w23-correlation-risk',
        title: '16 Positions. 1 Bet. The Diversification Illusion.',
        description: 'Holding NVDA, MSFT, GOOGL, META, AMZN, TSLA, AAPL — and 9 more AI names — is one position. Why the diversification is not what you think.',
        readingTime: '15 min',
      },
      {
        week: 24, slug: 'investing-101-intermediate-w24-when-to-sell',
        title: 'When to Sell. The Hardest Decision in Investing.',
        description: 'Apple 2014–2024: two investors, one stock, one sold. A three-part framework for the only three reasons that justify selling.',
        readingTime: '16 min',
      },
    ],
  },
];

export default function Investing101IntermediatePage() {
  permanentRedirect('/learn/investing-101');
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 11, fontFamily: 'var(--mono)', color: '#475569', flexWrap: 'wrap' }}>
          <Link href="/learn" style={{ color: '#475569', textDecoration: 'none' }}>Brutal Edge Academy</Link>
          <span>/</span>
          <span style={{ color: '#64748B' }}>Investing 101 Intermediate</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: '#60A5FA18', color: '#60A5FA', border: '1px solid #60A5FA30', letterSpacing: 1 }}>
              INVESTING 101 INTERMEDIATE
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#1E293B', color: '#64748B' }}>
              12 LESSONS · 4 PHASES · W13–W24
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 16px', lineHeight: 1.2 }}>
            You Know the Basics.<br />Now Build the Edge.
          </h1>
          <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
            Twelve weeks of institutional-grade analysis applied to real companies. Valuation that goes beyond P/E.
            Moat analysis that goes beyond buzzwords. Document forensics, earnings call interpretation, and portfolio
            management frameworks that professional investors actually use.
          </p>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              <span style={{ color: '#60A5FA', fontWeight: 700 }}>~190 min</span> total reading
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              <span style={{ color: '#60A5FA', fontWeight: 700 }}>Real companies</span>: TSLA, NVDA, MSFT, AAPL, Intel, Anthropic
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              <span style={{ color: '#60A5FA', fontWeight: 700 }}>37 original charts</span> — all generated from real data
            </div>
          </div>
        </div>

        {/* Prerequisite notice */}
        <div style={{ padding: '14px 20px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B', marginBottom: 36, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ color: '#60A5FA', fontWeight: 800, fontSize: 14, flexShrink: 0, lineHeight: 1.5 }}>→</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>Prerequisite: Investing 101 Beginner</div>
            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
              This series assumes you can read a basic income statement and understand what P/E means.
              New to investing?{' '}
              <Link href="/learn/investing-101-beginner" style={{ color: '#60A5FA', textDecoration: 'underline' }}>Start with the Beginner series →</Link>
            </div>
          </div>
        </div>

        {/* Start button */}
        <div style={{ marginBottom: 48 }}>
          <Link href="/learn/investing-101-intermediate-w13-three-valuations" style={{
            display: 'inline-block', padding: '14px 28px', borderRadius: 10,
            background: '#60A5FA', color: '#0B0F19', fontSize: 14, fontWeight: 800,
            textDecoration: 'none', letterSpacing: 0.3,
          }}>
            Start W13: Three Valuations →
          </Link>
        </div>

        {/* Phase curriculum */}
        {PHASES.map(({ phase, title: phaseTitle, color, lessons }) => (
          <div key={phase} style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color }}>{phase}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color, letterSpacing: 1.5 }}>PHASE {phase}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9' }}>{phaseTitle}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 4 }}>
              {lessons.map((lesson) => (
                <Link key={lesson.slug} href={`/learn/${lesson.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '16px 20px', borderRadius: 10,
                    background: '#111827', border: '1px solid #1E293B',
                    transition: 'border-color 0.15s',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: 72, borderRadius: 6, overflow: 'hidden',
                      background: '#1B2A4A', flexShrink: 0,
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/content/INV-101-W${lesson.week}.png`}
                        alt={lesson.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color, padding: '2px 7px', borderRadius: 4, background: `${color}14` }}>
                          W{lesson.week}
                        </span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#475569' }}>{lesson.readingTime}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.35, marginBottom: 5 }}>{lesson.title}</div>
                      <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.55 }}>{lesson.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Philosophy */}
        <div style={{ padding: '28px 28px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B', marginTop: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#60A5FA', letterSpacing: 2, marginBottom: 14 }}>HOW THIS SERIES WORKS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              ['Real Companies', 'Every lesson uses actual earnings data, real 10-K filings, and live market numbers — not textbook examples.'],
              ['Applied Frameworks', 'Each framework is demonstrated, not just explained. You see it work on a real stock before applying it yourself.'],
              ['37 Original Charts', 'Every chart is generated from real data using the same methodology professional analysts use.'],
            ].map(([title, desc]) => (
              <div key={title}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 20 }}>
          <Link href="/learn/investing-101-beginner" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← Beginner Series</Link>
          <Link href="/learn" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← Brutal Edge Academy</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', marginTop: 24, textAlign: 'center' }}>
          Educational content only. Not investment advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
