"use client";
import { useState } from "react";

const BANKS = [
  { name: "카카오뱅크", rate: 3.5 },
  { name: "토스뱅크", rate: 3.8 },
  { name: "케이뱅크", rate: 3.6 },
  { name: "국민은행", rate: 3.2 },
  { name: "신한은행", rate: 3.3 },
  { name: "하나은행", rate: 3.1 },
  { name: "우리은행", rate: 3.0 },
  { name: "농협은행", rate: 3.4 },
];

export default function DepositCompare() {
  const [monthly, setMonthly] = useState(300000);
  const [months, setMonths] = useState(12);
  const [results, setResults] = useState<{name:string;rate:number;interest:number;total:number}[]>([]);

  const calculate = () => {
    const res = BANKS.map(b => {
      let interest = 0;
      for (let i = 1; i <= months; i++) {
        interest += monthly * (b.rate / 100) * ((months - i + 1) / 12);
      }
      const tax = interest * 0.154;
      const netInterest = interest - tax;
      return { name: b.name, rate: b.rate, interest: Math.round(netInterest), total: Math.round(monthly * months + netInterest) };
    }).sort((a, b) => b.total - a.total);
    setResults(res);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">월 납입액</label>
          <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
        </div>
        <div>
          <label className="text-sm text-gray-600">기간 (개월)</label>
          <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
        </div>
      </div>
      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">비교하기</button>
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`p-3 border rounded-lg ${i === 0 ? "bg-blue-50 border-blue-300" : "bg-gray-50"}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{i === 0 && "🏆 "}{r.name}</span>
                  <span className="text-sm text-gray-500 ml-2">연 {r.rate}%</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">{r.total.toLocaleString()}원</p>
                  <p className="text-xs text-gray-500">이자 {r.interest.toLocaleString()}원 (세후)</p>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400">※ 참고용 고정 금리입니다. 실제 금리는 은행에 확인하세요.</p>
        </div>
      )}
    </div>
  );
}
