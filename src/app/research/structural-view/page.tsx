import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { fmtDateShort } from '@/lib/fmt-date';

export const metadata: Metadata = {
  title: 'The Structural View — Industry Paradigm Analysis | DHLM Studio',
  description: 'Industry paradigms, redefined through structural analysis. Each volume applies a single framework to understand which companies will win the next decade — and why.',
  alternates: { canonical: 'https://dhlm-studio.com/research/structural-view' },
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content/research');

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

interface VolumeMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
}

function getPublishedVolumes(): VolumeMeta[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.startsWith('structural-view-') && f.endsWith('.md'));
    const today = todayKST();
    const out: VolumeMeta[] = [];
    for (const f of files) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) continue;
      const fm: Record<string, string> = {};
      for (const line of fmMatch[1].split('\n')) {
        const m = line.match(/^(\w+):\s*(.+)$/);
        if (m) fm[m[1]] = m[2].trim().replace(/^"|"$/g, '');
      }
      const pubDate = fm['date'] || '';
      if (pubDate > today) continue;
      out.push({
        slug: fm['slug'] || '',
        title: fm['title'] || '',
        description: fm['description'] || '',
        date: pubDate,
        readTime: fm['readTime'] || '',
      });
    }
    return out.sort((a, b) => (a.date > b.date ? 1 : -1));
  } catch { return []; }
}

export default function StructuralViewPage() {
  const volumes = getPublishedVolumes();

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>

        <div style={{ marginBottom: 24 }}>
          <Link href="/research" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← The Mental Game</Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 6, background: '#0EA5E918', color: '#38BDF8', border: '1px solid #0EA5E940', letterSpacing: 2, display: 'inline-block', marginBottom: 14 }}>
            THE STRUCTURAL VIEW
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 14px', lineHeight: 1.2 }}>
            Industry Paradigms,<br />Redefined Through Structural Analysis.
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#94A3B8', lineHeight: 1.7, margin: 0, maxWidth: 680 }}>
            Each volume applies a single structural framework to understand which companies, technologies, or business models will define the next decade — and why the obvious answer is usually wrong.
          </p>
        </div>

        {/* Volumes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
          {volumes.map((v, i) => (
            <Link
              key={v.slug}
              href={`/research/${v.slug}`}
              style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '22px 24px', textDecoration: 'none', display: 'block' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: '#0EA5E918', color: '#38BDF8', border: '1px solid #0EA5E940', letterSpacing: 1 }}>
                  VOL.{i + 1}
                </span>
                <span style={{ fontSize: 11, color: '#475569' }}>{fmtDateShort(v.date)} · {v.readTime}</span>
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 8 }}>{v.title}</div>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>{v.description}</p>
            </Link>
          ))}

        </div>

        {/* Series description */}
        <div style={{ padding: '18px 22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#38BDF8', letterSpacing: 2, marginBottom: 8 }}>ABOUT THIS SERIES</div>
          <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>
            The Structural View publishes on no fixed schedule. Each volume is released when a structural shift is significant enough to warrant a full framework report — not to fill a calendar slot. Non-scheduled by design.
          </div>
        </div>

      </div>
    </div>
  );
}
