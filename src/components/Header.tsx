"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { ko: "도구", en: "Tools", href: "/tools" },
  { ko: "운세", en: "Fortune", href: "/lotto#fortune" },
  { ko: "로또", en: "Lotto", href: "/lotto" },
  { ko: "코리아", en: "Korea", href: "/blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0D1117]/95 backdrop-blur-md shadow-lg" : "bg-[#0D1117]"
      }`}>
        <div className="dancheong-band" />
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-[#F5F0E8]"
              style={{ fontFamily: "var(--font-playfair), var(--font-noto-serif-kr), serif" }}>
              DHLM
            </span>
            <span className="text-[10px] text-[#C5981A] font-medium tracking-[0.25em]">STUDIO</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-[#9A9080] hover:text-[#C5981A] transition-colors">
                {link.ko} <span className="text-[9px] text-[#5A5A5A]">{link.en}</span>
              </Link>
            ))}
          </nav>

          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(true)} aria-label="메뉴">
            <span className="block w-5 h-0.5 bg-[#9A9080]" />
            <span className="block w-5 h-0.5 bg-[#9A9080]" />
            <span className="block w-5 h-0.5 bg-[#9A9080]" />
          </button>
        </div>
      </header>

      {menuOpen && <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMenuOpen(false)} />}
      <div className={`fixed top-0 right-0 z-50 h-full w-64 bg-[#0D1117] shadow-xl transform transition-transform duration-300 md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)} className="p-2 text-[#9A9080]" aria-label="닫기">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block py-3 text-base font-medium text-[#9A9080] hover:text-[#C5981A] border-b border-[#1A1F2E] transition-colors">
              {link.ko} <span className="text-xs text-[#5A5A5A]">{link.en}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
