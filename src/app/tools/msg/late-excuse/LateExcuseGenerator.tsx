"use client";
import { useState } from "react";

const EXCUSES = [
  { category: "🚇 교통", items: [
    "지하철 지연으로 인해 늦게 도착할 예정입니다. 죄송합니다. 약 10분 후 도착합니다.",
    "버스가 사고로 우회 운행 중이라 조금 늦을 것 같습니다. 죄송합니다.",
    "출근길 교통체증이 심해서 약간 지연되고 있습니다. 최대한 빨리 가겠습니다.",
    "지하철 고장으로 한 정거장에서 대기 중입니다. 20분 내로 도착하겠습니다.",
  ]},
  { category: "🏥 건강", items: [
    "아침에 컨디션이 좋지 않아 병원 들렀다 출근하겠습니다. 죄송합니다.",
    "갑작스러운 두통으로 약 복용 후 출근하겠습니다. 조금 늦을 예정입니다.",
    "어젯밤부터 속이 안 좋아서 약 먹고 출발합니다. 약 15분 지각 예상됩니다.",
  ]},
  { category: "🏠 집안일", items: [
    "집에 배관 문제가 생겨서 응급 처리 후 출근합니다. 30분 정도 늦겠습니다.",
    "보일러 고장으로 수리기사 대기 중입니다. 처리 후 바로 출발하겠습니다.",
    "택배 수령 일정이 겹쳐서 조금 늦을 예정입니다. 죄송합니다.",
  ]},
  { category: "😅 솔직한", items: [
    "알람을 못 듣고 늦잠을 잤습니다. 정말 죄송합니다. 최대한 빨리 가겠습니다.",
    "죄송합니다. 출발이 늦어졌습니다. 10분 내로 도착하겠습니다.",
    "오늘 아침 준비가 늦어졌습니다. 빠르게 출근하겠습니다. 죄송합니다.",
  ]},
];

export default function LateExcuseGenerator() {
  const [category, setCategory] = useState(0);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const items = EXCUSES[category].items;
    setResult(items[Math.floor(Math.random() * items.length)]);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {EXCUSES.map((e, i) => (
          <button key={i} onClick={() => setCategory(i)} className={`px-3 py-2 rounded-lg text-sm ${category === i ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{e.category}</button>
        ))}
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">변명 생성</button>
      {result && (
        <div className="relative">
          <div className="p-4 border rounded-lg bg-gray-50 text-lg">{result}</div>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
    </div>
  );
}
