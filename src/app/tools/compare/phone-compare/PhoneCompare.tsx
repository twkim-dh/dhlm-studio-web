"use client";
import { useState } from "react";

const PLANS = [
  { carrier: "SKT", name: "T플랜 에센셜", price: 55000, data: "5GB", call: "무제한", type: "대형" },
  { carrier: "SKT", name: "T플랜 스탠다드", price: 69000, data: "무제한", call: "무제한", type: "대형" },
  { carrier: "KT", name: "Y24 심플", price: 49000, data: "3GB", call: "무제한", type: "대형" },
  { carrier: "KT", name: "Y24 스페셜", price: 65000, data: "무제한", call: "무제한", type: "대형" },
  { carrier: "LGU+", name: "다이렉트 49", price: 49000, data: "5GB", call: "무제한", type: "대형" },
  { carrier: "LGU+", name: "다이렉트 69", price: 69000, data: "무제한", call: "무제한", type: "대형" },
  { carrier: "알뜰폰", name: "리브모바일 11GB", price: 16500, data: "11GB", call: "무제한", type: "알뜰" },
  { carrier: "알뜰폰", name: "헬로모바일 무제한", price: 25000, data: "무제한(3Mbps)", call: "무제한", type: "알뜰" },
  { carrier: "알뜰폰", name: "KT M모바일 6GB", price: 9900, data: "6GB", call: "무제한", type: "알뜰" },
  { carrier: "알뜰폰", name: "SK 7모바일 5GB", price: 12000, data: "5GB", call: "무제한", type: "알뜰" },
];

export default function PhoneCompare() {
  const [filter, setFilter] = useState<"all"|"대형"|"알뜰">("all");
  const filtered = filter === "all" ? PLANS : PLANS.filter(p => p.type === filter);
  const sorted = [...filtered].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["all","대형","알뜰"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-sm ${filter===f?"bg-blue-600 text-white":"bg-gray-100"}`}>
            {f === "all" ? "전체" : f === "대형" ? "대형 통신사" : "알뜰폰"}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {sorted.map((p, i) => (
          <div key={i} className="p-3 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{p.carrier} <span className="text-gray-600 font-normal">{p.name}</span></p>
                <p className="text-xs text-gray-500">데이터: {p.data} | 통화: {p.call}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-700">{p.price.toLocaleString()}원</p>
                <p className="text-xs text-gray-400">/월</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">※ 참고용 정보입니다. 실제 요금은 통신사에 확인하세요.</p>
    </div>
  );
}
