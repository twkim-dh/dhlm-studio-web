'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { href: '/', label: 'Home', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C73E3A' : '#8A929C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { href: '/reports', label: 'Reports', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C73E3A' : '#8A929C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { href: '/learn', label: 'Learn', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#8B5CF6' : '#8A929C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
];

const moreLinks = [
  { href: '/research', label: '🧠 The Mental Game', color: '#A78BFA' },
  { href: '/editorial', label: '📋 Editorial', color: '#38BDF8' },
  { href: '/about', label: 'ℹ️ About', color: '#5B6470' },
];

// v2 — includes About link in More menu
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
          background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4',
          padding: '8px 0', minWidth: 160, boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
        }}>
          {moreLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMoreOpen(false)}
              style={{
                display: 'block', padding: '10px 16px', textDecoration: 'none',
                fontSize: 13, fontWeight: pathname.startsWith(l.href) ? 700 : 500,
                color: pathname.startsWith(l.href) ? l.color : '#5B6470',
              }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <nav aria-label="Mobile navigation" className="md:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#0B0F19F0', backdropFilter: 'blur(20px)',
        borderTop: '1px solid #E8E8E4',
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
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? '#16161A' : '#8A929C', fontFamily: 'var(--sans)' }}>{tab.label}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button onClick={() => setMoreOpen(!moreOpen)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 2, padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer', minWidth: 44,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isMoreActive || moreOpen ? '#A78BFA' : '#8A929C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
            <span style={{ fontSize: 9, fontWeight: isMoreActive || moreOpen ? 700 : 500, color: isMoreActive || moreOpen ? '#16161A' : '#8A929C', fontFamily: 'var(--sans)' }}>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
