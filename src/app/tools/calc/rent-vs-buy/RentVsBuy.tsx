"use client";
import { useState } from "react";

export default function RentVsBuy() {
  const [jeonse, setJeonse] = useState(300000000);
  const [monthly, setMonthly] = useState(800000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(10000000);
  const [investRate, setInvestRate] = useState(4.0);
  const [years, setYears] = useState(2);

  const months = years * 12;
  const totalMonthly = monthly * months;
  const jeonseOppCost = Math.round(jeonse * investRate / 100 * years);
  const monthlyOppCost = Math.round((jeonse - monthlyDeposit) * investRate / 100 * years);
  const jeonseCost = jeonseOppCost;
  const monthlyCost = totalMonthly - monthlyOppCost;
  const diff = monthlyCost - jeonseCost;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-gray-500">전세 보증금</label><input type="number" value={jeonse} onChange={e => setJeonse(+e.target.value)} className="w-full p-2 border rounded-lg" /></div>
        <div><label className="text-xs text-gray-500">월세 보증금</label><input type="number" value={monthlyDeposit} onChange={e => setMonthlyDeposit(+e.target.value)} className="w-full p-2 border rounded-lg" /></div>
        <div><label className="text-xs text-gray-500">월세 (원/월)</label><input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} className="w-full p-2 border rounded-lg" /></div>
        <div><label className="text-xs text-gray-500">투자 수익률 (%)</label><input type="number" step={0.5} value={investRate} onChange={e => setInvestRate(+e.target.value)} className="w-full p-2 border rounded-lg" /></div>
      </div>
      <div><label className="text-xs text-gray-500">거주 기간: {years}년</label><input type="range" min={1} max={10} value={years} onChange={e => setYears(+e.target.value)} className="w-full" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-4 rounded-lg ${diff > 0 ? "bg-blue-50 border-2 border-blue-300" : "bg-gray-50"}`}>
          <p className="text-sm font-semibold text-blue-700">{diff > 0 && "🏆 "}전세</p>
          <p className="text-xs text-gray-500 mt-1">보증금: {(jeonse / 10000).toLocaleString()}만원</p>
          <p className="text-xs text-gray-500">기회비용: {(jeonseOppCost / 10000).toLocaleString()}만원</p>
          <p className="text-lg font-bold mt-2">총 비용: {(jeonseCost / 10000).toLocaleString()}만원</p>
        </div>
        <div className={`p-4 rounded-lg ${diff <= 0 ? "bg-orange-50 border-2 border-orange-300" : "bg-gray-50"}`}>
          <p className="text-sm font-semibold text-orange-700">{diff <= 0 && "🏆 "}월세</p>
          <p className="text-xs text-gray-500 mt-1">보증금: {(monthlyDeposit / 10000).toLocaleString()}만원</p>
          <p className="text-xs text-gray-500">월세 총합: {(totalMonthly / 10000).toLocaleString()}만원</p>
          <p className="text-lg font-bold mt-2">총 비용: {(monthlyCost / 10000).toLocaleString()}만원</p>
        </div>
      </div>
      <p className="text-center text-sm font-semibold">{diff > 0 ? `전세가 ${(diff / 10000).toLocaleString()}만원 유리` : diff < 0 ? `월세가 ${(-diff / 10000).toLocaleString()}만원 유리` : "비용 동일"}</p>
      <p className="text-xs text-gray-400">※ 투자 수익률은 전세 보증금을 투자했을 때의 기회비용입니다.</p>
    </div>
  );
}
