'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { href: '/', label: 'Home', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#C73E3A' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { href: '/markets', label: 'Markets', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#00D474' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { href: '/rankings', label: 'Rankings', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A843' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z"/></svg> },
  { href: '/rankings/crypto', label: 'Crypto', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#F59E0B' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { href: '/blog', label: 'Blog', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#A78BFA' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#0B0F19F0',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #1E293B',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 56 }}>
        {tabs.map(tab => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '6px 12px',
                textDecoration: 'none',
                minWidth: 48,
              }}
            >
              {tab.icon(active)}
              <span style={{
                fontSize: 9,
                fontWeight: active ? 700 : 500,
                color: active ? '#F1F5F9' : '#64748B',
                fontFamily: 'var(--sans)',
              }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
