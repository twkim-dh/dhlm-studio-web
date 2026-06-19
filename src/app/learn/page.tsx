import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import LearnClient from '@/components/LearnClient';
import unsplashManifest from '@/data/unsplash-manifest.json';

export const metadata: Metadata = {
  title: 'Brutal Edge Academy — Learn Investing | DHLM Studio',
  description: 'Learn investing the way it actually works. The Masters, Investing 101, Quantum 101 — data-driven, zero hype, Brutal Edge style.',
  alternates: { canonical: 'https://dhlm-studio.com/learn' },
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content/research');
type ManifestEntry = { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null };
const manifest = unsplashManifest as Record<string, ManifestEntry>;

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

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

export interface InvestingLesson {
  week: number;
  slug: string;
  title: string;
  description: string;
  thumb: string;
  published: boolean;
}

export interface QuantumLesson {
  part: number;
  slug: string;
  title: string;
  description: string;
  thumb: string;
  published: boolean;
}

export interface MastersLesson {
  part: number;
  slug: string;
  title: string;
  description: string;
  thumb: string;
  subject: string;
  published: boolean;
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
      const today = todayKST();
      const pubDate = String(fm['publishDate'] || fm['date'] || '');
      if (pubDate > today) continue;
      out.push(fm as unknown as ResearchItem);
    }
    return out
      .filter(a => a.badge !== 'mental-game' && a.badge !== 'structural-view')
      .sort((a, b) => (b.date > a.date ? 1 : -1));
  } catch { return []; }
}

const QUANTUM_SLUGS: { slug: string; part: number; title: string; description: string }[] = [
  { part: 1,  slug: 'quantum-101-part1-superconducting-qubits',  title: 'Superconducting Qubits: The Semiconductor Path to Quantum Computing', description: 'How IBM and Google built their quantum bets on superconducting chips, and the one metric that matters more than any qubit headline.' },
  { part: 2,  slug: 'quantum-101-part2-trapped-ion',             title: 'Trapped-Ion Quantum Computers: The Slow but Precise Path', description: 'IonQ and Quantinuum use individual charged atoms as qubits — the most accurate gate operations in production today, at the cost of speed.' },
  { part: 3,  slug: 'quantum-101-part3-neutral-atom',            title: 'Neutral-Atom Quantum Computers: The Laser Tweezer Path to Scale', description: 'QuEra and Atom Computing use optical tweezers to arrange hundreds of atoms in programmable arrays — a hardware-efficient path to scale.' },
  { part: 4,  slug: 'quantum-101-part4-photonic',                title: 'Photonic Quantum Computers: The Light-Speed Network Path', description: 'PsiQuantum and Xanadu use photons instead of matter qubits — room-temperature operation and a natural bridge to quantum networking.' },
  { part: 5,  slug: 'quantum-101-part5-silicon-spin',            title: 'Silicon Spin Quantum Computers: The Semiconductor Path to Scale', description: 'Intel and others embed electron spin qubits in standard silicon chips — the most manufacturable approach, still early in fidelity.' },
  { part: 6,  slug: 'quantum-101-part6-topological',             title: 'Topological Quantum Computing: The High-Risk, High-Reward Path', description: 'Microsoft is pursuing topological qubits, which would be inherently error-resistant — an unproven approach that could leap ahead if it works.' },
  { part: 7,  slug: 'quantum-101-part7-quantum-annealing',       title: 'Quantum Annealing: The Optimization Machine Path', description: 'D-Wave\'s specialized approach solves optimization problems today — real commercial contracts, but a narrow scope compared to gate-based quantum.' },
  { part: 8,  slug: 'quantum-101-part8-software-cloud',          title: 'Quantum Software & Cloud Platforms: The Operating System Layer', description: 'Qiskit, Cirq, and cloud access via AWS Braket and Azure Quantum — the software and API layer that turns quantum hardware into usable infrastructure.' },
  { part: 9,  slug: 'quantum-101-part9-quantum-security',        title: 'Quantum Security & Post-Quantum Cryptography: The Cybersecurity Upgrade Wall', description: 'A sufficiently powerful quantum computer would break RSA encryption. NIST has standardized the first post-quantum algorithms — and the migration clock is running.' },
  { part: 10, slug: 'quantum-101-part10-quantum-applications',   title: 'Quantum Applications: Where Quantum Computing Could Actually Matter', description: 'Drug discovery, materials simulation, financial optimization, logistics — the specific problem classes where quantum advantage has been demonstrated or is expected.' },
  { part: 11, slug: 'quantum-101-part11-investing-framework',    title: 'The Quantum Investing Framework: Separating Real Platforms from Expensive Science Projects', description: 'A structured framework for evaluating quantum companies: qubit count vs. fidelity, fault-tolerance progress, revenue quality, and cash runway.' },
  { part: 12, slug: 'quantum-101-part12-watchlist',              title: 'The Quantum Investing Watchlist: Companies, Layers, and Signals Worth Tracking', description: 'A structured watchlist across hardware, software, and infrastructure layers — with the specific milestones that would signal real commercial progress.' },
];

