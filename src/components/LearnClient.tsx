'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fmtDateShort } from '@/lib/fmt-date';
import type { ResearchItem, LessonItem } from '@/app/learn/page';

type Tab = 'ALL' | 'CRYPTO 101' | 'INVESTING 101';
const TABS: Tab[] = ['ALL', 'CRYPTO 101', 'INVESTING 101'];
const TAB_PARAM: Record<Tab, string> = {
  'ALL': 'all',
  'CRYPTO 101': 'crypto-101',
  'INVESTING 101': 'investing-101',
};
const PARAM_TAB: Record<string, Tab> = Object.fromEntries(
  Object.entries(TAB_PARAM).map(([k, v]) => [v, k as Tab])
);

const TAB_COLOR: Record<Tab, string> = {
  'ALL': '#C73E3A',
  'CRYPTO 101': '#8B5CF6',
  'INVESTING 101': '#00D474',
};

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

function verdictColor(v: string) {
  if (v === 'YES') return { fg: '#00D474', bg: '#00D47418', border: '#00D47440' };
  if (v === 'NO')  return { fg: '#FF4545', bg: '#FF454518', border: '#FF454540' };
  return { fg: '#D4A843', bg: '#D4A84318', border: '#D4A84340' };
}

/* ─── Research thumbnail card ─── */
function ResearchCard({ a }: { a: ResearchItem }) {
  const c = verdictColor(a.verdict ?? '');
  const isStructural = a.badge === 'structural-view';
  const isMenutal = a.badge === 'mental-game';
  const subBg = isStructural ? '#0EA5E918' : '#7C3AED18';
  const subFg = isStructural ? '#38BDF8' : '#A78BFA';
  const subBorder = isStructural ? '#0EA5E940' : '#7C3AED40';

  return (
    <Link href={`/research/${a.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
      {a.heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.heroImage}
          alt={a.title}
          style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
        />
      )}
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, flexWrap: 'wrap' }}>
          {a.verdict ? (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: c.bg, color: c.fg, border: `1px solid ${c.border}`, letterSpacing: 1 }}>
              VERDICT: {a.verdict}
            </span>
          ) : (a.subcategory && !isMenutal) ? (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: subBg, color: subFg, border: `1px solid ${subBorder}`, letterSpacing: 1 }}>
              {a.subcategory.toUpperCase()}
            </span>
          ) : a.subcategory ? (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: '#7C3AED18', color: '#A78BFA', border: '1px solid #7C3AED40', letterSpacing: 1 }}>
              {a.subcategory.toUpperCase()}
            </span>
          ) : null}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#3B82F614', color: '#3B82F6' }}>
            {a.category}
          </span>
          <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>
            {fmtDateShort(a.date)} · {a.readTime}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 6 }}>{a.title}</div>
        <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.55 }}>{a.description}</p>
        {a.paperAuthors && (
          <div style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--mono)', marginTop: 8 }}>
            {a.paperAuthors}{a.paperYear ? ` (${a.paperYear})` : ''}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ─── Crypto lesson thumbnail card ─── */
function LessonCard({ l }: { l: LessonItem }) {
  const published = !!l.slug;
  const inner = (
    <div style={{ ...card, padding: 0, overflow: 'hidden', opacity: published ? 1 : 0.45, position: 'relative' }}>
      {l.thumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={l.thumb}
          alt={l.thumbAlt}
          style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
        />
      )}
      {!published && (
        <div style={{ position: 'absolute', top: 10, right: 10, fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84318', color: '#D4A843', border: '1px solid #D4A84340' }}>
          COMING SOON
        </div>
      )}
      <div style={{ padding: '14px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: '#8B5CF618', color: '#8B5CF6', border: '1px solid #8B5CF630', letterSpacing: 1 }}>
            CRYPTO 101
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${l.phaseColor}14`, color: l.phaseColor }}>
            WEEK {l.week}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 6 }}>{l.title}</div>
        <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.55 }}>{l.description}</p>
      </div>
    </div>
  );

  return published ? (
    <Link href={`/blog/${l.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}

/* ─── Grid wrapper ─── */
function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: 14,
    }}>
      {children}
    </div>
  );
}

/* ─── ALL tab ─── */
function AllTab({ articles, cryptoLessons }: { articles: ResearchItem[]; cryptoLessons: LessonItem[] }) {
  const publishedLessons = cryptoLessons.filter(l => l.slug);
  const totalCount = articles.length + publishedLessons.length;

  return (
    <div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', marginBottom: 16 }}>
        {totalCount} ITEMS
      </div>
      <CardGrid>
        {articles.map(a => <ResearchCard key={a.slug} a={a} />)}
        {publishedLessons.map(l => <LessonCard key={l.slug} l={l} />)}
      </CardGrid>
    </div>
  );
}

/* ─── CRYPTO 101 tab ─── */
function Crypto101Tab({ lessons }: { lessons: LessonItem[] }) {
  const published = lessons.filter(l => l.slug).length;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '14px 18px', borderRadius: 12, background: '#0D1117', border: '1px solid #1E293B' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#8B5CF6' }}>CURRICULUM PROGRESS</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B' }}>{published}/{lessons.length} PUBLISHED</span>
          </div>
          <div style={{ height: 5, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(published / lessons.length) * 100}%`, background: 'linear-gradient(90deg, #8B5CF6, #6D28D9)', borderRadius: 3 }} />
          </div>
        </div>
        <Link href="/learn/crypto-101" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#8B5CF6', textDecoration: 'none', fontWeight: 700, flexShrink: 0 }}>
          Full Curriculum →
        </Link>
      </div>
      <CardGrid>
        {lessons.map(l => <LessonCard key={l.week} l={l} />)}
      </CardGrid>
    </div>
  );
}

