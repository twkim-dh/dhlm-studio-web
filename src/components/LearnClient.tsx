'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fmtDateShort } from '@/lib/fmt-date';

interface ResearchMeta {
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  badge?: string;
  date: string;
  readTime: string;
  verdict?: string;
  description: string;
  paperAuthors?: string;
  paperYear?: number;
}

type Tab = 'CRYPTO 101' | 'INVESTING 101' | 'PAPER VS. PROFIT';
const TABS: Tab[] = ['CRYPTO 101', 'INVESTING 101', 'PAPER VS. PROFIT'];

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

function verdictColor(v: string): { fg: string; bg: string; border: string } {
  if (v === 'YES') return { fg: '#00D474', bg: '#00D47418', border: '#00D47440' };
  if (v === 'NO')  return { fg: '#FF4545', bg: '#FF454518', border: '#FF454540' };
  return { fg: '#D4A843', bg: '#D4A84318', border: '#D4A84340' };
}

function Crypto101Tab() {
  return (
    <div>
      <Link
        href="/learn/crypto-101"
        style={{
          ...card,
          padding: 0,
          textDecoration: 'none',
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          borderColor: '#8B5CF630',
          background: 'linear-gradient(135deg, #8B5CF608, #111827)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#8B5CF6' }} />
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, flexShrink: 0,
              background: '#8B5CF618', border: '1px solid #8B5CF630',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }}>🪙</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: '#8B5CF618', color: '#8B5CF6', letterSpacing: 1 }}>
                  CRYPTO 101
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#00D47414', color: '#00D474' }}>
                  ● LIVE · 8/12 LESSONS
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: '0 0 8px', lineHeight: 1.2 }}>
                Crypto From Scratch
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 14px', lineHeight: 1.6 }}>
                From &ldquo;What is blockchain?&rdquo; to DeFi, staking, and portfolio strategy. 12 lessons. No jargon, no hype.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, maxWidth: 200 }}>
                  <div style={{ height: 4, background: '#1E293B', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '67%', background: 'linear-gradient(90deg, #8B5CF6, #8B5CF699)', borderRadius: 2 }} />
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#8B5CF6', fontWeight: 700 }}>
                  Start Course →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div style={{ marginTop: 20, padding: '18px 22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8B5CF6', letterSpacing: 2, marginBottom: 8 }}>CURRICULUM</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 6 }}>
          {[
            { phase: 'Phase 1', label: 'Foundations', color: '#8B5CF6', desc: 'Blockchain, Bitcoin, Wallets, Buying, Exchanges' },
            { phase: 'Phase 2', label: 'DeFi & Ecosystem', color: '#A78BFA', desc: 'DeFi, Staking, NFTs, Regulation, Taxes' },
            { phase: 'Phase 3', label: 'Strategy', color: '#C4B5FD', desc: 'Bull/Bear cycles, Risk, Portfolio, 2026 Outlook' },
          ].map(p => (
            <div key={p.phase} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0, marginTop: 4 }} />
              <div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: p.color, fontWeight: 700 }}>{p.phase} — {p.label}</span>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Investing101Tab() {
  return (
    <div style={{ ...card, padding: '24px 28px', opacity: 0.75 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, flexShrink: 0,
          background: '#00D47414', border: '1px solid #00D47430',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
        }}>📈</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: '#00D47414', color: '#00D474', letterSpacing: 1 }}>
              INVESTING 101
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>
              ⏳ Coming April 21, 2026
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: '0 0 8px', lineHeight: 1.2 }}>
            Stock Market Fundamentals
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 14px', lineHeight: 1.6 }}>
            How markets actually work. Financial statements, valuation, earnings analysis, and building an investment framework.
          </p>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569' }}>
            Coming April 21, 2026 · 12 lessons · 3 phases
          </div>
        </div>
      </div>
    </div>
  );
}

function PaperVsProfitTab({ articles }: { articles: ResearchMeta[] }) {
  return (
    <div>
      {articles.length === 0 ? (
        <div style={{ ...card, padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#94A3B8', margin: 0 }}>First Paper vs. Profit issue coming soon.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {articles.map(a => {
            const c = verdictColor(a.verdict ?? '');
            return (
              <Link key={a.slug} href={`/learn/paper-vs-profit/${a.slug}`} style={{ ...card, padding: '20px 24px', textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  {a.verdict ? (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 6, background: c.bg, color: c.fg, border: `1px solid ${c.border}`, letterSpacing: 1 }}>
                      VERDICT: {a.verdict}
                    </span>
                  ) : a.subcategory ? (() => {
                    const isStructural = a.badge === 'structural-view';
                    const bg = isStructural ? '#0EA5E918' : '#7C3AED18';
                    const fg = isStructural ? '#38BDF8' : '#A78BFA';
                    const border = isStructural ? '#0EA5E940' : '#7C3AED40';
                    return (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 6, background: bg, color: fg, border: `1px solid ${border}`, letterSpacing: 1 }}>
                        {a.subcategory.toUpperCase()}
                      </span>
                    );
                  })() : null}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#3B82F614', color: '#3B82F6' }}>{a.category}</span>
                  <span style={{ fontSize: 11, color: '#475569' }}>{fmtDateShort(a.date)} · {a.readTime}</span>
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.4, marginBottom: 6 }}>{a.title}</div>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 8px', lineHeight: 1.6 }}>{a.description}</p>
                {a.paperAuthors && (
                  <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--mono)' }}>
                    {a.paperAuthors}{a.paperYear ? ` (${a.paperYear})` : ''}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 6 }}>PUBLICATION SCHEDULE</div>
        <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7 }}>
          New issue every <strong style={{ color: '#E2E8F0' }}>Wednesday</strong>. Each issue takes one academic finance paper, summarizes the method, evaluates the numbers, and delivers a verdict: <strong style={{ color: '#00D474' }}>YES</strong>, <strong style={{ color: '#D4A843' }}>MAYBE</strong>, or <strong style={{ color: '#FF4545' }}>NO</strong>.
        </div>
      </div>

      <div style={{ marginTop: 10, textAlign: 'right' }}>
        <Link href="/learn/paper-vs-profit" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#3B82F6', textDecoration: 'none', fontWeight: 700 }}>
          Full Archive →
        </Link>
      </div>
    </div>
  );
}

export default function LearnClient({ articles }: { articles: ResearchMeta[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('CRYPTO 101');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    if (t === 'investing-101') setActiveTab('INVESTING 101');
    else if (t === 'paper-vs-profit') setActiveTab('PAPER VS. PROFIT');
  }, []);

  const handleTab = (tab: Tab) => {
    setActiveTab(tab);
    const param = tab === 'CRYPTO 101' ? '' : tab === 'INVESTING 101' ? '?tab=investing-101' : '?tab=paper-vs-profit';
    window.history.replaceState(null, '', `/learn${param}`);
  };

  const TAB_COLOR: Record<Tab, string> = {
    'CRYPTO 101': '#8B5CF6',
    'INVESTING 101': '#00D474',
    'PAPER VS. PROFIT': '#3B82F6',
  };

  return (
    <>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
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

      {/* Tab content */}
      {activeTab === 'CRYPTO 101' && <Crypto101Tab />}
      {activeTab === 'INVESTING 101' && <Investing101Tab />}
      {activeTab === 'PAPER VS. PROFIT' && <PaperVsProfitTab articles={articles} />}
    </>
  );
}