const QUANTUM_THUMBS: Record<string, string> = {
  'quantum-101-part1-superconducting-qubits':  '/images/content/quantum-101-part1-hero.webp',
  'quantum-101-part2-trapped-ion':             '/images/content/quantum-101-part2-hero.webp',
  'quantum-101-part3-neutral-atom':            '/images/content/quantum-101-part3-hero.webp',
  'quantum-101-part4-photonic':                '/images/content/quantum-101-part4-hero.webp',
  'quantum-101-part5-silicon-spin':            '/images/content/quantum-101-part5-hero.webp',
  'quantum-101-part6-topological':             '/images/content/quantum-101-part6-hero.webp',
  'quantum-101-part7-quantum-annealing':       '/images/content/quantum-101-part7-hero.webp',
  'quantum-101-part8-software-cloud':          '/images/content/quantum-101-part8-hero.webp',
  'quantum-101-part9-quantum-security':        '/images/content/quantum-101-part9-hero.webp',
  'quantum-101-part10-quantum-applications':   '/images/content/quantum-101-part10-hero.webp',
  'quantum-101-part11-investing-framework':    '/images/content/quantum-101-part11-hero.webp',
  'quantum-101-part12-watchlist':              '/images/content/quantum-101-part12-hero.webp',
};

const INTERMEDIATE_SLUGS = [
  'investing-101-intermediate-w13-three-valuations',
  'investing-101-intermediate-w14-dcf-lies',
  'investing-101-intermediate-w15-multiples',
  'investing-101-intermediate-w16-five-moats',
  'investing-101-intermediate-w17-moat-erosion',
  'investing-101-intermediate-w18-new-tech-moats',
  'investing-101-intermediate-w19-10k-forensics',
  'investing-101-intermediate-w20-earnings-calls',
  'investing-101-intermediate-w21-proxy-statements',
  'investing-101-intermediate-w22-position-sizing',
  'investing-101-intermediate-w23-correlation-risk',
  'investing-101-intermediate-w24-when-to-sell',
];

const INTERMEDIATE_THUMBS: Record<string, string> = {
  'investing-101-intermediate-w13-three-valuations':  '/images/content/INV-101-W13.webp',
  'investing-101-intermediate-w14-dcf-lies':           '/images/content/INV-101-W14.webp',
  'investing-101-intermediate-w15-multiples':          '/images/content/INV-101-W15.webp',
  'investing-101-intermediate-w16-five-moats':         '/images/content/INV-101-W16.webp',
  'investing-101-intermediate-w17-moat-erosion':       '/images/content/INV-101-W17.webp',
  'investing-101-intermediate-w18-new-tech-moats':     '/images/content/INV-101-W18.webp',
  'investing-101-intermediate-w19-10k-forensics':      '/images/content/INV-101-W19.webp',
  'investing-101-intermediate-w20-earnings-calls':     '/images/content/INV-101-W20.webp',
  'investing-101-intermediate-w21-proxy-statements':   '/images/content/INV-101-W21.webp',
  'investing-101-intermediate-w22-position-sizing':    '/images/content/INV-101-W22.webp',
  'investing-101-intermediate-w23-correlation-risk':   '/images/content/INV-101-W23.webp',
  'investing-101-intermediate-w24-when-to-sell':       '/images/content/INV-101-W24.webp',
};

