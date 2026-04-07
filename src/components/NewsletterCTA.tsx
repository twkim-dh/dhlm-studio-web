'use client';

import { useState, useEffect } from 'react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('dhlm-newsletter');
    if (saved) setSubscribed(true);
    // Count from localStorage (simulated)
    const emails = JSON.parse(localStorage.getItem('dhlm-newsletter-list') || '[]');
    setCount(emails.length);
  }, []);

  const subscribe = () => {
    if (!email.trim() || !email.includes('@')) return;
    const emails = JSON.parse(localStorage.getItem('dhlm-newsletter-list') || '[]');
    if (!emails.includes(email.trim())) {
      emails.push(email.trim());
      localStorage.setItem('dhlm-newsletter-list', JSON.stringify(emails));
    }
    localStorage.setItem('dhlm-newsletter', email.trim());
    setSubscribed(true);
    setCount(emails.length);
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
        <button onClick={subscribe} disabled={!email.includes('@')}
          style={{
            padding: '12px 20px', borderRadius: 10, border: 'none',
            background: email.includes('@') ? '#C73E3A' : '#1E293B',
            color: email.includes('@') ? '#fff' : '#475569',
            fontSize: 13, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed',
          }}>
          Subscribe
        </button>
      </div>
      <div style={{ fontSize: 10, color: '#475569', textAlign: 'center', marginTop: 8 }}>
        {count > 0 ? `Join ${count.toLocaleString()} readers` : 'Join our community'} · Free · No spam
      </div>
    </div>
  );
}
