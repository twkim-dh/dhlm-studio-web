'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TickerLogo from '@/components/TickerLogo';
import { fmtDateShort } from '@/lib/fmt-date';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 12;

interface ReportMeta {
  title: string; slug: string; ticker: string; date: string; readTime: string;
  category: string; catColor: string; grade: string; beafScore: number; description: string;
  type?: string; sector?: string; tickers?: string[]; tags?: string[];
  thumb?: string; thumbAlt?: string;
}

type Tab = 'All' | 'Latest' | 'Special Report' | 'Deep Dive' | 'Crypto';
const TABS: Tab[] = ['All', 'Latest', 'Special Report', 'Deep Dive', 'Crypto'];

const TAB_PARAM: Record<Tab, string> = {
  'All': 'all',
  'Latest': 'latest',
  'Special Report': 'special',
  'Deep Dive': 'deep-dive',
  'Crypto': 'crypto',
};
const PARAM_TAB: Record<string, Tab> = Object.fromEntries(
  Object.entries(TAB_PARAM).map(([k, v]) => [v, k as Tab])
);

const BADGE_TTL_DAYS = 14;
function daysAgo(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000); }

const CRYPTO_TAGS = ['BTC', 'ETH', 'BITCOIN', 'ETHEREUM', 'CRYPTO', 'STABLECOIN', 'BLOCKCHAIN'];
function isCrypto(r: ReportMeta) {
  if (!Array.isArray(r.tags)) return false;
  return r.tags.some(t => CRYPTO_TAGS.includes(t.toUpperCase()));
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

function SpecialCard({ r }: { r: ReportMeta }) {
  return (
    <Link href={`/reports/${r.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', borderColor: `${r.catColor}40`, background: `linear-gradient(135deg, ${r.catColor}08, #111827)`, overflow: 'hidden' }}>
      {r.thumb && (
        <Image src={r.thumb} alt={r.thumbAlt || r.title} width={1920} height={1080} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" style={{ width: '100%', height: 'auto', display: 'block', background: '#0f172a' }} />
      )}
      <div style={{ padding: '16px 22px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: `${r.catColor}20`, color: r.catColor, letterSpacing: 1 }}>
            {r.category.toUpperCase()}
          </span>
          {Array.isArray(r.tickers) && r.tickers.slice(0, 5).map(t => (
            <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: r.catColor }}>{t}</span>
          ))}
          <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4 }}>{r.title}</div>
        <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
      </div>
    </Link>
  );
}

function RegularCard({ r }: { r: ReportMeta }) {
  return (
    <Link href={`/reports/${r.slug}`} style={{ ...card, padding: '20px 22px', textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <TickerLogo ticker={r.ticker} size={48} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color: '#60A5FA' }}>{r.ticker}</span>
          {r.beafScore > 0 && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>{r.beafScore}/100 ({r.grade})</span>
          )}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${r.catColor}14`, color: r.catColor }}>{r.category}</span>
          <span style={{ fontSize: 11, color: '#475569' }}>{fmtDateShort(r.date)} · {r.readTime}</span>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{r.title}</div>
        <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.5 }}>{r.description}</p>
      </div>
    </Link>
  );
}

function ReportCard({ r }: { r: ReportMeta }) {
  // Show SpecialCard (with hero image) for any report that has a thumbnail
  return r.thumb ? <SpecialCard r={r} /> : <RegularCard r={r} />;
}

function buildUrl(tab: Tab, page: number): string {
  const tabParam = TAB_PARAM[tab];
  const parts: string[] = [];
  if (tabParam !== 'all') parts.push(`tab=${tabParam}`);
  if (page > 1) parts.push(`page=${page}`);
  return '/reports' + (parts.length ? `?${parts.join('&')}` : '');
}

export default function ReportsClient({ reports }: { reports: ReportMeta[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const pageParam = Number(params.get('page')) || 1;
    if (tabParam && PARAM_TAB[tabParam]) setActiveTab(PARAM_TAB[tabParam]);
    setCurrentPage(pageParam);
  }, []);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    window.history.replaceState(null, '', buildUrl(tab, 1));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.history.replaceState(null, '', buildUrl(activeTab, page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Filter logic ──
  const getFiltered = (tab: Tab): ReportMeta[] => {
    switch (tab) {
      case 'All': return reports;
      case 'Latest': return reports.filter(r => daysAgo(r.date) <= BADGE_TTL_DAYS);
      case 'Special Report': return reports.filter(r => r.category === 'Special Report');
      case 'Deep Dive': return reports.filter(r => r.category === 'Deep Dive');
      case 'Crypto': return reports.filter(isCrypto);
    }
  };

  // ── Counts ──
  const counts: Record<Tab, number> = {
    'All': reports.length,
    'Latest': reports.filter(r => daysAgo(r.date) <= BADGE_TTL_DAYS).length,
    'Special Report': reports.filter(r => r.category === 'Special Report').length,
    'Deep Dive': reports.filter(r => r.category === 'Deep Dive').length,
    'Crypto': reports.filter(isCrypto).length,
  };

  const filtered = getFiltered(activeTab);

  // All tab: recent special reports go to featured section (not paginated), rest paginated
  const specials = reports.filter(r => r.category === 'Special Report' && daysAgo(r.date) <= BADGE_TTL_DAYS);
  const regularAll = reports.filter(r => !(r.category === 'Special Report' && daysAgo(r.date) <= BADGE_TTL_DAYS));

  // Pagination for non-All tabs (All tab paginates only the regularList)
  const paginatedItems = activeTab === 'All' ? regularAll : filtered;
  const totalPages = Math.max(1, Math.ceil(paginatedItems.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageSlice = paginatedItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      {/* ── TAB BAR ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const active = tab === activeTab;
          const count = counts[tab];
          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
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

      {/* ── ALL TAB ── */}
      {activeTab === 'All' && (
        <>
          {/* Featured: recent Special Reports (not paginated) */}
          {specials.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>⚡ SPECIAL REPORT</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {specials.map(r => <SpecialCard key={r.slug} r={r} />)}
              </div>
            </div>
          )}
          {/* Regular list (paginated) */}
          {pageSlice.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pageSlice.map(r => <ReportCard key={r.slug} r={r} />)}
              </div>
              <Pagination currentPage={safePage} totalPages={totalPages} onChange={handlePageChange} />
            </>
          ) : specials.length === 0 && (
            <div style={{ ...card, padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <p style={{ fontSize: 14, color: '#64748B' }}>Reports coming soon.</p>
            </div>
          )}
        </>
      )}

      {/* ── NON-ALL TABS ── */}
      {activeTab !== 'All' && (
        <>
          {filtered.length === 0 ? (
            <div style={{ ...card, padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <p style={{ fontSize: 14, color: '#64748B' }}>No reports in this category yet.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pageSlice.map(r => <ReportCard key={r.slug} r={r} />)}
              </div>
              <Pagination currentPage={safePage} totalPages={totalPages} onChange={handlePageChange} />
            </>
          )}
        </>
      )}
    </>
  );
}
