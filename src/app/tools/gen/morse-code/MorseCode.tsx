"use client";
import { useState } from "react";

const MORSE: Record<string, string> = {
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",
  K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",
  U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
  "6":"-....","7":"--...","8":"---..","9":"----.",
  " ":"/", ".":".-.-.-", ",":"--..--", "?":"..--..", "!":"-.-.--",
};
const REVERSE: Record<string, string> = {};
for (const [k, v] of Object.entries(MORSE)) REVERSE[v] = k;

export default function MorseCodeComponent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const toMorse = () => {
    setOutput(input.toUpperCase().split("").map(c => MORSE[c] || c).join(" "));
  };

  const toText = () => {
    setOutput(input.split(" ").map(m => {
      if (m === "/") return " ";
      return REVERSE[m] || m;
    }).join(""));
  };

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <textarea className="w-full h-28 p-3 border rounded-lg font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="텍스트 또는 모스 부호를 입력하세요..." value={input} onChange={e => setInput(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={toMorse} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">텍스트 → 모스</button>
        <button onClick={toText} className="flex-1 py-2 bg-green-600 text-white rounded-lg">모스 → 텍스트</button>
      </div>
      {output && (
        <div className="relative">
          <div className="p-4 border rounded-lg bg-gray-50 font-mono text-lg break-all">{output}</div>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
      <details className="text-xs text-gray-400">
        <summary className="cursor-pointer">모스 부호표</summary>
        <div className="grid grid-cols-6 gap-1 mt-2 font-mono">
          {Object.entries(MORSE).filter(([k]) => k !== " ").map(([k, v]) => (
            <span key={k}>{k}={v}</span>
          ))}
        </div>
      </details>
    </div>
  );
}
