'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StockLogo from '@/components/StockLogo';
import { Treemap, ResponsiveContainer } from 'recharts';
import { isTop30 } from '@/lib/top-tickers';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IndexItem  { symbol: string; label: string; price: number; pct: number; }
interface SectorItem { symbol: string; label: string; price: number; changePercent: number; }
interface CryptoItem { id: string; symbol: string; name: string; price: number; change24h: number; }
interface Mover      { symbol: string; name: string; price: number; changePercent: number; image?: string; }

// ─── Index label map ──────────────────────────────────────────────────────────

const INDEX_LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'Nasdaq',
  '^DJI':  'Dow',
  '^RUT':  'Russell 2000',
};

// Approximate market-weight for treemap tile sizing (% of S&P 500)
const SECTOR_WEIGHTS: Record<string, number> = {
  XLK:  33, XLC: 9,  XLF: 13, XLV: 11, XLY: 10,
  XLI:  8,  XLE: 4,  XLP:  6, XLU:  2, XLRE: 2, XLB: 2,
};

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

// ─── Treemap tile renderer ────────────────────────────────────────────────────

function TreemapTile(props: Record<string, unknown>) {
  const { x, y, width, height, name, change } = props as {
    x: number; y: number; width: number; height: number; name: string; change: number;
  };
  const c = pctColor(change || 0);
  const w = width as number;
  const h = height as number;
  const showTicker = w > 28 && h > 18;
  const showPct    = w > 34 && h > 32;
  const fs = Math.min(Math.max(Math.floor(w / 5), 8), 13);
  const fp = Math.min(Math.max(Math.floor(w / 6), 7), 10);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={c.bg} stroke="#0B0F19" strokeWidth={2} rx={2} />
      {showTicker && (
        <text x={x + w / 2} y={y + h / 2 - (showPct ? 7 : 0)}
          textAnchor="middle" dominantBaseline="middle"
          fill={c.text} fontSize={fs} fontWeight={700} fontFamily="monospace">
          {name}
        </text>
      )}
      {showPct && (
        <text x={x + w / 2} y={y + h / 2 + fp + 2}
          textAnchor="middle" dominantBaseline="middle"
          fill={c.text} fontSize={fp} fontFamily="monospace" opacity={0.85}>
          {(change as number) >= 0 ? '+' : ''}{(change as number)?.toFixed(1)}%
        </text>
      )}
    </g>
  );
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
        const up = s.changePercent >= 0;
        const hasPage = isTop30(s.symbol);
        const inner = (
          <>
            <span style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)', width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
            <StockLogo src={s.image} ticker={s.symbol} size={20} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{s.symbol}</div>
              <div style={{ fontSize: 9, color: '#475569', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>
                {up ? '+' : ''}{s.changePercent.toFixed(2)}%
              </div>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
            </div>
          </>
        );
        const rowStyle = { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: i < items.length - 1 ? '1px solid #1E293B40' : 'none' } as const;
        return hasPage ? (
          <Link key={s.symbol} href={`/markets/${s.symbol.toLowerCase()}`} style={{ textDecoration: 'none', ...rowStyle }}>{inner}</Link>
        ) : (
          <div key={s.symbol} style={rowStyle}>{inner}</div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketsPage() {
  const [indices,       setIndices]       = useState<IndexItem[]>([]);
  const [indicesLoaded, setIndicesLoaded] = useState(false);
  const [sectors,       setSectors]       = useState<SectorItem[]>([]);
  const [sectorsLoaded, setSectorsLoaded] = useState(false);
  const [movers,        setMovers]        = useState<{ gainers: Mover[]; losers: Mover[]; actives: Mover[] }>({ gainers: [], losers: [], actives: [] });
  const [moversLoading, setMoversLoading] = useState(true);
  const [tradingDate,   setTradingDate]   = useState('');
  const [cryptos,       setCryptos]       = useState<CryptoItem[]>([]);
  const [mounted,       setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);

    // ① Indices — Redis snapshot only, no FMP fallback
    fetch('/api/markets/indices')
      .then(r => r.json())
      .then(d => {
        if (d.indices?.length > 0) {
          const mapped: IndexItem[] = d.indices.map((q: { symbol: string; label?: string; price?: number; changePercent: number }) => ({
            symbol: q.symbol,
            label:  INDEX_LABELS[q.symbol] || q.label || q.symbol,
            price:  q.price ?? 0,
            pct:    q.changePercent,
          }));
          setIndices(mapped);
          if (d.tradingDate) setTradingDate(d.tradingDate);
        }
      })
      .catch(() => {})
      .finally(() => setIndicesLoaded(true));

    // ② Sector ETFs — Redis snapshot only
    fetch('/api/markets/sectors')
      .then(r => r.json())
      .then(d => {
        if (d.sectors?.length > 0) setSectors(d.sectors);
        if (d.tradingDate && !tradingDate) setTradingDate(d.tradingDate);
      })
      .catch(() => {})
      .finally(() => setSectorsLoaded(true));

    // ③ Crypto (CoinGecko — separate route, unaffected by snapshot)
    const CRYPTO_WHITELIST = ['bitcoin','ethereum','solana','ripple','binancecoin','cardano','dogecoin','avalanche-2','chainlink','polkadot'];
    fetch('/api/crypto')
      .then(r => r.json())
      .then(d => {
        if (d.coins?.length > 0) {
          const ordered = CRYPTO_WHITELIST
            .map((id: string) => d.coins.find((c: CryptoItem) => c.id === id))
            .filter(Boolean) as CryptoItem[];
          setCryptos(ordered.slice(0, 8));
        }
      })
      .catch(() => {});

    // ④ Movers — Top 30 based, Redis snapshot only
    fetch('/api/markets/movers')
      .then(r => r.json())
      .then(d => {
        const hasAny = d.gainers?.length > 0 || d.actives?.length > 0;
        if (hasAny) {
          setMovers({
            gainers: d.gainers || [],
            losers:  d.losers  || [],
            actives: d.actives || [],
          });
          if (d.tradingDate && !tradingDate) setTradingDate(d.tradingDate);
        }
      })
      .catch(() => {})
      .finally(() => setMoversLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sector treemap: one tile per sector ETF, sized by S&P 500 weight
  const treemapData = sectors.map(s => ({
    name:   s.symbol,
    size:   SECTOR_WEIGHTS[s.symbol] || 1,
    change: s.changePercent,
  }));

  // Top 3 sectors by absolute gain
  const topSectors = [...sectors].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);

  // Trading date display: "April 16, 2026"
  const tradingDateLabel = tradingDate
    ? new Date(tradingDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

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
              {tradingDateLabel ? (
                <>
                  <span>Previous close · {tradingDateLabel}</span>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#334155', color: '#94A3B8', fontWeight: 700, fontFamily: 'var(--mono)' }}>EOD DATA</span>
                </>
              ) : (
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' })}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexShrink: 0 }}>
            <Link href="/markets/search" style={{ fontSize: 11, padding: '7px 13px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', textDecoration: 'none' }}>🔍 Search</Link>
          </div>
        </div>

        {/* ② CRYPTO — 최상단 배치 */}
        <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#F59E0B', letterSpacing: 1.5 }}>🪙 CRYPTO — BTC · ETH · SOL + TOP ALTCOINS</div>
            <Link href="/rankings/crypto" style={{ fontSize: 10, color: '#F59E0B', fontFamily: 'var(--mono)', textDecoration: 'none' }}>Full Rankings →</Link>
          </div>
          {cryptos.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', fontSize: 11, color: '#334155', fontFamily: 'var(--mono)' }}>Loading crypto data...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
              {cryptos.map((c, i) => {
                const up = c.change24h >= 0;
                const sym = c.symbol?.toUpperCase() || c.id.slice(0, 5).toUpperCase();
                return (
                  <Link key={c.id} href={`/rankings/crypto/${c.id}`} style={{
                    textDecoration: 'none', padding: '12px 14px',
                    borderRight: i % 4 !== 3 ? '1px solid #1E293B40' : 'none',
                    borderBottom: i < 4 ? '1px solid #1E293B40' : 'none',
                    display: 'flex', flexDirection: 'column', gap: 3,
                  }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 800, color: '#F59E0B' }}>{sym}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>
                      {c.price >= 1000 ? `$${Math.round(c.price).toLocaleString()}` : c.price >= 1 ? `$${c.price.toFixed(2)}` : `$${c.price.toFixed(4)}`}
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: up ? '#00D474' : '#FF4545' }}>
                      {up ? '+' : ''}{c.change24h?.toFixed(2)}%
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          <div style={{ padding: '6px 16px', fontSize: 9, color: '#334155', fontFamily: 'var(--mono)', borderTop: '1px solid #1E293B40' }}>
            Source: CoinGecko · 24h change
          </div>
        </div>

        {/* ③ INDEX BAR */}
        {!indicesLoaded ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
            {['^GSPC', '^IXIC', '^DJI', '^RUT'].map(sym => (
              <div key={sym} style={{ background: '#111827', borderRadius: 10, border: '1px solid #1E293B20', padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#334155', fontFamily: 'var(--mono)', fontWeight: 700, marginBottom: 4 }}>{INDEX_LABELS[sym]}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#334155', fontFamily: 'var(--mono)' }}>—</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', marginTop: 2, color: '#334155' }}>—</div>
              </div>
            ))}
          </div>
        ) : indices.length === 0 ? (
          <div style={{ background: '#111827', borderRadius: 10, border: '1px solid #1E293B', padding: '16px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--mono)' }}>
              Index data temporarily unavailable · Updates daily at 4:30 PM ET
            </div>
          </div>
        ) : (
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
                    {up ? '+' : ''}{idx.pct.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ④ SECTOR HEATMAP */}
        <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '16px', marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1.5 }}>SECTOR HEATMAP · SPDR Sector ETFs</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>Size = S&P 500 weight · Color = daily close change</div>
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

          {!mounted || !sectorsLoaded ? (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#334155' }}>Loading sector data...</span>
            </div>
          ) : treemapData.length === 0 ? (
            <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#334155' }}>Sector data temporarily unavailable · Updates daily at 4:30 PM ET</span>
            </div>
          ) : (
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData}
                  dataKey="size"
                  aspectRatio={16 / 9}
                  content={<TreemapTile />}
                />
              </ResponsiveContainer>
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 9, color: '#334155', fontFamily: 'var(--mono)' }}>
            Source: FMP · 11 SPDR sector ETFs · Previous close{tradingDateLabel ? ` · ${tradingDateLabel}` : ''}
          </div>
        </div>

        {/* ⑤ TOP SECTORS */}
        {topSectors.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            {topSectors.map((sec, i) => {
              const up = sec.changePercent >= 0;
              const medals = ['🏆', '🥈', '🥉'];
              return (
                <div key={sec.symbol} style={{ background: '#111827', borderRadius: 10, border: `1px solid ${up ? '#00D47220' : '#FF454520'}`, padding: '12px 16px' }}>
                  <div style={{ fontSize: 9, color: '#64748B', fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
                    {medals[i]} TOP SECTOR
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#F1F5F9', marginBottom: 4, fontFamily: 'var(--sans)' }}>{sec.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>
                    {up ? '+' : ''}{sec.changePercent.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ⑥ TOP 30 MOVERS */}
        {moversLoading && (
          <p style={{ fontSize: 13, color: '#64748B', textAlign: 'center', padding: '20px 0' }}>Loading movers...</p>
        )}
        {!moversLoading && movers.gainers.length === 0 && movers.actives.length === 0 && (
          <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: '40px 0' }}>
            Mover data temporarily unavailable · Updates daily at 4:30 PM ET
          </p>
        )}
        {movers.gainers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            <MoverCol title="🟢 TOP 30 GAINERS"     color="#00D474" bg="#00D47410" items={movers.gainers.slice(0, 10)} />
            <MoverCol title="🔴 TOP 30 LOSERS"      color="#FF4545" bg="#FF454510" items={movers.losers.slice(0, 10)} />
            <MoverCol title="📊 TOP 30 MOST ACTIVE" color="#60A5FA" bg="#3B82F610" items={movers.actives.slice(0, 10)} />
          </div>
        )}

        {/* ⑦ DISCLAIMER */}
        <p style={{ fontSize: 9, color: '#475569', textAlign: 'center', lineHeight: 1.8, marginTop: 8 }}>
          End-of-day data updated once daily after NYSE close (4:00 PM ET).{' '}
          <strong style={{ color: '#94A3B8' }}>NOT investment advice.</strong>{' '}
          Source: Alpha Vantage · Financial Modeling Prep · CoinGecko.
        </p>

      </div>
    </div>
  );
}
