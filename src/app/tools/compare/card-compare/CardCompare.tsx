"use client";
import { useState } from "react";

const CARDS = [
  { name: "카카오뱅크 체크카드", annual: 0, cashback: 0.2, category: "전체", benefit: "전 가맹점 0.2% 캐시백", best: "소액 결제" },
  { name: "토스뱅크 체크카드", annual: 0, cashback: 0.3, category: "온라인", benefit: "온라인 0.3% 캐시백", best: "온라인 쇼핑" },
  { name: "신한 딥드림", annual: 15000, cashback: 1.0, category: "주유/통신", benefit: "주유 리터당 60원, 통신비 1%", best: "자차 통근" },
  { name: "현대 M포인트", annual: 10000, cashback: 0.5, category: "전체", benefit: "전 가맹점 M포인트 적립", best: "범용" },
  { name: "삼성 iD SIMPLE", annual: 0, cashback: 0.7, category: "편의점/카페", benefit: "편의점·카페 할인", best: "MZ세대" },
  { name: "KB국민 탄탄대로", annual: 12000, cashback: 0.8, category: "대중교통", benefit: "교통비 10% 할인", best: "대중교통 이용자" },
];

export default function CardCompare() {
  const [spending, setSpending] = useState(1000000);
  const [results, setResults] = useState<{name:string;annual:number;cashback:number;benefit:string;best:string;monthlySave:number}[]>([]);

  const compare = () => {
    const res = CARDS.map(c => ({
      ...c,
      monthlySave: Math.round(spending * c.cashback / 100 - c.annual / 12),
    })).sort((a, b) => b.monthlySave - a.monthlySave);
    setResults(res);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">월 카드 사용액</label>
        <input type="number" value={spending} onChange={(e) => setSpending(Number(e.target.value))} className="w-full p-3 border rounded-lg" />
      </div>
      <button onClick={compare} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">비교하기</button>
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`p-3 border rounded-lg ${i === 0 ? "bg-blue-50 border-blue-300" : "bg-gray-50"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{i === 0 && "🏆 "}{r.name}</p>
                  <p className="text-xs text-gray-500">{r.benefit}</p>
                  <p className="text-xs text-gray-400">연회비: {r.annual === 0 ? "없음" : r.annual.toLocaleString() + "원"} | 추천: {r.best}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">월 {r.monthlySave.toLocaleString()}원</p>
                  <p className="text-xs text-gray-500">절약</p>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400">※ 참고용 추정치입니다. 실제 혜택은 카드사에 확인하세요.</p>
        </div>
      )}
    </div>
  );
}
