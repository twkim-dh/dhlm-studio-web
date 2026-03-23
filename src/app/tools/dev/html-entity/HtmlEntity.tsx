"use client";
import { useState } from "react";

function encodeHtml(str: string): string {
  return str.replace(/[&<>"'\/]/g, (c) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;" };
    return map[c] || c;
  });
}

function decodeHtml(str: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
}

const COMMON = [
  { char: "&", entity: "&amp;" }, { char: "<", entity: "&lt;" }, { char: ">", entity: "&gt;" },
  { char: '"', entity: "&quot;" }, { char: "'", entity: "&#39;" }, { char: "©", entity: "&copy;" },
  { char: "®", entity: "&reg;" }, { char: "™", entity: "&trade;" }, { char: "€", entity: "&euro;" },
  { char: "£", entity: "&pound;" }, { char: "¥", entity: "&yen;" }, { char: "°", entity: "&deg;" },
  { char: "±", entity: "&plusmn;" }, { char: "×", entity: "&times;" }, { char: "÷", entity: "&divide;" },
  { char: "→", entity: "&rarr;" }, { char: "←", entity: "&larr;" }, { char: "↑", entity: "&uarr;" },
  { char: "↓", entity: "&darr;" }, { char: "♥", entity: "&hearts;" },
];

export default function HtmlEntityComponent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => setOutput(encodeHtml(input));
  const decode = () => setOutput(decodeHtml(input));
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <textarea className="w-full h-28 p-3 border rounded-lg font-mono text-sm resize-none" placeholder="HTML 또는 텍스트 입력..." value={input} onChange={e => setInput(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={encode} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">인코딩 (→ 엔티티)</button>
        <button onClick={decode} className="flex-1 py-2 bg-green-600 text-white rounded-lg">디코딩 (→ 문자)</button>
      </div>
      {output && (
        <div className="relative">
          <textarea className="w-full h-28 p-3 border rounded-lg font-mono text-sm bg-gray-50 resize-none" value={output} readOnly />
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
      <details className="text-xs text-gray-400">
        <summary className="cursor-pointer">자주 쓰는 HTML 엔티티</summary>
        <div className="grid grid-cols-4 gap-1 mt-2 font-mono">
          {COMMON.map(e => <span key={e.char} className="bg-gray-50 p-1 rounded text-center">{e.char} = {e.entity}</span>)}
        </div>
      </details>
    </div>
  );
}
