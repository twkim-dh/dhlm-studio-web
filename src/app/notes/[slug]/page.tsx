import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

function readNote(slug: string) {
  try {
    const p = path.join(process.cwd(), "src/content/notes", `${slug}.md`);
    if (!fs.existsSync(p)) return null;
    const content = fs.readFileSync(p, "utf8");
    const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) return null;
    const fm: Record<string, string> = {};
    m[1].split("\n").forEach(line => {
      const kv = line.match(/^(\w+):\s*"?([^"]+?)"?\s*$/);
      if (kv) fm[kv[1]] = kv[2].trim();
    });
    return { fm, body: m[2] };
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = readNote(slug);
  if (!note) return { title: "Note Not Found" };
  const { fm } = note;
  return {
    title: fm.title || slug,
    description: fm.summary_en || fm.summary_ko || "",
    alternates: { canonical: `https://dhlm-studio.com/notes/${slug}` },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = readNote(slug);
  if (!note) notFound();
  const { fm, body } = note;

  const isHolding = fm.type === "holding";

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Eyebrow */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#3B4A99", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
            {isHolding ? "Holding Note" : "Review Note"}{fm.ticker ? ` · ${fm.ticker}` : ""}
          </span>
          {fm.date && <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#B0B8C1", marginLeft: 16 }}>{fm.date}</span>}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 800, color: "#1A1D21", lineHeight: 1.25, marginBottom: fm.title_ko ? 12 : 32 }}>
          {fm.title}
        </h1>
        {fm.title_ko && (
          <div style={{ fontSize: 18, color: "#8A929C", marginBottom: 32, lineHeight: 1.4 }}>{fm.title_ko}</div>
        )}

        {/* Disclosure banner (if holding) */}
        {isHolding && fm.disclosure && (
          <div style={{ background: "#EEF1FF", border: "1px solid #C7D2FE", borderRadius: 8, padding: "14px 18px", marginBottom: 40, fontSize: 13, color: "#3B4A99", lineHeight: 1.5 }}>
            <strong>Disclosure:</strong> {fm.disclosure}
          </div>
        )}

        {/* Structure labels for holding notes */}
        {isHolding && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
            {[
              { label: "What happened", key: "event_summary" },
              { label: "Why it moved", key: "cause" },
              { label: "My take", key: "opinion" },
              { label: "My position", key: "position" },
            ].map(({ label, key }) => fm[key] ? (
              <div key={key} style={{ background: "#FBFBFC", border: "1px solid #EAECEF", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#8A929C", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#5B6470", lineHeight: 1.5 }}>{fm[key]}</div>
              </div>
            ) : null)}
          </div>
        )}

        {/* Structure labels for review notes */}
        {!isHolding && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {[
              { label: "Why I started looking", key: "why_looking" },
              { label: "Valuation read", key: "valuation" },
              { label: "My judgment", key: "judgment" },
            ].map(({ label, key }) => fm[key] ? (
              <div key={key} style={{ background: "#FBFBFC", border: "1px solid #EAECEF", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#8A929C", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#5B6470", lineHeight: 1.5 }}>{fm[key]}</div>
              </div>
            ) : null)}
          </div>
        )}

        {/* Full body */}
        <div style={{ fontSize: 15, color: "#5B6470", lineHeight: 1.8 }}>
          {body.split("\n\n").map((p, i) => (
            <p key={i} style={{ marginBottom: 20 }}>{p.replace(/^#+\s*/, "")}</p>
          ))}
        </div>

        {/* Bottom disclosure */}
        {fm.disclosure && (
          <div style={{ marginTop: 48, padding: "16px 20px", background: "#F7F8FA", borderRadius: 8, border: "1px solid #EAECEF" }}>
            <p style={{ fontSize: 12, color: "#8A929C", lineHeight: 1.6 }}>
              <strong style={{ color: "#5B6470" }}>Disclosure & Disclaimer:</strong> {fm.disclosure} This note is for educational purposes only and is not investment advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
