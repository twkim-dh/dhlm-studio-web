import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Quantum Computing 101 — 12-Part Investor Series | DHLM Studio',
  description: 'A 12-part series covering every major approach to quantum computing — superconducting, trapped-ion, photonic, and more — plus an investing framework for separating real platforms from expensive science projects.',
  alternates: { canonical: 'https://dhlm-studio.com/learn/quantum-101' },
  openGraph: {
    title: 'Quantum Computing 101 — Complete Series | DHLM Studio',
    description: 'A 12-part educational series on quantum computing for investors. Every hardware approach, the software layer, post-quantum cryptography, and a structured investing framework.',
    type: 'website',
    url: 'https://dhlm-studio.com/learn/quantum-101',
    images: [{ url: 'https://dhlm-studio.com/images/content/quantum-101-part1-hero.webp', width: 1920, height: 1080 }],
  },
};

const LEARN_DIR = path.join(process.cwd(), 'src/content/learn');

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

interface PartMeta {
  part: number;
  slug: string;
  title: string;
  description: string;
  thumb: string;
  publishDate: string;
  scheduledDate: string;
  published: boolean;
}

const ALL_PARTS: { part: number; slug: string; title: string; description: string; thumb: string; scheduledDate: string }[] = [
  { part: 1,  slug: 'quantum-101-part1-superconducting-qubits',  scheduledDate: '2026-06-15', thumb: '/images/content/quantum-101-part1-hero.webp',  title: 'Superconducting Qubits: The Semiconductor Path to Quantum Computing', description: 'How IBM and Google built their quantum bets on superconducting chips, and the one metric that matters more than any qubit headline.' },
  { part: 2,  slug: 'quantum-101-part2-trapped-ion',             scheduledDate: '2026-06-22', thumb: '/images/content/quantum-101-part2-hero.webp',  title: 'Trapped-Ion Quantum Computers: The Slow but Precise Path', description: 'IonQ and Quantinuum use individual charged atoms as qubits — the most accurate gate operations in production today, at the cost of speed.' },
  { part: 3,  slug: 'quantum-101-part3-neutral-atom',            scheduledDate: '2026-06-29', thumb: '/images/content/quantum-101-part3-hero.webp',  title: 'Neutral-Atom Quantum Computers: The Laser Tweezer Path to Scale', description: 'QuEra and Atom Computing arrange hundreds of atoms in programmable laser-tweezer arrays — a hardware-efficient path to scale.' },
  { part: 4,  slug: 'quantum-101-part4-photonic',                scheduledDate: '2026-07-06', thumb: '/images/content/quantum-101-part4-hero.webp',  title: 'Photonic Quantum Computers: The Light-Speed Network Path', description: 'PsiQuantum and Xanadu use photons instead of matter qubits — room-temperature operation and a natural bridge to quantum networking.' },
  { part: 5,  slug: 'quantum-101-part5-silicon-spin',            scheduledDate: '2026-07-13', thumb: '/images/content/quantum-101-part5-hero.webp',  title: 'Silicon Spin Quantum Computers: The Semiconductor Path to Scale', description: 'Intel and others embed electron spin qubits in standard silicon chips — the most manufacturable approach, still early in fidelity.' },
  { part: 6,  slug: 'quantum-101-part6-topological',             scheduledDate: '2026-07-20', thumb: '/images/content/quantum-101-part6-hero.webp',  title: 'Topological Quantum Computing: The High-Risk, High-Reward Path', description: 'Microsoft\'s topological qubits would be inherently error-resistant — an unproven approach that could leap ahead if it works.' },
  { part: 7,  slug: 'quantum-101-part7-quantum-annealing',       scheduledDate: '2026-07-27', thumb: '/images/content/quantum-101-part7-hero.webp',  title: 'Quantum Annealing: The Optimization Machine Path', description: 'D-Wave solves optimization problems today — real commercial contracts, but a narrower scope than gate-based quantum computing.' },
  { part: 8,  slug: 'quantum-101-part8-software-cloud',          scheduledDate: '2026-08-03', thumb: '/images/content/quantum-101-part8-hero.webp',  title: 'Quantum Software & Cloud Platforms: The Operating System Layer', description: 'Qiskit, Cirq, AWS Braket, and Azure Quantum — the software and API layer that turns quantum hardware into usable infrastructure.' },
  { part: 9,  slug: 'quantum-101-part9-quantum-security',        scheduledDate: '2026-08-10', thumb: '/images/content/quantum-101-part9-hero.webp',  title: 'Quantum Security & Post-Quantum Cryptography: The Cybersecurity Upgrade Wall', description: 'A powerful quantum computer would break RSA. NIST has standardized post-quantum algorithms — and the migration clock is running.' },
  { part: 10, slug: 'quantum-101-part10-quantum-applications',   scheduledDate: '2026-08-17', thumb: '/images/content/quantum-101-part10-hero.webp', title: 'Quantum Applications: Where Quantum Computing Could Actually Matter', description: 'Drug discovery, materials simulation, financial optimization — the specific problem classes where quantum advantage has been demonstrated.' },
  { part: 11, slug: 'quantum-101-part11-investing-framework',    scheduledDate: '2026-08-24', thumb: '/images/content/quantum-101-part11-hero.webp', title: 'The Quantum Investing Framework: Separating Real Platforms from Expensive Science Projects', description: 'A structured framework: qubit count vs. fidelity, fault-tolerance progress, revenue quality, and cash runway — what actually matters.' },
  { part: 12, slug: 'quantum-101-part12-watchlist',              scheduledDate: '2026-08-31', thumb: '/images/content/quantum-101-part12-hero.webp', title: 'The Quantum Investing Watchlist: Companies, Layers, and Signals Worth Tracking', description: 'A structured watchlist across hardware, software, and infrastructure layers — with the specific milestones that signal real progress.' },
];

