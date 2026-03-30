"use client";
import { useState } from "react";

export default function PasswordGen() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  const generate = () => {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const pws: string[] = [];
    for (let j = 0; j < 5; j++) {
      let pw = "";
      for (let i = 0; i < length; i++) pw += chars[Math.floor(Math.random() * chars.length)];
      pws.push(pw);
    }
    setResults(pws);
  };

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 12) score++;
    if (pw.length >= 16) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { label: "약함", color: "text-red-500" };
    if (score <= 4) return { label: "보통", color: "text-yellow-500" };
    return { label: "강함", color: "text-green-600" };
  };

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">길이: {length}자</label>
        <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
      </div>
      <div className="flex flex-wrap gap-3">
        {[{label:"대문자",v:upper,s:setUpper},{label:"소문자",v:lower,s:setLower},{label:"숫자",v:numbers,s:setNumbers},{label:"특수문자",v:symbols,s:setSymbols}].map(o => (
          <label key={o.label} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={o.v} onChange={(e) => o.s(e.target.checked)} /> {o.label}</label>
        ))}
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">5개 생성</button>
      {results.length > 0 && (
        <div className="grid gap-2">
          {results.map((pw, i) => {
            const strength = getStrength(pw);
            return (
              <div key={i} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                <span className="font-mono text-sm break-all flex-1 mr-2">{pw}</span>
                <span className={`text-xs mr-2 ${strength.color}`}>{strength.label}</span>
                <button onClick={() => copy(pw, i)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded shrink-0">{copied===i?"복사됨!":"복사"}</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
