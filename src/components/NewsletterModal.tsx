'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ga = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, params);
  }
};

function getCookie(name: string): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
}

function setDismissedCookie() {
  const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
  document.cookie = `dhlm-modal-dismissed=1; expires=${expires}; path=/; SameSite=Lax`;
}

export default function NewsletterModal() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const formStarted = useRef(false);

  const isTargetPage = pathname.startsWith('/reports/') || pathname.startsWith('/research/');

  useEffect(() => {
    if (!isTargetPage) return;
    if (getCookie('dhlm-sub') || (typeof localStorage !== 'undefined' && localStorage.getItem('dhlm-newsletter'))) return;
    if (getCookie('dhlm-modal-dismissed')) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setVisible(true);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total >= 0.35) trigger();
    };

    // Fallback: show after 25s if user hasn't scrolled 35%
    const timer = setTimeout(trigger, 25000);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [isTargetPage, pathname]);

  useEffect(() => {
    if (visible) ga('modal_view', { modal_name: 'newsletter_subscribe', page_path: pathname });
  }, [visible, pathname]);

  const dismiss = useCallback(() => {
    setDismissedCookie();
    setVisible(false);
  }, []);

  const subscribe = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setError('Enter a valid email address'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: e, source: 'modal' }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || 'Server error'); setSubmitting(false); return; }
      localStorage.setItem('dhlm-newsletter', e);
      document.cookie = 'dhlm-sub=1; max-age=31536000; path=/; SameSite=Lax';
      ga('form_submit', { form_id: 'newsletter_modal', form_name: 'Newsletter Subscribe Modal', page_path: pathname });
      setDone(true);
    } catch {
      setError('Network error — please try again');
    }
    setSubmitting(false);
  };

  if (!visible) return null;

  return (
    <>
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.72)',
          zIndex: 9998,
          animation: 'beModalFade 0.25s ease',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Subscribe to DHLM Studio newsletter"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(480px, calc(100vw - 32px))',
          zIndex: 9999,
          background: '#0B0F19',
          border: '1px solid #1E293B',
          borderRadius: 20,
          padding: '32px 28px 28px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.85)',
          animation: 'beModalSlide 0.3s ease',
        }}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'none', border: 'none',
            color: '#475569', fontSize: 22, cursor: 'pointer',
            lineHeight: 1, padding: '2px 6px', borderRadius: 6,
          }}
        >×</button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#00D474', letterSpacing: 2, marginBottom: 10 }}>YOU&apos;RE IN</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, marginBottom: 10 }}>
              Welcome to DHLM Studio.
            </div>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: '0 0 22px' }}>
              Check your inbox — your first report summary is on the way.
            </p>
            <button
              onClick={() => setVisible(false)}
              style={{
                padding: '10px 28px', borderRadius: 10, border: 'none',
                background: '#1E293B', color: '#94A3B8',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >Close</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#3B4A99', letterSpacing: 3, marginBottom: 10 }}>
              DHLM STUDIO · WEEKLY
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, marginBottom: 10 }}>
              Institutional-grade research.<br />Free, every week.
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.65, margin: '0 0 18px' }}>
              Deep Dive reports on AI, semiconductors &amp; quantum computing — the analysis serious investors actually use.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              {[
                'Mag 7 + AI sector Deep Dives — BEAF scored',
                'The Mental Game — behavioral investing series',
                'New reports delivered to your inbox first',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#C73E3A', fontWeight: 800, fontSize: 12, flexShrink: 0, lineHeight: 1.5 }}>→</span>
                  <span style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && subscribe()}
                onFocus={() => {
                  if (!formStarted.current) {
                    formStarted.current = true;
                    ga('form_start', { form_id: 'newsletter_modal', form_name: 'Newsletter Subscribe Modal', page_path: pathname });
                  }
                }}
                placeholder="your@email.com"
                autoComplete="email"
                style={{
                  flex: 1, padding: '12px 14px', borderRadius: 10,
                  background: '#111827', border: '1px solid #1E293B',
                  color: '#F1F5F9', fontSize: 13, outline: 'none',
                  fontFamily: 'var(--sans)',
                }}
              />
              <button
                onClick={subscribe}
                disabled={submitting || !email.includes('@')}
                style={{
                  padding: '12px 18px', borderRadius: 10, border: 'none',
                  background: email.includes('@') ? '#C73E3A' : '#1E293B',
                  color: email.includes('@') ? '#fff' : '#475569',
                  fontSize: 13, fontWeight: 800,
                  cursor: email.includes('@') ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap', transition: 'background 0.2s',
                  fontFamily: 'var(--sans)',
                }}
              >{submitting ? '...' : 'Get Free Access →'}</button>
            </div>

            {error && <div style={{ fontSize: 11, color: '#FF4545', marginBottom: 8 }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: '#475569' }}>No spam · Unsubscribe anytime</span>
              <button
                onClick={dismiss}
                style={{
                  background: 'none', border: 'none',
                  fontSize: 11, color: '#475569', cursor: 'pointer', padding: 0,
                  textDecoration: 'underline',
                }}
              >Maybe later</button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes beModalFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes beModalSlide {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 18px)) }
          to   { opacity: 1; transform: translate(-50%, -50%) }
        }
      `}</style>
    </>
  );
}
