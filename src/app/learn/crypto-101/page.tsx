import type { Metadata } from 'next';
import Link from 'next/link';
import unsplashManifest from '@/data/unsplash-manifest.json';

type ManifestEntry = { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null };
const manifest = unsplashManifest as Record<string, ManifestEntry>;

export const metadata: Metadata = {
  title: 'Crypto 101 — Learn Crypto From Scratch | DHLM Studio',
  description: 'A 12-week curriculum covering everything from "What is blockchain?" to DeFi, NFTs, and portfolio strategy. Brutal Edge style — no fluff, no hype.',
  alternates: { canonical: 'https://dhlm-studio.com/learn/crypto-101' },
};

interface Lesson {
  week: number;
  title: string;
  slug?: string;        // if published → /blog/${slug}
  description: string;
  imageKey: string;
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
        title: 'What Is Blockchain? (And Why Most Explanations Are Useless)',
        slug: 'crypto-101-what-is-blockchain',
        description: 'Distributed ledgers, nodes, consensus mechanisms — explained without the buzzword soup. How a Bitcoin transaction actually works, step by step.',
        imageKey: 'learn-w1-blockchain',
      },
      {
        week: 2,
        title: 'Bitcoin vs. Ethereum — The Only Differences That Actually Matter',
        slug: 'crypto-101-bitcoin-vs-ethereum',
        description: 'Bitcoin is designed to be money. Ethereum is designed to be a computer. Everything else flows from that distinction.',
        imageKey: 'learn-w2-btc-eth',
      },
      {
        week: 3,
        title: 'Crypto Wallets Explained — Hot, Cold, and Everything Between',
        slug: 'crypto-101-wallets-explained',
        description: 'In 2025, hackers stole $3.4B in crypto. Your wallet doesn\'t hold coins — it holds keys. Here\'s the difference that could save your portfolio.',
        imageKey: 'learn-w3-wallets',
      },
      {
        week: 4,
        title: 'How to Actually Buy Crypto Without Getting Scammed',
        slug: 'crypto-101-how-to-buy-crypto',
        description: 'Choosing a real exchange, understanding where the fees actually hide, and recognizing the red flags before they cost you anything.',
        imageKey: 'learn-w4-buy-crypto',
      },
    ],
  },
  {
    phase: 2,
    title: 'Yields, DeFi & Markets',
    color: '#3B82F6',
    lessons: [
      {
        week: 5,
        title: 'Staking Explained — Free Money or Hidden Risk?',
        slug: 'crypto-101-staking-explained',
        description: 'The real yields in 2026 (ETH pays 2.8–3.8%, not 15%), the inflation dilution nobody mentions, and a practical framework for beginners.',
        imageKey: 'learn-w5-staking',
      },
      {
        week: 6,
        title: 'DeFi for Normal People — What It Is and Why You Should Care',
        slug: 'crypto-101-defi-explained',
        description: 'Lending, borrowing, DEXs, yield farming — and the risks that DeFi marketing never puts in the headline.',
        imageKey: 'learn-w6-defi',
      },
      {
        week: 7,
        title: 'Reading Crypto Charts: The 5 Patterns That Actually Matter',
        slug: 'crypto-101-chart-patterns',
        description: 'Candlesticks, volume, support/resistance, and how to read a chart without fooling yourself.',
        imageKey: 'learn-w7-charts',
      },
      {
        week: 8,
        title: 'Portfolio Basics: How Much Crypto Should You Actually Own?',
        slug: 'crypto-101-portfolio-basics',
        description: 'Total allocation, core-satellite strategy, three model portfolios, DCA, and rebalancing.',
        imageKey: 'learn-w8-portfolio',
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
        title: 'Layer 1 vs. Layer 2: Solana, Arbitrum, and the Scaling Wars',
        slug: 'crypto-101-layer1-vs-layer2',
        description: 'The blockchain trilemma, why Ethereum needs rollups, and what L2 fragmentation means for your portfolio.',
        imageKey: 'learn-w9-layer2',
      },
      {
        week: 10,
        title: 'NFTs in 2026: Dead or Evolving?',
        slug: 'crypto-101-nfts-2026',
        description: 'What died, what survived, Bitcoin Ordinals, soulbound tokens, and the honest verdict on what remains valuable.',
        imageKey: 'learn-w10-nfts',
      },
      {
        week: 11,
        title: 'Crypto Taxes: What the IRS Actually Wants From You',
        slug: 'crypto-101-crypto-taxes',
        description: 'Every swap is a taxable event. Cost basis methods, Form 1099-DA, staking/DeFi treatment, and tax-loss harvesting.',
        imageKey: 'learn-w11-taxes',
      },
      {
        week: 12,
        title: 'Advanced Strategies: Yield Farming, Liquidity Pools, and When to Walk Away',
        slug: 'crypto-101-advanced-strategies',
        description: 'DeFi yield strategies, impermanent loss explained, risk management framework, and a complete decision checklist.',
        imageKey: 'learn-w12-advanced',
      },
    ],
  },
];

const published = CURRICULUM.flatMap(p => p.lessons).filter((l: Lesson) => l.slug).length;
const total = CURRICULUM.flatMap(p => p.lessons).length;

export default function Crypto101Page() {
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
        {manifest['learn-crypto-101']?.src && (
          <div style={{ width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 28, border: '1px solid #1E293B' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={manifest['learn-crypto-101'].src} alt={manifest['learn-crypto-101'].alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#8B5CF6', letterSpacing: 3, marginBottom: 10 }}>🪙 CRYPTO 101</div>
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

                const img = manifest[lesson.imageKey];
                const card = (
                  <div style={{
                    background: '#111827',
                    borderRadius: 12,
                    border: `1px solid ${isPublished ? `${phase.color}25` : '#1E293B'}`,
                    padding: '0',
                    display: 'flex',
                    alignItems: 'stretch',
                    opacity: isPublished ? 1 : 0.6,
                    cursor: isPublished ? 'pointer' : 'default',
                    textDecoration: 'none',
                    overflow: 'hidden',
                  }}>
                    {/* Week image thumbnail */}
                    {img?.src && (
                      <div style={{ width: 80, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt={img.alt} style={{ width: '100%', height: 'auto', display: 'block', opacity: isPublished ? 0.75 : 0.35 }} />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, transparent 40%, #111827 100%)` }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
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
                          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${phase.color}18`, color: phase.color, fontFamily: 'var(--mono)', flexShrink: 0 }}>READ →</span>
                        ) : (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#1E293B', color: '#475569', fontFamily: 'var(--mono)', flexShrink: 0 }}>COMING SOON</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{lesson.description}</p>
                    </div>
                    </div>
                  </div>
                );

                return href ? (
                  <Link key={lesson.week} href={href} style={{ textDecoration: 'none' }}>{card}</Link>
                ) : (
                  <div key={lesson.week}>{card}</div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Subscribe CTA */}
        <div style={{ marginTop: 8, padding: '24px', borderRadius: 14, background: 'linear-gradient(135deg, #8B5CF608, #8B5CF603)', border: '1px solid #8B5CF620', textAlign: 'center' }}>
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
          <Link href="/learn" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← Back to Academy</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', marginTop: 20, textAlign: 'center' }}>
          Educational content only. Not investment advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
