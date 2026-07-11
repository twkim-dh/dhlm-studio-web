import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Q&A — Ask Me About a Stock",
  description: "Send me a question about a company you're researching. If it's a good one, I'll answer it publicly here.",
  alternates: { canonical: "https://dhlm-studio.com/qa" },
};

const ANSWERED: { q: string; a: string; ticker?: string; date: string }[] = [];

export default function QAPage() {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#2D2F8F", fontWeight: 600, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Q&A</p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 800, color: "#1A1D21", lineHeight: 1.2, marginBottom: 16 }}>
            Ask Me About a Stock
          </h1>
          <p style={{ fontSize: 15, color: "#5B6470", lineHeight: 1.7 }}>
            If you&apos;re researching a company and want to know how I think about it — send me a question. I answer publicly here when I have something useful to say. I won&apos;t answer every question, but I read all of them.
          </p>
          <p style={{ fontSize: 13, color: "#8A929C", marginTop: 12, fontStyle: "italic" }}>
            I respond based on what I actually know and have researched. I won&apos;t speculate on price targets.
          </p>
        </div>

        {/* Submit form */}
        <div style={{ background: "#F7F8FA", border: "1px solid #EAECEF", borderRadius: 12, padding: "28px 28px", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600, color: "#1A1D21", marginBottom: 20 }}>Send a Question</h2>
          <form action={`mailto:dhlmstudio2026@gmail.com`} method="get" encType="text/plain" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#5B6470", marginBottom: 6, letterSpacing: 0.5 }}>TICKER (optional)</label>
              <input name="ticker" placeholder="e.g. MU, IONQ" style={{ width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid #EAECEF", borderRadius: 8, background: "#FFFFFF", color: "#1A1D21", fontFamily: "var(--mono)" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#5B6470", marginBottom: 6, letterSpacing: 0.5 }}>YOUR QUESTION</label>
              <textarea name="body" rows={4} placeholder="What's your question about this company?" style={{ width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid #EAECEF", borderRadius: 8, background: "#FFFFFF", color: "#1A1D21", resize: "vertical", fontFamily: "var(--sans)" }} />
            </div>
            <button type="submit" style={{ alignSelf: "flex-start", padding: "10px 24px", fontSize: 14, fontWeight: 600, color: "#FFFFFF", background: "#2D2F8F", border: "none", borderRadius: 8, cursor: "pointer" }}>
              Send via Email
            </button>
          </form>
        </div>

        {/* Answered questions */}
        <section>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>Answered Questions</h2>
          {ANSWERED.length === 0 ? (
            <div style={{ fontSize: 14, color: "#8A929C", padding: "24px 0" }}>
              No answered questions yet. Send the first one.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {ANSWERED.map((item, i) => (
                <div key={i} style={{ borderTop: "1px solid #F0F2F4", paddingTop: 28 }}>
                  <div style={{ fontSize: 12, color: "#8A929C", fontFamily: "var(--mono)", marginBottom: 8 }}>{item.date}{item.ticker ? ` · ${item.ticker}` : ""}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1D21", marginBottom: 12 }}>Q: {item.q}</div>
                  <div style={{ fontSize: 14, color: "#5B6470", lineHeight: 1.7 }}>A: {item.a}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
