'use client';

import { useState } from 'react';
import Link from 'next/link';
import TickerLogo from '@/components/TickerLogo';
import { fmtDateShort } from '@/lib/fmt-date';

interface ReportMeta {
  title: string; slug: string; ticker: string; date: string; readTime: string;
  category: string; catColor: string; grade: string; beafScore: number; description: string;
  type?: string; sector?: string; tickers?: string[];
  thumb?: string; thumbAlt?: string;
}

type Tab = 'All' | 'Deep Dive' | 'Special Report' | 'Education' | 'Hot Sector';
const TABS: Tab[] = ['All', 'Deep Dive', 'Special Report', 'Education', 'Hot Sector'];

const BADGE_TTL_DAYS = 14;
function daysAgo(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000); }

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function ReportsClient({ reports }: { reports: ReportMeta[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const EDUCATION_CATS = ['Investing 101', 'Crypto 101', 'Paper vs. Profit'];

  const filtered: ReportMeta[] = activeTab === 'All'
    ? reports
    : reports.filter(r => {
        if (activeTab === 'Education') return EDUCATION_CATS.includes(r.category);
        return r.category === activeTab;
      });

  // For "All" view, split into sections (same as current behavior)
  const hotSector = filtered.filter(r =>
    (r.type === 'hot-sector' || r.type === 'hidden-gem') && daysAgo(r.date) <= BADGE_TTL_DAYS
  );
  const specials = filtered.filter(r =>
    r.type === 'special-report' && daysAgo(r.date) <= BADGE_TTL_DAYS
  );
  const regularList = activeTab === 'All'
    ? filtered.filter(r => {
        if (!r.type || r.type === 'deep-dive') return true;
        return daysAgo(r.date) > BADGE_TTL_DAYS;
      })
    : filtered; // in non-All tabs, show flat list

  const counts: Partial<Record<Tab, number>> = {
    'All': reports.length,
    'Deep Dive': reports.filter(r => r.category === 'Deep Dive').length,
    'Special Report': reports.filter(r => r.category === 'Special Report').length,
    'Education': reports.filter(r => EDUCATION_CATS.includes(r.category)).length,
    'Hot Sector': reports.filter(r => r.category === 'Hot Sector').length,
  };

  return (
    <>
      {/* ── TAB BAR ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const active = tab === activeTab;
          const count = counts[tab] ?? 0;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: 8,
                border: active ? '1px solid #C73E3A60' : '1px solid #1E293B',
                background: active ? '#C73E3A18' : '#111827',
                color: active ? '#F1F5F9' : '#64748B',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                fontWeight: active ? 800 : 600,
                cursor: 'pointer',
                letterSpacing: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s',
              }}
            >
              {tab}
              {count > 0 && (
                <span style={{
                  fontSize: 9,
                  padding: '1px 5px',
                  borderRadius: 10,
                  background: active ? '#C73E3A30' : '#1E293B',
                  color: active ? '#C73E3A' : '#475569',
                  fontWeight: 700,
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── SPECIAL REPORT SECTION (All tab only) ── */}
      {activeTab === 'All' && specials.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>⚡ SPECIAL REPORT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {specials.map(r => (
              <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', borderColor: '#C73E3A40', background: 'linear-gradient(135deg, #C73E3A08, #111827)', overflow: 'hidden' }}>
                {r.thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.thumb} alt={r.thumbAlt || r.title} style={{ width: '100%', aspectRatio: r.thumb.endsWith('.png') ? '3/2' : '16/9', objectFit: r.thumb.endsWith('.png') ? 'contain' : 'cover', display: 'block', background: '#0f172a' }} />
                )}
                <div style={{ padding: '16px 22px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: '#C73E3A20', color: '#C73E3A', letterSpacing: 1 }}>SPECIAL REPORT</span>
                    {Array.isArray(r.tickers) && r.tickers.slice(0, 5).map(t => (
                      <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A' }}>{t}</span>
                    ))}
                    <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4 }}>{r.title}</div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── HOT SECTOR SECTION (All tab only) ── */}
      {activeTab === 'All' && hotSector.length > 0 && (
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

      {/* ── MAIN LIST ── */}
      {/* Non-All tabs: show filtered reports with appropriate card style */}
      {activeTab !== 'All' && filtered.length === 0 && (
        <div style={{ ...card, padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <p style={{ fontSize: 14, color: '#64748B' }}>No {activeTab} reports yet.</p>
        </div>
      )}
      {activeTab !== 'All' && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(r => {
            const isSpecial = r.type === 'special-report' || r.type === 'hot-sector' || r.type === 'hidden-gem';
            if (isSpecial) {
              return (
                <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', borderColor: `${r.catColor}40`, background: `linear-gradient(135deg, ${r.catColor}08, #111827)`, overflow: 'hidden' }}>
                  {r.thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.thumb} alt={r.thumbAlt || r.title} style={{ width: '100%', aspectRatio: r.thumb.endsWith('.png') ? '3/2' : '16/9', objectFit: r.thumb.endsWith('.png') ? 'contain' : 'cover', display: 'block', background: '#0f172a' }} />
                  )}
                  <div style={{ padding: '16px 22px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: `${r.catColor}20`, color: r.catColor, letterSpacing: 1 }}>{r.category.toUpperCase()}</span>
                      {Array.isArray(r.tickers) && r.tickers.slice(0, 5).map(t => (
                        <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: r.catColor }}>{t}</span>
                      ))}
                      <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4 }}>{r.title}</div>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
                  </div>
                </Link>
              );
            }
            return (
              <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: '20px 22px', textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <TickerLogo ticker={r.ticker} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color: '#60A5FA' }}>{r.ticker}</span>
                    {r.beafScore > 0 && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>BEAF {r.beafScore}/100 ({r.grade})</span>
                    )}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${r.catColor}14`, color: r.catColor }}>{r.category}</span>
                    <span style={{ fontSize: 11, color: '#475569' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{r.title}</div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── ALL TAB: regular deep-dive list ── */}
      {activeTab === 'All' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {regularList.map(r => (
            <Link key={r.slug} href={`/reports/${r.slug}`} style={{ ...card, padding: '20px 22px', textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <TickerLogo ticker={r.ticker} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color: '#60A5FA' }}>{r.ticker}</span>
                  {r.beafScore > 0 && (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>BEAF {r.beafScore}/100 ({r.grade})</span>
                  )}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${r.catColor}14`, color: r.catColor }}>{r.category}</span>
                  <span style={{ fontSize: 11, color: '#475569' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{r.title}</div>
                <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'All' && regularList.length === 0 && specials.length === 0 && hotSector.length === 0 && (
        <div style={{ ...card, padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <p style={{ fontSize: 14, color: '#64748B' }}>Reports coming soon.</p>
        </div>
      )}
    </>
  );
}
