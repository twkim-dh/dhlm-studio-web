'use client';

// Compact inline newsletter signup. Used inside report/research article footers.
// Same backend as NewsletterCTA: POST /api/subscribe with { email, source }.

import { useState } from 'react';

interface Props {
  source: 'report' | 'daily' | 'request-form' | 'about';
  headline?: string;
  description?: string;
}

export default function InlineSubscribe({
  source,
  headline = 'Never miss the next Deep Dive',
  description = '32+ free reports. New analysis every week. No spam.',
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
      <div style={{ padding: '16px 20px', borderRadius: 12, background: '#00D47408', border: '1px solid #00D47430', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#00D474', marginBottom: 2 }}>✓ You&apos;re in</div>
        <div style={{ fontSize: 11, color: '#64748B' }}>Your first report summary is on the way.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '18px 20px', borderRadius: 12, background: '#0D1117', border: '1px solid #1E293B' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#3B4A99', letterSpacing: 2, marginBottom: 6 }}>DHLM STUDIO · WEEKLY</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#E2E8F0', marginBottom: 3, fontFamily: 'var(--serif)' }}>{headline}</div>
      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 12, lineHeight: 1.5 }}>{description}</div>
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
        <button
          onClick={submit}
          disabled={submitting || !email.includes('@')}
          style={{
            padding: '10px 16px', borderRadius: 8, border: 'none',
            background: email.includes('@') ? '#C73E3A' : '#1E293B',
            color: email.includes('@') ? '#fff' : '#475569',
            fontSize: 12, fontWeight: 800, cursor: email.includes('@') ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--sans)', whiteSpace: 'nowrap',
          }}>
          {submitting ? '...' : 'Get it free →'}
        </button>
      </div>
      {error && <div style={{ fontSize: 10, color: '#FF4545', marginTop: 6 }}>{error}</div>}
      <div style={{ fontSize: 10, color: '#475569', marginTop: 8 }}>No spam · Unsubscribe anytime</div>
    </div>
  );
}
