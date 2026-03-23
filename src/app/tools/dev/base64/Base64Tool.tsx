"use client";
import { useState } from "react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setOutput("인코딩 오류");
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
    } catch {
      setOutput("디코딩 오류 - 유효한 Base64 문자열을 입력하세요");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-36 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="텍스트 또는 Base64를 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={encode} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">인코딩 →</button>
        <button onClick={decode} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">← 디코딩</button>
      </div>
      {output && (
        <div className="relative">
          <textarea className="w-full h-36 p-3 border rounded-lg font-mono text-sm resize-none bg-gray-50" value={output} readOnly />
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      )}
    </div>
  );
}
