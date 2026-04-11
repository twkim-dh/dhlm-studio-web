import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Crypto 101 — Learn Crypto From Scratch | DHLM Studio',
  description: 'A 12-week curriculum covering everything from "What is blockchain?" to DeFi, NFTs, and portfolio strategy. Brutal Edge style — no fluff, no hype.',
  alternates: { canonical: 'https://dhlm-studio.com/crypto-101' },
};

interface Lesson {
  week: number;
  title: string;
  slug?: string;        // if published → /blog/${slug}
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
    color: '#8B5CF6',
    lessons: [
      {
        week: 1,
        title: 'What is Blockchain? The Technology Behind Crypto',
        slug: 'crypto-101-what-is-blockchain',
        description: 'Distributed ledgers, nodes, consensus mechanisms — explained without the buzzword soup.',
      },
      {
        week: 2,
        title: 'Bitcoin — The Original Digital Money',
        description: 'Why Bitcoin was created, how mining works, and why the 21M supply cap matters.',
      },
      {
        week: 3,
        title: 'Ethereum & Smart Contracts',
        description: 'From digital money to programmable money — what Ethereum unlocked.',
      },
      {
        week: 4,
        title: 'Altcoins, Tokens & the Crypto Ecosystem',
        description: "Layer 1s, Layer 2s, stablecoins, memecoins — what's signal and what's noise.",
      },
    ],
  },
  {
    phase: 2,
    title: 'Markets & Analysis',
    color: '#3B82F6',
    lessons: [
      {
        week: 5,
        title: 'How Crypto Exchanges Work',
        description: 'CEX vs DEX, order books, liquidity, and how not to get wrecked by fees.',
      },
      {
        week: 6,
        title: 'Reading Crypto Charts',
        description: 'Candlesticks, volume, support/resistance — the basics every trader must know.',
      },
      {
        week: 7,
        title: 'On-Chain Analysis Basics',
        description: "The blockchain is public. Here's how to read it like a detective.",
      },
      {
        week: 8,
        title: 'DeFi — Decentralized Finance',
        description: 'Yield farming, liquidity pools, lending protocols — and the real risks involved.',
      },
    ],
  },
  {
    phase: 3,
    title: 'Strategy & Beyond',
    color: '#D4A843',
    lessons: [
      {
        week: 9,
        title: 'NFTs & Digital Ownership',
        description: 'What NFTs actually are, what they solve, and why most of them are worthless.',
      },
      {
        week: 10,
        title: 'Crypto Security — Wallets, Keys & Scams',
        description: "Not your keys, not your coins. How to actually secure your assets.",
      },
      {
        week: 11,
        title: 'Portfolio Strategy & Risk Management',
        description: 'Position sizing, diversification, and when to take profit — without the guru nonsense.',
      },
      {
        week: 12,
        title: 'The Future of Money',
        description: 'CBDCs, institutional adoption, and what crypto actually changes about finance.',
      },
    ],
  },
];

const published = CURRICULUM.flatMap(p => p.lessons).filter(l => l.slug).length;
const total = CURRICULUM.flatMap(p => p.lessons).length;

export default function Crypto101Page() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#8B5CF6', letterSpacing: 3, marginBottom: 10 }}>📚 CRYPTO 101</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 14px', lineHeight: 1.2 }}>
            Learn Crypto From Scratch
          </h1>
          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 600 }}>
            A 12-week curriculum covering everything from blockchain basics to DeFi and portfolio strategy.
            Brutal Edge style — data-driven, zero hype, zero BS.
          </p>

          {/* Progress bar */}
          <div style={{ background: '#111827', borderRadius: 10, border: '1px solid #1E293B', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6', fontFamily: 'var(--mono)' }}>CURRICULUM PROGRESS</span>
                <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--mono)' }}>{published}/{total} published</span>
              </div>
              <div style={{ height: 6, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(published / total) * 100}%`, background: 'linear-gradient(90deg, #8B5CF6, #6D28D9)', borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Phases */}
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
                const href = isPublished ? `/blog/${lesson.slug}` : undefined;

                const card = (
                  <div style={{
                    background: '#111827',
                    borderRadius: 12,
                    border: `1px solid ${isPublished ? `${phase.color}25` : '#1E293B'}`,
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    opacity: isPublished ? 1 : 0.6,
                    cursor: isPublished ? 'pointer' : 'default',
                    textDecoration: 'none',
                  }}>
                    {/* Week badge */}
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
                        <span style={{ fontSize: 14, fontWeight: 700, color: isPublished ? '#F1F5F9' : '#64748B', lineHeight: 1.3 }}>
                          {lesson.title}
                        </span>
                        {isPublished ? (
                          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${phase.color}18`, color: phase.color, fontFamily: 'var(--mono)', flexShrink: 0 }}>
                            READ →
                          </span>
                        ) : (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#1E293B', color: '#475569', fontFamily: 'var(--mono)', flexShrink: 0 }}>
                            COMING SOON
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{lesson.description}</p>
                    </div>
                  </div>
                );

                return href ? (
                  <Link key={lesson.week} href={href} style={{ textDecoration: 'none' }}>
                    {card}
                  </Link>
                ) : (
                  <div key={lesson.week}>{card}</div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Subscribe CTA */}
        <div style={{ marginTop: 8, padding: '24px 24px', borderRadius: 14, background: 'linear-gradient(135deg, #8B5CF608, #8B5CF603)', border: '1px solid #8B5CF620', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#8B5CF6', letterSpacing: 2, marginBottom: 8 }}>📬 NEW LESSONS EVERY WEEK</div>
          <p style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 14px' }}>
            New Crypto 101 lesson drops every Wednesday. Subscribe to get it in your inbox.
          </p>
          <Link href="/#subscribe" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: '#8B5CF6', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Subscribe Free →
          </Link>
        </div>

        {/* Back links */}
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <Link href="/blog" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← All Blog Posts</Link>
          <Link href="/rankings/crypto" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>Crypto Rankings →</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', marginTop: 20, textAlign: 'center' }}>
          Educational content only. Not investment advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
