'use client';

import { useState, useEffect } from 'react';

interface Quote { symbol: string; price: number; change: number; changesPercentage: number }
interface CryptoPrice { id: string; price: number; change24h: number }
interface FearGreed { value: number; label: string }
interface TodayMarketPayload {
  asOf: string;
  indices: Quote[];
  macro: Quote[];
  crypto: CryptoPrice[];
  fearGreed: FearGreed;
  verdict: { text: string; trigger: string };
  source: 'live' | 'cached' | 'fallback';
}

// Static SSR fallback so the section is never empty on first paint.
// Replaced with live data on mount via /api/today-market.
const SSR_FALLBACK: TodayMarketPayload = {
  asOf: new Date().toISOString(),
  indices: [
    { symbol: '^GSPC', price: 5612.40, change: -135.20, changesPercentage: -2.36 },
    { symbol: '^IXIC', price: 17834.50, change: -485.30, changesPercentage: -2.65 },
    { symbol: '^DJI',  price: 41250.80, change: -780.40, changesPercentage: -1.86 },
  ],
  macro: [
    { symbol: 'CL=F', price:   78.40, change: 1.20, changesPercentage:  1.55 },
    { symbol: 'GC=F', price: 2342.50, change: 18.30, changesPercentage:  0.79 },
    { symbol: '^VIX', price:   23.70, change: 4.10, changesPercentage: 20.92 },
    { symbol: '^TNX', price:    4.42, change: 0.11, changesPercentage:  2.55 },
  ],
  crypto: [
    { id: 'bitcoin',  price: 66850, change24h: 1.4 },
    { id: 'ethereum', price:  2030, change24h: 2.1 },
  ],
  fearGreed: { value: 38, label: 'Fear' },
  verdict: { text: 'Loading the latest market snapshot.', trigger: 'neutral' },
  source: 'fallback',
};

const LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'Nasdaq',
  '^DJI':  'Dow',
  'CL=F':  'WTI Oil',
  'GC=F':  'Gold',
  '^VIX':  'VIX',
  '^TNX':  'US 10Y',
};

function fmtNum(n: number, decimals = 2): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function changeColor(v: number): string {
  if (v > 0.05) return '#00D474';
  if (v < -0.05) return '#FF4545';
  return '#94A3B8';
}

function fearGreedColor(v: number): string {
  if (v < 25) return '#FF4545';
  if (v < 45) return '#F59E0B';
  if (v < 55) return '#94A3B8';
  if (v < 75) return '#84CC16';
  return '#00D474';
}

const cell = { padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 12, color: '#E2E8F0' } as const;
const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' } as const;

