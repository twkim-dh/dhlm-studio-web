"use client";
import { useState } from "react";

export type Lang = "en" | "ko";

export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid #EAECEF", borderRadius: 6, overflow: "hidden", fontSize: 12, fontFamily: "var(--mono)", fontWeight: 600 }}>
      {(["en", "ko"] as Lang[]).map(l => (
        <button
          key={l}
          onClick={() => onChange(l)}
          style={{
            padding: "5px 12px",
            background: lang === l ? "#3B4A99" : "#FFFFFF",
            color: lang === l ? "#FFFFFF" : "#8A929C",
            border: "none",
            cursor: "pointer",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            transition: "all 0.15s",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function useLang(defaultLang: Lang = "en") {
  const [lang, setLang] = useState<Lang>(defaultLang);
  return { lang, setLang };
}

export function T({ en, ko, lang }: { en: string; ko: string; lang: Lang }) {
  return <>{lang === "ko" ? ko : en}</>;
}
