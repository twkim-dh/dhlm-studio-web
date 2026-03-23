"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "of" | "is_what" | "change";

interface Result {
  answer: string;
  process: string;
}

export default function PercentCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const a = parseFloat(inputA);
    const b = parseFloat(inputB);
    if (isNaN(a) || isNaN(b)) return;

    if (mode === "of") {
      // A의 B%는?
      if (b < 0) return;
      const answer = (a * b) / 100;
      const rounded = Math.round(answer * 10000) / 10000;
      setResult({
        answer: `${a.toLocaleString("ko-KR")}의 ${b}% = ${rounded.toLocaleString("ko-KR")}`,
        process: `${a.toLocaleString("ko-KR")} x ${b} / 100 = ${rounded.toLocaleString("ko-KR")}`,
      });
    } else if (mode === "is_what") {
      // A는 B의 몇%?
      if (b === 0) return;
      const answer = (a / b) * 100;
      const rounded = Math.round(answer * 100) / 100;
      setResult({
        answer: `${a.toLocaleString("ko-KR")}은(는) ${b.toLocaleString("ko-KR")}의 ${rounded}%`,
        process: `${a.toLocaleString("ko-KR")} / ${b.toLocaleString("ko-KR")} x 100 = ${rounded}%`,
      });
    } else {
      // A에서 B로 변화율
      if (a === 0) return;
      const answer = ((b - a) / a) * 100;
      const rounded = Math.round(answer * 100) / 100;
      const sign = rounded >= 0 ? "+" : "";
      setResult({
        answer: `${a.toLocaleString("ko-KR")} → ${b.toLocaleString("ko-KR")}: ${sign}${rounded}%`,
        process: `(${b.toLocaleString("ko-KR")} - ${a.toLocaleString("ko-KR")}) / ${a.toLocaleString("ko-KR")} x 100 = ${sign}${rounded}%`,
      });
    }
  }

  const modes: { key: Mode; label: string; desc: string }[] = [
    { key: "of", label: "A의 B%", desc: "A의 B%는 얼마인가?" },
    { key: "is_what", label: "A는 B의 몇%", desc: "A는 B의 몇 퍼센트인가?" },
    { key: "change", label: "변화율", desc: "A에서 B로의 변화율은?" },
  ];

  const labels: Record<Mode, [string, string]> = {
    of: ["숫자 A", "퍼센트 B (%)"],
    is_what: ["숫자 A", "기준 숫자 B"],
    change: ["이전 값 A", "이후 값 B"],
  };

  return (
    <CalculatorLayout title="퍼센트 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계산 모드
            </label>
            <div className="grid grid-cols-3 gap-2">
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    setMode(m.key);
                    setInputA("");
                    setInputB("");
                    setResult(null);
                  }}
                  className={`py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                    mode === m.key
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {modes.find((m) => m.key === mode)?.desc}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {labels[mode][0]}
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="입력"
              value={inputA}
              onChange={(e) =>
                setInputA(e.target.value.replace(/[^0-9.\-]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {labels[mode][1]}
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="입력"
              value={inputB}
              onChange={(e) =>
                setInputB(e.target.value.replace(/[^0-9.\-]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="w-full mt-4 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-brand-50 rounded-lg p-4 mb-4 text-center">
            <p className="text-sm text-gray-600 mb-1">계산 결과</p>
            <p className="text-xl font-bold text-brand">{result.answer}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">계산 과정</p>
            <p className="text-sm text-gray-700 font-medium mt-1">
              {result.process}
            </p>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
