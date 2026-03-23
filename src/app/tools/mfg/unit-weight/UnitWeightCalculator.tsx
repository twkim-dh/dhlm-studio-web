"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const MATERIALS: Record<string, { label: string; density: number }> = {
  steel: { label: "철 (Steel)", density: 7.85 },
  sus: { label: "SUS (스테인리스)", density: 7.93 },
  aluminum: { label: "알루미늄", density: 2.71 },
  copper: { label: "구리", density: 8.96 },
};

interface Result {
  weightKg: number;
  weightTon: number;
  material: string;
  density: number;
}

export default function UnitWeightCalculator() {
  const [material, setMaterial] = useState("steel");
  const [thickness, setThickness] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const t = parseFloat(thickness);
    const w = parseFloat(width);
    const l = parseFloat(length);
    if (!t || !w || !l || t <= 0 || w <= 0 || l <= 0) return;

    const { density, label } = MATERIALS[material];
    // 중량(kg) = 비중 × 두께(mm) × 폭(mm) × 길이(mm) / 1,000,000
    const weightKg = (density * t * w * l) / 1_000_000;

    setResult({
      weightKg,
      weightTon: weightKg / 1000,
      material: label,
      density,
    });
  }

  return (
    <CalculatorLayout title="단중 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              재질
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            >
              {Object.entries(MATERIALS).map(([key, { label, density }]) => (
                <option key={key} value={key}>
                  {label} (비중 {density})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              두께 (mm)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="예: 1.6"
              value={thickness}
              onChange={(e) =>
                setThickness(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              폭 (mm)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="예: 1219"
              value={width}
              onChange={(e) =>
                setWidth(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              길이 (mm)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="예: 2438"
              value={length}
              onChange={(e) =>
                setLength(e.target.value.replace(/[^0-9.]/g, ""))
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
            <p className="text-sm text-gray-600 mb-1">중량</p>
            <p className="text-3xl font-bold text-brand">
              {result.weightKg.toFixed(2)} kg
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["재질", result.material],
              ["비중", result.density.toString()],
              ["중량 (kg)", result.weightKg.toFixed(3) + " kg"],
              ["중량 (ton)", result.weightTon.toFixed(4) + " ton"],
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
            * 계산식: 비중 x 두께(mm) x 폭(mm) x 길이(mm) / 1,000,000
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
