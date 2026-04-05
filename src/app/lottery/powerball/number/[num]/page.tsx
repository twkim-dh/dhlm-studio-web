import type { Metadata } from 'next';
import Link from 'next/link';
import { analyzeNumber, type DrawRecord } from '@/lib/lottery-stats';
import fs from 'fs';
import path from 'path';

const YEAR = new Date().getFullYear();

export function generateStaticParams() {
  return Array.from({ length: 69 }, (_, i) => ({ num: String(i + 1) }));
}

function loadDraws(): DrawRecord[] {
  try {
    const filePath = path.join(process.cwd(), 'public/data/powerball-history.json');
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return raw.map((d: { date: string; numbers: number[]; pb: number }) => ({
      date: d.date, numbers: d.numbers, special: d.pb,
    }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ num: string }> }): Promise<Metadata> {
  const { num } = await params;
  return {
    title: `Powerball Number ${num} — Statistics & History ${YEAR}`,
    description: `How often does number ${num} appear in Powerball? Frequency, last drawn date, most common companions. ${YEAR} data.`,
    robots: { index: false, follow: true },
  };
}

export default async function NumberDetailPage({ params }: { params: Promise<{ num: string }> }) {
  const { num } = await params;
  const n = parseInt(num);
  if (n < 1 || n > 69) return <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}><h1 style={{ color: '#F1F5F9' }}>Invalid Number</h1></div>;

  const draws = loadDraws();
  const stats = analyzeNumber(draws, n);
  const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebPage',
        name: `Powerball Number ${n} Statistics`,
        url: `https://dhlm-studio.com/lottery/powerball/number/${n}`,
      }) }} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/lottery/powerball/stats" style={{ fontSize: 12, color: '#64748B' }}>← Powerball Stats</Link>

        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#0F172A', fontFamily: 'var(--mono)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            {n}
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 900, color: '#F1F5F9', margin: '16px 0 4px' }}>Powerball Number {n}</h1>
          <p style={{ fontSize: 12, color: '#64748B' }}>Based on {draws.length} draws (2015–{YEAR})</p>
        </div>

        {/* Key stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
          <div style={{ ...card, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#64748B', fontFamily: 'var(--mono)' }}>APPEARANCES</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#EF4444', fontFamily: 'var(--mono)', marginTop: 4 }}>{stats.count}</div>
            <div style={{ fontSize: 10, color: '#475569' }}>{stats.pct.toFixed(1)}% of draws</div>
          </div>
          <div style={{ ...card, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#64748B', fontFamily: 'var(--mono)' }}>LAST DRAWN</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginTop: 8 }}>{stats.lastDate || 'Never'}</div>
            <div style={{ fontSize: 10, color: '#475569' }}>{stats.drawsAgo} draws ago</div>
          </div>
          <div style={{ ...card, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#64748B', fontFamily: 'var(--mono)' }}>FREQUENCY</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginTop: 8 }}>1 in {(draws.length / (stats.count || 1)).toFixed(1)}</div>
            <div style={{ fontSize: 10, color: '#475569' }}>draws</div>
          </div>
        </div>

        {/* Common companions */}
        {stats.companions.length > 0 && (
          <div style={{ ...card, padding: '18px 20px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#A78BFA', letterSpacing: 2, marginBottom: 12 }}>MOST COMMON COMPANIONS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {stats.companions.map(c => (
                <Link key={c.number} href={`/lottery/powerball/number/${c.number}`} style={{
                  width: 48, padding: '6px 0', borderRadius: 8, background: '#1E293B', textAlign: 'center', textDecoration: 'none',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{c.number}</div>
                  <div style={{ fontSize: 8, color: '#475569' }}>{c.count}×</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          {n > 1 && <Link href={`/lottery/powerball/number/${n - 1}`} style={{ fontSize: 12, color: '#64748B' }}>← #{n - 1}</Link>}
          <span />
          {n < 69 && <Link href={`/lottery/powerball/number/${n + 1}`} style={{ fontSize: 12, color: '#64748B' }}>#{n + 1} →</Link>}
        </div>

        {/* All numbers grid */}
        <div style={{ ...card, padding: '14px 16px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#475569', letterSpacing: 2, marginBottom: 8 }}>ALL NUMBERS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))', gap: 3 }}>
            {Array.from({ length: 69 }, (_, i) => i + 1).map(num => (
              <Link key={num} href={`/lottery/powerball/number/${num}`} style={{
                width: '100%', aspectRatio: '1', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: num === n ? 900 : 600, fontFamily: 'var(--mono)', textDecoration: 'none',
                background: num === n ? '#EF4444' : '#1E293B', color: num === n ? '#fff' : '#94A3B8',
              }}>{num}</Link>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 12 }}>Past frequency does not predict future results. Lottery is random.</p>
      </div>
    </div>
  );
}
