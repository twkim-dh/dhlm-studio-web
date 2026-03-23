"use client";
import { useState } from "react";

const CATEGORIES = [
  { label: "💒 결혼 축하", templates: [
    "두 분의 아름다운 결합을 진심으로 축하합니다. 앞으로의 모든 날이 행복으로 가득하길 바랍니다.",
    "사랑하는 두 분의 결혼을 축하드립니다. 서로를 아끼며 행복한 가정을 이루시길 기원합니다.",
    "결혼을 진심으로 축하합니다! 두 분이 함께하는 모든 순간이 축복이 되길 바랍니다. 행복하세요!",
    "백년해로하시길 축원합니다. 두 분의 앞날에 항상 웃음꽃이 피어나길 바랍니다.",
  ]},
  { label: "👶 출산 축하", templates: [
    "예쁜 아기의 탄생을 진심으로 축하합니다! 건강하고 행복하게 자라길 바랍니다.",
    "새 생명의 탄생을 축하드립니다. 아이와 함께 더 큰 행복을 느끼시길 바랍니다.",
    "축하합니다! 아기가 건강하게 태어나서 정말 기쁩니다. 육아 화이팅! 💪",
  ]},
  { label: "🙏 조의 (장례)", templates: [
    "삼가 고인의 명복을 빕니다. 깊은 위로의 말씀을 드립니다.",
    "슬픈 소식에 깊은 애도를 표합니다. 유가족분들께 위로의 말씀을 드립니다.",
    "갑작스러운 비보에 마음이 무겁습니다. 고인의 영면을 빌며, 남은 가족분들의 건강을 기원합니다.",
  ]},
  { label: "🎂 생일 축하", templates: [
    "생일 축하합니다! 올해도 건강하고 좋은 일만 가득하길 바랍니다. 🎂",
    "생일을 진심으로 축하해요! 나이는 숫자일 뿐, 늘 젊고 활기차게! 🎉",
    "소중한 날을 축하합니다. 올 한 해도 행복과 성공이 함께하길 바랍니다.",
  ]},
  { label: "🏠 집들이", templates: [
    "새집으로의 이사를 축하합니다! 새로운 공간에서 행복한 추억 많이 만드세요.",
    "이사 축하드려요! 좋은 기운 가득한 보금자리에서 편안한 나날 보내세요. 🏡",
  ]},
];

export default function CongratGenerator() {
  const [category, setCategory] = useState(0);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const templates = CATEGORIES[category].templates;
    setResult(templates[Math.floor(Math.random() * templates.length)]);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <button key={i} onClick={() => setCategory(i)} className={`px-3 py-2 rounded-lg text-sm ${category === i ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{c.label}</button>
        ))}
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">문구 생성</button>
      {result && (
        <div className="relative">
          <div className="p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap text-lg leading-relaxed">{result}</div>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
    </div>
  );
}
