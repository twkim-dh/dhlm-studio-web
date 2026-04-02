'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { href: '/', label: 'Home', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C73E3A' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { href: '/markets', label: 'Markets', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#00D474' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { href: '/rankings', label: 'Rankings', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#D4A843' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z"/></svg> },
  { href: '/lottery', label: 'Lottery', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#EF4444' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg> },
];

const moreLinks = [
  { href: '/rankings/crypto', label: '🪙 Crypto', color: '#F59E0B' },
  { href: '/creators', label: '🔥 Creators', color: '#A78BFA' },
  { href: '/blog', label: '📖 Blog', color: '#60A5FA' },
  { href: '/blog/wisdom', label: '💡 Wisdom', color: '#D4A843' },
  { href: '/tools', label: '🧮 Tools', color: '#64748B' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = moreLinks.some(l => pathname.startsWith(l.href));

  return (
    <>
      {/* More menu backdrop */}
      {moreOpen && <div onClick={() => setMoreOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.4)' }} />}

      {/* More menu popup */}
      {moreOpen && (
        <div style={{
          position: 'fixed', bottom: 64, right: 8, zIndex: 101,
          background: '#111827', borderRadius: 14, border: '1px solid #1E293B',
          padding: '8px 0', minWidth: 160, boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
        }}>
          {moreLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMoreOpen(false)}
              style={{
                display: 'block', padding: '10px 16px', textDecoration: 'none',
                fontSize: 13, fontWeight: pathname.startsWith(l.href) ? 700 : 500,
                color: pathname.startsWith(l.href) ? l.color : '#94A3B8',
              }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <nav aria-label="Mobile navigation" className="md:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#0B0F19F0', backdropFilter: 'blur(20px)',
        borderTop: '1px solid #1E293B',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 56 }}>
          {tabs.map(tab => {
            const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, padding: '6px 10px', textDecoration: 'none', minWidth: 44,
              }}>
                {tab.icon(active)}
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? '#F1F5F9' : '#64748B', fontFamily: 'var(--sans)' }}>{tab.label}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button onClick={() => setMoreOpen(!moreOpen)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 2, padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer', minWidth: 44,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isMoreActive || moreOpen ? '#A78BFA' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
            <span style={{ fontSize: 9, fontWeight: isMoreActive || moreOpen ? 700 : 500, color: isMoreActive || moreOpen ? '#F1F5F9' : '#64748B', fontFamily: 'var(--sans)' }}>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
