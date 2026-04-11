'use client';

// Compact inline newsletter signup. Used inside reports/daily article footers,
// where a full-width NewsletterCTA card would be too heavy.
//
// Same backend as NewsletterCTA: POST /api/subscribe with { email, source }.

import { useState } from 'react';

interface Props {
  source: 'report' | 'daily' | 'request-form' | 'about';
  /** One-line headline shown above the input. */
  headline?: string;
  /** Description below the headline. */
  description?: string;
}

export default function InlineSubscribe({
  source,
  headline = 'Get notified of new reports',
  description = 'One email per weekday at 7:30 AM ET. Free. No spam.',
}: Props) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
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
      setDone(true);
      try { localStorage.setItem('dhlm-newsletter', e); } catch { /* ignore */ }
    } catch {
      setError('Network error');
    }
    setSubmitting(false);
  };

  if (done) {
    return (
      <div style={{ padding: '14px 18px', borderRadius: 12, background: '#00D47410', border: '1px solid #00D47425', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#00D474' }}>✓ Subscribed</div>
        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>The next Brutal Edge Daily lands in your inbox at 7:30 AM ET.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 18px', borderRadius: 12, background: '#0D1117', border: '1px solid #1E293B' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 6 }}>📧 BRUTAL EDGE&trade; DAILY</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>{headline}</div>
      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 12 }}>{description}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="your@email.com"
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 8,
            background: '#0B0F19', border: '1px solid #1E293B',
            color: '#F1F5F9', fontFamily: 'var(--sans)', fontSize: 12, outline: 'none',
          }}
        />
        <button onClick={submit} disabled={submitting || !email.includes('@')}
          style={{
            padding: '10px 16px', borderRadius: 8, border: 'none',
            background: email.includes('@') ? '#C73E3A' : '#1E293B',
            color: email.includes('@') ? '#fff' : '#475569',
            fontSize: 12, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--sans)',
          }}>
          {submitting ? '...' : 'Get it'}
        </button>
      </div>
      {error && <div style={{ fontSize: 10, color: '#FF4545', marginTop: 6 }}>{error}</div>}
    </div>
  );
}
