"use client";
import { useState } from "react";

export default function BinaryConverter() {
  const [value, setValue] = useState("255");
  const [base, setBase] = useState(10);
  const [copied, setCopied] = useState("");

  const num = parseInt(value, base);
  const isValid = !isNaN(num);

  const conversions = isValid ? [
    { label: "10진수", value: num.toString(10), base: 10 },
    { label: "2진수", value: num.toString(2), base: 2 },
    { label: "8진수", value: num.toString(8), base: 8 },
    { label: "16진수", value: num.toString(16).toUpperCase(), base: 16 },
  ] : [];

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[{ l: "10진수", b: 10 }, { l: "2진수", b: 2 }, { l: "8진수", b: 8 }, { l: "16진수", b: 16 }].map(o => (
          <button key={o.b} onClick={() => setBase(o.b)} className={`flex-1 py-2 rounded-lg text-sm ${base === o.b ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{o.l}</button>
        ))}
      </div>
      <input className="w-full p-3 border rounded-lg font-mono text-lg" placeholder="숫자 입력" value={value} onChange={e => setValue(e.target.value)} />
      {!isValid && value && <p className="text-red-500 text-sm">유효하지 않은 {base}진수 값입니다</p>}
      {conversions.length > 0 && (
        <div className="space-y-2">
          {conversions.map(c => (
            <div key={c.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500 w-16">{c.label}</span>
              <span className="font-mono text-sm font-semibold flex-1 text-right mr-2">{c.value}</span>
              <button onClick={() => copy(c.value, c.label)} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">{copied === c.label ? "✓" : "복사"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
