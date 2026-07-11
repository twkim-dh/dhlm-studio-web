'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fmtDateShort } from '@/lib/fmt-date';
import type { ResearchItem, InvestingLesson, QuantumLesson, MastersLesson } from '@/app/learn/page';

type Tab = 'ALL' | 'THE MASTERS' | 'INVESTING 101' | 'QUANTUM 101';
const TABS: Tab[] = ['ALL', 'THE MASTERS', 'QUANTUM 101', 'INVESTING 101'];
const TAB_PARAM: Record<Tab, string> = {
  'ALL': 'all',
  'THE MASTERS': 'the-masters',
  'INVESTING 101': 'investing-101',
  'QUANTUM 101': 'quantum-101',
};
const PARAM_TAB: Record<string, Tab> = Object.fromEntries(
  Object.entries(TAB_PARAM).map(([k, v]) => [v, k as Tab])
);

const TAB_ACCENT: Record<Tab, string> = {
  'ALL':           '#2D2F8F',
  'THE MASTERS':   '#B5860D',
  'INVESTING 101': '#2A7A4C',
  'QUANTUM 101':   '#5B3FB5',
};

function verdictColor(v: string) {
  if (v === 'YES') return { fg: '#2A7A4C', bg: '#F0FAF5', border: '#B7DEC9' };
  if (v === 'NO')  return { fg: '#C0392B', bg: '#FDF0EE', border: '#F1B8B3' };
  return { fg: '#B5860D', bg: '#FDF8ED', border: '#E8D5A3' };
}

/* ─── Shared card layout ─── */
function LearnCard({
  href, thumb, thumbAlt, badges, title, desc, meta, disabled,
}: {
  href?: string;
  thumb?: string;
  thumbAlt?: string;
  badges?: React.ReactNode;
  title: string;
  desc?: string;
  meta?: React.ReactNode;
  disabled?: boolean;
}) {
  const inner = (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E8E8E4',
      overflow: 'hidden', opacity: disabled ? 0.45 : 1,
      display: 'flex', flexDirection: 'column',
    }}>
      {thumb ? (
        <Image src={thumb} alt={thumbAlt || title} width={1200} height={800} loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          style={{ width: '100%', height: 'auto', display: 'block', background: '#FAFAF8' }} />
      ) : (
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#FAFAF8' }} />
      )}
      <div style={{ padding: '16px 18px 20px', flex: 1 }}>
        {badges && <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>{badges}</div>}
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 400,
          color: '#16161A', lineHeight: 1.4, marginBottom: 6, letterSpacing: '-0.01em'
        }}>
          {title}
        </div>
        {desc && (
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#5B6470', margin: 0, lineHeight: 1.55 }}>
            {desc}
          </p>
        )}
        {meta && <div style={{ marginTop: 10 }}>{meta}</div>}
      </div>
    </div>
  );
  if (!href || disabled) return <div>{inner}</div>;
  return <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>;
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
      padding: '3px 8px', border: `1px solid ${color}40`,
      color: color, letterSpacing: 1, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function ComingSoonBadge() {
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600,
      padding: '3px 8px', border: '1px solid #E8E8E4',
      color: '#B0B8C1', letterSpacing: 1, marginLeft: 'auto',
    }}>
      COMING SOON
    </span>
  );
}

/* ─── Research card ─── */
function ResearchCard({ a }: { a: ResearchItem }) {
  const c = verdictColor(a.verdict ?? '');
  return (
    <LearnCard
      href={`/research/${a.slug}`}
      thumb={a.heroImage}
      thumbAlt={a.title}
      title={a.title}
      desc={a.description}
      badges={<>
        {a.verdict ? (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            padding: '3px 8px', background: c.bg, color: c.fg,
            border: `1px solid ${c.border}`, letterSpacing: 1
          }}>
            VERDICT: {a.verdict}
          </span>
        ) : a.subcategory ? (
          <Badge label={a.subcategory.toUpperCase()} color="#2D2F8F" />
        ) : null}
        <Badge label={a.category} color="#5B6470" />
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: '#B0B8C1',
          marginLeft: 'auto', alignSelf: 'center'
        }}>
          {fmtDateShort(a.date)} · {a.readTime}
        </span>
      </>}
      meta={a.paperAuthors ? (
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#8A929C', letterSpacing: 0.5 }}>
          {a.paperAuthors}{a.paperYear ? ` (${a.paperYear})` : ''}
        </div>
      ) : undefined}
    />
  );
}

