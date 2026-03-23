"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function getSigmaLevel(defectRate: number): string {
  // Approximate sigma level from defect rate (%)
  if (defectRate <= 0.00034) return "6\u03c3";
  if (defectRate <= 0.023) return "5\u03c3";
  if (defectRate <= 0.62) return "4\u03c3";
  if (defectRate <= 6.68) return "3\u03c3";
  if (defectRate <= 30.85) return "2\u03c3";
  if (defectRate <= 69.15) return "1\u03c3";
  return "1\u03c3 \ubbf8\ub9cc";
}

interface Result {
  defectRate: number;
  ppm: number;
  yieldRate: number;
  sigmaLevel: string;
}

export default function DefectCalculator() {
  const [total, setTotal] = useState("");
  const [defects, setDefects] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const t = parseFloat(total);
    const d = parseFloat(defects);
    if (!t || t <= 0 || isNaN(d) || d < 0) return;
    if (d > t) return;

    const defectRate = (d / t) * 100;
    const ppm = (d / t) * 1_000_000;
    const yieldRate = 100 - defectRate;

    setResult({
      defectRate,
      ppm,
      yieldRate,
      sigmaLevel: getSigmaLevel(defectRate),
    });
  }

  return (
    <CalculatorLayout title="불량률 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              총 생산수
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="예: 10000"
              value={total}
              onChange={(e) =>
                setTotal(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              불량수
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="예: 15"
              value={defects}
              onChange={(e) =>
                setDefects(e.target.value.replace(/[^0-9]/g, ""))
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
          <div className="bg-brand-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">불량률</p>
            <p className="text-3xl font-bold text-brand">
              {result.defectRate.toFixed(4)}%
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["불량률 (%)", result.defectRate.toFixed(4) + "%"],
              ["PPM", Math.round(result.ppm).toLocaleString("ko-KR")],
              ["수율 (%)", result.yieldRate.toFixed(4) + "%"],
              ["시그마 수준", result.sigmaLevel],
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
            <p>* 불량률 = 불량수 / 총생산수 x 100</p>
            <p>* PPM = 불량수 / 총생산수 x 1,000,000</p>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
