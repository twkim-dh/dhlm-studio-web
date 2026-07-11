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

function getRecentReports(n = 4): ReportMeta[] {
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

function getRecentLearn(n = 3): LearnMeta[] {
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
  const reports = getRecentReports(4);
  const learns  = getRecentLearn(3);

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>

      {/* ── Hero — editorial oversized ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "96px 28px 80px" }}>
        <p style={{
          fontFamily: "var(--mono)", fontSize: 10, color: "#2D2F8F",
          fontWeight: 600, letterSpacing: 3, marginBottom: 40, textTransform: "uppercase"
        }}>
          DHLM Studio · Independent Research
        </p>
        <h1 style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(38px, 6vw, 60px)",
          fontWeight: 300,
          color: "#16161A",
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          marginBottom: 12,
          fontStyle: "italic",
        }}>
          I research the stocks<br />I invest in,<br />and share what I find.
        </h1>
        <p style={{
          fontFamily: "var(--serif)", fontSize: "clamp(13px, 2vw, 15px)",
          color: "#8A929C", marginBottom: 0, fontStyle: "normal",
          fontWeight: 300, letterSpacing: "0.01em"
        }}>
          투자하는 종목을 직접 조사하고, 그 과정을 공유합니다.
        </p>
        <p style={{
          fontFamily: "var(--sans)", fontSize: 15, color: "#5B6470",
          lineHeight: 1.75, maxWidth: 520, marginTop: 28
        }}>
          One individual investor&apos;s notes — not a research firm, not a newsletter.
          I hold real positions in the companies I write about, and I disclose that every time.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/holdings" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "11px 22px", background: "#16161A", color: "#FFFFFF",
            borderRadius: 2, fontSize: 13, fontWeight: 600,
            textDecoration: "none", letterSpacing: "0.03em",
            fontFamily: "var(--sans)"
          }}>
            My Holdings
          </Link>
          <Link href="/reports" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "11px 22px", background: "transparent", color: "#5B6470",
            border: "1px solid #E8E8E4", borderRadius: 2, fontSize: 13, fontWeight: 500,
            textDecoration: "none", fontFamily: "var(--sans)"
          }}>
            Research Notes
          </Link>
        </div>
      </section>

      <div style={{ borderTop: "1px solid #E8E8E4" }} />

      {/* ── Recent Analysis — editorial list ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
            color: "#8A929C", letterSpacing: 2.5, textTransform: "uppercase"
          }}>
            Recent Analysis
          </h2>
          <Link href="/reports" style={{
            fontSize: 12, color: "#2D2F8F", textDecoration: "none",
            fontFamily: "var(--sans)", letterSpacing: "0.02em"
          }}>
            All reports →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {reports.map((r, i) => (
            <Link key={r.slug} href={`/reports/${r.slug}`} style={{
              display: "grid",
              gridTemplateColumns: r.heroImage ? "72px 1fr" : "1fr",
              gap: 20, alignItems: "start",
              padding: "24px 0",
              borderBottom: i < reports.length - 1 ? "1px solid #F0F0EC" : "none",
              textDecoration: "none",
            }}>
              {r.heroImage && (
                <div style={{ width: 72, height: 48, overflow: "hidden", background: "#F0F0EC", flexShrink: 0 }}>
                  <Image src={r.heroImage} alt={r.title} width={144} height={96}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                {r.category && (
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700,
                    color: r.catColor || "#2D2F8F", letterSpacing: 2,
                    textTransform: "uppercase", marginBottom: 6
                  }}>
                    {r.category}
                  </div>
                )}
                <div style={{
                  fontFamily: "var(--serif)", fontSize: "clamp(15px, 2.5vw, 18px)",
                  fontWeight: 400, color: "#16161A", lineHeight: 1.35, marginBottom: 6,
                  letterSpacing: "-0.01em"
                }}>
                  {r.title}
                </div>
                {r.description && (
                  <div style={{
                    fontFamily: "var(--sans)", fontSize: 13, color: "#8A929C",
                    lineHeight: 1.55, overflow: "hidden", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                  }}>
                    {r.description}
                  </div>
                )}
                <div style={{
                  marginTop: 8, fontFamily: "var(--mono)", fontSize: 10,
                  color: "#B0B8C1", letterSpacing: 1
                }}>
                  {fmtDateShort(r.date)}
                  {r.readTime && <span style={{ marginLeft: 12 }}>{r.readTime}</span>}
                </div>
              </div>
            </Link>
          ))}
          {reports.length === 0 && (
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: "#8A929C", padding: "24px 0" }}>
              Loading recent reports…
            </div>
          )}
        </div>
      </section>

      <div style={{ borderTop: "1px solid #E8E8E4" }} />

      {/* ── Holdings — minimal grid ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
            color: "#8A929C", letterSpacing: 2.5, textTransform: "uppercase"
          }}>
            Current Holdings
          </h2>
          <Link href="/holdings" style={{
            fontSize: 12, color: "#2D2F8F", textDecoration: "none",
            fontFamily: "var(--sans)"
          }}>
            Full breakdown →
          </Link>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 1, border: "1px solid #E8E8E4"
        }}>
          {HOLDINGS.map(h => (
            <Link key={h.ticker} href="/holdings" style={{
              display: "flex", flexDirection: "column", gap: 3,
              padding: "16px 18px", background: "#FFFFFF",
              textDecoration: "none",
              borderRight: "1px solid #E8E8E4",
              borderBottom: "1px solid #E8E8E4",
            }}>
              <span style={{
                fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700,
                color: "#16161A", letterSpacing: "0.05em"
              }}>
                {h.ticker}
              </span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#5B6470" }}>{h.name}</span>
              <span style={{
                fontFamily: "var(--mono)", fontSize: 9, color: "#B0B8C1",
                letterSpacing: 1, marginTop: 2
              }}>
                {h.theme}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ borderTop: "1px solid #E8E8E4" }} />

      {/* ── Learn — editorial aside ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
            color: "#8A929C", letterSpacing: 2.5, textTransform: "uppercase"
          }}>
            Learn
          </h2>
          <Link href="/learn" style={{
            fontSize: 12, color: "#2D2F8F", textDecoration: "none", fontFamily: "var(--sans)"
          }}>
            All courses →
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {learns.map((l, i) => (
            <Link key={l.slug} href={`/learn/${l.slug}`} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "16px 0",
              borderBottom: i < learns.length - 1 ? "1px solid #F0F0EC" : "none",
              textDecoration: "none",
              gap: 16,
            }}>
              <div style={{ minWidth: 0 }}>
                {l.series && (
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 9, color: "#2D2F8F",
                    fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4
                  }}>
                    {l.series}
                  </div>
                )}
                <div style={{
                  fontFamily: "var(--serif)", fontSize: 16, fontWeight: 400,
                  color: "#16161A", lineHeight: 1.35, letterSpacing: "-0.01em"
                }}>
                  {l.title}
                </div>
              </div>
              {l.readingTime && (
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 10, color: "#B0B8C1",
                  flexShrink: 0, letterSpacing: 1
                }}>
                  {l.readingTime}
                </span>
              )}
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/learn/quantum-101" style={{
            fontFamily: "var(--sans)", fontSize: 13, color: "#2D2F8F",
            textDecoration: "none", padding: "9px 16px",
            border: "1px solid #2D2F8F", borderRadius: 2
          }}>
            Quantum 101 →
          </Link>
          <Link href="/learn/investing-101" style={{
            fontFamily: "var(--sans)", fontSize: 13, color: "#2D2F8F",
            textDecoration: "none", padding: "9px 16px",
            border: "1px solid #2D2F8F", borderRadius: 2
          }}>
            Investing 101 →
          </Link>
        </div>
      </section>

      <div style={{ borderTop: "1px solid #E8E8E4" }} />

      {/* ── Red Days — pull quote ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
            color: "#8A929C", letterSpacing: 2.5, textTransform: "uppercase"
          }}>
            Red Days
          </h2>
          <Link href="/red-days" style={{
            fontSize: 12, color: "#2D2F8F", textDecoration: "none", fontFamily: "var(--sans)"
          }}>
            All entries →
          </Link>
        </div>
        <div style={{ paddingLeft: 24, borderLeft: "2px solid #16161A" }}>
          <blockquote style={{
            fontFamily: "var(--serif)", fontSize: "clamp(18px, 3vw, 24px)",
            fontWeight: 300, fontStyle: "italic", color: "#16161A",
            lineHeight: 1.55, margin: 0, letterSpacing: "-0.01em"
          }}>
            &ldquo;The stock market is a device for transferring money from the impatient to the patient.&rdquo;
          </blockquote>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, color: "#8A929C",
            marginTop: 16, letterSpacing: 1
          }}>
            — Warren Buffett
          </div>
          <div style={{ marginTop: 20 }}>
            <Link href="/red-days" style={{
              fontFamily: "var(--sans)", fontSize: 13, color: "#5B6470",
              textDecoration: "none", borderBottom: "1px solid #E8E8E4",
              paddingBottom: 1
            }}>
              What I write to myself when the market drops →
            </Link>
          </div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid #E8E8E4" }} />

      {/* ── Q&A ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h2 style={{
            fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
            color: "#8A929C", letterSpacing: 2.5, textTransform: "uppercase"
          }}>
            Q&A
          </h2>
          <Link href="/qa" style={{
            fontSize: 12, color: "#2D2F8F", textDecoration: "none", fontFamily: "var(--sans)"
          }}>
            All questions →
          </Link>
        </div>
        <p style={{
          fontFamily: "var(--sans)", fontSize: 15, color: "#5B6470",
          lineHeight: 1.7, marginBottom: 24, maxWidth: 520
        }}>
          Researching a company and want to know how I think about it? Ask me —
          I answer publicly when I have something useful to say.
        </p>
        <Link href="/qa" style={{
          display: "inline-flex", alignItems: "center",
          padding: "11px 22px", background: "transparent", color: "#5B6470",
          border: "1px solid #E8E8E4", borderRadius: 2, fontSize: 13, fontWeight: 500,
          textDecoration: "none", fontFamily: "var(--sans)"
        }}>
          Ask a question →
        </Link>
      </section>

      {/* ── Footer strip ── */}
      <footer style={{ borderTop: "1px solid #E8E8E4", marginTop: 32 }}>
        <div style={{
          maxWidth: 760, margin: "0 auto", padding: "32px 28px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 16
        }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#B0B8C1", letterSpacing: 1 }}>
            DHLM STUDIO · ONE INVESTOR&apos;S NOTES
          </span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["About", "/about"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([l, h]) => (
              <Link key={l} href={h} style={{
                fontFamily: "var(--sans)", fontSize: 12, color: "#8A929C", textDecoration: "none"
              }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 28px 32px" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "#B0B8C1", lineHeight: 1.6 }}>
            All content is personal opinion and educational only. Not investment advice.
            I hold positions in the companies I write about — disclosed each time.
            Past performance does not guarantee future results.
          </p>
        </div>
      </footer>
    </div>
  );
}