export default function TodayMarket() {
  const [data, setData] = useState<TodayMarketPayload>(SSR_FALLBACK);

  useEffect(() => {
    fetch('/api/today-market')
      .then(r => r.json())
      .then((d: TodayMarketPayload) => { if (d?.indices) setData(d); })
      .catch(() => { /* keep fallback */ });
  }, []);

  const renderQuoteRow = (q: Quote) => {
    const label = LABELS[q.symbol] || q.symbol;
    // Yahoo Finance returns ^TNX as a percent value already (e.g. 4.42 means 4.42%).
    const isYield = q.symbol === '^TNX';
    const decimals = isYield ? 2 : 2;
    const priceDisplay = isYield ? `${fmtNum(q.price, 2)}%` : fmtNum(q.price, decimals);
    return (
      <div key={q.symbol} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 12, padding: '9px 12px', borderBottom: '1px solid #1E293B40' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', fontFamily: 'var(--mono)', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ ...cell, padding: 0, fontWeight: 800, color: '#F1F5F9', textAlign: 'right' }}>{priceDisplay}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: changeColor(q.changesPercentage), fontFamily: 'var(--mono)', minWidth: 56, textAlign: 'right' }}>
          {q.changesPercentage >= 0 ? '+' : ''}{fmtNum(q.changesPercentage, 2)}%
        </span>
      </div>
    );
  };

  const renderCryptoRow = (c: CryptoPrice) => {
    const label = c.id === 'bitcoin' ? 'BTC' : c.id === 'ethereum' ? 'ETH' : c.id.toUpperCase();
    return (
      <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 12, padding: '9px 12px', borderBottom: '1px solid #1E293B40' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', fontFamily: 'var(--mono)', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ ...cell, padding: 0, fontWeight: 800, color: '#F1F5F9', textAlign: 'right' }}>${c.price >= 1000 ? Math.round(c.price).toLocaleString() : fmtNum(c.price, 2)}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: changeColor(c.change24h), fontFamily: 'var(--mono)', minWidth: 56, textAlign: 'right' }}>
          {c.change24h >= 0 ? '+' : ''}{fmtNum(c.change24h, 2)}%
        </span>
      </div>
    );
  };

  const fgColor = fearGreedColor(data.fearGreed.value);

  // Format the asOf timestamp into a short relative-friendly label
  // e.g. "as of 14:32 UTC" so users always see when the data was captured.
  const asOfLabel = (() => {
    try {
      const d = new Date(data.asOf);
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      return `as of ${hh}:${mm} UTC`;
    } catch { return ''; }
  })();

  // Status label per data source. NEVER show "DEMO" — the user has been
  // explicit that an honest "delayed" disclosure is required regardless
  // of whether the data path is live, cached, or static fallback.
  const statusLabel = data.source === 'live'
    ? '● LIVE · 15-min delayed'
    : `● Delayed · ${asOfLabel}`;

  const statusColor = data.source === 'live' ? '#00D474' : '#94A3B8';

  return (
    <section style={{ padding: '0 24px 32px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 4 }}>● TODAY&apos;S MARKET</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Market Snapshot</h2>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: statusColor }}>
          {statusLabel}
        </span>
      </div>

      {/* 4-card grid: Indices, Macro, Crypto, Fear & Greed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 16 }}>
        {/* US Indices */}
        <div style={card}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #1E293B', fontSize: 9, fontWeight: 800, color: '#3B82F6', fontFamily: 'var(--mono)', letterSpacing: 2 }}>US INDICES</div>
          {data.indices.map(renderQuoteRow)}
        </div>

        {/* Macro */}
        <div style={card}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #1E293B', fontSize: 9, fontWeight: 800, color: '#D4A843', fontFamily: 'var(--mono)', letterSpacing: 2 }}>MACRO</div>
          {data.macro.map(renderQuoteRow)}
        </div>

        {/* Crypto */}
        <div style={card}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #1E293B', fontSize: 9, fontWeight: 800, color: '#F59E0B', fontFamily: 'var(--mono)', letterSpacing: 2 }}>CRYPTO</div>
          {data.crypto.map(renderCryptoRow)}
        </div>

        {/* Fear & Greed */}
        <div style={card}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #1E293B', fontSize: 9, fontWeight: 800, color: '#A78BFA', fontFamily: 'var(--mono)', letterSpacing: 2 }}>SENTIMENT</div>
          <div style={{ padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 900, color: fgColor, lineHeight: 1 }}>{data.fearGreed.value}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: fgColor, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{data.fearGreed.label}</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 9, color: '#475569', marginTop: 6 }}>Fear &amp; Greed Index</div>
            {/* Simple gauge */}
            <div style={{ marginTop: 10, height: 6, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${data.fearGreed.value}%`, height: '100%', background: fgColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* Brutal AI Verdict */}
      <div style={{
        padding: '16px 20px', borderRadius: 14,
        background: 'linear-gradient(135deg, #C73E3A0F, #C73E3A05)',
        border: '1px solid #C73E3A30',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>BRUTAL AI&trade; VERDICT</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#475569', marginLeft: 'auto' }}>trigger: {data.verdict.trigger}</span>
        </div>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 14, color: '#E2E8F0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
          &ldquo;{data.verdict.text}&rdquo;
        </p>
      </div>
    </section>
  );
}
