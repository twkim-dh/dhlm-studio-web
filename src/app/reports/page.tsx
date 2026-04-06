import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Reports — Brutal AI™ Deep Dive Analysis | DHLM Studio',
  description: 'In-depth stock and crypto analysis with BAAF scoring. 3,000+ word deep dives. Data-driven insights, not investment advice.',
};

const REPORTS_DIR = path.join(process.cwd(), 'src/content/reports');

interface ReportMeta {
  title: string; slug: string; ticker: string; date: string; readTime: string;
  category: string; catColor: string; grade: string; baafScore: number; description: string;
}

function getAllReports(): ReportMeta[] {
  try {
    const files = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.md'));
    return files.map(f => {
      const content = fs.readFileSync(path.join(REPORTS_DIR, f), 'utf8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) return null;
      const fm: Record<string, string | number> = {};
      fmMatch[1].split('\n').forEach(line => {
        const m = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
        if (m) fm[m[1]] = isNaN(Number(m[2])) ? m[2] : Number(m[2]);
      });
      return fm as unknown as ReportMeta;
    }).filter(Boolean).sort((a, b) => (b!.date > a!.date ? 1 : -1)) as ReportMeta[];
  } catch { return []; }
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function ReportsPage() {
  const reports = getAllReports();

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>🔥 BRUTAL AI™ REPORTS</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Deep Dive Analysis</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>In-depth stock analysis with BAAF scoring — {reports.length} reports</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reports.map(r => (
            <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: '20px 22px', textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color: '#60A5FA' }}>{r.ticker}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>BAAF {r.baafScore}/100 ({r.grade})</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${r.catColor}14`, color: r.catColor }}>{r.category}</span>
                <span style={{ fontSize: 11, color: '#475569' }}>{r.date} · {r.readTime}</span>
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{r.title}</div>
              <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
            </Link>
          ))}
        </div>

        {reports.length === 0 && (
          <div style={{ ...card, padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <p style={{ fontSize: 14, color: '#64748B' }}>Reports coming soon.</p>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link href="/editorial" style={{ fontSize: 12, color: '#64748B' }}>How we analyze stocks → Editorial Policy</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 12 }}>
          All reports are for informational purposes only. NOT investment advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
