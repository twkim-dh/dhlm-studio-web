'use client';

import { useEffect, useState } from 'react';

interface HistoryPoint { x: number; y: number }
interface FngPayload {
  asOf: string;
  current: { score: number; rating: string };
  ago: { week: number; month: number; threeMonth: number; year: number };
  history: HistoryPoint[];
  source: 'live' | 'cached' | 'fallback';
}

const FALLBACK: FngPayload = {
  asOf: new Date().toISOString(),
  current: { score: 50, rating: 'Neutral' },
  ago: { week: 50, month: 50, threeMonth: 50, year: 50 },
  history: [],
  source: 'fallback',
};

function bandColor(v: number): string {
  if (v < 25) return '#FF4545';
  if (v < 45) return '#F59E0B';
  if (v < 55) return '#FACC15';
  if (v < 75) return '#84CC16';
  return '#00D474';
}

function bandLabel(v: number): string {
  if (v < 25) return 'Extreme Fear';
  if (v < 45) return 'Fear';
  if (v < 55) return 'Neutral';
  if (v < 75) return 'Greed';
  return 'Extreme Greed';
}

function brutalCommentary(v: number): string {
  if (v < 25) return 'The market is on its knees. Warren Buffett is probably shopping. Historically, every reading below 25 in the past decade has marked a tradeable bottom within 30 days — and every reading has felt completely justified at the time.';
  if (v < 45) return 'Fear is in the air. Not panic, but definitely sweaty palms. This is where the most disciplined investors quietly add to positions while everyone else worries about the headlines.';
  if (v < 55) return 'The market cannot decide. Neither can we. Sentiment is at the mushy middle, which is exactly where the data is least useful for predicting anything.';
  if (v < 75) return 'Greed is creeping in. Everyone thinks they are a genius after a few green weeks. The smart move now is reviewing position sizes, not stretching for new highs.';
  return 'Peak greed. This is where legends are made and destroyed. Historically, the sentiment readings above 75 have preceded several drawdowns. The data is loud. Whether you listen is your decision.';
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function FearGreedDashboard() {
  const [data, setData] = useState<FngPayload>(FALLBACK);

  useEffect(() => {
    fetch('/api/fear-greed').then(r => r.json()).then((d: FngPayload) => { if (d?.current) setData(d); }).catch(() => {});
  }, []);

  const score = data.current.score;
  const color = bandColor(score);
  const label = data.current.rating || bandLabel(score);

  // Sparkline path for the last ~90 days of history
  const last = data.history.slice(-90);
  const sparkPath = (() => {
    if (last.length < 2) return '';
    const w = 600;
    const h = 80;
    const ys = last.map(p => p.y);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const range = Math.max(max - min, 1);
    return last.map((p, i) => {
      const x = (i / (last.length - 1)) * w;
      const y = h - ((p.y - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
  })();

  return (
    <div>
      {/* Big gauge card */}
      <div style={{ ...card, padding: '32px 28px', textAlign: 'center', marginBottom: 16, background: `radial-gradient(circle at 50% 0%, ${color}15, #111827 60%)` }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 8 }}>● CURRENT</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(80px, 14vw, 140px)', fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 800, color, marginTop: 8, textTransform: 'uppercase', letterSpacing: 2 }}>{label}</div>

        {/* Color band gauge */}
        <div style={{ marginTop: 20, position: 'relative', height: 14, borderRadius: 8, overflow: 'hidden', display: 'flex' }}>
          <div style={{ flex: 25, background: '#FF4545' }} />
          <div style={{ flex: 20, background: '#F59E0B' }} />
          <div style={{ flex: 10, background: '#FACC15' }} />
          <div style={{ flex: 20, background: '#84CC16' }} />
          <div style={{ flex: 25, background: '#00D474' }} />
          {/* Indicator */}
          <div style={{ position: 'absolute', left: `${score}%`, top: -4, transform: 'translateX(-50%)', width: 4, height: 22, background: '#F1F5F9', borderRadius: 2, boxShadow: '0 0 8px rgba(0,0,0,0.6)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 8, color: '#475569', marginTop: 6 }}>
          <span>0 Extreme Fear</span>
          <span>50 Neutral</span>
          <span>100 Extreme Greed</span>
        </div>
      </div>

      {/* History compare strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Now', v: score },
          { label: '1W ago', v: data.ago.week },
          { label: '1M ago', v: data.ago.month },
          { label: '3M ago', v: data.ago.threeMonth },
          { label: '1Y ago', v: data.ago.year },
        ].map(p => (
          <div key={p.label} style={{ ...card, padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 1, marginBottom: 4 }}>{p.label.toUpperCase()}</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 900, color: bandColor(p.v) }}>{p.v}</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 9, color: bandColor(p.v), marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{bandLabel(p.v)}</div>
          </div>
        ))}
      </div>

      {/* Historical sparkline */}
      {sparkPath && (
        <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: 2, marginBottom: 12 }}>📈 LAST 90 DAYS</div>
          <svg viewBox="0 0 600 80" preserveAspectRatio="none" width="100%" height="80">
            {/* Band background hints */}
            <line x1="0" y1="60" x2="600" y2="60" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,4" />
            <line x1="0" y1="40" x2="600" y2="40" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,4" />
            <line x1="0" y1="20" x2="600" y2="20" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,4" />
            <path d={sparkPath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 8, color: '#475569', marginTop: 4 }}>
            <span>{last[0]?.x ? new Date(last[0].x).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
            <span>Today</span>
          </div>
        </div>
      )}

      {/* Brutal AI commentary */}
      <div style={{ padding: '20px 22px', borderRadius: 14, background: `linear-gradient(135deg, ${color}10, transparent)`, border: `1px solid ${color}30` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>BRUTAL AI&trade; COMMENTARY</span>
        </div>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 15, color: '#E2E8F0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
          &ldquo;{brutalCommentary(score)}&rdquo;
        </p>
      </div>
    </div>
  );
}
