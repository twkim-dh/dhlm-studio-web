import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: 'Reports — Deep Analysis & Weekly Recaps | DHLM Studio',
  description: 'In-depth stock analysis, weekly Wall Street recaps, and crypto market reports. Data-driven insights, not investment advice.',
};

const YEAR = new Date().getFullYear();

// Filter: deep-dive + weekly reports
const reports = blogPosts.filter(p =>
  p.slug.startsWith('deep-dive-') || p.slug.startsWith('wall-street-weekly-') || p.slug.startsWith('crypto-weekly-')
);
const deepDives = blogPosts.filter(p => p.slug.startsWith('deep-dive-'));
const weeklies = blogPosts.filter(p => p.slug.startsWith('wall-street-weekly-') || p.slug.startsWith('crypto-weekly-'));

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function ReportsPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>📊 REPORTS</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Deep Analysis & Recaps</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>In-depth stock analysis and weekly market recaps — {YEAR}</p>
        </div>

        {/* Deep Dives */}
        {deepDives.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 12 }}>🔍 DEEP DIVE ANALYSIS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {deepDives.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ ...card, padding: '18px 20px', textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: p.catColor, padding: '2px 8px', borderRadius: 4, background: `${p.catColor}14` }}>{p.category}</span>
                    <span style={{ fontSize: 11, color: '#475569' }}>{p.date} · {p.readTime} read</span>
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{p.title}</div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{p.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Recaps */}
        {weeklies.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 12 }}>📰 WEEKLY RECAPS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {weeklies.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ ...card, padding: '14px 18px', textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{p.title}</div>
                    <span style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--mono)', flexShrink: 0, marginLeft: 8 }}>{p.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {reports.length === 0 && (
          <div style={{ ...card, padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <p style={{ fontSize: 14, color: '#64748B' }}>Reports are published monthly (Deep Dives) and weekly (Recaps).</p>
            <p style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>First reports dropping April 2026.</p>
          </div>
        )}

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 20 }}>
          All reports are for informational purposes only. NOT investment advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
