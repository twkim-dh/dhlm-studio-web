'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Mobile bottom tabs: finance-first per master directive PART 7-D.
// Daily is the new flagship tab. Reports earns its own slot (it is the
// site's highest-value content). Rankings/Creators moved to More.
const tabs = [
  { href: '/', label: 'Home', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C73E3A' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { href: '/daily', label: 'Daily', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C73E3A' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { href: '/markets', label: 'Markets', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#00D474' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { href: '/reports', label: 'Reports', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C73E3A' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

// Secondary destinations live in the More menu — same set as before plus
// Creators/Rankings demoted from primary nav, Daily promoted out of More.
const moreLinks = [
  { href: '/rankings/crypto', label: '🪙 Crypto', color: '#F59E0B' },
  { href: '/lottery', label: '🎰 Lottery', color: '#EF4444' },
  { href: '/blog', label: '📖 Blog', color: '#60A5FA' },
  { href: '/blog/wisdom', label: '💡 Wisdom', color: '#D4A843' },
  { href: '/rankings', label: '🏆 Rankings', color: '#D4A843' },
  { href: '/creators', label: '🔥 Creators', color: '#A78BFA' },
  { href: '/tools', label: '🧮 Tools', color: '#64748B' },
  { href: '/about', label: 'ℹ️ About', color: '#94A3B8' },
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
