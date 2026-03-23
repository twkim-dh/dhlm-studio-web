"use client";
import { useState } from "react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => { try { setOutput(encodeURIComponent(input)); } catch { setOutput("인코딩 오류"); } };
  const decode = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput("디코딩 오류"); } };
  const encodeFull = () => { try { setOutput(encodeURI(input)); } catch { setOutput("인코딩 오류"); } };
  const decodeFull = () => { try { setOutput(decodeURI(input)); } catch { setOutput("디코딩 오류"); } };

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <textarea className="w-full h-28 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="URL 또는 텍스트를 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button onClick={encode} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">컴포넌트 인코딩</button>
        <button onClick={decode} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">컴포넌트 디코딩</button>
        <button onClick={encodeFull} className="px-4 py-2 bg-blue-400 text-white rounded-lg text-sm">전체 URL 인코딩</button>
        <button onClick={decodeFull} className="px-4 py-2 bg-green-400 text-white rounded-lg text-sm">전체 URL 디코딩</button>
      </div>
      {output && (
        <div className="relative">
          <textarea className="w-full h-28 p-3 border rounded-lg font-mono text-sm bg-gray-50 resize-none" value={output} readOnly />
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
    </div>
  );
}
