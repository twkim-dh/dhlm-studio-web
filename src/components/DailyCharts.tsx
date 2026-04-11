'use client';
/**
 * DailyCharts — S&P 500 candlestick chart (live OHLC via /api/markets/ohlc)
 *              + Fear & Greed SVG semicircle gauge
 * Used in /daily/[slug]/page.tsx
 */
import { useEffect, useState } from 'react';

interface Props {
  spPct:    number;
  nasPct:   number;
  dowPct:   number;
  rus2Pct?: number;
  fgScore:  number;
  fgLabel:  string;
}

interface Candle {
  date:  string;
  open:  number;
  high:  number;
  low:   number;
  close: number;
}

// ─── Fear & Greed colour bands ────────────────────────────────────────────────
function fgColor(score: number): string {
  if (score <= 25) return '#C73E3A';
  if (score <= 45) return '#F59E0B';
  if (score <= 55) return '#94A3B8';
  if (score <= 75) return '#60A5FA';
  return '#00D474';
}

// ─── Half-circle gauge ────────────────────────────────────────────────────────
function FGGauge({ score, color }: { score: number; color: string }) {
  const r = 32, cx = 40, cy = 38;
  const angle = Math.PI - (score / 100) * Math.PI;
  const x2    = cx + r * Math.cos(angle);
  const y2    = cy - r * Math.sin(angle);
  const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const fgPath = score > 0 && score < 100
    ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
    : score >= 100 ? bgPath : '';
  return (
    <svg width={80} height={46} viewBox="0 0 80 46" style={{ display: 'block' }}>
      <path d={bgPath} fill="none" stroke="#1E293B" strokeWidth={7} strokeLinecap="round" />
      {fgPath && <path d={fgPath} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />}
    </svg>
  );
}

// ─── SVG Candlestick chart ────────────────────────────────────────────────────
const CHART_W = 360;
const CHART_H = 110;
const PAD_L   = 48;   // left padding for price labels
const PAD_R   = 8;
const PAD_T   = 8;
const PAD_B   = 22;   // bottom for date labels

