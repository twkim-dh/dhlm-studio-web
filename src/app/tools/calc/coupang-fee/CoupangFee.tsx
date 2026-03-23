"use client";
import { useState } from "react";

const CATEGORIES = [
  { name: "일반", fee: 10.8 },
  { name: "식품", fee: 10.8 },
  { name: "패션/의류", fee: 10.8 },
  { name: "가전/디지털", fee: 8.0 },
  { name: "생활/건강", fee: 10.8 },
  { name: "뷰티", fee: 10.8 },
  { name: "도서", fee: 7.0 },
];

export default function CoupangFee() {
  const [price, setPrice] = useState(30000);
  const [cost, setCost] = useState(15000);
  const [shipping, setShipping] = useState(3000);
  const [category, setCategory] = useState(0);

  const feeRate = CATEGORIES[category].fee;
  const fee = Math.round(price * feeRate / 100);
  const revenue = price - fee - cost - shipping;
  const marginRate = price > 0 ? Math.round(revenue / price * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <button key={i} onClick={() => setCategory(i)} className={`px-3 py-1.5 text-sm rounded-lg ${category === i ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{c.name} ({c.fee}%)</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div><label className="text-sm text-gray-600">판매가</label><input type="number" value={price} onChange={e => setPrice(+e.target.value)} className="w-full p-3 border rounded-lg" /></div>
        <div><label className="text-sm text-gray-600">원가 (매입가)</label><input type="number" value={cost} onChange={e => setCost(+e.target.value)} className="w-full p-3 border rounded-lg" /></div>
        <div><label className="text-sm text-gray-600">배송비</label><input type="number" value={shipping} onChange={e => setShipping(+e.target.value)} className="w-full p-3 border rounded-lg" /></div>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg space-y-2">
        <div className="flex justify-between text-sm"><span>판매가</span><span>{price.toLocaleString()}원</span></div>
        <div className="flex justify-between text-sm text-red-500"><span>수수료 ({feeRate}%)</span><span>-{fee.toLocaleString()}원</span></div>
        <div className="flex justify-between text-sm text-red-500"><span>원가</span><span>-{cost.toLocaleString()}원</span></div>
        <div className="flex justify-between text-sm text-red-500"><span>배송비</span><span>-{shipping.toLocaleString()}원</span></div>
        <div className={`flex justify-between border-t pt-2 text-lg font-bold ${revenue >= 0 ? "text-blue-700" : "text-red-600"}`}>
          <span>순수익</span><span>{revenue.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500"><span>마진율</span><span>{marginRate}%</span></div>
      </div>
    </div>
  );
}
