"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";

const SearchModal = lazy(() => import("./SearchModal"));

const links = [
  { label: "Holdings", href: "/holdings" },
  { label: "Notes", href: "/notes" },
  { label: "Learn", href: "/learn" },
  { label: "Red Days", href: "/red-days" },
  { label: "Q&A", href: "/qa" },
  { label: "About", href: "/about" },
];

function DhlmMono({ size = 28 }: { size?: number }) {
  const s = size, r = Math.max(s*0.275,3), fs = s*0.3;
  return (
    <svg viewBox={`0 0 ${s} ${s}`} width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <defs><linearGradient id="dG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5B6BE0"/><stop offset="100%" stopColor="#3B4A99"/></linearGradient></defs>
      <rect x={s*0.04} y={s*0.04} width={s*0.92} height={s*0.92} rx={r} fill="#FFFFFF" stroke="#EAECEF" strokeWidth={Math.max(s*0.015,0.8)}/>
      <text x={s*0.18} y={s*0.43} fontFamily="'Playfair Display',serif" fontSize={fs} fontWeight="900" fill="#1A1D21">D</text>
      <text x={s*0.52} y={s*0.43} fontFamily="'Playfair Display',serif" fontSize={fs} fontWeight="900" fill="#1A1D21" opacity="0.7">H</text>
      <text x={s*0.24} y={s*0.78} fontFamily="'Playfair Display',serif" fontSize={fs} fontWeight="900" fill="#1A1D21" opacity="0.5">L</text>
      <text x={s*0.54} y={s*0.78} fontFamily="'Playfair Display',serif" fontSize={fs} fontWeight="900" fill="url(#dG)">M</text>
      <line x1={s*0.22} y1={s*0.5} x2={s*0.78} y2={s*0.5} stroke="#EAECEF" strokeWidth={Math.max(s*0.008,0.5)}/>
      <circle cx={s*0.15} cy={s*0.15} r={s*0.028} fill="url(#dG)"/><circle cx={s*0.85} cy={s*0.85} r={s*0.028} fill="url(#dG)"/>
    </svg>
  );
}

export { DhlmMono };

export default function Header() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 30); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); } };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <>
      <nav aria-label="Main navigation" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? "12px 24px" : "16px 24px", background: scrolled ? "rgba(255,255,255,0.95)" : "#FFFFFF", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: "1px solid #EAECEF", transition: "all 0.2s" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <DhlmMono size={28} />
            <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#1A1D21", letterSpacing: 0.5 }}>DHLM Studio</span>
          </Link>
          <div className="hidden md:flex" style={{ gap: 24, alignItems: "center" }}>
            {links.map(l => (
              <Link key={l.label} href={l.href} style={{ fontSize: 13, fontWeight: 400, color: "#5B6470", fontFamily: "var(--sans)", textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => setSearchOpen(true)} aria-label="Search" style={{ background: "none", border: "none", padding: 8, cursor: "pointer" }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="#5B6470" strokeWidth="1.5"/>
                <path d="M10.5 10.5L14 14" stroke="#5B6470" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ background: "none", border: "none", padding: 8, cursor: "pointer" }}>
              <div style={{ width: 20, height: 1.5, background: "#5B6470", marginBottom: 5 }} />
              <div style={{ width: 20, height: 1.5, background: "#5B6470" }} />
            </button>
          </div>
        </div>
      </nav>
      <div style={{ height: 56 }} />

      {/* Mobile drawer overlay */}
      {menuOpen && <div style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.3)" }} onClick={() => setMenuOpen(false)} />}
      <div role="dialog" aria-label="Mobile menu" style={{ position: "fixed", top: 0, right: 0, zIndex: 151, height: "100%", width: 260, background: "#FFFFFF", transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.2s", borderLeft: "1px solid #EAECEF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #EAECEF" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#1A1D21" }}>DHLM Studio</span>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", color: "#8A929C", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>&times;</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "8px 0" }}>
          <button
            onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
            style={{ padding: "12px 20px", fontSize: 14, fontWeight: 400, color: "#5B6470", background: "none", border: "none", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="6.5" cy="6.5" r="5" stroke="#8A929C" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="#8A929C" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Search
          </button>
          {links.map(l => (
            <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ padding: "12px 20px", fontSize: 14, fontWeight: 400, color: "#5B6470", textDecoration: "none", borderTop: "1px solid #F0F2F4", fontFamily: "var(--sans)" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {searchOpen && (
        <Suspense fallback={null}>
          <SearchModal onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
