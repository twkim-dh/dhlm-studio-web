"use client";
import { useState } from "react";

const PERMS = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
const LABELS = ["읽기(r)", "쓰기(w)", "실행(x)"];
const ROLES = ["소유자", "그룹", "기타"];

export default function ChmodCalc() {
  const [perms, setPerms] = useState([7, 5, 5]); // rwxr-xr-x

  const toggle = (role: number, bit: number) => {
    const newPerms = [...perms];
    newPerms[role] ^= (4 >> bit);
    setPerms(newPerms);
  };

  const numStr = perms.join("");
  const symStr = perms.map(p => PERMS[p]).join("");
  const [copied, setCopied] = useState("");

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const presets = [
    { label: "755", perms: [7, 5, 5] },
    { label: "644", perms: [6, 4, 4] },
    { label: "777", perms: [7, 7, 7] },
    { label: "700", perms: [7, 0, 0] },
    { label: "600", perms: [6, 0, 0] },
    { label: "400", perms: [4, 0, 0] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button key={p.label} onClick={() => setPerms(p.perms)} className={`px-3 py-1 text-sm rounded-full ${numStr === p.perms.join("") ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{p.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div />
        {LABELS.map(l => <div key={l} className="font-semibold text-gray-600">{l}</div>)}
        {ROLES.map((role, ri) => (
          <div key={role} className="contents">
            <div className="font-semibold text-gray-700 text-left">{role}</div>
            {[0, 1, 2].map(bit => (
              <button key={bit} onClick={() => toggle(ri, bit)}
                className={`py-2 rounded-lg ${(perms[ri] & (4 >> bit)) ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
                {(perms[ri] & (4 >> bit)) ? "✓" : "–"}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-500">숫자</p>
          <p className="text-3xl font-bold font-mono">{numStr}</p>
          <button onClick={() => copy(numStr, "num")} className="mt-1 text-xs text-blue-600">{copied === "num" ? "복사됨!" : "복사"}</button>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-500">문자</p>
          <p className="text-2xl font-bold font-mono">{symStr}</p>
          <button onClick={() => copy(symStr, "sym")} className="mt-1 text-xs text-blue-600">{copied === "sym" ? "복사됨!" : "복사"}</button>
        </div>
      </div>
      <p className="text-xs text-gray-400 font-mono text-center">chmod {numStr} filename</p>
    </div>
  );
}
