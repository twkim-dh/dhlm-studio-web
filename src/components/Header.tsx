"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Korea", href: "/blog" },
  { label: "Lottery", href: "/lotto" },
  { label: "Tools", href: "/tools" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#0B0D17]/90 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}>
        {scrolled && <div className="h-[2px] bg-gradient-to-r from-[#8B2500] via-[#C5981A] to-[#1B5E20]" />}
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="group">
            <span className="text-lg font-bold tracking-[0.15em]"
              style={{ fontFamily: "var(--font-playfair), var(--font-noto-serif-kr), serif", color: scrolled ? '#C5981A' : '#C5981A' }}>
              DHLM
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${scrolled ? 'text-[#9A9080] hover:text-[#C5981A]' : 'text-[#F5F0E8]/60 hover:text-[#C5981A]'}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <div className="space-y-1.5">
              <span className={`block w-5 h-[1.5px] transition ${scrolled ? 'bg-[#9A9080]' : 'bg-[#F5F0E8]/60'}`} />
              <span className={`block w-5 h-[1.5px] transition ${scrolled ? 'bg-[#9A9080]' : 'bg-[#F5F0E8]/60'}`} />
            </div>
          </button>
        </div>
      </header>

      {menuOpen && <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setMenuOpen(false)} />}
      <div className={`fixed top-0 right-0 z-50 h-full w-64 bg-[#0B0D17] transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-end p-5">
          <button onClick={() => setMenuOpen(false)} className="text-[#9A9080] text-2xl">&times;</button>
        </div>
        <nav className="flex flex-col px-8 gap-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block py-4 text-lg font-medium text-[#9A9080] hover:text-[#C5981A] border-b border-[#1A1A2E] transition-colors tracking-wide">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
