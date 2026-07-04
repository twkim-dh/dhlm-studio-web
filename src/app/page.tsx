import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import path from "path";
import fs from "fs";
import { fmtDateShort } from "@/lib/fmt-date";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "DHLM Studio — One Investor's Notes",
  description: "I research the stocks I invest in, and share what I find. Notes on AI, semiconductors, quantum computing, and the companies I hold.",
  alternates: { canonical: "https://dhlm-studio.com" },
};

function todayKST() {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

type ReportMeta = {
  slug: string; title: string; date: string; readTime: string;
  heroImage?: string; category?: string; catColor?: string;
  description?: string; ticker?: string; tickers?: string[];
};

type LearnMeta = {
  slug: string; title: string; series?: string; week?: number;
  publishDate?: string; readingTime?: string;
};

function getRecentReports(n = 3): ReportMeta[] {
  try {
    const dir = path.join(process.cwd(), "src/content/reports");
    const today = todayKST();
    return fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => {
      const content = fs.readFileSync(path.join(dir, f), "utf8");
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) return null;
      const fm: Record<string, unknown> = {};
      fmMatch[1].split("\n").forEach(line => {
        const m = line.match(/^(\w+):\s*(.+)$/);
        if (!m) return;
        let raw = m[2].trim();
        if (raw.startsWith("[") || raw.startsWith("{")) { try { fm[m[1]] = JSON.parse(raw); return; } catch { /* fall through */ } }
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1);
        fm[m[1]] = raw !== "" && !isNaN(Number(raw)) ? Number(raw) : raw;
      });
      const pubDate = String(fm["publishDate"] || fm["date"] || "").slice(0, 10);
      if (pubDate > today) return null;
      return fm as unknown as ReportMeta;
    }).filter(Boolean).sort((a, b) => (b!.date > a!.date ? 1 : -1)).slice(0, n) as ReportMeta[];
  } catch { return []; }
}

function getRecentLearn(n = 4): LearnMeta[] {
  try {
    const dir = path.join(process.cwd(), "src/content/learn");
    const today = todayKST();
    return fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => {
      const content = fs.readFileSync(path.join(dir, f), "utf8");
      const m = content.match(/^---\n([\s\S]*?)\n---/);
      if (!m) return null;
      const fm: Record<string, string> = {};
      m[1].split("\n").forEach(line => {
        const kv = line.match(/^(\w+):\s*"?([^"\n]+?)"?\s*$/);
        if (kv) fm[kv[1]] = kv[2].trim();
      });
      const pub = (fm.publishDate || "").slice(0, 10);
      if (pub && pub > today) return null;
      return { slug: f.replace(".md", ""), title: fm.title || "", series: fm.series, week: Number(fm.week) || undefined, publishDate: fm.publishDate, readingTime: fm.readingTime };
    }).filter(Boolean).sort((a, b) => ((b!.publishDate || "") > (a!.publishDate || "") ? 1 : -1)).slice(0, n) as LearnMeta[];
  } catch { return []; }
}

const HOLDINGS = [
  { ticker: "MU",     name: "Micron",     theme: "Memory / AI" },
  { ticker: "IONQ",   name: "IonQ",       theme: "Quantum" },
  { ticker: "TSLA",   name: "Tesla",      theme: "Physical AI" },
  { ticker: "NVDA",   name: "NVIDIA",     theme: "AI Infra" },
  { ticker: "MSFT",   name: "Microsoft",  theme: "AI Platform" },
  { ticker: "AMZN",   name: "Amazon",     theme: "Cloud / AI" },
  { ticker: "INOD",   name: "Innodata",   theme: "AI Data" },
  { ticker: "SpaceX", name: "SpaceX",     theme: "Space" },
];

