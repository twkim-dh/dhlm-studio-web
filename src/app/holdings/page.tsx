import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holdings — What I Own and Why",
  description: "The stocks I currently hold, the ones I'm watching, and the reasoning behind each position.",
  alternates: { canonical: "https://dhlm-studio.com/holdings" },
};

const HOLDINGS = [
  { ticker: "MU",   name: "Micron Technology",   note: "Memory supercycle + HBM demand. Long-term hold.", theme: "AI Infrastructure" },
  { ticker: "IONQ", name: "IonQ",                note: "Trapped-ion quantum computing. Small position, long horizon.", theme: "Quantum Computing" },
  { ticker: "TSLA", name: "Tesla",               note: "Energy + autonomy optionality. Core holding.", theme: "Physical AI" },
  { ticker: "NVDA", name: "NVIDIA",              note: "GPU dominance in the AI training cycle.", theme: "AI Infrastructure" },
  { ticker: "MSFT", name: "Microsoft",           note: "Azure + Copilot. Stable AI platform play.", theme: "AI Platform" },
  { ticker: "AMZN", name: "Amazon",              note: "AWS + logistics AI. Steady compounder.", theme: "Cloud / AI" },
  { ticker: "INOD", name: "Innodata",            note: "AI training data annotation. Small cap, high risk.", theme: "AI Data" },
  { ticker: "SpaceX", name: "SpaceX (Private)", note: "Not publicly tradable. Following via secondaries.", theme: "Space / Physical AI" },
];

const WATCHING: string[] = [];

const PHILOSOPHY = [
  "Long-term hold — I buy when I've done the research, and I don't sell easily.",
  "Keep ~20% cash. Dry powder matters more in volatile markets.",
  "AI boom is the current cycle. Quantum is the next one I'm positioning for.",
  "Valuation-based judgment — I try to buy when the price reflects pessimism, not optimism.",
  "For quantum: I separate long-term (core account) from short-term trades (separate account).",
];

export default function HoldingsPage() {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#2D2F8F", fontWeight: 600, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Holdings</p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 800, color: "#1A1D21", lineHeight: 1.2, marginBottom: 16 }}>
            What I Own and Why
          </h1>
          <p style={{ fontSize: 15, color: "#5B6470", lineHeight: 1.7, maxWidth: 560 }}>
            These are the stocks I currently hold. I update this page as my positions change. Everything here is disclosed because I believe you should know what I own when I write about it.
          </p>
          <p style={{ fontSize: 13, color: "#8A929C", marginTop: 12, fontStyle: "italic" }}>
            This is not investment advice. I'm sharing what I hold — not telling you what to buy.
          </p>
        </div>

        {/* Current Holdings */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>Current Positions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {HOLDINGS.map(h => (
              <div key={h.ticker} style={{ display: "flex", alignItems: "flex-start", gap: 20, padding: "18px 0", borderBottom: "1px solid #F0F2F4" }}>
                <div style={{ minWidth: 64 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700, color: "#2D2F8F" }}>{h.ticker}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1D21", marginBottom: 4 }}>{h.name}</div>
                  <div style={{ fontSize: 13, color: "#5B6470", lineHeight: 1.5 }}>{h.note}</div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#8A929C", background: "#F7F8FA", padding: "2px 7px", borderRadius: 4 }}>{h.theme}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Watching */}
        {WATCHING.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Watching</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {WATCHING.map(t => (
                <span key={t} style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#5B6470", background: "#F7F8FA", border: "1px solid #EAECEF", padding: "4px 10px", borderRadius: 6 }}>{t}</span>
              ))}
            </div>
          </section>
        )}

        {/* Investment Philosophy */}
        <section style={{ borderTop: "1px solid #EAECEF", paddingTop: 40 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>How I Invest</h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none" }}>
            {PHILOSOPHY.map((p, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#2D2F8F", fontSize: 14, lineHeight: 1.6, flexShrink: 0 }}>—</span>
                <span style={{ fontSize: 14, color: "#5B6470", lineHeight: 1.6 }}>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Disclosure */}
        <div style={{ marginTop: 48, padding: "20px 24px", background: "#F7F8FA", borderRadius: 8, border: "1px solid #EAECEF" }}>
          <p style={{ fontSize: 12, color: "#8A929C", lineHeight: 1.6 }}>
            <strong style={{ color: "#5B6470" }}>Disclosure:</strong> I hold positions in the stocks listed above. This page is for transparency only — it is not investment advice or a recommendation to buy or sell any security. Holdings are updated periodically and may not reflect real-time positions.
          </p>
        </div>
      </div>
    </div>
  );
}
