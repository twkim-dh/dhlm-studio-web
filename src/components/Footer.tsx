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
            { label: "Editorial", href: "/editorial" },
            { label: "Disclaimer", href: "/disclaimer" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Contact", href: "/contact" },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: 11, color: "#475569", fontFamily: "var(--sans)" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 10, color: "#334155", marginTop: 16, lineHeight: 1.6, textAlign: "center" }}>
        All content is for informational and educational purposes only. Not investment advice. Always do your own research.
      </div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 9, color: "#334155", marginTop: 8, lineHeight: 1.6, textAlign: "center", maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
        All company logos and trademarks are the property of their respective owners. They are used here for identification purposes only. DHLM Studio is not affiliated with, sponsored by, or endorsed by any company analyzed on this site.
      </div>
    </footer>
  );
}