/* ─── Masters card ─── */
function MastersCard({ slug, title, description, thumb, subject }: MastersLesson) {
  return (
    <LearnCard
      href={`/learn/${slug}`}
      thumb={thumb}
      thumbAlt={title}
      title={title}
      desc={description}
      badges={<>
        <Badge label="THE MASTERS" color="#B5860D" />
        <Badge label={subject.toUpperCase()} color="#B5860D" />
      </>}
    />
  );
}

/* ─── Investing lesson card ─── */
function InvestingCard({ slug, title, description, thumb, week, published, accentColor }: {
  slug: string; title: string; description: string; thumb: string;
  week: number; published: boolean; accentColor: string;
}) {
  return (
    <LearnCard
      href={published ? `/learn/${slug}` : undefined}
      thumb={thumb}
      thumbAlt={title}
      title={title}
      desc={description}
      disabled={!published}
      badges={<>
        <Badge label="INVESTING 101" color={accentColor} />
        <Badge label={`WEEK ${week}`} color={accentColor} />
        {!published && <ComingSoonBadge />}
      </>}
    />
  );
}

/* ─── Quantum lesson card ─── */
function QuantumCard({ slug, title, description, thumb, part, published }: {
  slug: string; title: string; description: string; thumb: string;
  part: number; published: boolean;
}) {
  const color = '#5B3FB5';
  return (
    <LearnCard
      href={published ? `/learn/${slug}` : undefined}
      thumb={thumb}
      thumbAlt={title}
      title={title}
      desc={description}
      disabled={!published}
      badges={<>
        <Badge label="QUANTUM 101" color={color} />
        <Badge label={`PART ${part}`} color={color} />
        {!published && <ComingSoonBadge />}
      </>}
    />
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

/* ─── Progress bar ─── */
function ProgressBar({ label, value, total, color, link }: {
  label: string; value: number; total: number; color: string; link: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
      padding: '16px 20px', border: '1px solid #E8E8E4'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color, letterSpacing: 1 }}>
            {label}
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#8A929C' }}>
            {value === total ? `${value}/${total} PUBLISHED` : `${value} PUBLISHED · NEW WEEKLY`}
          </span>
        </div>
        <div style={{ height: 3, background: '#F0F0EC', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(value / total) * 100}%`, background: color, transition: 'width 0.3s' }} />
        </div>
      </div>
      <Link href={link} style={{
        fontFamily: 'var(--mono)', fontSize: 10, color, textDecoration: 'none',
        fontWeight: 700, flexShrink: 0, letterSpacing: 0.5
      }}>
        Full →
      </Link>
    </div>
  );
}

/* ─── ALL tab ─── */
function AllTab({ articles, mastersLessons }: { articles: ResearchItem[]; mastersLessons: MastersLesson[] }) {
  const publishedMasters = mastersLessons.filter(l => l.published);
  const totalCount = articles.length + publishedMasters.length;
  return (
    <div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#8A929C', marginBottom: 16, letterSpacing: 1 }}>
        {totalCount} ITEMS
      </div>
      <CardGrid>
        {articles.map(a => <ResearchCard key={a.slug} a={a} />)}
        {publishedMasters.map(l => <MastersCard key={l.slug} {...l} />)}
      </CardGrid>
    </div>
  );
}

/* ─── THE MASTERS tab ─── */
function MastersTab({ lessons }: { lessons: MastersLesson[] }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Badge label="THE MASTERS" color="#B5860D" />
        <Badge label="INVESTOR BIOGRAPHIES" color="#8A929C" />
      </div>
      <div style={{
        padding: '18px 20px', border: '1px solid #E8E8E4', marginBottom: 20
      }}>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#5B6470', margin: '0 0 8px', lineHeight: 1.6 }}>
          Deep-dives into how legendary investors actually think. Not mythology — methodology.
          Livermore, Druckenmiller, Peter Lynch, Charlie Munger.
        </p>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#B5860D', fontWeight: 700, letterSpacing: 1 }}>
          {lessons.length} PARTS PUBLISHED
        </div>
      </div>
      <CardGrid>
        {lessons.map(l => <MastersCard key={l.slug} {...l} />)}
      </CardGrid>
    </div>
  );
}

/* ─── Beginner lessons (hardcoded) ─── */
const BEGINNER_LESSONS = [
  { week: 1, slug: 'investing-101-beginner-w1-what-is-a-stock-really', title: 'What Is a Stock, Really?', description: 'Forget the ticker symbols. A stock is a legal claim on a living business.', thumb: '/images/content/investing-101-beginner-w1-what-is-a-stock-hero.webp' },
  { week: 2, slug: 'investing-101-beginner-w2-how-the-market-actually-works', title: 'How the Market Actually Works', description: 'Exchanges, market makers, clearinghouses — what actually happens between "buy" and "share in your account."', thumb: '/images/content/investing-101-beginner-w2-how-market-works-hero.webp' },
  { week: 3, slug: 'investing-101-beginner-w3-opening-your-first-brokerage-account', title: 'Opening Your First Brokerage Account', description: 'Choosing a broker, account types, and the first decisions every new investor faces.', thumb: '/images/content/investing-101-beginner-w3-brokerage-account-hero.webp' },
  { week: 4, slug: 'investing-101-beginner-w4-reading-income-statement', title: 'Reading a Company (Part 1): The Income Statement', description: 'Revenue, gross profit, operating income, net income — what each number actually tells you.', thumb: '/images/content/investing-101-beginner-w4-income-statement-hero.webp' },
  { week: 5, slug: 'investing-101-beginner-w5-reading-balance-sheet', title: 'Reading a Company (Part 2): The Balance Sheet', description: 'Assets, liabilities, equity — the snapshot of what a company owns, owes, and what is left for shareholders.', thumb: '/images/content/investing-101-beginner-w5-balance-sheet-hero.webp' },
  { week: 6, slug: 'investing-101-beginner-w6-reading-cash-flow-statement', title: 'Reading a Company (Part 3): The Cash Flow Statement', description: 'Why free cash flow matters more than earnings, and how to tell a profitable business from a cash-burning one.', thumb: '/images/content/investing-101-beginner-w6-cash-flow-statement-hero.webp' },
  { week: 7, slug: 'investing-101-beginner-w7-what-is-a-business-model', title: 'What Is a Business Model?', description: 'How a company actually makes money — and why the model shapes everything about how to value it.', thumb: '/images/content/investing-101-beginner-w7-business-model-hero.webp' },
  { week: 8, slug: 'investing-101-beginner-w8-valuation-basics', title: 'Valuation Basics: P/E, P/B, PEG', description: 'What does it mean for a stock to be "expensive" or "cheap"? Three core multiples.', thumb: '/images/content/investing-101-beginner-w8-valuation-basics-hero.webp' },
  { week: 9, slug: 'investing-101-beginner-w9-dividends-and-total-return', title: 'Dividends and Total Return', description: 'Yield, payout ratio, dividend growth — and why total return is the only number that matters.', thumb: '/images/content/investing-101-beginner-w9-dividends-total-return-hero.webp' },
  { week: 10, slug: 'investing-101-beginner-w10-diversification-portfolio-basics', title: 'Diversification and Portfolio Basics', description: 'Why spreading risk works, how much is enough, and building a portfolio that survives a crash.', thumb: '/images/content/investing-101-beginner-w10-diversification-portfolio-hero.webp' },
  { week: 11, slug: 'investing-101-beginner-w11-investors-mind', title: "The Investor's Mind: Fear, Greed, Patience", description: 'The behavioral traps that destroy returns — and how to recognize them before they cost you.', thumb: '/images/content/investing-101-beginner-w11-investors-mind-hero.webp' },
  { week: 12, slug: 'investing-101-beginner-w12-your-first-five-years', title: 'Your First 5 Years: A Realistic Roadmap', description: 'A concrete action plan from Day 1 through Year 5.', thumb: '/images/content/investing-101-beginner-w12-five-year-roadmap-hero.webp' },
];

/* ─── INVESTING 101 tab ─── */
function Investing101Tab({ intermediateLessons }: { intermediateLessons: InvestingLesson[] }) {
  const [level, setLevel] = useState<'beginner' | 'intermediate'>('beginner');
  const intPublished = intermediateLessons.filter(l => l.published).length;
  const showAllIntermediate = intPublished >= 6;
  const color = level === 'beginner' ? '#2A7A4C' : '#2D2F8F';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Badge label="INVESTING 101" color={color} />
        <Badge label="2026 EDITION" color="#8A929C" />
      </div>

      {/* Level sub-tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid #E8E8E4' }}>
        {(['beginner', 'intermediate'] as const).map(lvl => {
          const active = level === lvl;
          const c = lvl === 'beginner' ? '#2A7A4C' : '#2D2F8F';
          return (
            <button key={lvl} onClick={() => setLevel(lvl)} style={{
              padding: '10px 18px',
              borderBottom: active ? `2px solid ${c}` : '2px solid transparent',
              background: 'none', border: 'none',
              borderBottomWidth: 2,
              borderBottomStyle: 'solid',
              borderBottomColor: active ? c : 'transparent',
              color: active ? c : '#8A929C',
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: active ? 700 : 500,
              cursor: 'pointer', letterSpacing: 1,
            }}>
              {lvl === 'beginner' ? 'BEGINNER (W1-12)' : 'INTERMEDIATE (W13-24)'}
            </button>
          );
        })}
      </div>

      <ProgressBar
        label="CURRICULUM PROGRESS"
        value={level === 'beginner' ? 12 : intPublished}
        total={12}
        color={color}
        link={level === 'beginner' ? '/learn/investing-101-beginner' : '/learn/investing-101'}
      />

      <CardGrid>
        {level === 'beginner'
          ? BEGINNER_LESSONS.map(l => (
              <InvestingCard key={l.week} slug={l.slug} title={l.title} description={l.description} thumb={l.thumb} week={l.week} published={true} accentColor="#2A7A4C" />
            ))
          : (showAllIntermediate ? intermediateLessons : intermediateLessons.filter(l => l.published)).map(l => (
              <InvestingCard key={l.week} slug={l.slug} title={l.title} description={l.description} thumb={l.thumb} week={l.week} published={l.published} accentColor="#2D2F8F" />
            ))
        }
      </CardGrid>

      {level === 'intermediate' && !showAllIntermediate && (
        <div style={{ marginTop: 20, padding: '18px 20px', border: '1px solid #E8E8E4', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#5B6470', margin: '0 0 8px', lineHeight: 1.6 }}>
            More lessons published weekly.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── QUANTUM 101 tab ─── */
function Quantum101Tab({ lessons }: { lessons: QuantumLesson[] }) {
  const published = lessons.filter(l => l.published).length;
  const color = '#5B3FB5';
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Badge label="QUANTUM 101" color={color} />
        <Badge label="2026 EDITION" color="#8A929C" />
      </div>
      <ProgressBar
        label="CURRICULUM PROGRESS"
        value={published}
        total={lessons.length}
        color={color}
        link="/learn/quantum-101"
      />
      <CardGrid>
        {lessons.map(l => (
          <QuantumCard key={l.part} slug={l.slug} title={l.title} description={l.description} thumb={l.thumb} part={l.part} published={l.published} />
        ))}
      </CardGrid>
      {published < lessons.length && (
        <div style={{ marginTop: 20, padding: '18px 20px', border: '1px solid #E8E8E4', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#5B6470', margin: '0 0 8px', lineHeight: 1.6 }}>
            New parts published every Monday.
          </p>
          <Link href="/learn/quantum-101" style={{ fontFamily: 'var(--sans)', fontSize: 13, color, textDecoration: 'none' }}>
            View full series schedule →
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── Main export ─── */
export default function LearnClient({ articles, mastersLessons, intermediateLessons, quantumLessons }: {
  articles: ResearchItem[];
  mastersLessons: MastersLesson[];
  intermediateLessons: InvestingLesson[];
  quantumLessons: QuantumLesson[];
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
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid #E8E8E4', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const active = tab === activeTab;
          const color = TAB_ACCENT[tab];
          return (
            <button key={tab} onClick={() => handleTab(tab)} style={{
              flexShrink: 0,
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
              color: active ? color : '#8A929C',
              fontFamily: 'var(--mono)', fontSize: 10,
              fontWeight: active ? 700 : 500,
              cursor: 'pointer', letterSpacing: 1,
              transition: 'color 0.15s',
            }}>
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'ALL'           && <AllTab articles={articles} mastersLessons={mastersLessons} />}
      {activeTab === 'THE MASTERS'   && <MastersTab lessons={mastersLessons} />}
      {activeTab === 'QUANTUM 101'   && <Quantum101Tab lessons={quantumLessons} />}
      {activeTab === 'INVESTING 101' && <Investing101Tab intermediateLessons={intermediateLessons} />}
    </>
  );
}
