"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

type InputType = "hourly" | "monthly" | "annual";

interface Result {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
}

export default function TimeCalculator() {
  const [inputType, setInputType] = useState<InputType>("hourly");
  const [amount, setAmount] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("40");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const val = parseFloat(amount);
    const wh = parseFloat(weeklyHours) || 40;
    if (!val || val <= 0) return;

    const dailyHours = wh / 5;
    let hourly: number;

    if (inputType === "hourly") {
      hourly = val;
    } else if (inputType === "monthly") {
      hourly = (val * 10000) / (wh * 4.345);
    } else {
      hourly = (val * 10000) / (wh * 52);
    }

    setResult({
      hourly,
      daily: hourly * dailyHours,
      weekly: hourly * wh,
      monthly: hourly * wh * 4.345,
      annual: hourly * wh * 52,
    });
  }

  const types: { key: InputType; label: string }[] = [
    { key: "hourly", label: "시급 (원)" },
    { key: "monthly", label: "월급 (만원)" },
    { key: "annual", label: "연봉 (만원)" },
  ];

  return (
    <CalculatorLayout title="시급 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              입력 기준
            </label>
            <div className="grid grid-cols-3 gap-2">
              {types.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setInputType(t.key)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    inputType === t.key
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:border-brand"
                  }`}
                >
                  {t.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {types.find((t) => t.key === inputType)?.label}
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="금액 입력"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주당 근무시간
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="40"
              value={weeklyHours}
              onChange={(e) =>
                setWeeklyHours(e.target.value.replace(/[^0-9.]/g, ""))
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
            <p className="text-sm text-gray-600 mb-1">시급</p>
            <p className="text-3xl font-bold text-brand">
              {formatWon(result.hourly)}
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["시급", formatWon(result.hourly)],
              ["일급", formatWon(result.daily)],
              ["주급", formatWon(result.weekly)],
              ["월급", formatWon(result.monthly)],
              ["연봉", formatWon(result.annual)],
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
            * 주당 {weeklyHours || 40}시간, 월 4.345주, 연 52주 기준
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
