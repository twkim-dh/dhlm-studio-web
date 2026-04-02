"use client";

import Link from "next/link";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto", borderTop: "1px solid #1E293B" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 800, color: "#94A3B8" }}>DHLM</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: "#C73E3A", letterSpacing: 2, marginLeft: 4 }}>STUDIO</span>
          <div style={{ fontFamily: "var(--sans)", fontSize: 10, color: "#475569", marginTop: 2 }}>Data-Driven Insights · © {YEAR}</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "About", href: "/about" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Contact", href: "mailto:dhlmstudio2026@gmail.com" },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: 11, color: "#475569", fontFamily: "var(--sans)" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 10, color: "#334155", marginTop: 16, lineHeight: 1.6, textAlign: "center" }}>
        Market data is for informational purposes only and does not constitute investment advice. Always do your own research.
      </div>
    </footer>
  );
}
