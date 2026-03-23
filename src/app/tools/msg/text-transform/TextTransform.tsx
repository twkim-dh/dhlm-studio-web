"use client";
import { useState } from "react";

export default function TextTransform() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const transforms = [
    { label: "대문자", fn: (s: string) => s.toUpperCase() },
    { label: "소문자", fn: (s: string) => s.toLowerCase() },
    { label: "제목형", fn: (s: string) => s.replace(/\b\w/g, c => c.toUpperCase()) },
    { label: "문장형", fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
    { label: "뒤집기", fn: (s: string) => s.split("").reverse().join("") },
    { label: "공백 제거", fn: (s: string) => s.replace(/\s+/g, "") },
    { label: "중복 공백 제거", fn: (s: string) => s.replace(/\s+/g, " ").trim() },
    { label: "줄바꿈 제거", fn: (s: string) => s.replace(/\n+/g, " ").trim() },
    { label: "각 줄 정렬(오름)", fn: (s: string) => s.split("\n").sort().join("\n") },
    { label: "중복 줄 제거", fn: (s: string) => [...new Set(s.split("\n"))].join("\n") },
  ];

  const apply = (fn: (s: string) => string) => setOutput(fn(input));
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <textarea className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="변환할 텍스트를 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {transforms.map(t => (
          <button key={t.label} onClick={() => apply(t.fn)} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-700">{t.label}</button>
        ))}
      </div>
      {output && (
        <div className="relative">
          <textarea className="w-full h-32 p-3 border rounded-lg bg-gray-50 resize-none" value={output} readOnly />
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
    </div>
  );
}
