import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import RequestDeepDive from '@/components/RequestDeepDive';
import { fmtDateShort } from '@/lib/fmt-date';
import TickerLogo from '@/components/TickerLogo';
import unsplashManifest from '@/data/unsplash-manifest.json';

export const metadata: Metadata = {
  title: 'Reports — Brutal Edge™ Deep Dive Analysis | DHLM Studio',
  description: 'In-depth stock and crypto analysis with BEAF scoring. 3,000+ word deep dives. Data-driven insights, not investment advice.',
  alternates: { canonical: 'https://dhlm-studio.com/reports' },
  openGraph: {
    title: 'Brutal Edge™ Deep Dive Reports',
    description: 'In-depth stock and crypto analysis with BEAF scoring. 3,000+ word deep dives.',
    type: 'website',
    url: 'https://dhlm-studio.com/reports',
  },
};

export const revalidate = 3600; // Revalidate at most once per hour on new deployments

const REPORTS_DIR = path.join(process.cwd(), 'src/content/reports');

interface ReportMeta {
  title: string; slug: string; ticker: string; date: string; readTime: string;
  category: string; catColor: string; grade: string; beafScore: number; description: string;
  type?: string; sector?: string; tickers?: string[];
}

/** Days since a date string (negative = future date) */
function daysAgo(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

/** Featured badge is active for 14 days from publish date */
const BADGE_TTL_DAYS = 14;

function getAllReports(): ReportMeta[] {
  try {
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
      return fm as unknown as ReportMeta;
    }).filter(Boolean).sort((a, b) => (b!.date > a!.date ? 1 : -1)) as ReportMeta[];
  } catch { return []; }
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function ReportsPage() {
  const all = getAllReports();

  // Featured sections: only show badge for 14 days from publish date.
  // After 14 days the report falls into the regular deep-dive list automatically.
  const hotSector = all.filter(r =>
    (r.type === 'hot-sector' || r.type === 'hidden-gem') && daysAgo(r.date) <= BADGE_TTL_DAYS
  );
  const specials = all.filter(r =>
    r.type === 'special-report' && daysAgo(r.date) <= BADGE_TTL_DAYS
  );
  // Regular list: deep-dives + any featured report older than 14 days
  const reports = all.filter(r => {
    if (!r.type || r.type === 'deep-dive') return true; // always regular
    const expired = daysAgo(r.date) > BADGE_TTL_DAYS;
    return expired; // featured but aged-out → show as normal report
  });

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>🔥 BRUTAL EDGE™ REPORTS</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Deep Dive Analysis</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>In-depth stock analysis with BEAF scoring — {all.length} Reports{hotSector.length > 0 ? ` · ${hotSector.length} Hot Sector` : ''}{specials.length > 0 ? ` · ${specials.length} Special` : ''}</p>
        </div>

        {specials.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>⚡ SPECIAL REPORT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {specials.map(r => {
                const manifest = unsplashManifest as Record<string, { src: string; alt: string }>;
                const thumb = manifest[r.slug];
                return (
                  <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', borderColor: '#C73E3A40', background: 'linear-gradient(135deg, #C73E3A08, #111827)', overflow: 'hidden' }}>
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb.src} alt={thumb.alt} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                    )}
                    <div style={{ padding: '16px 22px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: '#C73E3A20', color: '#C73E3A', letterSpacing: 1 }}>SPECIAL REPORT</span>
                        <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4 }}>{r.title}</div>
                      <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {hotSector.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#D4A843', letterSpacing: 2, marginBottom: 10 }}>🔥 HOT SECTOR</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {hotSector.map(r => (
                <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: '20px 22px', textDecoration: 'none', display: 'block', borderColor: '#D4A84340', background: 'linear-gradient(135deg, #D4A8430A, #111827)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: '#D4A84320', color: '#D4A843', letterSpacing: 1 }}>
                      {r.type === 'hidden-gem' ? '💎 HIDDEN GEM' : '🔥 HOT SECTOR'}
                    </span>
                    {r.sector && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#0D1117', color: '#94A3B8' }}>{r.sector}</span>}
                    {Array.isArray(r.tickers) && r.tickers.slice(0, 6).map(t => (
                      <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#60A5FA' }}>{t}</span>
                    ))}
                    <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4 }}>{r.title}</div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reports.map(r => (
            <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: '20px 22px', textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <TickerLogo ticker={r.ticker} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color: '#60A5FA' }}>{r.ticker}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>BEAF {r.beafScore}/100 ({r.grade})</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${r.catColor}14`, color: r.catColor }}>{r.category}</span>
                  <span style={{ fontSize: 11, color: '#475569' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{r.title}</div>
                <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {reports.length === 0 && (
          <div style={{ ...card, padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <p style={{ fontSize: 14, color: '#64748B' }}>Reports coming soon.</p>
          </div>
        )}

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
