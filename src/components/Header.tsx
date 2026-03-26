"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "도구", href: "/tools" },
  { label: "로또", href: "/lotto" },
  { label: "블로그", href: "/blog" },
  { label: "회사소개", href: "/about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(window.location.pathname === "/");
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isHome
            ? scrolled
              ? "bg-[#0F172A]/90 backdrop-blur-md shadow-sm"
              : "bg-transparent"
            : scrolled
              ? "bg-white/80 backdrop-blur-md shadow-sm"
              : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className={`text-xl font-bold tracking-tight ${isHome ? "text-white" : ""}`}
            style={isHome ? {} : { color: "var(--brand-green)" }}
          >
            DHLM-STUDIO
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${isHome ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-[var(--brand-green)]"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <span className={`block w-6 h-0.5 ${isHome ? "bg-gray-300" : "bg-gray-700"}`} />
            <span className={`block w-6 h-0.5 ${isHome ? "bg-gray-300" : "bg-gray-700"}`} />
            <span className={`block w-6 h-0.5 ${isHome ? "bg-gray-300" : "bg-gray-700"}`} />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-gray-600"
            aria-label="메뉴 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-2 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-base font-medium text-gray-700 hover:text-[var(--brand-green)] border-b border-gray-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
