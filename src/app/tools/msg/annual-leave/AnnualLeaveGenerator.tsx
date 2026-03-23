"use client";
import { useState } from "react";

const REASONS = [
  { category: "개인 사유", items: ["개인 사유로 연차를 신청합니다.", "개인적인 일정이 있어 연차 사용합니다.", "개인 일정 소화를 위해 연차를 사용하겠습니다."] },
  { category: "병원/건강", items: ["건강 검진 예약으로 연차를 신청합니다.", "병원 진료 예약이 있어 연차를 사용합니다.", "치과 치료 일정이 있어 연차 신청합니다.", "정기 건강검진을 위해 연차를 사용하겠습니다."] },
  { category: "가족/경조사", items: ["가족 행사 참석을 위해 연차를 신청합니다.", "친척 경조사 참석으로 연차를 사용합니다.", "부모님 병원 동행을 위해 연차 신청합니다.", "자녀 학교 행사 참석을 위해 연차를 사용합니다."] },
  { category: "관공서/행정", items: ["관공서 업무 처리를 위해 연차를 신청합니다.", "은행 및 관공서 방문을 위해 연차를 사용합니다.", "주민센터 서류 발급을 위해 연차 신청합니다."] },
  { category: "이사/집", items: ["이사 일정으로 연차를 신청합니다.", "집 수리/점검을 위해 연차를 사용합니다.", "가스/전기 점검 일정이 있어 연차 신청합니다."] },
  { category: "리프레시", items: ["리프레시를 위해 연차를 사용하겠습니다.", "재충전을 위해 연차를 신청합니다.", "컨디션 회복을 위해 연차를 사용합니다."] },
];

export default function AnnualLeaveGenerator() {
  const [category, setCategory] = useState(0);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const items = REASONS[category].items;
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
        {REASONS.map((r, i) => (
          <button key={i} onClick={() => setCategory(i)} className={`px-3 py-2 rounded-lg text-sm ${category === i ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{r.category}</button>
        ))}
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">사유 생성</button>
      {result && (
        <div className="relative">
          <div className="p-4 border rounded-lg bg-gray-50 text-lg">{result}</div>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
      <p className="text-xs text-gray-400">여러 번 누르면 다른 사유가 나옵니다.</p>
    </div>
  );
}
