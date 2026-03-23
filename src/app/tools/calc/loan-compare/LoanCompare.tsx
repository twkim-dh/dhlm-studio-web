"use client";
import { useState } from "react";

interface LoanOption { name: string; rate: number; months: number; }

function calcMonthly(principal: number, annualRate: number, months: number) {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

export default function LoanCompare() {
  const [principal, setPrincipal] = useState(100000000);
  const [options, setOptions] = useState<LoanOption[]>([
    { name: "A은행", rate: 4.5, months: 360 },
    { name: "B은행", rate: 4.2, months: 360 },
    { name: "C은행", rate: 5.0, months: 240 },
  ]);

  const updateOption = (i: number, field: keyof LoanOption, value: string | number) => {
    const newOpts = [...options];
    (newOpts[i] as unknown as Record<string, unknown>)[field] = value;
    setOptions(newOpts);
  };

  const addOption = () => setOptions([...options, { name: `${String.fromCharCode(65 + options.length)}은행`, rate: 4.0, months: 360 }]);
  const removeOption = (i: number) => setOptions(options.filter((_, idx) => idx !== i));

  const results = options.map(o => {
    const monthly = calcMonthly(principal, o.rate, o.months);
    const totalPayment = monthly * o.months;
    const totalInterest = totalPayment - principal;
    return { ...o, monthly: Math.round(monthly), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest) };
  }).sort((a, b) => a.totalInterest - b.totalInterest);

  return (
    <div className="space-y-4">
      <div><label className="text-sm text-gray-600">대출 원금</label><input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} className="w-full p-3 border rounded-lg" /></div>
      {options.map((o, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1"><label className="text-xs text-gray-500">이름</label><input value={o.name} onChange={e => updateOption(i, "name", e.target.value)} className="w-full p-2 border rounded-lg text-sm" /></div>
          <div className="w-20"><label className="text-xs text-gray-500">금리(%)</label><input type="number" step={0.1} value={o.rate} onChange={e => updateOption(i, "rate", +e.target.value)} className="w-full p-2 border rounded-lg text-sm" /></div>
          <div className="w-20"><label className="text-xs text-gray-500">기간(월)</label><input type="number" value={o.months} onChange={e => updateOption(i, "months", +e.target.value)} className="w-full p-2 border rounded-lg text-sm" /></div>
          {options.length > 2 && <button onClick={() => removeOption(i)} className="text-red-400 text-sm pb-1">✕</button>}
        </div>
      ))}
      <button onClick={addOption} className="text-sm text-blue-600">+ 옵션 추가</button>
      <div className="space-y-2 mt-4">
        {results.map((r, i) => (
          <div key={i} className={`p-3 border rounded-lg ${i === 0 ? "bg-blue-50 border-blue-300" : "bg-gray-50"}`}>
            <div className="flex justify-between items-start">
              <div><p className="font-semibold">{i === 0 && "🏆 "}{r.name} <span className="text-sm text-gray-500">({r.rate}%, {Math.round(r.months/12)}년)</span></p></div>
              <div className="text-right">
                <p className="font-bold text-blue-700">월 {r.monthly.toLocaleString()}원</p>
                <p className="text-xs text-gray-500">총 이자 {r.totalInterest.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
