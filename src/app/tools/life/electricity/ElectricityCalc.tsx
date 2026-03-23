"use client";
import { useState } from "react";

const TIERS = [
  { limit: 200, rate: 120.0, base: 910 },
  { limit: 400, rate: 214.6, base: 1600 },
  { limit: Infinity, rate: 307.3, base: 7300 },
];

export default function ElectricityCalc() {
  const [kwh, setKwh] = useState(300);
  const [result, setResult] = useState<{ usage: number; base: number; vat: number; fund: number; total: number } | null>(null);

  const calculate = () => {
    let usage = 0;
    let remaining = kwh;
    let base = 0;

    for (const tier of TIERS) {
      if (remaining <= 0) break;
      const tierKwh = tier.limit === Infinity ? remaining : Math.min(remaining, tier.limit - (TIERS.indexOf(tier) === 0 ? 0 : TIERS[TIERS.indexOf(tier) - 1].limit));
      usage += tierKwh * tier.rate;
      base = tier.base;
      remaining -= tierKwh;
    }

    // Simplified calculation
    let totalUsage = 0;
    let rem = kwh;
    if (rem > 0) { const t1 = Math.min(rem, 200); totalUsage += t1 * 120.0; rem -= t1; }
    if (rem > 0) { const t2 = Math.min(rem, 200); totalUsage += t2 * 214.6; rem -= t2; }
    if (rem > 0) { totalUsage += rem * 307.3; }

    const tierBase = kwh <= 200 ? 910 : kwh <= 400 ? 1600 : 7300;
    const subtotal = tierBase + totalUsage;
    const vat = Math.round(subtotal * 0.1);
    const fund = Math.round(subtotal * 0.037);
    const total = Math.round(subtotal + vat + fund);

    setResult({ usage: Math.round(totalUsage), base: tierBase, vat, fund, total });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">월 사용량 (kWh)</label>
        <input type="number" value={kwh} onChange={e => setKwh(+e.target.value)} className="w-full p-3 border rounded-lg" />
        <div className="flex gap-2 mt-2">
          {[100, 200, 300, 400, 500].map(v => (
            <button key={v} onClick={() => setKwh(v)} className={`px-3 py-1 text-sm rounded-full ${kwh === v ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{v}kWh</button>
          ))}
        </div>
      </div>
      <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">계산하기</button>
      {result && (
        <div className="p-4 bg-blue-50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm"><span>기본요금</span><span>{result.base.toLocaleString()}원</span></div>
          <div className="flex justify-between text-sm"><span>전력량요금</span><span>{result.usage.toLocaleString()}원</span></div>
          <div className="flex justify-between text-sm"><span>부가세 (10%)</span><span>{result.vat.toLocaleString()}원</span></div>
          <div className="flex justify-between text-sm"><span>전력기금 (3.7%)</span><span>{result.fund.toLocaleString()}원</span></div>
          <div className="flex justify-between border-t pt-2 text-lg font-bold"><span>예상 전기요금</span><span className="text-blue-700">{result.total.toLocaleString()}원</span></div>
        </div>
      )}
      <p className="text-xs text-gray-400">※ 주택용(저압) 기준 추정치입니다.</p>
    </div>
  );
}
