"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

interface Result {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export default function OeeCalculator() {
  const [plannedTime, setPlannedTime] = useState("");
  const [actualTime, setActualTime] = useState("");
  const [totalProduced, setTotalProduced] = useState("");
  const [goodCount, setGoodCount] = useState("");
  const [idealCT, setIdealCT] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const pt = parseFloat(plannedTime);
    const at = parseFloat(actualTime);
    const tp = parseFloat(totalProduced);
    const gc = parseFloat(goodCount);
    const ict = parseFloat(idealCT);
    if (!pt || !at || !tp || isNaN(gc) || !ict) return;
    if (pt <= 0 || at <= 0 || tp <= 0 || gc < 0 || ict <= 0) return;

    const availability = (at / pt) * 100;
    // 성능률: 이론CT(분) x 총생산수 / 실가동시간(분) x 100
    const performance = ((tp * ict) / (at * 60)) * 100;
    const quality = (gc / tp) * 100;
    const oee = (availability * performance * quality) / 10000;

    setResult({ availability, performance, quality, oee });
  }

  const fields = [
    {
      label: "계획 가동시간 (분)",
      value: plannedTime,
      setter: setPlannedTime,
      placeholder: "예: 480",
    },
    {
      label: "실 가동시간 (분)",
      value: actualTime,
      setter: setActualTime,
      placeholder: "예: 420",
    },
    {
      label: "총 생산수 (개)",
      value: totalProduced,
      setter: setTotalProduced,
      placeholder: "예: 5000",
    },
    {
      label: "양품수 (개)",
      value: goodCount,
      setter: setGoodCount,
      placeholder: "예: 4900",
    },
    {
      label: "이론 사이클타임 (초)",
      value: idealCT,
      setter: setIdealCT,
      placeholder: "예: 4.5",
    },
  ];

  return (
    <CalculatorLayout title="가동률/OEE 계산기">
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
                  f.setter(e.target.value.replace(/[^0-9.]/g, ""))
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
            <p className="text-sm text-gray-600 mb-1">OEE (종합설비효율)</p>
            <p className="text-3xl font-bold text-brand">
              {result.oee.toFixed(1)}%
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["가동률", result.availability.toFixed(1) + "%"],
              ["성능률", result.performance.toFixed(1) + "%"],
              ["양품률", result.quality.toFixed(1) + "%"],
              ["OEE", result.oee.toFixed(1) + "%"],
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
            <p>* 가동률 = 실가동시간 / 계획가동시간 x 100</p>
            <p>* 성능률 = 총생산수 x 이론CT / 실가동시간 x 100</p>
            <p>* 양품률 = 양품수 / 총생산수 x 100</p>
            <p>* OEE = 가동률 x 성능률 x 양품률 / 10000</p>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
