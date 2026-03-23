"use client";
import { useState } from "react";

function summarize(text: string): string {
  const sentences = text.split(/[.!?。]\s*/g).filter(s => s.trim().length > 5);
  if (sentences.length === 0) return "요약할 내용이 없습니다.";
  if (sentences.length <= 2) return sentences.join(". ") + ".";

  // Simple extractive: pick first sentence + longest middle sentence + last
  const first = sentences[0];
  const last = sentences[sentences.length - 1];
  const middle = sentences.slice(1, -1).sort((a, b) => b.length - a.length)[0];

  const charCount = text.length;
  const wordCount = text.split(/\s+/).length;

  return `📝 요약 (${charCount}자 → ${first.length + (middle?.length || 0) + last.length}자)\n\n` +
    `${first}.\n${middle ? middle + ".\n" : ""}${last}.`;
}

function getStats(text: string) {
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?。]\s*/g).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\n+/).filter(Boolean).length;
  return { chars, charsNoSpace, words, sentences, paragraphs };
}

export default function TextSummaryComponent() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = getStats(input);

  const handleSummarize = () => setResult(summarize(input));

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-48 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="요약할 텍스트를 붙여넣으세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span>글자: {stats.chars}자</span>
        <span>공백 제외: {stats.charsNoSpace}자</span>
        <span>단어: {stats.words}개</span>
        <span>문장: {stats.sentences}개</span>
      </div>
      <button onClick={handleSummarize} disabled={input.trim().length < 10} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40">요약하기</button>
      {result && (
        <div className="relative">
          <div className="p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap">{result}</div>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
    </div>
  );
}
