'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('dhlm-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('dhlm-cookie-consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('dhlm-cookie-consent', 'declined');
    setShow(false);
    // Disable GA4 if declined
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      padding: '16px 20px',
      background: '#111827F0', backdropFilter: 'blur(12px)',
      borderTop: '1px solid #1E293B',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{ fontSize: 12, color: '#E2E8F0', margin: '0 0 4px', fontWeight: 600 }}>🍪 We use cookies</p>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
            We use Google Analytics to understand how you use our site. No personal data is sold.
            <a href="/privacy" style={{ color: '#60A5FA', marginLeft: 4 }}>Privacy Policy</a>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={decline} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #1E293B',
            background: 'transparent', color: '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Decline</button>
          <button onClick={accept} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            background: '#C73E3A', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>Accept</button>
        </div>
      </div>
    </div>
  );
}
