"use client";
import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const prettify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setError("");
      setOutput("✅ 유효한 JSON입니다.");
    } catch (e) {
      setError("❌ " + (e as Error).message);
      setOutput("");
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
        className="w-full h-48 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="JSON을 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-2 flex-wrap">
        <button onClick={prettify} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">정리하기</button>
        <button onClick={minify} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">압축하기</button>
        <button onClick={validate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">검증하기</button>
      </div>
      {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
      {output && (
        <div className="relative">
          <textarea
            className="w-full h-48 p-3 border rounded-lg font-mono text-sm resize-none bg-gray-50"
            value={output}
            readOnly
          />
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      )}
    </div>
  );
}
