import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Days — Notes from Market Turbulence",
  description: "What I write to myself on the difficult days. Market crashes, drawdowns, and the thinking behind staying calm.",
  alternates: { canonical: "https://dhlm-studio.com/red-days" },
};

const ENTRIES: { date: string; title: string; quote: string; body_en: string; body_ko: string }[] = [];

export default function RedDaysPage() {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#2D2F8F", fontWeight: 600, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Red Days</p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 800, color: "#1A1D21", lineHeight: 1.2, marginBottom: 16 }}>
            Notes from Market Turbulence
          </h1>
          <p style={{ fontSize: 15, color: "#5B6470", lineHeight: 1.7 }}>
            These are the notes I write to myself on difficult days — when the market drops 5%, when a position is down 30%, when everyone is selling. I share them because I think the mental game is the part most investors don't talk about honestly.
          </p>
        </div>

        {/* Entries */}
        {ENTRIES.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8A929C" }}>
            <div style={{ fontFamily: "var(--font-voice)", fontSize: 22, color: "#B0B8C1", marginBottom: 16, fontStyle: "italic", lineHeight: 1.6 }}>
              "The stock market is a device for transferring money from the impatient to the patient."
            </div>
            <div style={{ fontSize: 12, color: "#B0B8C1" }}>— Warren Buffett</div>
            <div style={{ marginTop: 40, fontSize: 14, color: "#8A929C" }}>First entries coming soon.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {ENTRIES.map((e, i) => (
              <article key={i} style={{ borderTop: i > 0 ? "1px solid #EAECEF" : "none", paddingTop: i > 0 ? 48 : 0 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8A929C", marginBottom: 12 }}>{e.date}</div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "#1A1D21", lineHeight: 1.3, marginBottom: 20 }}>{e.title}</h2>
                {e.quote && (
                  <blockquote style={{ fontFamily: "var(--font-voice)", fontSize: 18, color: "#5B6470", fontStyle: "italic", lineHeight: 1.7, borderLeft: "3px solid #2D2F8F", paddingLeft: 20, margin: "0 0 24px" }}>
                    {e.quote}
                  </blockquote>
                )}
                <p style={{ fontSize: 15, color: "#5B6470", lineHeight: 1.8 }}>{e.body_en}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
