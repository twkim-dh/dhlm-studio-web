'use client';

// Newsletter signup card. Backed by /api/subscribe (Upstash Redis).
// `source` is recorded so we can later attribute conversions to the
// surface that captured them (homepage, daily, request-form, report).

import { useState, useEffect } from 'react';

export default function NewsletterCTA({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [count, setCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('dhlm-newsletter')) {
      setSubscribed(true);
    }
    fetch('/api/subscribe').then(r => r.json()).then(d => { if (typeof d.total === 'number') setCount(d.total); }).catch(() => {});
  }, []);

  const subscribe = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setError('Enter a valid email'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: e, source }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || 'Server error'); setSubmitting(false); return; }
      localStorage.setItem('dhlm-newsletter', e);
      setSubscribed(true);
      if (typeof d.total === 'number') setCount(d.total);
    } catch {
      setError('Network error');
    }
    setSubmitting(false);
  };

  if (subscribed) {
    return (
      <div style={{
        padding: '20px 24px', borderRadius: 16,
        background: '#00D47410', border: '1px solid #00D47425', textAlign: 'center',
      }}>
        <div style={{ fontSize: 20, marginBottom: 6 }}>✅</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#00D474' }}>You&apos;re subscribed!</div>
        <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>The Weekly Roast drops every Monday.</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px', borderRadius: 16,
      background: '#111827', border: '1px solid #1E293B',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 24, marginBottom: 6 }}>📧</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>Get the Weekly Roast</div>
        <p style={{ fontSize: 12, color: '#64748B', margin: '6px 0 0', lineHeight: 1.6 }}>
          Top movers, brutal AI takes, and Wall Street wisdom — every Monday.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && subscribe()}
          placeholder="your@email.com"
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 10,
            background: '#0D1117', border: '1px solid #1E293B',
            color: '#F1F5F9', fontSize: 13, outline: 'none',
          }}
        />
        <button onClick={subscribe} disabled={submitting || !email.includes('@')}
          style={{
            padding: '12px 20px', borderRadius: 10, border: 'none',
            background: email.includes('@') ? '#C73E3A' : '#1E293B',
            color: email.includes('@') ? '#fff' : '#475569',
            fontSize: 13, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed',
          }}>
          {submitting ? '...' : 'Subscribe'}
        </button>
      </div>
      {error && <div style={{ fontSize: 10, color: '#FF4545', textAlign: 'center', marginTop: 8 }}>{error}</div>}
      <div style={{ fontSize: 10, color: '#475569', textAlign: 'center', marginTop: 8 }}>
        {count > 0 ? `Join ${count.toLocaleString()} readers` : 'Join our community'} · Free · No spam
      </div>
    </div>
  );
}
