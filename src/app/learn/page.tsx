import type { Metadata } from 'next';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import LearnClient from '@/components/LearnClient';

export const metadata: Metadata = {
  title: 'Brutal Edge Academy — Learn Investing | DHLM Studio',
  description: 'Learn investing the way it actually works. Crypto 101, Investing 101, and Paper vs. Profit — data-driven, zero hype, Brutal Edge style.',
  alternates: { canonical: 'https://dhlm-studio.com/learn' },
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content/research');

interface ResearchMeta {
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
}

function getAllResearch(): ResearchMeta[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
    const out: ResearchMeta[] = [];
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
        if ((raw.startsWith('"') && raw.endsWith('"'))) raw = raw.slice(1, -1);
        fm[m[1]] = raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw;
      }
      const today = new Date().toISOString().slice(0, 10);
      const pubDate = String(fm['publishDate'] || fm['date'] || '');
      if (pubDate > today) continue;
      out.push(fm as unknown as ResearchMeta);
    }
    return out.sort((a, b) => (b.date > a.date ? 1 : -1));
  } catch { return []; }
}

export default function LearnPage() {
  const articles = getAllResearch();

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

        {/* Tab client component */}
        <LearnClient articles={articles} />

        {/* Philosophy */}
        <div style={{ padding: '22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B', marginTop: 36, marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 12 }}>THE BRUTAL EDGE APPROACH</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { icon: '📊', label: 'Data First', desc: 'Every claim backed by numbers, not vibes.' },
              { icon: '🚫', label: 'Zero Hype', desc: 'We say what won\'t work, not just what will.' },
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
