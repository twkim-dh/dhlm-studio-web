"use client";
import { useState } from "react";

export default function InvestmentReturn() {
  const [initial, setInitial] = useState(10000000);
  const [final, setFinal] = useState(15000000);
  const [years, setYears] = useState(3);

  const profit = final - initial;
  const roi = initial > 0 ? (profit / initial * 100) : 0;
  const cagr = initial > 0 && years > 0 ? ((Math.pow(final / initial, 1 / years) - 1) * 100) : 0;
  const annualProfit = Math.round(profit / years);

  return (
    <div className="space-y-4">
      <div><label className="text-sm text-gray-600">투자 원금</label><input type="number" value={initial} onChange={e => setInitial(+e.target.value)} className="w-full p-3 border rounded-lg" /></div>
      <div><label className="text-sm text-gray-600">현재 가치 (또는 매도 금액)</label><input type="number" value={final} onChange={e => setFinal(+e.target.value)} className="w-full p-3 border rounded-lg" /></div>
      <div><label className="text-sm text-gray-600">투자 기간: {years}년</label><input type="range" min={1} max={30} value={years} onChange={e => setYears(+e.target.value)} className="w-full" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">총 수익</p><p className={`text-xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>{profit >= 0 ? "+" : ""}{profit.toLocaleString()}원</p></div>
        <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">수익률 (ROI)</p><p className={`text-xl font-bold ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>{roi >= 0 ? "+" : ""}{roi.toFixed(1)}%</p></div>
        <div className="p-3 bg-blue-50 rounded-lg text-center"><p className="text-xs text-gray-500">연평균 수익률 (CAGR)</p><p className="text-xl font-bold text-blue-700">{cagr.toFixed(2)}%</p></div>
        <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">연간 수익</p><p className="text-xl font-bold">{annualProfit.toLocaleString()}원</p></div>
      </div>
    </div>
  );
}
