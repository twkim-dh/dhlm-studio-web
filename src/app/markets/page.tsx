'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StockLogo from '@/components/StockLogo';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IndexItem  { symbol: string; label: string; price: number; pct: number; }
interface TopStock   { ticker: string; name: string; price: number; change: number; marketCap: number; sector: string; image?: string; }
interface Mover      { rank: number; ticker: string; name: string; price: number; change: number; volume: number; image?: string; }
interface SectorGroup { name: string; change: number; totalMC: number; stocks: TopStock[]; }

// ─── Static fallback indices (shown when FMP unavailable) ─────────────────────

// Fallback updated 2026-04-15 to reflect confirmed Apr-15 closing data.
const INDEX_FALLBACK: IndexItem[] = [
  { symbol: '^GSPC', label: 'S&P 500',     price: 6967, pct: 0 },
  { symbol: '^IXIC', label: 'Nasdaq',       price: 23639, pct: 0 },
  { symbol: '^DJI',  label: 'Dow',          price: 48536, pct: 0 },
  { symbol: '^RUT',  label: 'Russell 2000', price: 2120,  pct: 0 },
];

// ─── Color helpers ────────────────────────────────────────────────────────────

function pctColor(pct: number): { bg: string; text: string; border: string } {
  if (pct >= 3)   return { bg: '#005C2E', text: '#A7F3D0', border: '#00944D60' };
  if (pct >= 1)   return { bg: '#003D20', text: '#6EE7B7', border: '#005C2E60' };
  if (pct > 0)    return { bg: '#012816', text: '#34D399', border: '#003D2060' };
  if (pct === 0)  return { bg: '#1E293B', text: '#94A3B8', border: '#33415560' };
  if (pct > -1)   return { bg: '#2D0F0F', text: '#FCA5A5', border: '#7A202060' };
  if (pct > -3)   return { bg: '#7A2020', text: '#FCA5A5', border: '#B4303060' };
  return            { bg: '#B43030', text: '#fff',     border: '#FF454560' };
}

const LEGEND = [
  { label: '≥ 3%',   bg: '#005C2E', text: '#A7F3D0' },
  { label: '1–3%',   bg: '#003D20', text: '#6EE7B7' },
  { label: '0–1%',   bg: '#012816', text: '#34D399' },
  { label: '0%',     bg: '#1E293B', text: '#94A3B8' },
  { label: '–1–0%',  bg: '#2D0F0F', text: '#FCA5A5' },
  { label: '–3–1%',  bg: '#7A2020', text: '#FCA5A5' },
  { label: '≤ –3%',  bg: '#B43030', text: '#fff'    },
];

// ─── Mover column ─────────────────────────────────────────────────────────────

