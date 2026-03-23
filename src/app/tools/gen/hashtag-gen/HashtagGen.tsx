"use client";
import { useState } from "react";

const TAG_MAP: Record<string, string[]> = {
  "맛집": ["맛집","맛집추천","맛스타그램","먹스타그램","푸드스타그램","맛집탐방","오늘뭐먹지","food","foodie","yummy","dailyfood","koreanfood"],
  "카페": ["카페","카페추천","카페스타그램","커피","커피스타그램","카페투어","디저트","디저트스타그램","cafe","coffee","coffeetime"],
  "여행": ["여행","여행스타그램","국내여행","해외여행","여행사진","여행에미치다","trip","travel","travelgram","vacation","wanderlust"],
  "일상": ["일상","일상스타그램","데일리","소통","좋아요","팔로우","daily","dailylife","instadaily","instagood","photooftheday"],
  "운동": ["운동","운동스타그램","헬스","헬스타그램","다이어트","건강","fitness","gym","workout","health","fitlife"],
  "패션": ["패션","패션스타그램","옷","코디","데일리룩","오늘뭐입지","fashion","ootd","style","outfit","streetfashion"],
  "뷰티": ["뷰티","메이크업","화장품","스킨케어","뷰티스타그램","beauty","makeup","skincare","cosmetics","beautytips"],
  "반려동물": ["반려동물","강아지","고양이","펫스타그램","멍스타그램","냥스타그램","dog","cat","pet","petstagram","dogsofinstagram"],
};

export default function HashtagGenComponent() {
  const [category, setCategory] = useState("맛집");
  const [custom, setCustom] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const base = TAG_MAP[category] || TAG_MAP["일상"];
    const customTags = custom.split(/[,\s]+/).filter(Boolean).map(t => t.startsWith("#") ? t.slice(1) : t);
    const all = [...new Set([...base, ...customTags])];
    const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 20);
    setTags(shuffled);
  };

  const copyAll = async () => {
    const text = tags.map(t => `#${t}`).join(" ");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(TAG_MAP).map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`px-3 py-2 rounded-lg text-sm ${category === c ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{c}</button>
        ))}
      </div>
      <input className="w-full p-3 border rounded-lg" placeholder="추가 키워드 (쉼표로 구분)" value={custom} onChange={(e) => setCustom(e.target.value)} />
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">생성하기</button>
      {tags.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <span key={t} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">#{t}</span>
            ))}
          </div>
          <button onClick={copyAll} className="w-full py-2 bg-green-600 text-white rounded-lg">{copied ? "복사됨!" : "전체 복사"}</button>
          <p className="text-xs text-gray-400">{tags.length}개 태그</p>
        </div>
      )}
    </div>
  );
}
