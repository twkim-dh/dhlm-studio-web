import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Notes — Stock Research Notes",
  description: "My research notes on the companies I hold and the ones I'm considering. 1인칭 분석 + 실제 포지션 공개.",
  alternates: { canonical: "https://dhlm-studio.com/notes" },
};

type NoteMeta = {
  slug: string;
  title: string;
  title_ko?: string;
  ticker?: string;
  type: "holding" | "review";
  date: string;
  summary_en?: string;
  summary_ko?: string;
};

function getNotes(): NoteMeta[] {
  try {
    const dir = path.join(process.cwd(), "src/content/notes");
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => {
      const content = fs.readFileSync(path.join(dir, f), "utf8");
      const m = content.match(/^---\n([\s\S]*?)\n---/);
      if (!m) return null;
      const fm: Record<string, string> = {};
      m[1].split("\n").forEach(line => {
        const kv = line.match(/^(\w+):\s*"?([^"]+)"?$/);
        if (kv) fm[kv[1]] = kv[2].trim();
      });
      return {
        slug: f.replace(".md", ""),
        title: fm.title || f,
        title_ko: fm.title_ko,
        ticker: fm.ticker,
        type: (fm.type as "holding" | "review") || "review",
        date: fm.date || "",
        summary_en: fm.summary_en,
        summary_ko: fm.summary_ko,
      };
    }).filter(Boolean).sort((a, b) => (b!.date > a!.date ? 1 : -1)) as NoteMeta[];
  } catch { return []; }
}

export default function NotesPage() {
  const notes = getNotes();
  const holdings = notes.filter(n => n.type === "holding");
  const reviews  = notes.filter(n => n.type === "review");

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#2D2F8F", fontWeight: 600, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Notes</p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 800, color: "#1A1D21", lineHeight: 1.2, marginBottom: 16 }}>
            Stock Research Notes
          </h1>
          <p style={{ fontSize: 15, color: "#5B6470", lineHeight: 1.7 }}>
            Notes on the companies I hold and the ones I'm researching. Two types: <strong>holding notes</strong> (what happened + my reaction) and <strong>review notes</strong> (why I started looking + my valuation read).
          </p>
        </div>

        {/* Holding Notes */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>
            Holding Notes
          </h2>
          {holdings.length === 0 ? (
            <div style={{ padding: "32px 0", fontSize: 14, color: "#8A929C" }}>
              First holding notes coming soon. These will cover what happened + my reaction to each event.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {holdings.map(n => <NoteRow key={n.slug} note={n} />)}
            </div>
          )}
        </section>

        {/* Review Notes */}
        <section>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "#8A929C", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>
            Review Notes
          </h2>
          {reviews.length === 0 ? (
            <div style={{ padding: "32px 0", fontSize: 14, color: "#8A929C" }}>
              First review notes coming soon. These will cover why I started researching a company + my valuation read.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {reviews.map(n => <NoteRow key={n.slug} note={n} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function NoteRow({ note }: { note: NoteMeta }) {
  return (
    <Link href={`/notes/${note.slug}`} style={{ display: "flex", alignItems: "flex-start", gap: 20, padding: "18px 0", borderBottom: "1px solid #F0F2F4", textDecoration: "none" }}>
      {note.ticker && (
        <div style={{ minWidth: 56, paddingTop: 2 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: "#2D2F8F" }}>{note.ticker}</span>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1D21", marginBottom: 4, lineHeight: 1.4 }}>
          {note.title}
        </div>
        {note.title_ko && (
          <div style={{ fontSize: 13, color: "#8A929C", marginBottom: 6 }}>{note.title_ko}</div>
        )}
        {note.summary_en && (
          <div style={{ fontSize: 13, color: "#5B6470", lineHeight: 1.5 }}>{note.summary_en}</div>
        )}
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#B0B8C1", flexShrink: 0, paddingTop: 3 }}>{note.date}</div>
    </Link>
  );
}
