"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const areaConfig: Record<string, { logo: string; logoColor: string; bg: string; bgScroll: string; linkColor: string; hoverColor: string; lineColors: string; links: { label: string; href: string }[] }> = {
  main: {
    logo: 'DHLM', logoColor: '#C5981A',
    bg: 'transparent', bgScroll: 'rgba(11,13,23,0.9)',
    linkColor: 'rgba(245,240,232,0.6)', hoverColor: '#C5981A',
    lineColors: 'linear-gradient(90deg, #8B2500, #C5981A, #1B5E20)',
    links: [{ label: 'Korea', href: '/blog' }, { label: 'Lottery', href: '/lotto' }, { label: 'Tools', href: '/tools' }],
  },
  lotto: {
    logo: '🎱 DHLM Lotto', logoColor: '#C5981A',
    bg: 'rgba(11,13,23,0.95)', bgScroll: 'rgba(11,13,23,0.95)',
    linkColor: '#6A6A7A', hoverColor: '#C5981A',
    lineColors: 'linear-gradient(90deg, #8B2500, #C5981A, #1B5E20)',
    links: [{ label: 'Home', href: '/' }, { label: 'Korea', href: '/blog' }, { label: 'Tools', href: '/tools' }],
  },
  korea: {
    logo: '🇰🇷 Discover Korea', logoColor: '#8B2500',
    bg: 'rgba(245,240,232,0.95)', bgScroll: 'rgba(245,240,232,0.95)',
    linkColor: '#8D8478', hoverColor: '#8B2500',
    lineColors: 'linear-gradient(90deg, #8B2500, #C5981A, #1B5E20)',
    links: [{ label: 'Home', href: '/' }, { label: 'Lottery', href: '/lotto' }, { label: 'Tools', href: '/tools' }],
  },
  tools: {
    logo: '🧮 DHLM Tools', logoColor: '#1A237E',
    bg: 'rgba(250,250,248,0.95)', bgScroll: 'rgba(250,250,248,0.95)',
    linkColor: '#8D8478', hoverColor: '#1A237E',
    lineColors: 'linear-gradient(90deg, #1A237E, #C5981A, #1A237E)',
    links: [{ label: 'Home', href: '/' }, { label: 'Korea', href: '/blog' }, { label: 'Lottery', href: '/lotto' }],
  },
};

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const area = pathname.startsWith('/lotto') ? 'lotto'
    : (pathname.startsWith('/blog') || pathname.startsWith('/korea')) ? 'korea'
    : pathname.startsWith('/tools') ? 'tools'
    : 'main';
  const cfg = areaConfig[area];
  const isLight = area === 'korea' || area === 'tools';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-md' : ''}`}
        style={{
          background: scrolled ? cfg.bgScroll : cfg.bg,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}>
        {scrolled && <div className="h-[2px]" style={{ background: cfg.lineColors }} />}
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href={area === 'main' ? '/' : area === 'lotto' ? '/lotto' : area === 'korea' ? '/blog' : '/tools'}
            className="text-base font-bold tracking-wide" style={{ fontFamily: "var(--font-playfair), var(--font-noto-serif-kr), serif", color: cfg.logoColor }}>
            {cfg.logo}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {cfg.links.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium tracking-wide transition-colors"
                style={{ color: cfg.linkColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = cfg.hoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = cfg.linkColor)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <div className="space-y-1.5">
              <span className="block w-5 h-[1.5px]" style={{ background: isLight ? '#8D8478' : 'rgba(245,240,232,0.5)' }} />
              <span className="block w-5 h-[1.5px]" style={{ background: isLight ? '#8D8478' : 'rgba(245,240,232,0.5)' }} />
            </div>
          </button>
        </div>
      </header>

      {menuOpen && <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMenuOpen(false)} />}
      <div className={`fixed top-0 right-0 z-50 h-full w-64 shadow-xl transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: isLight ? '#FAFAF8' : '#0B0D17' }}>
        <div className="flex justify-end p-5">
          <button onClick={() => setMenuOpen(false)} className="text-2xl" style={{ color: isLight ? '#8D8478' : '#6A6A7A' }}>&times;</button>
        </div>
        <nav className="flex flex-col px-8 gap-1">
          {cfg.links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block py-3.5 text-base font-medium border-b transition-colors"
              style={{ color: isLight ? '#2C1810' : '#9A9A9A', borderColor: isLight ? '#E0D8CC' : '#1A1A2E' }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
