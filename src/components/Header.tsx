"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { label: "Korea", href: "/blog" },
  { label: "Lottery", href: "/lotto" },
  { label: "Tools", href: "/tools" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ borderBottom: '1px solid #E5E7EB', height: '56px' }}>
        <div className="mx-auto h-full flex items-center justify-between px-6" style={{ maxWidth: '960px' }}>
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-wide" style={{ color: '#1A1A1A' }}>DHLM</span>
            <span className="w-1 h-1 rounded-full" style={{ background: '#C73E3A' }} />
          </Link>

          <nav className="hidden sm:flex items-center gap-8">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href}
                  className="text-[13px] transition-colors duration-200"
                  style={{ color: active ? '#1A1A1A' : '#BCBCBC' }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#1A1A1A'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#BCBCBC'; }}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button className="sm:hidden p-2" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <div className="space-y-1.5">
              <span className="block w-5 h-[1px] bg-[#1A1A1A]" />
              <span className="block w-5 h-[1px] bg-[#1A1A1A]" />
            </div>
          </button>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: '56px' }} />

      {menuOpen && <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMenuOpen(false)} />}
      <div className={`fixed top-0 right-0 z-50 h-full w-64 bg-white transform transition-transform duration-200 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderLeft: '1px solid #E5E7EB' }}>
        <div className="flex justify-end p-5">
          <button onClick={() => setMenuOpen(false)} className="text-xl text-[#6B7280]">&times;</button>
        </div>
        <nav className="flex flex-col px-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="py-4 text-base transition-colors duration-200 hover:text-[#C73E3A]"
              style={{ color: '#1A1A1A', borderBottom: '1px solid #E5E7EB' }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