export default function HomePage() {
  const reports = getRecentReports(3);
  const learns  = getRecentLearn(4);

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 64px" }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#3B4A99", fontWeight: 600, letterSpacing: 2.5, marginBottom: 24, textTransform: "uppercase" }}>DHLM Studio</p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, color: "#1A1D21", lineHeight: 1.2, marginBottom: 8 }}>
          I research the stocks I invest in,<br />and share what I find.
        </h1>
        <p style={{ fontSize: 16, color: "#8A929C", marginBottom: 6, fontStyle: "italic" }}>
          투자하는 종목을 직접 조사하고, 그 과정을 공유합니다.
        </p>
        <p style={{ fontSize: 15, color: "#5B6470", lineHeight: 1.7, maxWidth: 560, marginTop: 20 }}>
          This is one individual investor&apos;s notes — not a research firm, not a newsletter. I hold real positions in the companies I write about, and I disclose that every time.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <Link href="/holdings" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#3B4A99", color: "#FFFFFF", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            My Holdings →
          </Link>
          <Link href="/notes" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#F7F8FA", color: "#5B6470", border: "1px solid #EAECEF", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Research Notes
          </Link>
        </div>
      </section>

      <div style={{ borderTop: "1px solid #EAECEF" }} />

      {/* ── Holdings snapshot ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase" }}>Current Holdings</h2>
          <Link href="/holdings" style={{ fontSize: 12, color: "#3B4A99", textDecoration: "none" }}>Full breakdown →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
          {HOLDINGS.map(h => (
            <Link key={h.ticker} href="/holdings" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "14px 16px", background: "#FBFBFC", border: "1px solid #EAECEF", borderRadius: 8, textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: "#3B4A99" }}>{h.ticker}</span>
              <span style={{ fontSize: 12, color: "#1A1D21", fontWeight: 400 }}>{h.name}</span>
              <span style={{ fontSize: 10, color: "#8A929C", fontFamily: "var(--mono)" }}>{h.theme}</span>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ borderTop: "1px solid #EAECEF" }} />

      {/* ── Recent Notes / Reports ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase" }}>Recent Analysis</h2>
          <Link href="/reports" style={{ fontSize: 12, color: "#3B4A99", textDecoration: "none" }}>All reports →</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {reports.map((r, i) => (
            <Link key={r.slug} href={`/reports/${r.slug}`} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "20px 0", borderBottom: "1px solid #F0F2F4", textDecoration: "none" }}>
              {r.heroImage && (
                <div style={{ flexShrink: 0, width: 80, height: 45, overflow: "hidden", borderRadius: 6, background: "#F0F2F4" }}>
                  <Image src={r.heroImage} alt={r.title} width={160} height={90} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1D21", lineHeight: 1.4, marginBottom: 4 }}>{r.title}</div>
                {r.description && (
                  <div style={{ fontSize: 12, color: "#8A929C", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.description}</div>
                )}
                <div style={{ marginTop: 6, fontSize: 11, color: "#B0B8C1", fontFamily: "var(--mono)" }}>{fmtDateShort(r.date)}</div>
              </div>
            </Link>
          ))}
          {reports.length === 0 && (
            <div style={{ fontSize: 14, color: "#8A929C", padding: "24px 0" }}>Loading recent reports…</div>
          )}
        </div>
      </section>

      <div style={{ borderTop: "1px solid #EAECEF" }} />

      {/* ── Learn ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase" }}>Learn</h2>
          <Link href="/learn" style={{ fontSize: 12, color: "#3B4A99", textDecoration: "none" }}>All courses →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {learns.map(l => (
            <Link key={l.slug} href={`/learn/${l.slug}`} style={{ padding: "16px 18px", background: "#FBFBFC", border: "1px solid #EAECEF", borderRadius: 8, textDecoration: "none" }}>
              {l.series && <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#3B4A99", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{l.series}</div>}
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1D21", lineHeight: 1.4 }}>{l.title}</div>
              {l.readingTime && <div style={{ fontSize: 11, color: "#8A929C", marginTop: 8, fontFamily: "var(--mono)" }}>{l.readingTime}</div>}
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/learn/quantum-101" style={{ fontSize: 13, color: "#3B4A99", textDecoration: "none", padding: "8px 14px", background: "#EEF1FF", borderRadius: 6 }}>Quantum 101 →</Link>
          <Link href="/learn/investing-101" style={{ fontSize: 13, color: "#3B4A99", textDecoration: "none", padding: "8px 14px", background: "#EEF1FF", borderRadius: 6 }}>Investing 101 →</Link>
        </div>
      </section>

      <div style={{ borderTop: "1px solid #EAECEF" }} />

      {/* ── Red Days teaser ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase" }}>Red Days</h2>
          <Link href="/red-days" style={{ fontSize: 12, color: "#3B4A99", textDecoration: "none" }}>All entries →</Link>
        </div>
        <div style={{ background: "#FBFBFC", border: "1px solid #EAECEF", borderRadius: 10, padding: "28px 28px" }}>
          <blockquote style={{ fontFamily: "var(--font-voice)", fontSize: 18, color: "#5B6470", fontStyle: "italic", lineHeight: 1.7, borderLeft: "3px solid #3B4A99", paddingLeft: 20, margin: 0 }}>
            &ldquo;The stock market is a device for transferring money from the impatient to the patient.&rdquo;
          </blockquote>
          <div style={{ fontSize: 12, color: "#8A929C", marginTop: 12, paddingLeft: 23 }}>— Warren Buffett</div>
          <div style={{ marginTop: 20 }}>
            <Link href="/red-days" style={{ fontSize: 13, color: "#3B4A99", textDecoration: "none" }}>What I write to myself when the market drops →</Link>
          </div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid #EAECEF" }} />

      {/* ── Q&A teaser ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase" }}>Q&A</h2>
          <Link href="/qa" style={{ fontSize: 12, color: "#3B4A99", textDecoration: "none" }}>All questions →</Link>
        </div>
        <p style={{ fontSize: 14, color: "#5B6470", lineHeight: 1.7, marginBottom: 20 }}>
          Researching a company and want to know how I think about it? Ask me — I answer publicly when I have something useful to say.
        </p>
        <Link href="/qa" style={{ display: "inline-flex", alignItems: "center", padding: "10px 20px", background: "#F7F8FA", color: "#5B6470", border: "1px solid #EAECEF", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Ask a question →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #EAECEF", marginTop: 24 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#B0B8C1" }}>DHLM Studio · one investor&apos;s notes</span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["About", "/about"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 12, color: "#8A929C", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 32px" }}>
          <p style={{ fontSize: 11, color: "#B0B8C1", lineHeight: 1.6 }}>
            All content is personal opinion and educational only. Not investment advice. I hold positions in the companies I write about — disclosed each time. Past performance does not guarantee future results.
          </p>
        </div>
      </footer>
    </div>
  );
}
