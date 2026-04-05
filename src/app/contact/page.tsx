'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    // Open mailto with pre-filled content
    const subject = encodeURIComponent(`Contact from ${name} — DHLM Studio`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:dhlmstudio2026@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
  };

  const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/" style={{ fontSize: 12, color: '#64748B' }}>← Home</Link>

        <div style={{ marginTop: 20, marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#3B82F6', letterSpacing: 3, marginBottom: 8 }}>CONTACT US</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Get in Touch</h1>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 6 }}>Questions, feedback, or corrections? We typically respond within 24 hours.</p>
        </div>

        {!sent ? (
          <div style={{ ...card, padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--mono)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>YOUR NAME</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', color: '#F1F5F9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--mono)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', color: '#F1F5F9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--mono)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>MESSAGE</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your message..." rows={5}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', color: '#F1F5F9', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'var(--sans)' }} />
            </div>
            <button onClick={handleSubmit} disabled={!name.trim() || !email.includes('@') || !message.trim()}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 15,
                background: name.trim() && email.includes('@') && message.trim() ? '#C73E3A' : '#1E293B',
                color: name.trim() && email.includes('@') && message.trim() ? '#fff' : '#475569',
                cursor: name.trim() && email.includes('@') && message.trim() ? 'pointer' : 'not-allowed',
              }}>
              Send Message
            </button>
          </div>
        ) : (
          <div style={{ ...card, padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#00D474' }}>Message Sent!</div>
            <p style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>We typically respond within 24 hours.</p>
            <button onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }}
              style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, background: 'transparent', border: '1px solid #1E293B', color: '#94A3B8', fontSize: 12, cursor: 'pointer' }}>
              Send Another Message
            </button>
          </div>
        )}

        <div style={{ marginTop: 24, ...card, padding: '18px 22px' }}>
          <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>
            <strong style={{ color: '#E2E8F0' }}>Other ways to reach us:</strong><br />
            📧 Email: <a href="mailto:dhlmstudio2026@gmail.com" style={{ color: '#60A5FA' }}>dhlmstudio2026@gmail.com</a><br />
            𝕏 Twitter: <a href="https://x.com/dhlm_studio" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>@dhlm_studio</a>
          </div>
        </div>
      </div>
    </div>
  );
}