function CandlestickChart({ candles, symbol }: { candles: Candle[]; symbol: string }) {
  if (candles.length === 0) {
    return (
      <div style={{ height: CHART_H + PAD_T + PAD_B, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#334155', fontFamily: 'var(--mono)' }}>Loading chart…</span>
      </div>
    );
  }

  const prices   = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range    = maxPrice - minPrice || 1;
  const innerW   = CHART_W - PAD_L - PAD_R;
  const innerH   = CHART_H - PAD_T - PAD_B;
  const n        = candles.length;

  const toY = (price: number) =>
    PAD_T + innerH - ((price - minPrice) / range) * innerH;

  const candleW = Math.max(2, Math.floor(innerW / n) - 1);

  // Y-axis ticks: 4 levels
  const ticks = [0, 0.33, 0.67, 1].map(t => minPrice + t * range);

  // Last candle for price label
  const last     = candles[candles.length - 1];
  const lastUp   = last.close >= last.open;
  const lastColor = lastUp ? '#00D474' : '#FF4545';
  const chg      = ((last.close - candles[0].open) / candles[0].open * 100);
  const chgStr   = `${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%`;

  // Date labels: first and last
  const firstDate = candles[0].date.slice(5);   // MM-DD
  const lastDate  = last.date.slice(5);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${CHART_W} ${CHART_H + PAD_T + PAD_B}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Grid lines + Y-axis labels */}
      {ticks.map((price, i) => {
        const y = toY(price);
        return (
          <g key={i}>
            <line x1={PAD_L} x2={CHART_W - PAD_R} y1={y} y2={y}
              stroke="#1E293B" strokeWidth={0.5} strokeDasharray="3,4" />
            <text x={PAD_L - 4} y={y + 3.5} textAnchor="end"
              fontSize={8} fill="#475569" fontFamily="var(--mono)">
              {price >= 1000
                ? (price / 1000).toFixed(1) + 'k'
                : price.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Candles */}
      {candles.map((c, i) => {
        const x   = PAD_L + (i / n) * innerW + candleW / 2;
        const up  = c.close >= c.open;
        const col = up ? '#00D474' : '#FF4545';
        const yH  = toY(c.high);
        const yL  = toY(c.low);
        const yO  = toY(Math.max(c.open, c.close));
        const yC  = toY(Math.min(c.open, c.close));
        const bodyH = Math.max(1, yC - yO);
        return (
          <g key={i}>
            {/* Wick */}
            <line x1={x} x2={x} y1={yH} y2={yL}
              stroke={col} strokeWidth={0.8} opacity={0.7} />
            {/* Body */}
            <rect x={x - candleW / 2} y={yO} width={candleW} height={bodyH}
              fill={col} opacity={0.85} rx={0.5} />
          </g>
        );
      })}

      {/* Current price label */}
      <text x={CHART_W - PAD_R} y={toY(last.close) + 3.5} textAnchor="end"
        fontSize={8.5} fill={lastColor} fontWeight={700} fontFamily="var(--mono)">
        {last.close.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </text>

      {/* Date labels */}
      <text x={PAD_L} y={CHART_H + PAD_T + PAD_B - 2} textAnchor="start"
        fontSize={8} fill="#475569" fontFamily="var(--mono)">{firstDate}</text>
      <text x={CHART_W - PAD_R} y={CHART_H + PAD_T + PAD_B - 2} textAnchor="end"
        fontSize={8} fill="#475569" fontFamily="var(--mono)">{lastDate}</text>

      {/* Symbol + % change badge */}
      <text x={PAD_L + 4} y={PAD_T + 13} fontSize={9} fill="#94A3B8"
        fontWeight={700} fontFamily="var(--mono)">{symbol}</text>
      <text x={PAD_L + 4} y={PAD_T + 24} fontSize={8.5} fill={lastColor}
        fontWeight={700} fontFamily="var(--mono)">{chgStr} (30d)</text>
    </svg>
  );
}

// ─── Index return mini bars (fallback quick view below chart) ─────────────────
function IndexBar({ label, pct }: { label: string; pct: number }) {
  const up    = pct >= 0;
  const color = up ? '#00D474' : '#FF4545';
  const w     = Math.min(Math.abs(pct) * 10, 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 9, color: '#64748B', fontFamily: 'var(--mono)', width: 52, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${w}%`, background: color,
          marginLeft: up ? 0 : `${100 - w}%`, borderRadius: 3,
        }} />
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: 'var(--mono)', width: 40, textAlign: 'right', flexShrink: 0 }}>
        {up ? '+' : ''}{pct.toFixed(2)}%
      </span>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function DailyCharts({ spPct, nasPct, dowPct, rus2Pct, fgScore, fgLabel }: Props) {
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    fetch('/api/markets/ohlc?symbol=%5EGSPC&days=30')
      .then(r => r.json())
      .then((d: { candles?: Candle[] }) => {
        if (d.candles && d.candles.length > 0) setCandles(d.candles);
      })
      .catch(() => {});
  }, []);

  const color = fgColor(fgScore);

  return (
    <div style={{ margin: '16px 0 24px' }}>
      {/* Row 1: Candlestick chart + F&G gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 10, marginBottom: 8 }}>

        {/* S&P 500 Candlestick */}
        <div style={{ background: '#0D1117', borderRadius: 12, padding: '12px 10px 6px', border: '1px solid #1E293B' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: 1.5, marginBottom: 6 }}>
            S&amp;P 500 — 30D CHART
          </div>
          <CandlestickChart candles={candles} symbol="S&P 500" />
        </div>

        {/* Fear & Greed */}
        <div style={{ background: '#0D1117', borderRadius: 12, padding: '14px 8px 10px', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: 1.5, textAlign: 'center', marginBottom: 4 }}>
            FEAR &amp; GREED
          </div>
          <FGGauge score={fgScore} color={color} />
          <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color, lineHeight: 1, marginTop: 2 }}>
            {fgScore}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#475569', letterSpacing: 1, textTransform: 'uppercase' }}>
            {fgLabel}
          </div>
        </div>
      </div>

      {/* Row 2: Index mini bars */}
      <div style={{ background: '#0D1117', borderRadius: 12, padding: '12px 14px 10px', border: '1px solid #1E293B' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: 1.5, marginBottom: 10 }}>
          INDEX RETURNS (TODAY)
        </div>
        <IndexBar label="S&P 500"  pct={spPct} />
        <IndexBar label="Nasdaq"   pct={nasPct} />
        <IndexBar label="Dow"      pct={dowPct} />
        {rus2Pct != null && <IndexBar label="Russell" pct={rus2Pct} />}
      </div>
    </div>
  );
}
