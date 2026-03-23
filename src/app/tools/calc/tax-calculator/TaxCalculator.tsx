"use client";
import { useState } from "react";

const BRACKETS = [
  { limit: 14000000, rate: 6, deduction: 0 },
  { limit: 50000000, rate: 15, deduction: 1260000 },
  { limit: 88000000, rate: 24, deduction: 5760000 },
  { limit: 150000000, rate: 35, deduction: 15440000 },
  { limit: 300000000, rate: 38, deduction: 19940000 },
  { limit: 500000000, rate: 40, deduction: 25940000 },
  { limit: 1000000000, rate: 42, deduction: 35940000 },
  { limit: Infinity, rate: 45, deduction: 65940000 },
];

export default function TaxCalculator() {
  const [income, setIncome] = useState(50000000);
  const [result, setResult] = useState<{ tax: number; local: number; total: number; effective: number; bracket: number } | null>(null);

  const calculate = () => {
    const bracket = BRACKETS.find(b => income <= b.limit) || BRACKETS[BRACKETS.length - 1];
    const tax = Math.floor(income * bracket.rate / 100 - bracket.deduction);
    const local = Math.floor(tax * 0.1);
    const total = tax + local;
    const effective = income > 0 ? Math.round(total / income * 10000) / 100 : 0;
    setResult({ tax, local, total, effective, bracket: bracket.rate });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">과세표준 (원)</label>
        <input type="number" value={income} onChange={e => setIncome(+e.target.value)} className="w-full p-3 border rounded-lg" />
      </div>
      <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">계산하기</button>
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">적용 세율</p><p className="text-xl font-bold">{result.bracket}%</p></div>
            <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">실효세율</p><p className="text-xl font-bold">{result.effective}%</p></div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <div className="flex justify-between"><span>소득세</span><span className="font-bold">{result.tax.toLocaleString()}원</span></div>
            <div className="flex justify-between"><span>지방소득세 (10%)</span><span>{result.local.toLocaleString()}원</span></div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold"><span>총 세금</span><span className="text-blue-700">{result.total.toLocaleString()}원</span></div>
          </div>
          <p className="text-xs text-gray-400">※ 2026년 종합소득세 기본세율 기준. 각종 공제 미적용.</p>
        </div>
      )}
    </div>
  );
}