function MoverCol({ title, color, bg, items }: {
  title: string; color: string; bg: string; items: Mover[];
}) {
  return (
    <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: bg, borderBottom: '1px solid #1E293B' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color, letterSpacing: 1.5 }}>{title}</div>
      </div>
      {items.map((s, i) => {
        const up = s.change >= 0;
        return (
          <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: i < items.length - 1 ? '1px solid #1E293B40' : 'none' }}>
            <span style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)', width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
            <StockLogo src={s.image} ticker={s.ticker} size={20} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{s.ticker}</div>
              <div style={{ fontSize: 9, color: '#475569', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>
                {up ? '+' : ''}{s.change.toFixed(1)}%
              </div>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketsPage() {
  const [indices,  setIndices]  = useState<IndexItem[]>(INDEX_FALLBACK);
  const [sectors,  setSectors]  = useState<SectorGroup[]>([]);
  const [sectorsLoaded, setSectorsLoaded] = useState(false);
  const [movers,   setMovers]   = useState<{ gainers: Mover[]; losers: Mover[]; actives: Mover[] }>({ gainers: [], losers: [], actives: [] });
  const [isWeekend, setIsWeekend] = useState(false);
  const [lastCloseLabel, setLastCloseLabel] = useState('');
  const [moversLoading, setMoversLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // ① Indices
    fetch('/api/markets/indices')
      .then(r => r.json())
      .then(d => { if (d.indices?.length > 0) setIndices(d.indices); })
      .catch(() => {});

    // ③ Top 20 → sector heatmap
    fetch('/api/markets/top20')
      .then(r => r.json())
      .then(d => {
        const stocks: TopStock[] = d.stocks || [];
        if (stocks.length > 0) {
          const map = new Map<string, TopStock[]>();
          for (const s of stocks) {
            const sec = s.sector || 'Other';
            if (!map.has(sec)) map.set(sec, []);
            map.get(sec)!.push(s);
          }
          const list: SectorGroup[] = Array.from(map.entries()).map(([name, ss]) => {
            const totalMC = ss.reduce((a, c) => a + c.marketCap, 0);
            const weightedChange = totalMC > 0
              ? ss.reduce((a, c) => a + c.change * c.marketCap, 0) / totalMC
              : ss.reduce((a, c) => a + c.change, 0) / ss.length;
            return { name, stocks: ss, change: weightedChange, totalMC };
          }).sort((a, b) => b.totalMC - a.totalMC);
          setSectors(list);
        }
      })
      .catch(() => {})
      .finally(() => setSectorsLoaded(true));

    // ⑤⑥⑦ Gainers / Losers / Actives
    fetch('/api/markets')
      .then(r => r.json())
      .then(d => {
        if (d.isWeekend) { setIsWeekend(true); setLastCloseLabel(d.lastCloseLabel || ''); }
        // Store whatever data arrived — even weekend-only actives
        const hasAny = d.gainers?.length > 0 || d.actives?.length > 0;
        if (hasAny) {
          setMovers({ gainers: d.gainers || [], losers: d.losers || [], actives: d.actives || [] });
          setIsLive(!d.isWeekend && d.gainers?.length > 0);
        }
      })
      .catch(() => {})
      .finally(() => setMoversLoading(false));
  }, []);

  const topSectors = [...sectors].sort((a, b) => b.change - a.change).slice(0, 3);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 16px 40px' }}>

        {/* ① HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 900, color: '#F1F5F9', margin: 0 }}>
              Market Snapshot
            </h1>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 5, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {isWeekend ? (
                <>
                  <span style={{ color: '#D4A843' }}>Last close: {lastCloseLabel}</span>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#D4A84318', color: '#D4A843', fontWeight: 700, fontFamily: 'var(--mono)' }}>MARKET CLOSED</span>
                </>
              ) : (
                <>
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' })}</span>
                  {isLive && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE</span>}
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexShrink: 0 }}>
            <Link href="/markets/search" style={{ fontSize: 11, padding: '7px 13px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', textDecoration: 'none' }}>🔍 Search</Link>
          </div>
        </div>

        {/* ② INDEX BAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
          {indices.map(idx => {
            const up = idx.pct >= 0;
            return (
              <div key={idx.symbol} style={{ background: '#111827', borderRadius: 10, border: `1px solid ${up ? '#00D47420' : '#FF454520'}`, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--mono)', fontWeight: 700, marginBottom: 4 }}>{idx.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', fontFamily: 'var(--mono)' }}>
                  {idx.price > 0 ? idx.price.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', marginTop: 2, color: up ? '#00D474' : '#FF4545' }}>
                  {idx.price > 0 ? `${up ? '+' : ''}${idx.pct.toFixed(2)}%` : '—'}
                </div>
              </div>
            );
          })}
        </div>

        {/* ③ SECTOR HEATMAP */}
        <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '16px', marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1.5 }}>SECTOR HEATMAP · S&P 500 Market Sectors</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>Size = market weight · Color = daily change</div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {LEGEND.map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.bg }} />
                <span style={{ fontSize: 9, color: '#64748B', fontFamily: 'var(--mono)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Sector rows */}
          {!sectorsLoaded ? (
            <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#334155' }}>Loading sector data...</span>
            </div>
          ) : sectors.length === 0 ? (
            <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#334155' }}>Sector data unavailable — updates during market hours</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sectors.map(sec => {
                const sc = pctColor(sec.change);
                return (
                  <div key={sec.name} style={{ background: sc.bg, borderRadius: 8, padding: '10px 12px', border: `1px solid ${sc.border}` }}>
                    {/* Sector header */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: sc.text, fontFamily: 'var(--mono)' }}>{sec.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: sc.text, fontFamily: 'var(--mono)', opacity: 0.9 }}>
                        {sec.change >= 0 ? '+' : ''}{sec.change.toFixed(1)}%
                      </span>
                    </div>
                    {/* Constituent stocks */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {sec.stocks.map(s => {
                        const tc = pctColor(s.change);
                        return (
                          <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{
                            textDecoration: 'none', padding: '3px 8px', borderRadius: 5,
                            background: `${tc.bg}CC`, border: `1px solid ${tc.border}`,
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: tc.text, fontFamily: 'var(--mono)' }}>{s.ticker}</span>
                            <span style={{ fontSize: 9, color: tc.text, fontFamily: 'var(--mono)', opacity: 0.85 }}>
                              {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 9, color: '#334155', fontFamily: 'var(--mono)' }}>
            Source: Financial Modeling Prep · Top 20 stocks by market cap · Change: daily
          </div>
        </div>

        {/* ④ TOP SECTORS */}
        {topSectors.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            {topSectors.map((sec, i) => {
              const up = sec.change >= 0;
              const medals = ['🏆', '🥈', '🥉'];
              return (
                <div key={sec.name} style={{ background: '#111827', borderRadius: 10, border: `1px solid ${up ? '#00D47220' : '#FF454520'}`, padding: '12px 16px' }}>
                  <div style={{ fontSize: 9, color: '#64748B', fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
                    {medals[i]} TOP SECTOR
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#F1F5F9', marginBottom: 4, fontFamily: 'var(--sans)' }}>{sec.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>
                    {up ? '+' : ''}{sec.change.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ⑤⑥⑦ GAINERS · LOSERS · MOST ACTIVE */}
        {moversLoading && (
          <p style={{ fontSize: 13, color: '#64748B', textAlign: 'center', padding: '20px 0' }}>Loading S&P 500 movers...</p>
        )}
        {!moversLoading && movers.gainers.length === 0 && movers.actives.length === 0 && (
          <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: '40px 0' }}>
            {isWeekend ? 'Markets closed. Last session data unavailable.' : 'Mover data unavailable. Try again shortly.'}
          </p>
        )}
        {/* Full 3-column grid when gainers available */}
        {movers.gainers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            <MoverCol title="🟢 S&P 500 GAINERS"     color="#00D474" bg="#00D47410" items={movers.gainers.slice(0, 10)} />
            <MoverCol title="🔴 S&P 500 LOSERS"      color="#FF4545" bg="#FF454510" items={movers.losers.slice(0, 10)} />
            <MoverCol title="📊 S&P 500 MOST ACTIVE" color="#60A5FA" bg="#3B82F610" items={movers.actives.slice(0, 10)} />
          </div>
        )}
        {/* Weekend/fallback: show only Most Active when gainers unavailable */}
        {!moversLoading && movers.gainers.length === 0 && movers.actives.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#D4A843', textAlign: 'center', marginBottom: 8 }}>
              Markets closed · Last session data · Gainers/Losers unavailable on weekends
            </div>
            <div style={{ maxWidth: 340, margin: '0 auto' }}>
              <MoverCol title="📊 S&P 500 MOST ACTIVE" color="#60A5FA" bg="#3B82F610" items={movers.actives.slice(0, 10)} />
            </div>
          </div>
        )}

        {/* ⑧ DISCLAIMER */}
        <p style={{ fontSize: 9, color: '#475569', textAlign: 'center', lineHeight: 1.8, marginTop: 8 }}>
          Data is approximate and for informational purposes only.{' '}
          <strong style={{ color: '#94A3B8' }}>NOT investment advice.</strong>{' '}
          Source: Financial Modeling Prep + Alpha Vantage. Prices may be delayed up to 15 min.
        </p>

      </div>
    </div>
  );
}
