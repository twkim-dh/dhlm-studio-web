'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generatePortfolioRoast, type PortfolioStock, type PortfolioReport } from '@/lib/portfolio-roast';

const LOADING_MSGS = [
  'The AI is judging your life choices...',
  'Analyzing your terrible decisions...',
  'Preparing maximum devastation...',
  'Consulting the financial gods...',
  'Calculating your pain threshold...',
];

export default function RoastPortfolio() {
  const [tickers, setTickers] = useState<string[]>(['', '', '', '', '']);
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [loadMsg, setLoadMsg] = useState('');
  const [report, setReport] = useState<PortfolioReport | null>(null);

  const activeTickers = tickers.filter(t => t.trim().length > 0);

  const roast = () => {
    if (activeTickers.length < 2) return;
    setStep('loading');
    let msgIdx = 0;
    setLoadMsg(LOADING_MSGS[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length;
      setLoadMsg(LOADING_MSGS[msgIdx]);
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      const stocks: PortfolioStock[] = activeTickers.map(t => {
        const seed = t.toUpperCase().split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        return {
          ticker: t.toUpperCase(),
          change: ((seed * 7) % 40) - 15,
          sector: ['Technology', 'Healthcare', 'Financial', 'Consumer Cyclical', 'Communication', 'Energy', 'Industrials'][(seed * 3) % 7],
        };
      });
      setReport(generatePortfolioRoast(stocks));
      setStep('result');
    }, 3000);
  };

  const share = () => {
    if (!report) return;
    const tks = activeTickers.join(', ');
    const text = `My portfolio just got ROASTED by AI 💀\n\nGrade: ${report.grade}\n"${report.overview.slice(0, 120)}..."\n\nGet yours roasted →`;
    const url = 'https://dhlm-studio.com/markets/roast-portfolio';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const reset = () => { setTickers(['', '', '', '', '']); setReport(null); setStep('input'); };

  const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 16px' }}>
        <Link href="/markets" style={{ fontSize: 12, color: '#64748B' }}>← Markets</Link>

        <div style={{ textAlign: 'center', margin: '20px 0 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔥</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Roast My Portfolio</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 6 }}>Enter 2-5 stocks. The AI will judge your life choices.</p>
        </div>

        {/* Input */}
        {step === 'input' && (
          <div style={{ ...card, padding: 22 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 14 }}>YOUR PORTFOLIO</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8, marginBottom: 16 }}>
              {tickers.map((t, i) => (
                <input key={i} value={t} onChange={e => { const n = [...tickers]; n[i] = e.target.value.toUpperCase().replace(/[^A-Z-]/g, ''); setTickers(n); }}
                  placeholder={['AAPL', 'TSLA', 'NVDA', 'PLTR', 'GME'][i]}
                  maxLength={6}
                  style={{
                    padding: '12px 10px', borderRadius: 10, textAlign: 'center',
                    background: '#0D1117', border: t ? '2px solid #C73E3A40' : '1px solid #1E293B',
                    color: '#F1F5F9', fontSize: 16, fontWeight: 800, fontFamily: 'var(--mono)',
                    outline: 'none', letterSpacing: 2,
                  }} />
              ))}
            </div>
            <button onClick={roast} disabled={activeTickers.length < 2}
              style={{
                width: '100%', padding: '16px 0', borderRadius: 14, border: 'none', fontWeight: 900, fontSize: 16, cursor: activeTickers.length >= 2 ? 'pointer' : 'not-allowed',
                background: activeTickers.length >= 2 ? 'linear-gradient(135deg, #C73E3A, #EF4444)' : '#1E293B',
                color: activeTickers.length >= 2 ? '#fff' : '#475569',
                boxShadow: activeTickers.length >= 2 ? '0 4px 20px #C73E3A40' : 'none',
              }}>
              🔥 ROAST MY PORTFOLIO ({activeTickers.length}/5)
            </button>
            <p style={{ fontSize: 9, color: '#475569', textAlign: 'center', marginTop: 8 }}>Minimum 2 stocks required</p>
          </div>
        )}

        {/* Loading */}
        {step === 'loading' && (
          <div style={{ ...card, padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: 'pulse 1s ease infinite' }}>🔥</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#C73E3A', marginBottom: 8 }}>{loadMsg}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#64748B' }}>{activeTickers.join(' · ')}</div>
            <div style={{ width: 100, height: 3, borderRadius: 2, background: '#1E293B', margin: '20px auto 0', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #C73E3A, #EF4444)', animation: 'loading 2.5s ease-in-out' }} />
            </div>
          </div>
        )}

        {/* Report */}
        {step === 'result' && report && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Grade */}
            <div style={{ ...card, padding: 24, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 8 }}>🔥 PORTFOLIO ROAST REPORT</div>
              <div style={{ fontSize: 14, color: '#64748B', marginBottom: 12 }}>{activeTickers.join(' · ')}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 64, fontWeight: 900, color: report.gradeColor }}>{report.grade}</div>
              <div style={{ fontSize: 28 }}>{report.gradeEmoji}</div>
            </div>

            {/* Overview */}
            <div style={{ ...card, padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 10 }}>OVERALL ASSESSMENT</div>
              <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>&ldquo;{report.overview}&rdquo;</p>
            </div>

            {/* Individual */}
            <div style={{ ...card, padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 12 }}>INDIVIDUAL ROASTS</div>
              {report.individualRoasts.map((r, i) => (
                <div key={r.ticker} style={{ padding: '12px 0', borderBottom: i < report.individualRoasts.length - 1 ? '1px solid #1E293B' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800, color: '#60A5FA' }}>{r.ticker}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${r.ratingColor}15`, color: r.ratingColor, fontFamily: 'var(--mono)' }}>{r.rating}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>&ldquo;{r.roast}&rdquo;</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ ...card, padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 10 }}>PORTFOLIO STATS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Diversification', value: report.stats.diversification },
                  { label: 'Risk Level', value: report.stats.riskLevel },
                  { label: 'AI Says', value: report.stats.recommendation },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: 10, borderRadius: 8, background: '#0D1117' }}>
                    <div style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)' }}>{s.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0', marginTop: 4 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={share} style={{ padding: '10px 20px', borderRadius: 10, background: '#1D9BF0', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Share on 𝕏</button>
              <button onClick={reset} style={{ padding: '10px 20px', borderRadius: 10, background: 'transparent', border: '1px solid #C73E3A30', color: '#C73E3A', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🔥 Roast Again</button>
            </div>

            <p style={{ fontSize: 9, color: '#334155', textAlign: 'center' }}>🤖 Informational commentary under editorial oversight. NOT investment advice.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes loading{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        input::placeholder{color:#374151}
      `}</style>
    </div>
  );
}