/* ─── INVESTING 101 tab ─── */
function Investing101Tab() {
  return (
    <div style={{ ...card, padding: '36px 28px', textAlign: 'center', opacity: 0.7 }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📈</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 6, background: '#D4A84318', color: '#D4A843', border: '1px solid #D4A84340', display: 'inline-block', letterSpacing: 1, marginBottom: 14 }}>
        ⏳ COMING APRIL 21, 2026
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', marginBottom: 10 }}>
        Stock Market Fundamentals
      </div>
      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: '0 auto', maxWidth: 480 }}>
        How markets actually work. Financial statements, valuation, earnings analysis, and building an investment framework. 12 lessons · 3 phases.
      </p>
    </div>
  );
}

/* ─── Main export ─── */
export default function LearnClient({ articles, cryptoLessons }: { articles: ResearchItem[]; cryptoLessons: LessonItem[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('ALL');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('tab');
    if (p && PARAM_TAB[p]) setActiveTab(PARAM_TAB[p]);
  }, []);

  const handleTab = (tab: Tab) => {
    setActiveTab(tab);
    const param = TAB_PARAM[tab];
    window.history.replaceState(null, '', `/learn${param === 'all' ? '' : `?tab=${param}`}`);
  };

  return (
    <>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const active = tab === activeTab;
          const color = TAB_COLOR[tab];
          return (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: 8,
                border: active ? `1px solid ${color}60` : '1px solid #1E293B',
                background: active ? `${color}18` : '#111827',
                color: active ? '#F1F5F9' : '#64748B',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                fontWeight: active ? 800 : 600,
                cursor: 'pointer',
                letterSpacing: 0.5,
                transition: 'all 0.15s',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'ALL'           && <AllTab articles={articles} cryptoLessons={cryptoLessons} />}
      {activeTab === 'CRYPTO 101'    && <Crypto101Tab lessons={cryptoLessons} />}
      {activeTab === 'INVESTING 101' && <Investing101Tab />}
    </>
  );
}
