import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tools | DHLM Studio",
  description: "Free online tools: QR code generator, password generator, and more.",
};

const tools = [
  { title: "QR Code Generator", desc: "Generate QR codes for URLs, text, and more", href: "/tools/qr-generator", icon: "📱" },
  { title: "Password Generator", desc: "Create strong, secure passwords instantly", href: "/tools/password-generator", icon: "🔐" },
];

export default function ToolsPage() {
  return (
    <div style={{ background: "#0B0F19", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "#C73E3A", letterSpacing: 3, marginBottom: 8 }}>FREE TOOLS</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 900, color: "#F1F5F9", margin: "0 0 8px" }}>Tools</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "#64748B", margin: "0 0 40px" }}>Free utilities — no login required</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {tools.map(t => (
            <Link key={t.href} href={t.href} style={{
              display: "block", padding: "24px 20px", background: "#111827", borderRadius: 14,
              border: "1px solid #1E293B",
            }}>
              <span style={{ fontSize: 28 }}>{t.icon}</span>
              <h2 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: "12px 0 4px" }}>{t.title}</h2>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#64748B", margin: 0 }}>{t.desc}</p>
            </Link>
          ))}
        </div>

        <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#334155", marginTop: 40, textAlign: "center" }}>
          More tools coming soon.
        </p>
      </div>
    </div>
  );
}
