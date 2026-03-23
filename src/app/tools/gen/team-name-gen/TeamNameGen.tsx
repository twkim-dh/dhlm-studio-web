"use client";
import { useState } from "react";

const ANIMALS = ["호랑이","독수리","상어","늑대","사자","용","불사조","표범","매","곰"];
const COLORS = ["레드","블루","골든","블랙","화이트","실버","그린","퍼플","스카이","크림슨"];
const ACTION = ["파이터즈","워리어즈","히어로즈","스톰","유나이티드","올스타","드래곤즈","챔피언스","레전드","스트라이커즈"];
const KR_STYLE = ["번개","폭풍","불꽃","얼음","바람","천둥","별빛","무적","최강","전설의"];

export default function TeamNameGen() {
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  const generate = () => {
    const names: string[] = [];
    for (let i = 0; i < 5; i++) {
      names.push(COLORS[Math.floor(Math.random()*COLORS.length)] + " " + ANIMALS[Math.floor(Math.random()*ANIMALS.length)]);
    }
    for (let i = 0; i < 3; i++) {
      names.push(KR_STYLE[Math.floor(Math.random()*KR_STYLE.length)] + " " + ANIMALS[Math.floor(Math.random()*ANIMALS.length)]);
    }
    for (let i = 0; i < 2; i++) {
      names.push("Team " + ANIMALS[Math.floor(Math.random()*ANIMALS.length)] + " " + ACTION[Math.floor(Math.random()*ACTION.length)]);
    }
    setResults(names.sort(() => Math.random() - 0.5));
  };

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <div className="space-y-4">
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">10개 생성</button>
      {results.length > 0 && (
        <div className="grid gap-2">
          {results.map((n, i) => (
            <div key={i} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
              <span className="font-medium">{n}</span>
              <button onClick={() => copy(n, i)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied===i?"복사됨!":"복사"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
