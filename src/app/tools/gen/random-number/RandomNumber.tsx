"use client";
import { useState } from "react";

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    if (unique && count > max - min + 1) { alert("범위보다 많은 고유 숫자를 생성할 수 없습니다"); return; }
    const nums: number[] = [];
    if (unique) {
      const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      nums.push(...pool.slice(0, count).sort((a, b) => a - b));
    } else {
      for (let i = 0; i < count; i++) nums.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    setResults(nums);
  };

  const lotto = () => { setMin(1); setMax(45); setCount(6); setUnique(true); setTimeout(() => {
    const pool = Array.from({ length: 45 }, (_, i) => i + 1);
    for (let i = 44; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    setResults(pool.slice(0, 6).sort((a, b) => a - b));
  }, 0); };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={lotto} className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-bold">🎱 로또 번호</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs text-gray-500">최소</label><input type="number" value={min} onChange={e=>setMin(+e.target.value)} className="w-full p-2 border rounded-lg"/></div>
        <div><label className="text-xs text-gray-500">최대</label><input type="number" value={max} onChange={e=>setMax(+e.target.value)} className="w-full p-2 border rounded-lg"/></div>
        <div><label className="text-xs text-gray-500">개수</label><input type="number" min={1} max={100} value={count} onChange={e=>setCount(+e.target.value)} className="w-full p-2 border rounded-lg"/></div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={unique} onChange={e=>setUnique(e.target.checked)} /> 중복 없이</label>
      <button onClick={generate} className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700">🎲 생성!</button>
      {results.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center py-4">
          {results.map((n, i) => (
            <span key={i} className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold">{n}</span>
          ))}
        </div>
      )}
    </div>
  );
}
