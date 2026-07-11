import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import RequestDeepDive from '@/components/RequestDeepDive';
import ReportsClient from '@/components/ReportsClient';
import unsplashManifest from '@/data/unsplash-manifest.json';

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ page?: string; tab?: string }> }
): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const tab = params.tab;
  const base = 'https://dhlm-studio.com/reports';
  const parts: string[] = [];
  if (tab && tab !== 'all') parts.push(`tab=${tab}`);
  if (page > 1) parts.push(`page=${page}`);
  const canonical = base + (parts.length ? `?${parts.join('&')}` : '');

  return {
    title: page > 1
      ? `Reports — Page ${page} | DHLM Studio`
      : 'Reports — DHLM Studio Research | DHLM Studio',
    description: 'In-depth stock and crypto analysis with scoring. 3,000+ word deep dives. Data-driven insights, not investment advice.',
    alternates: { canonical },
    openGraph: {
      title: 'DHLM Studio Reports',
      description: 'In-depth stock and crypto analysis with scoring. 3,000+ word deep dives.',
      type: 'website',
      url: canonical,
    },
  };
}

export const revalidate = 3600;

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const REPORTS_DIR = path.join(process.cwd(), 'src/content/reports');

interface ReportMeta {
  title: string; slug: string; ticker: string; date: string; readTime: string;
  category: string; catColor: string; grade: string; beafScore: number; description: string;
  type?: string; sector?: string; tickers?: string[]; tags?: string[];
  thumb?: string; thumbAlt?: string;
}

function getAllReports(): ReportMeta[] {
  try {
    const today = todayKST();
    const manifest = unsplashManifest as Record<string, { src: string; alt: string }>;
    const files = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.md'));
    return files.map(f => {
      const content = fs.readFileSync(path.join(REPORTS_DIR, f), 'utf8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) return null;
      const fm: Record<string, unknown> = {};
      fmMatch[1].split('\n').forEach(line => {
        const m = line.match(/^(\w+):\s*(.+)$/);
        if (!m) return;
        let raw = m[2].trim();
        if (raw.startsWith('[') || raw.startsWith('{')) {
          try { fm[m[1]] = JSON.parse(raw); return; } catch { /* fall through */ }
        }
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
          raw = raw.slice(1, -1);
        }
        fm[m[1]] = raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw;
      });
      // Filter out future-dated reports
      const dateOnly = String(fm.date || '').slice(0, 10);
      if (dateOnly > today) return null;
      const slug = String(fm.slug || '');
      const entry = manifest[slug];
      return {
        ...fm,
        thumb: entry?.src || (fm.heroImage as string) || undefined,
        thumbAlt: entry?.alt,
      } as unknown as ReportMeta;
    }).filter(Boolean).sort((a, b) => (b!.date > a!.date ? 1 : -1)) as ReportMeta[];
  } catch { return []; }
}

export default function ReportsPage() {
  const all = getAllReports();

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#3B4A99', letterSpacing: 3, marginBottom: 8 }}>DHLM STUDIO REPORTS</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Deep Dive Analysis</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
            In-depth stock analysis with {all.length} Reports
          </p>
        </div>

        <ReportsClient reports={all} />

        <div style={{ marginTop: 24 }}>
          <RequestDeepDive />
        </div>

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
