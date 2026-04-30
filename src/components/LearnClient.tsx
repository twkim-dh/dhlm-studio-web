'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fmtDateShort } from '@/lib/fmt-date';
import type { ResearchItem, LessonItem, InvestingLesson } from '@/app/learn/page';

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
      {a.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.heroImage} alt={a.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', background: '#0f172a' }} />
      ) : (
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 28 }}>🧠</span>
        </div>
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
    <div style={{ ...card, padding: 0, overflow: 'hidden', opacity: published ? 1 : 0.45 }}>
      {l.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={l.thumb} alt={l.thumbAlt || l.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', background: '#0f172a' }} />
      ) : (
        <div style={{ width: '100%', aspectRatio: '16/9', background: `${l.phaseColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: `${l.phaseColor}80`, letterSpacing: 1 }}>WEEK {l.week}</span>
        </div>
      )}
      <div style={{ padding: '14px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: '#8B5CF618', color: '#8B5CF6', border: '1px solid #8B5CF630', letterSpacing: 1 }}>
            CRYPTO 101
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${l.phaseColor}14`, color: l.phaseColor }}>
            WEEK {l.week}
          </span>
          {!published && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84318', color: '#D4A843', border: '1px solid #D4A84340', marginLeft: 'auto' }}>
              COMING SOON
            </span>
          )}
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

/* ─── Investing lesson card (Beginner or Intermediate) ─── */
function InvestingCard({ slug, title, description, thumb, week, published, accentColor }: {
  slug: string; title: string; description: string; thumb: string;
  week: number; published: boolean; accentColor: string;
}) {
  const inner = (
    <div style={{ ...card, padding: 0, overflow: 'hidden', opacity: published ? 1 : 0.45 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumb} alt={title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', background: '#0f172a' }} />
      <div style={{ padding: '14px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}30`, letterSpacing: 1 }}>
            INVESTING 101
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${accentColor}14`, color: accentColor }}>
            WEEK {week}
          </span>
          {!published && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84318', color: '#D4A843', border: '1px solid #D4A84340', marginLeft: 'auto' }}>
              COMING SOON
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 6 }}>{title}</div>
        <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.55 }}>{description}</p>
      </div>
    </div>
  );
  return published ? (
    <Link href={`/learn/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>
  ) : (
    <div>{inner}</div>
  );
}

/* ─── Grid wrapper ─── */
function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
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
      {/* Edition label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 5, background: '#8B5CF618', color: '#8B5CF6', border: '1px solid #8B5CF630', letterSpacing: 1 }}>CRYPTO 101</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 5, background: '#1E293B', color: '#64748B', letterSpacing: 1 }}>2026 EDITION</span>
      </div>
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

/* ─── Beginner lesson list (hardcoded, all published) ─── */
const BEGINNER_LESSONS = [
  { week: 1, slug: 'investing-101-beginner-w1-what-is-a-stock-really', title: 'What Is a Stock, Really?', description: 'Forget the ticker symbols. A stock is a legal claim on a living business. Understand that, and everything else follows.', thumb: '/images/content/investing-101-beginner-w1-what-is-a-stock-hero.png' },
  { week: 2, slug: 'investing-101-beginner-w2-how-the-market-actually-works', title: 'How the Market Actually Works', description: 'Exchanges, market makers, clearinghouses — what actually happens between "buy" and "share in your account."', thumb: '/images/content/investing-101-beginner-w2-how-market-works-hero.png' },
  { week: 3, slug: 'investing-101-beginner-w3-opening-your-first-brokerage-account', title: 'Opening Your First Brokerage Account', description: 'Choosing a broker, account types, and the first decisions every new investor faces before placing a single trade.', thumb: '/images/content/investing-101-beginner-w3-brokerage-account-hero.png' },
  { week: 4, slug: 'investing-101-beginner-w4-reading-income-statement', title: 'Reading a Company (Part 1): The Income Statement', description: 'Revenue, gross profit, operating income, net income — what each number actually tells you.', thumb: '/images/content/investing-101-beginner-w4-income-statement-hero.png' },
  { week: 5, slug: 'investing-101-beginner-w5-reading-balance-sheet', title: 'Reading a Company (Part 2): The Balance Sheet', description: 'Assets, liabilities, equity — the snapshot of what a company owns, owes, and what is left for shareholders.', thumb: '/images/content/investing-101-beginner-w5-balance-sheet-hero.png' },
  { week: 6, slug: 'investing-101-beginner-w6-reading-cash-flow-statement', title: 'Reading a Company (Part 3): The Cash Flow Statement', description: 'Why free cash flow matters more than earnings, and how to tell a profitable business from a cash-burning one.', thumb: '/images/content/investing-101-beginner-w6-cash-flow-statement-hero.png' },
  { week: 7, slug: 'investing-101-beginner-w7-what-is-a-business-model', title: 'What Is a Business Model?', description: 'How a company actually makes money — and why the model shapes everything about how to value it.', thumb: '/images/content/investing-101-beginner-w7-business-model-hero.png' },
  { week: 8, slug: 'investing-101-beginner-w8-valuation-basics', title: 'Valuation Basics: P/E, P/B, PEG', description: 'What does it mean for a stock to be "expensive" or "cheap"? Three core multiples and how to use them.', thumb: '/images/content/investing-101-beginner-w8-valuation-basics-hero.png' },
  { week: 9, slug: 'investing-101-beginner-w9-dividends-and-total-return', title: 'Dividends and Total Return', description: 'Yield, payout ratio, dividend growth — and why total return is the only number that matters.', thumb: '/images/content/investing-101-beginner-w9-dividends-total-return-hero.png' },
  { week: 10, slug: 'investing-101-beginner-w10-diversification-portfolio-basics', title: 'Diversification and Portfolio Basics', description: 'Why spreading risk works, how much diversification is enough, and building a portfolio that survives a crash.', thumb: '/images/content/investing-101-beginner-w10-diversification-portfolio-hero.png' },
  { week: 11, slug: 'investing-101-beginner-w11-investors-mind', title: "The Investor's Mind: Fear, Greed, Patience", description: 'The behavioral traps that destroy returns — and how to recognize them before they cost you.', thumb: '/images/content/investing-101-beginner-w11-investors-mind-hero.png' },
  { week: 12, slug: 'investing-101-beginner-w12-your-first-five-years', title: 'Your First 5 Years: A Realistic Roadmap', description: 'A concrete action plan from Day 1 through Year 5. What to do, in what order, with what goals.', thumb: '/images/content/investing-101-beginner-w12-five-year-roadmap-hero.png' },
];

/* ─── INVESTING 101 tab ─── */
function Investing101Tab({ intermediateLessons }: { intermediateLessons: InvestingLesson[] }) {
  const [level, setLevel] = useState<'beginner' | 'intermediate'>('beginner');

  const intPublished = intermediateLessons.filter(l => l.published).length;

  const levelBtnStyle = (active: boolean, color: string) => ({
    padding: '6px 14px',
    borderRadius: 7,
    border: active ? `1px solid ${color}50` : '1px solid #1E293B',
    background: active ? `${color}18` : '#111827',
    color: active ? color : '#64748B',
    fontFamily: 'var(--mono)',
    fontSize: 10,
    fontWeight: active ? 800 : 600,
    cursor: 'pointer',
    letterSpacing: 0.5,
    transition: 'all 0.15s',
  } as React.CSSProperties);

  return (
    <div>
      {/* Edition label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 5, background: '#00D47418', color: '#00D474', border: '1px solid #00D47430', letterSpacing: 1 }}>INVESTING 101</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 5, background: '#1E293B', color: '#64748B', letterSpacing: 1 }}>2026 EDITION</span>
      </div>

      {/* Level sub-tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <button onClick={() => setLevel('beginner')} style={levelBtnStyle(level === 'beginner', '#00D474')}>
          BEGINNER (W1-12)
        </button>
        <button onClick={() => setLevel('intermediate')} style={levelBtnStyle(level === 'intermediate', '#3B82F6')}>
          INTERMEDIATE (W13-24)
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '14px 18px', borderRadius: 12, background: '#0D1117', border: '1px solid #1E293B' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: level === 'beginner' ? '#00D474' : '#3B82F6' }}>CURRICULUM PROGRESS</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B' }}>
              {level === 'beginner' ? '12/12 PUBLISHED' : `${intPublished} PUBLISHED · NEW WEEKLY`}
            </span>
          </div>
          <div style={{ height: 5, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '100%', background: level === 'beginner' ? 'linear-gradient(90deg, #00D474, #059952)' : 'linear-gradient(90deg, #3B82F6, #1D4ED8)', borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
        </div>
        <Link
          href={level === 'beginner' ? '/learn/investing-101-beginner' : '/learn/investing-101-intermediate'}
          style={{ fontFamily: 'var(--mono)', fontSize: 11, color: level === 'beginner' ? '#00D474' : '#3B82F6', textDecoration: 'none', fontWeight: 700, flexShrink: 0 }}
        >
          Full Curriculum →
        </Link>
      </div>

      {/* Cards */}
      <CardGrid>
        {level === 'beginner'
          ? BEGINNER_LESSONS.map(l => (
              <InvestingCard key={l.week} slug={l.slug} title={l.title} description={l.description} thumb={l.thumb} week={l.week} published={true} accentColor="#00D474" />
            ))
          : intermediateLessons.filter(l => l.published).map(l => (
              <InvestingCard key={l.week} slug={l.slug} title={l.title} description={l.description} thumb={l.thumb} week={l.week} published={true} accentColor="#3B82F6" />
            ))
        }
      </CardGrid>

      {level === 'intermediate' && (
        <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 12, background: '#0D1117', border: '1px solid #1E293B', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 8px', lineHeight: 1.6 }}>
            More lessons published weekly.
          </p>
          <a href="/" style={{ fontSize: 12, fontWeight: 700, color: '#3B82F6', textDecoration: 'none' }}>
            Subscribe to receive new releases first →
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Main export ─── */
export default function LearnClient({ articles, cryptoLessons, intermediateLessons }: {
  articles: ResearchItem[];
  cryptoLessons: LessonItem[];
  intermediateLessons: InvestingLesson[];
}) {
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
      {activeTab === 'INVESTING 101' && <Investing101Tab intermediateLessons={intermediateLessons} />}
    </>
  );
}
