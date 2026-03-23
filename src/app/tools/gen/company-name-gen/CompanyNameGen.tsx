"use client";
import { useState } from "react";

const PREFIXES = ["Neo","Pro","Meta","Hyper","Ultra","Mono","Poly","Nova","Zen","Flux","Vibe","Core","Edge","Peak","Rise","Flow","Glow","Sync","Loop","Hive"];
const SUFFIXES = ["Lab","Hub","Works","Studio","Craft","Point","Base","Sphere","Bridge","Gate","Wave","Link","Space","Nest","Box","Mint","Bloom","Pine","Stone","Bay"];
const KR_PREFIX = ["빛","새","한","참","큰","밝은","푸른","맑은","든든","바른","슬기","아름","하늘","별","꿈","다솜","나래","온","가온","미르"];
const KR_SUFFIX = ["솔루션","테크","랩","스튜디오","컴퍼니","그룹","파트너스","플러스","허브","팩토리"];

export default function CompanyNameGen() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  const generate = () => {
    const names: string[] = [];
    const kw = keyword.trim() || "Tech";
    for (let i = 0; i < 5; i++) {
      names.push(PREFIXES[Math.floor(Math.random()*PREFIXES.length)] + kw.charAt(0).toUpperCase() + kw.slice(1).toLowerCase());
      names.push(kw.charAt(0).toUpperCase() + kw.slice(1).toLowerCase() + SUFFIXES[Math.floor(Math.random()*SUFFIXES.length)]);
    }
    for (let i = 0; i < 4; i++) {
      names.push(KR_PREFIX[Math.floor(Math.random()*KR_PREFIX.length)] + KR_SUFFIX[Math.floor(Math.random()*KR_SUFFIX.length)]);
    }
    setResults(names.sort(() => Math.random() - 0.5).slice(0, 10));
  };

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <div className="space-y-4">
      <input className="w-full p-3 border rounded-lg" placeholder="키워드 입력 (예: Design, Food, AI)" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">이름 생성</button>
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
