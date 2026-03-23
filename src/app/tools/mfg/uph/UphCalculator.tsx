"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type CalcMode = "fromDaily" | "fromCT";

interface Result {
  uph: number;
  daily: number;
  monthly: number;
}

export default function UphCalculator() {
  const [mode, setMode] = useState<CalcMode>("fromDaily");
  const [dailyOutput, setDailyOutput] = useState("");
  const [operatingHours, setOperatingHours] = useState("8");
  const [cycleTime, setCycleTime] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const hours = parseFloat(operatingHours) || 8;

    if (mode === "fromDaily") {
      const daily = parseFloat(dailyOutput);
      if (!daily || daily <= 0) return;
      const uph = daily / hours;
      setResult({ uph, daily, monthly: daily * 22 });
    } else {
      const ct = parseFloat(cycleTime);
      if (!ct || ct <= 0) return;
      const uph = 3600 / ct;
      const daily = uph * hours;
      setResult({ uph, daily, monthly: daily * 22 });
    }
  }

  return (
    <CalculatorLayout title="UPH 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계산 방식
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["fromDaily", "일 생산량 기준"],
                  ["fromCT", "사이클타임 기준"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setMode(val)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    mode === val
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:border-brand"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {mode === "fromDaily" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일 생산량 (개)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="예: 4000"
                value={dailyOutput}
                onChange={(e) =>
                  setDailyOutput(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이클타임 (초)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="예: 12.5"
                value={cycleTime}
                onChange={(e) =>
                  setCycleTime(e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가동시간 (시간/일)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="8"
              value={operatingHours}
              onChange={(e) =>
                setOperatingHours(e.target.value.replace(/[^0-9.]/g, ""))
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
            <p className="text-sm text-gray-600 mb-1">UPH (시간당 생산량)</p>
            <p className="text-3xl font-bold text-brand">
              {result.uph.toFixed(1)}개
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["UPH", `${result.uph.toFixed(1)}개/시간`],
              ["일 생산량", `${Math.round(result.daily).toLocaleString("ko-KR")}개`],
              ["월 생산량 (22일)", `${Math.round(result.monthly).toLocaleString("ko-KR")}개`],
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
            * UPH = 일생산량 / 가동시간 또는 3600 / 사이클타임(초)
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
