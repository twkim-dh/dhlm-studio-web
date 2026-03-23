"use client";
import { useState } from "react";

export default function RandomPicker() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  const pick = () => {
    const items = input.split("\n").map(s => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    setAnimating(true);
    setTimeout(() => {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setResults(shuffled.slice(0, Math.min(count, items.length)));
      setAnimating(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-40 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="항목을 한 줄에 하나씩 입력하세요&#10;예:&#10;김철수&#10;이영희&#10;박민수&#10;최지은"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">뽑을 수:</label>
        <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-20 p-2 border rounded-lg text-center" />
      </div>
      <button onClick={pick} disabled={animating} className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700 disabled:opacity-50">
        {animating ? "🎲 뽑는 중..." : "🎯 뽑기!"}
      </button>
      {results.length > 0 && !animating && (
        <div className="bg-blue-50 p-4 rounded-lg text-center space-y-2">
          <p className="text-sm text-gray-500">🎉 당첨!</p>
          {results.map((r, i) => (
            <p key={i} className="text-2xl font-bold text-blue-700">{r}</p>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">입력된 항목: {input.split("\n").filter(s => s.trim()).length}개</p>
    </div>
  );
}
