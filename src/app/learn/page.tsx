import type { Metadata } from 'next';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import LearnClient from '@/components/LearnClient';
import unsplashManifest from '@/data/unsplash-manifest.json';

export const metadata: Metadata = {
  title: 'Brutal Edge Academy — Learn Investing | DHLM Studio',
  description: 'Learn investing the way it actually works. Crypto 101, Investing 101, and Paper vs. Profit — data-driven, zero hype, Brutal Edge style.',
  alternates: { canonical: 'https://dhlm-studio.com/learn' },
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content/research');
type ManifestEntry = { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null };
const manifest = unsplashManifest as Record<string, ManifestEntry>;

export interface ResearchItem {
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  badge?: string;
  date: string;
  readTime: string;
  verdict?: string;
  description: string;
  paperAuthors?: string;
  paperYear?: number;
  heroImage?: string;
}

export interface LessonItem {
  week: number;
  slug?: string;
  title: string;
  description: string;
  imageKey: string;
  thumb: string;
  thumbAlt: string;
  phase: number;
  phaseTitle: string;
  phaseColor: string;
}

function getAllResearch(): ResearchItem[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
    const out: ResearchItem[] = [];
    for (const f of files) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) continue;
      const fm: Record<string, unknown> = {};
      for (const line of fmMatch[1].split('\n')) {
        const m = line.match(/^(\w+):\s*(.+)$/);
        if (!m) continue;
        let raw = m[2].trim();
        if (raw.startsWith('[') || raw.startsWith('{')) {
          try { fm[m[1]] = JSON.parse(raw); continue; } catch { /* ignore */ }
        }
        if (raw.startsWith('"') && raw.endsWith('"')) raw = raw.slice(1, -1);
        fm[m[1]] = raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw;
      }
      const today = new Date().toISOString().slice(0, 10);
      const pubDate = String(fm['publishDate'] || fm['date'] || '');
      if (pubDate > today) continue;
      out.push(fm as unknown as ResearchItem);
    }
    return out
      .filter(a => a.badge !== 'mental-game' && a.badge !== 'structural-view')
      .sort((a, b) => (b.date > a.date ? 1 : -1));
  } catch { return []; }
}

const PHASES = [
  {
    phase: 1, title: 'Foundations', color: '#8B5CF6',
    lessons: [
      { week: 1, slug: 'crypto-101-what-is-blockchain', title: 'What Is Blockchain? (And Why Most Explanations Are Useless)', description: 'Distributed ledgers, nodes, consensus mechanisms — explained without the buzzword soup. How a Bitcoin transaction actually works, step by step.', imageKey: 'learn-w1-blockchain' },
      { week: 2, slug: 'crypto-101-bitcoin-vs-ethereum', title: 'Bitcoin vs. Ethereum — The Only Differences That Actually Matter', description: 'Bitcoin is designed to be money. Ethereum is designed to be a computer. Everything else flows from that distinction.', imageKey: 'learn-w2-btc-eth' },
      { week: 3, slug: 'crypto-101-wallets-explained', title: 'Crypto Wallets Explained — Hot, Cold, and Everything Between', description: "In 2025, hackers stole $3.4B in crypto. Your wallet doesn't hold coins — it holds keys. Here's the difference that could save your portfolio.", imageKey: 'learn-w3-wallets' },
      { week: 4, slug: 'crypto-101-how-to-buy-crypto', title: 'How to Actually Buy Crypto Without Getting Scammed', description: 'Choosing a real exchange, understanding where the fees actually hide, and recognizing the red flags before they cost you anything.', imageKey: 'learn-w4-buy-crypto' },
    ],
  },
  {
    phase: 2, title: 'Yields, DeFi & Markets', color: '#3B82F6',
    lessons: [
      { week: 5, slug: 'crypto-101-staking-explained', title: 'Staking Explained — Free Money or Hidden Risk?', description: 'The real yields in 2026 (ETH pays 2.8–3.8%, not 15%), the inflation dilution nobody mentions, and a practical framework for beginners.', imageKey: 'learn-w5-staking' },
      { week: 6, slug: 'crypto-101-defi-explained', title: 'DeFi for Normal People — What It Is and Why You Should Care', description: 'Lending, borrowing, DEXs, yield farming — and the risks that DeFi marketing never puts in the headline.', imageKey: 'learn-w6-defi' },
      { week: 7, slug: 'crypto-101-chart-patterns', title: 'Reading Crypto Charts: The 5 Patterns That Actually Matter', description: 'Candlesticks, volume, support/resistance, and how to read a chart without fooling yourself.', imageKey: 'learn-w7-charts' },
      { week: 8, slug: 'crypto-101-portfolio-basics', title: 'Portfolio Basics: How Much Crypto Should You Actually Own?', description: 'Total allocation, core-satellite strategy, three model portfolios, DCA, and rebalancing.', imageKey: 'learn-w8-portfolio' },
    ],
  },
  {
    phase: 3, title: 'Strategy & Beyond', color: '#D4A843',
    lessons: [
      { week: 9, slug: undefined, title: 'Layer 1 vs. Layer 2: Solana, Arbitrum, and the Scaling Wars', description: 'The blockchain trilemma, why Ethereum needs rollups, and what L2 fragmentation means for your portfolio.', imageKey: 'learn-w9-layer2' },
      { week: 10, slug: undefined, title: 'NFTs in 2026: Dead or Evolving?', description: 'What died, what survived, Bitcoin Ordinals, soulbound tokens, and the honest verdict on what remains valuable.', imageKey: 'learn-w10-nfts' },
      { week: 11, slug: undefined, title: 'Crypto Taxes: What the IRS Actually Wants From You', description: 'Every swap is a taxable event. Cost basis methods, Form 1099-DA, staking/DeFi treatment, and tax-loss harvesting.', imageKey: 'learn-w11-taxes' },
      { week: 12, slug: undefined, title: 'Advanced Strategies: Yield Farming, Liquidity Pools, and When to Walk Away', description: 'DeFi yield strategies, impermanent loss explained, risk management framework, and a complete decision checklist.', imageKey: 'learn-w12-advanced' },
    ],
  },
];

function getCryptoLessons(): LessonItem[] {
  return PHASES.flatMap(ph =>
    ph.lessons.map(l => ({
      ...l,
      phase: ph.phase,
      phaseTitle: ph.title,
      phaseColor: ph.color,
      thumb: manifest[l.imageKey]?.src || '',
      thumbAlt: manifest[l.imageKey]?.alt || l.title,
    }))
  );
}

export default function LearnPage() {
  const articles = getAllResearch();
  const cryptoLessons = getCryptoLessons();

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px' }}>

        {/* Hero image */}
        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 36 }}>
          <Image
            src="/images/content/learn-hero-banner.png"
            alt="Learn investing the way it actually works"
            width={860}
            height={430}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority
          />
        </div>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 10 }}>
            🎓 BRUTAL EDGE ACADEMY
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 12px', lineHeight: 1.15 }}>
            Learn investing the way<br />it actually works.
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
            No courses that sell you false hope. No &ldquo;get rich quick&rdquo; narratives. Every lesson is data-driven, opinionated, and built around what investors actually need to know.
          </p>
        </div>

        <LearnClient articles={articles} cryptoLessons={cryptoLessons} />

        {/* Philosophy */}
        <div style={{ padding: '22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B', marginTop: 36, marginBottom: 28 }}>
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

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center' }}>
          Educational content only. Not investment advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
