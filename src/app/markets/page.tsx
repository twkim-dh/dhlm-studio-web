'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StockLogo from '@/components/StockLogo';

interface Mover {
  rank: number; ticker: string; name: string; price: number; change: number;
  volume: number; image?: string;
}
interface IndexItem { symbol: string; label: string; price: number; pct: number; }
interface TopStock { ticker: string; name: string; price: number; change: number; marketCap: number; marketCapFmt: string; sector?: string; image?: string; }

function pctColor(pct: number) {
  if (pct >= 2)   return { bg: '#00944D', color: '#fff',    border: '#00D47460' };
  if (pct >= 0.5) return { bg: '#005C30', color: '#A7F3D0', border: '#00944D60' };
  if (pct > -0.5) return { bg: '#1E293B', color: '#94A3B8', border: '#334155' };
  if (pct > -2)   return { bg: '#7A2020', color: '#FECACA', border: '#B4303060' };
  return           { bg: '#B43030',       color: '#fff',    border: '#FF454560' };
}

function StockHeatmap({ stocks }: { stocks: TopStock[] }) {
  if (stocks.length === 0) return null;
  const totalSqrt = stocks.reduce((s, c) => s + Math.sqrt(Math.max(c.marketCap, 1)), 0);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, margin: '0 0 4px' }}>
      {stocks.map(s => {
        const pct = `${Math.max(3.5, Math.min(s.marketCap > 0 ? (Math.sqrt(s.marketCap) / totalSqrt) * 100 : 3.5, 22))}%`;
        const c = pctColor(s.change);
        return (
          <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{
            flexBasis: pct, flexGrow: 1, minWidth: 48, padding: '9px 6px',
            borderRadius: 6, background: c.bg, border: `1px solid ${c.border}`,
            textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: c.color, fontFamily: 'var(--mono)', lineHeight: 1 }}>{s.ticker}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: c.color, fontFamily: 'var(--mono)', marginTop: 2, opacity: 0.85 }}>
              {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function MoverColumn({ title, items, colorFn }: {
  title: string;
  items: Mover[];
  colorFn: (change: number) => string;
}) {
  const isGainers = title.includes('GAINER');
  const isLosers  = title.includes('LOSER');
  const headerColor = isGainers ? '#00D474' : isLosers ? '#FF4545' : '#60A5FA';
  const headerBg    = isGainers ? '#00D47410' : isLosers ? '#FF454510' : '#3B82F610';
  return (
    <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: headerBg, borderBottom: '1px solid #1E293B' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: headerColor, letterSpacing: 1.5 }}>{title}</div>
      </div>
      {items.map((s, i) => {
        const col = colorFn(s.change);
        return (
          <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: i < items.length - 1 ? '1px solid #1E293B40' : 'none' }}>
            <span style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)', width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
            <StockLogo src={s.image} ticker={s.ticker} size={20} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{s.ticker}</div>
              <div style={{ fontSize: 9, color: '#475569', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: col, fontFamily: 'var(--mono)' }}>
                {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
              </div>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function MarketsPage() {
  const [indices, setIndices] = useState<IndexItem[]>([]);
  const [top20, setTop20] = useState<TopStock[]>([]);
  const [data, setData] = useState<{ gainers: Mover[]; losers: Mover[]; actives: Mover[] }>({ gainers: [], losers: [], actives: [] });
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const [lastCloseLabel, setLastCloseLabel] = useState('');

  useEffect(() => {
    fetch('/api/markets/indices')
      .then(r => r.json())
      .then(d => { if (d.indices?.length > 0) setIndices(d.indices); })
      .catch(() => {});

    fetch('/api/markets/top20')
      .then(r => r.json())
      .then(d => { if (d.stocks?.length > 0) setTop20(d.stocks); })
      .catch(() => {});

    fetch('/api/markets')
      .then(r => r.json())
      .then(d => {
        if (d.isWeekend) { setIsWeekend(true); setLastCloseLabel(d.lastCloseLabel || ''); }
        if (d.gainers?.length > 0) {
          setData({ gainers: d.gainers, losers: d.losers || [], actives: d.actives || [] });
          setIsLive(!d.isWeekend);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 16px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 900, color: '#F1F5F9', margin: 0, lineHeight: 1.2 }}>
              {isWeekend ? 'Market Snapshot' : "Today's Markets"}
            </h1>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
              {isWeekend
                ? <><span style={{ color: '#D4A843' }}>Last close: {lastCloseLabel}</span><span style={{ marginLeft: 8, fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#D4A84318', color: '#D4A843', fontWeight: 700, fontFamily: 'var(--mono)' }}>MARKET CLOSED</span></>
                : <>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}{isLive && <span style={{ marginLeft: 8, fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE</span>}</>
              }
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Link href="/markets/search" style={{ fontSize: 11, padding: '7px 13px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', textDecoration: 'none' }}>🔍 Search</Link>
            <Link href="/markets/sectors" style={{ fontSize: 11, padding: '7px 13px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', textDecoration: 'none' }}>🗺️ Sectors</Link>
          </div>
        </div>

        {/* ① Index Bar */}
        {indices.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
            {indices.map(idx => {
              const up = idx.pct >= 0;
              return (
                <div key={idx.symbol} style={{ background: '#111827', borderRadius: 10, border: `1px solid ${up ? '#00D47420' : '#FF454520'}`, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--mono)', fontWeight: 700, marginBottom: 4 }}>{idx.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', fontFamily: 'var(--mono)' }}>{idx.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)', marginTop: 2 }}>
                    {up ? '+' : ''}{idx.pct.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {indices.length === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
            {['S&P 500', 'Nasdaq', 'Dow', 'Russell 2000'].map(label => (
              <div key={label} style={{ background: '#111827', borderRadius: 10, border: '1px solid #1E293B', padding: '12px 14px', opacity: 0.5 }}>
                <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--mono)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#334155', fontFamily: 'var(--mono)' }}>—</div>
              </div>
            ))}
          </div>
        )}

        {/* ② Market Cap Heatmap */}
        <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>TOP 20 BY MARKET CAP</div>
            <button onClick={() => setShowList(!showList)} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6, background: '#1E293B', border: '1px solid #334155', color: '#94A3B8', cursor: 'pointer', fontFamily: 'var(--mono)' }}>
              {showList ? 'Heatmap' : 'List'}
            </button>
          </div>

          {top20.length > 0 ? (
            showList ? (
              <div>
                {top20.map((s, i) => {
                  const up = s.change >= 0;
                  return (
                    <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < top20.length - 1 ? '1px solid #1E293B40' : 'none', textDecoration: 'none' }}>
                      <div style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--mono)', width: 18, textAlign: 'right', flexShrink: 0 }}>{i + 1}</div>
                      <StockLogo src={s.image} ticker={s.ticker} size={22} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>{s.ticker}</div>
                        <div style={{ fontSize: 10, color: '#475569', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>{up ? '+' : ''}{s.change.toFixed(1)}%</div>
                      </div>
                      <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--mono)', width: 52, textAlign: 'right', flexShrink: 0 }}>{s.marketCapFmt}</div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <StockHeatmap stocks={top20} />
            )
          ) : (
            <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#334155' }}>Loading market data...</span>
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 9, color: '#334155', fontFamily: 'var(--mono)' }}>
            Tile size ∝ market cap · Color = daily change · Source: FMP
          </div>
        </div>

        {/* ③ S&P 500 Gainers / Losers / Most Active */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#475569', textAlign: 'center', marginBottom: 12 }}>
          S&P 500 quality ($10B+ market cap) · Source: Alpha Vantage + FMP
        </div>

        {loading && <p style={{ fontSize: 13, color: '#64748B', textAlign: 'center', padding: 20 }}>Loading market data...</p>}

        {!loading && data.gainers.length === 0 && (
          <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: 40 }}>
            {isWeekend ? 'Markets are closed. Data shown is from last trading session.' : 'No data available. Try again later.'}
          </p>
        )}

        {data.gainers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            <MoverColumn title="🟢 S&P 500 GAINERS"   items={data.gainers.slice(0, 10)} colorFn={(c) => c >= 0 ? '#00D474' : '#FF4545'} />
            <MoverColumn title="🔴 S&P 500 LOSERS"    items={data.losers.slice(0, 10)}  colorFn={(c) => c >= 0 ? '#00D474' : '#FF4545'} />
            <MoverColumn title="📊 S&P 500 MOST ACTIVE" items={data.actives.slice(0, 10)} colorFn={(c) => c >= 0 ? '#00D474' : '#FF4545'} />
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: 8, padding: '12px 14px', borderRadius: 10, background: '#C73E3A08', border: '1px solid #C73E3A10' }}>
          <p style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.7, textAlign: 'center', margin: 0 }}>
            BRUTAL EDGE is informational and educational. <strong style={{ color: '#C73E3A' }}>NOT investment advice</strong>. Data: Alpha Vantage + FMP. Prices may be delayed.
          </p>
        </div>
      </div>
    </div>
  );
}
