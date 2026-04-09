import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Research — Paper vs. Profit | DHLM Studio',
  description: 'We read academic finance papers, judge them, and tell you if they will make you money. Brutal AI dissects research with one question: would this work in practice?',
  alternates: { canonical: 'https://dhlm-studio.com/research' },
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content/research');

interface ResearchMeta {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  verdict: string;
  description: string;
  paperTitle: string;
  paperAuthors: string;
  paperYear: number;
}

function getAllResearch(): ResearchMeta[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
    const out: ResearchMeta[] = [];
    for (const f of files) {
      const slug = f.replace(/\.md$/, '');
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
      out.push(fm as unknown as ResearchMeta);
    }
    return out.sort((a, b) => (b.date > a.date ? 1 : -1));
  } catch { return []; }
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

function verdictColor(v: string): { fg: string; bg: string; border: string } {
  if (v === 'YES') return { fg: '#00D474', bg: '#00D47418', border: '#00D47440' };
  if (v === 'NO')  return { fg: '#FF4545', bg: '#FF454518', border: '#FF454540' };
  return { fg: '#D4A843', bg: '#D4A84318', border: '#D4A84340' }; // MAYBE
}

export default function ResearchIndexPage() {
  const articles = getAllResearch();

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#3B82F6', letterSpacing: 3, marginBottom: 8 }}>📚 RESEARCH LAB</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 12px', lineHeight: 1.2 }}>
            Paper vs. Profit
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#94A3B8', lineHeight: 1.7, margin: 0, maxWidth: 680 }}>
            We read the papers. We judge them. We tell you if they will make you money. Brutal AI dissects academic finance research with one question: would this actually work in practice?
          </p>
        </div>

        {articles.length === 0 ? (
          <div style={{ ...card, padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#94A3B8', margin: 0 }}>First Paper vs. Profit issue publishes Wednesday, April 9, 2026.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {articles.map(a => {
              const c = verdictColor(a.verdict);
              return (
                <Link key={a.slug} href={`/research/${a.slug}`} style={{ ...card, padding: '22px 24px', textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 6, background: c.bg, color: c.fg, border: `1px solid ${c.border}`, letterSpacing: 1 }}>
                      VERDICT: {a.verdict}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#3B82F614', color: '#3B82F6' }}>{a.category}</span>
                    <span style={{ fontSize: 11, color: '#475569' }}>{a.date} · {a.readTime}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 6 }}>{a.title}</div>
                  <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 10px', lineHeight: 1.6 }}>{a.description}</p>
                  <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--mono)' }}>
                    {a.paperAuthors} ({a.paperYear})
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 32, padding: '18px 22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 8 }}>📅 PUBLICATION SCHEDULE</div>
          <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>
            New Paper vs. Profit issue published every <strong style={{ color: '#E2E8F0' }}>Wednesday</strong>. Each issue takes one academic finance paper, summarizes the method, evaluates the numbers, and delivers a clear verdict: YES, MAYBE, or NO.
          </div>
        </div>

        <p style={{ fontSize: 10, color: '#334155', textAlign: 'center', marginTop: 20 }}>
          Academic research interpretation only. Not investment advice. Always verify findings against the original paper.
        </p>
      </div>
    </div>
  );
}
