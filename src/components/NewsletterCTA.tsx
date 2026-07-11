'use client';

import { useState, useEffect } from 'react';

export default function NewsletterCTA({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [count, setCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const hasLocalStorage = typeof window !== 'undefined' && !!localStorage.getItem('dhlm-newsletter');
    const hasCookie = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('dhlm-sub='));
    if (hasLocalStorage || hasCookie) setSubscribed(true);
    fetch('/api/subscribe').then(r => r.json()).then(d => { if (typeof d.total === 'number') setCount(d.total); }).catch(() => {});
  }, []);

  const subscribe = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setError('Enter a valid email address'); return; }
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
      document.cookie = 'dhlm-sub=1; max-age=31536000; path=/; SameSite=Lax';
      setJustSubscribed(true);
      setSubscribed(true);
      if (typeof d.total === 'number') setCount(d.total);
    } catch {
      setError('Network error — please try again');
    }
    setSubmitting(false);
  };

  if (subscribed) {
    return (
      <div style={{
        padding: '24px 28px', borderRadius: 16,
        background: '#00D47408', border: '1px solid #00D47430', textAlign: 'center',
      }}>
        {justSubscribed ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00D474', letterSpacing: 1, marginBottom: 4 }}>YOU&apos;RE IN</div>
            <div style={{ fontSize: 22, fontFamily: 'var(--serif)', fontWeight: 900, color: '#F1F5F9', marginBottom: 6 }}>Welcome to DHLM Studio.</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Check your inbox — your first report summary is on the way.</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00D474', letterSpacing: 1, marginBottom: 4 }}>WELCOME BACK</div>
            <div style={{ fontSize: 22, fontFamily: 'var(--serif)', fontWeight: 900, color: '#F1F5F9', marginBottom: 6 }}>Welcome back, subscriber.</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>You&apos;re already on the list. New reports in your inbox every week.</div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{
      padding: '28px 28px 24px', borderRadius: 16,
      background: 'linear-gradient(135deg, #111827 0%, #0D1117 100%)',
      border: '1px solid #1E293B',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#3B4A99', letterSpacing: 3, marginBottom: 8 }}>DHLM STUDIO · WEEKLY</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: '#F1F5F9', lineHeight: 1.25, marginBottom: 8 }}>
          Institutional-grade research.<br />Free, every week.
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
          Deep Dive reports on AI, semiconductors, and quantum computing — the analysis serious investors actually use.
        </p>
      </div>

      {/* Value bullets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        {[
          'Mag 7 + AI sector Deep Dives — scored',
          '32+ published reports + new analysis every week',
          'Investing 101 Beginner Series — 12 free lessons',
          'New reports delivered to your inbox first',
        ].map((item) => (
          <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: '#C73E3A', fontWeight: 800, fontSize: 13, lineHeight: 1.4, flexShrink: 0 }}>→</span>
            <span style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.4 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && subscribe()}
          placeholder="your@email.com"
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 10,
            background: '#0B0F19', border: '1px solid #1E293B',
            color: '#F1F5F9', fontSize: 13, outline: 'none',
            fontFamily: 'var(--sans)',
          }}
        />
        <button
          onClick={subscribe}
          disabled={submitting || !email.includes('@')}
          style={{
            padding: '12px 20px', borderRadius: 10, border: 'none',
            background: email.includes('@') ? '#C73E3A' : '#1E293B',
            color: email.includes('@') ? '#fff' : '#475569',
            fontSize: 13, fontWeight: 800, cursor: email.includes('@') ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--sans)', whiteSpace: 'nowrap',
            transition: 'background 0.2s',
          }}>
          {submitting ? '...' : 'Get Free Access →'}
        </button>
      </div>

      {error && <div style={{ fontSize: 11, color: '#FF4545', marginBottom: 8 }}>{error}</div>}

      {/* Trust line — tiered by count */}
      <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.5 }}>
        {count >= 500
          ? `Join ${count.toLocaleString()}+ investors`
          : count >= 100
          ? `Join ${Math.floor(count / 100) * 100}+ investors building frameworks`
          : count >= 50
          ? `Join 50+ investors`
          : count >= 10
          ? `Join 10+ readers`
          : 'Trusted by investors in the US, UK & Canada'
        } · No spam · Unsubscribe anytime
      </div>
    </div>
  );
}
