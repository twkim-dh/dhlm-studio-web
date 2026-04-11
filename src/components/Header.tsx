"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Primary nav: editorial-first ordering per directive update.
// Daily/Markets/Reports/Blog (the four content pillars) lead the nav,
// with Crypto/Lottery in the secondary slots. Creators and Rankings
// moved to footer "More" per master directive PART 7-D.
const links = [
  { label: "Daily", href: "/daily" },
  { label: "Markets", href: "/markets" },
  { label: "Reports", href: "/reports" },
  { label: "Research", href: "/research" },
  { label: "Blog", href: "/blog" },
  { label: "Crypto", href: "/rankings/crypto" },
  { label: "Lottery", href: "/lottery" },
];

function DhlmMono({ size = 28 }: { size?: number }) {
  const s = size, r = Math.max(s*0.275,3), fs = s*0.3;
  return (
    <svg viewBox={`0 0 ${s} ${s}`} width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <defs><linearGradient id="dG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E85D59"/><stop offset="100%" stopColor="#C73E3A"/></linearGradient></defs>
      <rect x={s*0.04} y={s*0.04} width={s*0.92} height={s*0.92} rx={r} fill="#0D1117" stroke="#1E293B" strokeWidth={Math.max(s*0.015,0.8)}/>
      <text x={s*0.18} y={s*0.43} fontFamily="'Playfair Display',serif" fontSize={fs} fontWeight="900" fill="#F1F5F9">D</text>
      <text x={s*0.52} y={s*0.43} fontFamily="'Playfair Display',serif" fontSize={fs} fontWeight="900" fill="#F1F5F9" opacity="0.7">H</text>
      <text x={s*0.24} y={s*0.78} fontFamily="'Playfair Display',serif" fontSize={fs} fontWeight="900" fill="#F1F5F9" opacity="0.5">L</text>
      <text x={s*0.54} y={s*0.78} fontFamily="'Playfair Display',serif" fontSize={fs} fontWeight="900" fill="url(#dG)">M</text>
      <line x1={s*0.22} y1={s*0.5} x2={s*0.78} y2={s*0.5} stroke="#1E293B" strokeWidth={Math.max(s*0.008,0.5)}/>
      <circle cx={s*0.15} cy={s*0.15} r={s*0.028} fill="url(#dG)"/><circle cx={s*0.85} cy={s*0.85} r={s*0.028} fill="url(#dG)"/>
    </svg>
  );
}

export { DhlmMono };

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 30); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);

  return (
    <>
      <nav aria-label="Main navigation" style={{ position: "fixed", top: 28, left: 0, right: 0, zIndex: 100, padding: scrolled ? "12px 24px" : "18px 24px", background: scrolled ? "#0B0F19E8" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid #1C2333" : "none", transition: "all 0.3s" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <DhlmMono size={30} />
            <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, color: "#C73E3A", letterSpacing: 2, marginLeft: 2 }}>STUDIO</span>
          </Link>
          <div className="hidden md:flex" style={{ gap: 28, alignItems: "center" }}>
            {links.map(l => <Link key={l.label} href={l.href} style={{ fontSize: 13, fontWeight: 500, color: "#94A3B8", fontFamily: "var(--sans)" }}>{l.label}</Link>)}
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ background: "none", border: "none", padding: 8, cursor: "pointer" }}>
            <div style={{ width: 20, height: 1.5, background: "#94A3B8", marginBottom: 5 }} /><div style={{ width: 20, height: 1.5, background: "#94A3B8" }} />
          </button>
        </div>
      </nav>
      <div style={{ height: 64 }} />
      {menuOpen && <div style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.6)" }} onClick={() => setMenuOpen(false)} />}
      <div role="dialog" aria-label="Mobile menu" style={{ position: "fixed", top: 0, right: 0, zIndex: 151, height: "100%", width: 260, background: "#0B0F19", transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.2s", borderLeft: "1px solid #1E293B" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}><button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 24, cursor: "pointer" }}>&times;</button></div>
        <div style={{ display: "flex", flexDirection: "column", padding: "0 24px" }}>
          {links.map(l => <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ padding: "14px 0", fontSize: 15, fontWeight: 500, color: "#94A3B8", borderBottom: "1px solid #1E293B", fontFamily: "var(--sans)" }}>{l.label}</Link>)}
        </div>
      </div>
    </>
  );
}
