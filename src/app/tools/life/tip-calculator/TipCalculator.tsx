"use client";
import { useState } from "react";

export default function TipCalculator() {
  const [total, setTotal] = useState(50000);
  const [people, setPeople] = useState(4);
  const [tipRate, setTipRate] = useState(0);

  const tip = Math.round(total * tipRate / 100);
  const grandTotal = total + tip;
  const perPerson = Math.ceil(grandTotal / people);
  const rounded = Math.ceil(perPerson / 1000) * 1000;

  return (
    <div className="space-y-4">
      <div><label className="text-sm text-gray-600">총 금액 (원)</label><input type="number" value={total} onChange={e=>setTotal(+e.target.value)} className="w-full p-3 border rounded-lg" /></div>
      <div><label className="text-sm text-gray-600">인원수</label><input type="number" min={1} value={people} onChange={e=>setPeople(Math.max(1,+e.target.value))} className="w-full p-3 border rounded-lg" /></div>
      <div>
        <label className="text-sm text-gray-600">팁: {tipRate}%</label>
        <div className="flex gap-2 mt-1">
          {[0,5,10,15,20].map(t=>(
            <button key={t} onClick={()=>setTipRate(t)} className={`flex-1 py-2 rounded-lg text-sm ${tipRate===t?"bg-blue-600 text-white":"bg-gray-100"}`}>{t}%</button>
          ))}
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl space-y-3">
        {tip > 0 && <div className="flex justify-between"><span className="text-gray-600">팁</span><span>{tip.toLocaleString()}원</span></div>}
        <div className="flex justify-between"><span className="text-gray-600">총액</span><span>{grandTotal.toLocaleString()}원</span></div>
        <div className="flex justify-between text-lg font-bold border-t pt-2"><span>1인당</span><span className="text-blue-700">{perPerson.toLocaleString()}원</span></div>
        <div className="flex justify-between text-sm text-gray-400"><span>1인당 (천원 단위)</span><span>{rounded.toLocaleString()}원</span></div>
      </div>
    </div>
  );
}