const MASTERS_LESSONS: MastersLesson[] = [
  { part: 1,  slug: 'masters-livermore',     subject: 'Livermore',    title: "Livermore Didn't Teach Prediction. He Taught Waiting.", description: "Jesse Livermore made $100M shorting the 1929 crash. He died broke at 63. The method worked. The man couldn't survive his own method. That's the lesson most investors miss.", thumb: '/images/content/livermore-masters-hero.webp', published: true },
  { part: 2,  slug: 'masters-druckenmiller', subject: 'Druckenmiller', title: "Druckenmiller's Real Edge Wasn't Macro — It Was Knowing When He Was Wrong", description: '30% annualized for 30 years with zero losing years. Everyone studies his NVDA trade. Almost nobody studies why he\'d reverse it within weeks. The self-doubt is the strategy.', thumb: '/images/content/druckenmiller-masters-hero.webp', published: true },
  { part: 3,  slug: 'masters-lynch-1',       subject: 'Peter Lynch',   title: 'The Peter Lynch Bible, Part 1: There\'s a Ten-Bagger Closer Than You Think', description: 'Lynch ran the best large fund in history for 13 years. His edge wasn\'t the Fidelity research machine. It was a checklist any retail investor can use.', thumb: '/images/content/masters-peter-lynch-part1-ten-bagger-hero.webp', published: true },
  { part: 4,  slug: 'masters-lynch-2',       subject: 'Peter Lynch',   title: 'The Peter Lynch Bible, Part 2: Stocks Are Not All the Same', description: 'Why Peter Lynch\'s six-category framework still beats generic "value vs. growth" thinking — and how to use it before the market labels a stock for you.', thumb: '/images/content/masters-peter-lynch-part2-categories-hero.webp', published: true },
  { part: 5,  slug: 'masters-lynch-3',       subject: 'Peter Lynch',   title: 'The Peter Lynch Bible, Part 3: The Cocktail Party Theory and the Psychology of Bear Markets', description: 'Lynch developed a real-world sentiment indicator at dinner parties. It\'s more reliable than most professional sentiment surveys — and completely free.', thumb: '/images/content/masters-peter-lynch-part3-cocktail-party-hero.webp', published: true },
  { part: 6,  slug: 'masters-lynch-4',       subject: 'Peter Lynch',   title: 'The Peter Lynch Bible, Part 4: Numbers Don\'t Lie', description: 'Lynch\'s actual financial checklist — the numbers he looked at first, the ones he ignored, and why P/E alone tells you almost nothing useful.', thumb: '/images/content/masters-peter-lynch-part4-numbers-hero.webp', published: true },
  { part: 7,  slug: 'masters-lynch-5',       subject: 'Peter Lynch',   title: 'The Peter Lynch Bible, Part 5: If Peter Lynch Were Investing in 2026', description: 'What would Lynch buy in 2026? Not predictions — the exact framework he\'d apply to AI, consumer trends, and where retail investors still have an information edge.', thumb: '/images/content/masters-peter-lynch-part5-2026-hero.webp', published: true },
  { part: 8,  slug: 'masters-munger-1',      subject: 'Charlie Munger', title: "The Masters: Charlie Munger Part 1  --  Don't Try to Be Brilliant. Just Stop Doing Stupid Things.", description: 'Charlie Munger\'s most underrated insight: long-term compounding is less about brilliant decisions and more about systematically avoiding the predictable mistakes that destroy wealth.', thumb: '/images/content/masters-charlie-munger-part1-stupidity-hero.webp', published: true },
  { part: 9,  slug: 'masters-munger-2',      subject: 'Charlie Munger', title: "The Masters: Charlie Munger Part 2  --  It's Not Ignorance That Ruins You. It's Ego.", description: 'Why the biggest threat to your portfolio is not the market — it\'s the narrative you construct to protect your self-image when a position goes wrong.', thumb: '/images/content/masters-charlie-munger-part2-ego-hero.webp', published: true },
  { part: 10, slug: 'masters-munger-3',      subject: 'Charlie Munger', title: 'The Masters: Charlie Munger Part 3  --  When You Feel Safest, You May Be Most Exposed', description: 'Why the moments that feel the most stable in investing are often the most dangerous — and how Munger\'s framework teaches investors to distrust comfort.', thumb: '/images/content/masters-charlie-munger-part3-safety-hero.webp', published: true },
  { part: 11, slug: 'masters-munger-4',      subject: 'Charlie Munger', title: "The Masters: Charlie Munger Part 4  --  The Fastest Road to Ruin Is the Desire to Get Rich Fast", description: 'Leverage, overconfidence, and the fatal seduction of speed. Why intelligent people blow up in markets not from ignorance, but from impatience.', thumb: '/images/content/masters-charlie-munger-part4-leverage-hero.webp', published: true },
  { part: 12, slug: 'masters-munger-5',      subject: 'Charlie Munger', title: 'The Masters: Charlie Munger Part 5  --  The Quiet Truth of Compounding', description: 'Why investing should be boring, and why patience is a superpower. The investor who can tolerate silence has an advantage no market cycle can easily replicate.', thumb: '/images/content/masters-charlie-munger-part5-compounding-hero.webp', published: true },
];

