"use client";
import { useState, useMemo } from "react";

const PRESETS = [
  { label: "이메일", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { label: "전화번호", pattern: "01[0-9]-?\\d{3,4}-?\\d{4}" },
  { label: "URL", pattern: "https?://[\\w.-]+(?:/[\\w./?%&=-]*)?" },
  { label: "한글만", pattern: "[가-힣]+" },
  { label: "숫자만", pattern: "\\d+" },
  { label: "IP주소", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" },
];

export default function RegexTesterComponent() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");
  const [error, setError] = useState("");

  const matches = useMemo(() => {
    if (!pattern || !testText) return [];
    try {
      const regex = new RegExp(pattern, flags);
      const result: { match: string; index: number }[] = [];
      let m;
      if (flags.includes("g")) {
        while ((m = regex.exec(testText)) !== null) {
          result.push({ match: m[0], index: m.index });
          if (!m[0]) break;
        }
      } else {
        m = regex.exec(testText);
        if (m) result.push({ match: m[0], index: m.index });
      }
      setError("");
      return result;
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, flags, testText]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => setPattern(p.pattern)} className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-blue-100">{p.label}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 p-3 border rounded-lg font-mono text-sm" placeholder="정규식 패턴" value={pattern} onChange={(e) => setPattern(e.target.value)} />
        <input className="w-16 p-3 border rounded-lg font-mono text-sm text-center" placeholder="gi" value={flags} onChange={(e) => setFlags(e.target.value)} />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <textarea className="w-full h-32 p-3 border rounded-lg text-sm resize-none" placeholder="테스트할 텍스트를 입력하세요..." value={testText} onChange={(e) => setTestText(e.target.value)} />
      {matches.length > 0 && (
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm font-semibold text-green-700 mb-2">{matches.length}개 매칭</p>
          <div className="space-y-1">
            {matches.slice(0, 20).map((m, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-mono bg-yellow-100 px-1 rounded">{m.match}</span>
                <span className="text-gray-400">index: {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {pattern && testText && matches.length === 0 && !error && (
        <p className="text-gray-400 text-sm">매칭 결과 없음</p>
      )}
    </div>
  );
}
