'use client';

// "Request a Deep Dive" form per master directive PART 17.
// User submits a ticker (and optional email for completion notification).
// Top 10 most-requested tickers are loaded on mount and refreshed after each
// successful submission so the social proof updates immediately.

import { useState, useEffect, useCallback } from 'react';

interface TopRequest { ticker: string; count: number }

const TICKER_RE = /^[A-Z][A-Z0-9.-]{0,9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RequestDeepDive({ compact = false }: { compact?: boolean }) {
  const [ticker, setTicker] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [top, setTop] = useState<TopRequest[]>([]);

  const loadTop = useCallback(async () => {
    try {
      const r = await fetch('/api/request-deepdive', { cache: 'no-store' });
      const d = await r.json();
      if (Array.isArray(d.top)) setTop(d.top);
    } catch { /* keep previous */ }
  }, []);

  useEffect(() => { loadTop(); }, [loadTop]);

  const submit = async () => {
    const t = ticker.trim().toUpperCase();
    if (!TICKER_RE.test(t)) { setErrorMsg('Enter a valid ticker (e.g. SOFI, COIN, RIVN)'); setStatus('error'); return; }
    if (email && !EMAIL_RE.test(email)) { setErrorMsg('Enter a valid email or leave it blank'); setStatus('error'); return; }
    setStatus('submitting'); setErrorMsg('');
    try {
      const r = await fetch('/api/request-deepdive', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ticker: t, email: email || undefined }),
      });
      const d = await r.json();
      if (!r.ok) { setErrorMsg(d.error || 'Server error'); setStatus('error'); return; }
      setStatus('success'); setTicker(''); setEmail('');
      loadTop();
    } catch {
      setErrorMsg('Network error'); setStatus('error');
    }
  };

  return (
    <div style={{
      padding: compact ? '20px 22px' : '28px 26px',
      borderRadius: 16,
      background: 'linear-gradient(135deg, #C73E3A0A, #C73E3A03)',
      border: '1px solid #C73E3A25',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>🔍 REQUEST A DEEP DIVE</span>
      </div>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: compact ? 18 : 22, fontWeight: 800, color: '#F1F5F9', margin: '0 0 6px' }}>
        Which stock should we analyze next?
      </h3>
      <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, margin: '0 0 16px' }}>
        Submit a ticker. The top requested ticker each week becomes a Brutal AI Deep Dive.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1fr auto' : '120px 1fr auto', gap: 8, marginBottom: 10 }}>
        <input
          type="text"
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="TICKER"
          maxLength={10}
          style={{
            padding: '11px 14px', borderRadius: 10,
            background: '#0D1117', border: '1px solid #1E293B',
            color: '#F1F5F9', fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700,
            outline: 'none', textTransform: 'uppercase',
          }}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="email (optional)"
          style={{
            padding: '11px 14px', borderRadius: 10,
            background: '#0D1117', border: '1px solid #1E293B',
            color: '#F1F5F9', fontFamily: 'var(--sans)', fontSize: 13,
            outline: 'none',
          }}
        />
        <button onClick={submit} disabled={status === 'submitting' || !ticker}
          style={{
            padding: '11px 20px', borderRadius: 10, border: 'none',
            background: ticker ? '#C73E3A' : '#1E293B',
            color: ticker ? '#fff' : '#475569',
            fontSize: 13, fontWeight: 800, cursor: ticker ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--sans)',
          }}>
          {status === 'submitting' ? '...' : 'Request'}
        </button>
      </div>

      {status === 'success' && <div style={{ fontSize: 11, color: '#00D474', fontWeight: 700, marginBottom: 8 }}>✓ Request received. Thank you.</div>}
      {status === 'error' && <div style={{ fontSize: 11, color: '#FF4545', fontWeight: 700, marginBottom: 8 }}>{errorMsg}</div>}

      {top.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #1E293B30' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: 2, marginBottom: 8 }}>📊 MOST REQUESTED THIS WEEK</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {top.slice(0, 8).map((t, i) => (
              <span key={t.ticker} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 6,
                background: i === 0 ? '#D4A84318' : '#0D1117',
                border: '1px solid ' + (i === 0 ? '#D4A84340' : '#1E293B'),
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: i === 0 ? '#D4A843' : '#60A5FA' }}>{t.ticker}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569' }}>{t.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