const LEARN_DIR_PATH = path.join(process.cwd(), 'src/content/learn');

function getIntermediateLessons(): InvestingLesson[] {
  const today = todayKST();
  return INTERMEDIATE_SLUGS.map(slug => {
    try {
      const content = fs.readFileSync(path.join(LEARN_DIR_PATH, `${slug}.md`), 'utf8');
      const m = content.match(/^---\n([\s\S]*?)\n---/);
      if (!m) return null;
      const fm: Record<string, unknown> = {};
      for (const line of m[1].split('\n')) {
        const lm = line.match(/^(\w+):\s*(.+)$/);
        if (!lm) continue;
        let raw = lm[2].trim();
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1);
        else if (raw !== '' && !isNaN(Number(raw))) { fm[lm[1]] = Number(raw); continue; }
        fm[lm[1]] = raw;
      }
      return {
        week: Number(fm['week'] || 0),
        slug,
        title: String(fm['title'] || ''),
        description: String(fm['description'] || ''),
        thumb: INTERMEDIATE_THUMBS[slug] || '',
        published: String(fm['publishDate'] || '9999-99-99') <= today,
      };
    } catch { return null; }
  }).filter(Boolean) as InvestingLesson[];
}

function getQuantumLessons(): QuantumLesson[] {
  const today = todayKST();
  return QUANTUM_SLUGS.map(({ slug, part, title, description }) => {
    try {
      const content = fs.readFileSync(path.join(LEARN_DIR_PATH, `${slug}.md`), 'utf8');
      const m = content.match(/^---\n([\s\S]*?)\n---/);
      if (!m) return { part, slug, title, description, thumb: QUANTUM_THUMBS[slug] || '', published: false };
      const fm: Record<string, unknown> = {};
      for (const line of m[1].split('\n')) {
        const lm = line.match(/^(\w+):\s*(.+)$/);
        if (!lm) continue;
        let raw = lm[2].trim();
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1);
        fm[lm[1]] = raw;
      }
      return {
        part,
        slug,
        title: String(fm['title'] || title),
        description: String(fm['description'] || description),
        thumb: QUANTUM_THUMBS[slug] || '',
        published: String(fm['publishDate'] || '9999-99-99') <= today,
      };
    } catch {
      return { part, slug, title, description, thumb: QUANTUM_THUMBS[slug] || '', published: false };
    }
  });
}

export default function LearnPage() {
  const articles = getAllResearch();
  const intermediateLessons = getIntermediateLessons();
  const quantumLessons = getQuantumLessons();

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px' }}>

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

        <LearnClient articles={articles} mastersLessons={MASTERS_LESSONS} intermediateLessons={intermediateLessons} quantumLessons={quantumLessons} />

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
