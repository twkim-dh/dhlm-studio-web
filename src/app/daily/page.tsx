import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import TodayMarket from '@/components/TodayMarket';

export const metadata: Metadata = {
  title: 'Daily Brief — Brutal AI Market Analysis | DHLM Studio',
  description: 'Daily market briefing with index snapshots, sector pulse, movers and shakers, and a Brutal AI verdict. Published every weekday at 7:30 AM ET.',
  alternates: { canonical: 'https://dhlm-studio.com/daily' },
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content/daily');

interface DailyBriefMeta { slug: string; date: string; title: string; description: string }

function getAllBriefs(): DailyBriefMeta[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
    const out: DailyBriefMeta[] = [];
    for (const f of files) {
      const slug = f.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) continue;
      const fm: Record<string, string> = {};
      for (const line of fmMatch[1].split('\n')) {
        const m = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
        if (m) fm[m[1]] = m[2];
      }
      out.push({ slug, date: fm.date || slug, title: fm.title || `Daily Brief — ${slug}`, description: fm.description || '' });
    }
    return out.sort((a, b) => (b.date > a.date ? 1 : -1));
  } catch { return []; }
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function DailyIndexPage() {
  const briefs = getAllBriefs();

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 24px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>● BRUTAL AI&trade; DAILY</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.1, margin: '0 0 16px' }}>
          Daily Brief
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#64748B', lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
          The market brief that explains <em>why</em> better than Bloomberg and <em>what</em> better than Morning Brew. Published every weekday at 7:30 AM ET, under human editorial oversight.
        </p>
      </section>

      {/* Live Today's Market */}
      <TodayMarket />

      {/* Archive */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 3, marginBottom: 4 }}>ARCHIVE</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Past Briefs</h2>
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#475569' }}>{briefs.length} {briefs.length === 1 ? 'issue' : 'issues'}</span>
        </div>

        {briefs.length === 0 ? (
          <div style={{ ...card, padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#94A3B8', margin: '0 0 8px' }}>The first Daily Brief publishes Monday, April 14, 2026.</p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#475569', margin: 0 }}>Subscribe to our newsletter to get it in your inbox at 7:30 AM ET.</p>
            <Link href="/#newsletter" style={{ display: 'inline-block', marginTop: 14, padding: '10px 18px', borderRadius: 10, background: '#C73E3A', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Get Notified →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {briefs.map(b => (
              <Link key={b.slug} href={`/daily/${b.slug}`} style={{ ...card, display: 'block', padding: '18px 22px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 2 }}>{b.date}</span>
                  <span style={{ fontSize: 11, color: '#475569' }}>Read →</span>
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, color: '#F1F5F9', margin: '0 0 4px' }}>{b.title}</h3>
                {b.description && <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}>{b.description}</p>}
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginTop: 24, padding: '18px 22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 6 }}>WEEKLY SCHEDULE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, fontSize: 12, color: '#94A3B8', fontFamily: 'var(--sans)', lineHeight: 1.6 }}>
            <div><strong style={{ color: '#E2E8F0' }}>Mon-Fri</strong><br />Daily Brief</div>
            <div><strong style={{ color: '#E2E8F0' }}>Saturday</strong><br />Weekly Deep Analysis</div>
            <div><strong style={{ color: '#E2E8F0' }}>Sunday</strong><br />Week Ahead Preview</div>
          </div>
        </div>
      </section>
    </div>
  );
}