const PHASES = [
  { phase: 1, title: 'Qubit Approaches', color: '#7C3AED', parts: [1, 2, 3, 4, 5, 6, 7] },
  { phase: 2, title: 'Platforms & Applications', color: '#3B82F6', parts: [8, 9, 10] },
  { phase: 3, title: 'Investing Framework', color: '#D4A843', parts: [11, 12] },
];

function getAllParts(): PartMeta[] {
  const today = todayKST();
  return ALL_PARTS.map(p => {
    try {
      const content = fs.readFileSync(path.join(LEARN_DIR, `${p.slug}.md`), 'utf8');
      const m = content.match(/^---\n([\s\S]*?)\n---/);
      if (!m) return { ...p, publishDate: p.scheduledDate, published: p.scheduledDate <= today };
      const fm: Record<string, string> = {};
      for (const line of m[1].split('\n')) {
        const lm = line.match(/^(\w+):\s*(.+)$/);
        if (!lm) continue;
        let raw = lm[2].trim();
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1);
        fm[lm[1]] = raw;
      }
      const pubDate = fm['publishDate'] || p.scheduledDate;
      return { ...p, title: fm['title'] || p.title, description: fm['description'] || p.description, publishDate: pubDate, published: pubDate <= today };
    } catch {
      return { ...p, publishDate: p.scheduledDate, published: p.scheduledDate <= today };
    }
  });
}

function fmtDate(d: string) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [, m, day] = d.split('-');
  return `${months[parseInt(m,10)-1]} ${parseInt(day,10)}`;
}

export default function Quantum101Page() {
  const parts = getAllParts();
  const publishedCount = parts.filter(p => p.published).length;

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <Link href="/learn" style={{ fontSize: 11, color: '#475569', textDecoration: 'none', fontFamily: 'var(--mono)' }}>
            ← DHLM Studio Academy
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#A78BFA', letterSpacing: 3, marginBottom: 10 }}>
            ⚛ QUANTUM COMPUTING 101 — COMPLETE SERIES
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 16px', lineHeight: 1.15 }}>
            Quantum Computing 101<br />for U.S. Investors
          </h1>
          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.75, margin: '0 0 20px', maxWidth: 640 }}>
            A 12-part series explaining every major approach to quantum computing — from superconducting chips and trapped ions to topological qubits — plus the software layer, post-quantum security, and a structured framework for evaluating quantum companies as investments.
          </p>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65, margin: '0 0 24px', maxWidth: 600 }}>
            Educational content only. Companies are named as examples of how each approach is implemented, not as investment recommendations. The investing sections explain the metrics specialists use — not buy signals.
          </p>

          {/* Progress bar */}
          <div style={{ padding: '16px 20px', borderRadius: 12, background: '#0D1117', border: '1px solid #1E293B', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#A78BFA' }}>SERIES PROGRESS</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B' }}>{publishedCount} / {parts.length} PUBLISHED · NEW WEEKLY ON MONDAYS</span>
            </div>
            <div style={{ height: 6, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(publishedCount / parts.length) * 100}%`, background: 'linear-gradient(90deg, #A78BFA, #7C3AED)', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#334155', fontFamily: 'var(--mono)', margin: 0 }}>
            SERIES RUNS JUNE 15 – AUG 31, 2026 · DHLM STUDIO ACADEMY
          </p>
        </div>

        {/* Phases */}
        {PHASES.map(ph => {
          const phaseParts = parts.filter(p => ph.parts.includes(p.part));
          return (
            <div key={ph.phase} style={{ marginBottom: 44 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 5, background: `${ph.color}18`, color: ph.color, border: `1px solid ${ph.color}30`, letterSpacing: 1 }}>
                  PHASE {ph.phase}
                </span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#CBD5E1' }}>{ph.title}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {phaseParts.map(p => (
                  <div key={p.part}>
                    {p.published ? (
                      <Link href={`/learn/${p.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden' }}>
                          <Image src={p.thumb} alt={p.title} width={1920} height={1080} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" style={{ width: '100%', height: 'auto', display: 'block' }} />
                          <div style={{ padding: '14px 16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${ph.color}18`, color: ph.color, border: `1px solid ${ph.color}30` }}>PART {p.part}</span>
                              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#00D47418', color: '#00D474' }}>LIVE</span>
                            </div>
                            <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 6 }}>{p.title}</div>
                            <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.55 }}>{p.description}</p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden', opacity: 0.5 }}>
                        <div style={{ width: '100%', aspectRatio: '16/9', background: `${ph.color}12`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: `${ph.color}60`, letterSpacing: 1 }}>PART {p.part}</span>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#334155' }}>{fmtDate(p.scheduledDate)}</span>
                        </div>
                        <div style={{ padding: '14px 16px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${ph.color}18`, color: ph.color, border: `1px solid ${ph.color}30` }}>PART {p.part}</span>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#D4A84318', color: '#D4A843', border: '1px solid #D4A84340' }}>COMING {fmtDate(p.scheduledDate).toUpperCase()}</span>
                          </div>
                          <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 800, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 6 }}>{p.title}</div>
                          <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.55 }}>{p.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* About section */}
        <div style={{ padding: '24px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B', marginTop: 8, marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 14 }}>ABOUT THIS SERIES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { icon: '⚛', label: 'Every Approach Covered', desc: 'Superconducting, trapped-ion, neutral atom, photonic, silicon spin, topological, and annealing.' },
              { icon: '📊', label: 'Investor-Focused', desc: 'Each part explains the metrics specialists actually track — not just how the technology works.' },
              { icon: '🚫', label: 'Not Investment Advice', desc: 'Companies are named as examples of each approach, not as buy or sell recommendations.' },
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
