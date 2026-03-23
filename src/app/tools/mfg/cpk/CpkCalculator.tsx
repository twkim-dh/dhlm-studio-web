"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

interface Result {
  cp: number;
  cpu: number;
  cpl: number;
  cpk: number;
  label: string;
  color: string;
}

function judge(cpk: number): { label: string; color: string } {
  if (cpk >= 1.33) return { label: "양호 (Excellent)", color: "text-green-600" };
  if (cpk >= 1.0) return { label: "보통 (Acceptable)", color: "text-yellow-600" };
  return { label: "불량 (Poor)", color: "text-red-500" };
}

export default function CpkCalculator() {
  const [usl, setUsl] = useState("");
  const [lsl, setLsl] = useState("");
  const [mean, setMean] = useState("");
  const [sigma, setSigma] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const u = parseFloat(usl);
    const l = parseFloat(lsl);
    const m = parseFloat(mean);
    const s = parseFloat(sigma);
    if (isNaN(u) || isNaN(l) || isNaN(m) || !s || s <= 0) return;
    if (u <= l) return;

    const cp = (u - l) / (6 * s);
    const cpu = (u - m) / (3 * s);
    const cpl = (m - l) / (3 * s);
    const cpk = Math.min(cpu, cpl);
    const { label, color } = judge(cpk);

    setResult({ cp, cpu, cpl, cpk, label, color });
  }

  const fields = [
    { label: "USL (규격 상한)", value: usl, setter: setUsl, placeholder: "예: 10.5" },
    { label: "LSL (규격 하한)", value: lsl, setter: setLsl, placeholder: "예: 9.5" },
    { label: "평균 (X\u0304)", value: mean, setter: setMean, placeholder: "예: 10.02" },
    { label: "표준편차 (\u03c3)", value: sigma, setter: setSigma, placeholder: "예: 0.08" },
  ];

  return (
    <CalculatorLayout title="Cpk 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {f.label}
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder={f.placeholder}
                value={f.value}
                onChange={(e) =>
                  f.setter(e.target.value.replace(/[^0-9.\-]/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
              />
            </div>
          ))}
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
          <div className="bg-brand-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Cpk (공정능력지수)</p>
            <p className="text-3xl font-bold text-brand">
              {result.cpk.toFixed(3)}
            </p>
          </div>
          <div className="text-center mb-4">
            <span className="text-sm text-gray-600">판정: </span>
            <span className={`text-lg font-bold ${result.color}`}>
              {result.label}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["Cp", result.cp.toFixed(3)],
              ["Cpu", result.cpu.toFixed(3)],
              ["Cpl", result.cpl.toFixed(3)],
              ["Cpk", result.cpk.toFixed(3)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-2 border-b border-gray-100"
              >
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-medium mb-1">판정 기준</p>
            <p>Cpk &ge; 1.33: 양호 / Cpk &ge; 1.0: 보통 / Cpk &lt; 1.0: 불량</p>
            <p className="mt-1">Cp = (USL-LSL) / 6&sigma;, Cpk = min(Cpu, Cpl)</p>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
