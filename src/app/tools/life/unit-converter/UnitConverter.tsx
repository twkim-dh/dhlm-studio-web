"use client";
import { useState } from "react";

const CATEGORIES: Record<string, { units: { name: string; factor: number }[]; type: "multiply" | "temp" }> = {
  "길이": { type: "multiply", units: [
    { name: "mm", factor: 1 }, { name: "cm", factor: 10 }, { name: "m", factor: 1000 },
    { name: "km", factor: 1000000 }, { name: "in", factor: 25.4 }, { name: "ft", factor: 304.8 },
    { name: "yd", factor: 914.4 }, { name: "mile", factor: 1609344 },
  ]},
  "무게": { type: "multiply", units: [
    { name: "mg", factor: 1 }, { name: "g", factor: 1000 }, { name: "kg", factor: 1000000 },
    { name: "ton", factor: 1000000000 }, { name: "oz", factor: 28349.5 }, { name: "lb", factor: 453592 },
  ]},
  "면적": { type: "multiply", units: [
    { name: "mm²", factor: 1 }, { name: "cm²", factor: 100 }, { name: "m²", factor: 1000000 },
    { name: "km²", factor: 1e12 }, { name: "평", factor: 3305785 }, { name: "에이커", factor: 4.047e9 },
  ]},
  "부피": { type: "multiply", units: [
    { name: "mL", factor: 1 }, { name: "L", factor: 1000 }, { name: "m³", factor: 1000000 },
    { name: "gallon", factor: 3785.41 }, { name: "oz(fl)", factor: 29.5735 },
  ]},
};

export default function UnitConverterComponent() {
  const [category, setCategory] = useState("길이");
  const [fromIdx, setFromIdx] = useState(2);
  const [toIdx, setToIdx] = useState(0);
  const [value, setValue] = useState("1");

  const cat = CATEGORIES[category];
  const units = cat.units;
  const from = units[fromIdx] || units[0];
  const to = units[toIdx] || units[1];
  const numVal = parseFloat(value) || 0;
  const result = (numVal * from.factor) / to.factor;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(CATEGORIES).map(c => (
          <button key={c} onClick={() => { setCategory(c); setFromIdx(2); setToIdx(0); }}
            className={`px-3 py-2 rounded-lg text-sm ${category === c ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
        <div>
          <label className="text-xs text-gray-500">값</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full p-3 border rounded-lg" />
          <select value={fromIdx} onChange={(e) => setFromIdx(Number(e.target.value))} className="w-full p-2 border rounded-lg mt-1 text-sm">
            {units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
          </select>
        </div>
        <span className="text-xl font-bold text-gray-400 pb-3">→</span>
        <div>
          <label className="text-xs text-gray-500">결과</label>
          <div className="p-3 border rounded-lg bg-blue-50 font-bold text-blue-700">{result.toLocaleString("ko-KR", { maximumFractionDigits: 6 })}</div>
          <select value={toIdx} onChange={(e) => setToIdx(Number(e.target.value))} className="w-full p-2 border rounded-lg mt-1 text-sm">
            {units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
          </select>
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center">{numVal} {from.name} = {result.toLocaleString("ko-KR", { maximumFractionDigits: 6 })} {to.name}</p>
    </div>
  );
}
