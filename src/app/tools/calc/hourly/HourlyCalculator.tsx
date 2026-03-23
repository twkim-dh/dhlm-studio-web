"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

const MIN_WAGE_2026 = 10030;

interface Result {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  weeklyHolidayPay: number;
  monthlyWithHoliday: number;
}

export default function HourlyCalculator() {
  const [hourly, setHourly] = useState(MIN_WAGE_2026.toString());
  const [dailyHours, setDailyHours] = useState("8");
  const [weeklyDays, setWeeklyDays] = useState("5");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const h = parseFloat(hourly);
    const dh = parseFloat(dailyHours) || 8;
    const wd = parseFloat(weeklyDays) || 5;
    if (!h || h <= 0) return;

    const daily = h * dh;
    const weeklyWork = daily * wd;

    // 주휴수당: 주 15시간 이상 근무 시, 1일분 시급 x 일 근무시간
    const weeklyHolidayPay = dh * wd >= 15 ? h * dh : 0;
    const weekly = weeklyWork + weeklyHolidayPay;

    // 월급: 209시간 기준 (주 40시간 + 주휴 8시간 = 48시간 x 4.345주)
    // 실제로는 입력 기준으로 계산
    const weeklyTotalHours = dh * wd + (dh * wd >= 15 ? dh : 0);
    const monthlyHours = weeklyTotalHours * (365 / 7 / 12);
    const monthly = h * monthlyHours;
    const annual = monthly * 12;

    setResult({
      hourly: h,
      daily,
      weekly,
      monthly,
      annual,
      weeklyHolidayPay,
      monthlyWithHoliday: monthly,
    });
  }

  return (
    <CalculatorLayout title="시급 계산기 (2026 최저시급)">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
          2026년 최저시급: <strong>{MIN_WAGE_2026.toLocaleString("ko-KR")}원</strong>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시급 (원)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder={`기본: ${MIN_WAGE_2026.toLocaleString("ko-KR")}`}
              value={hourly}
              onChange={(e) =>
                setHourly(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일 근무시간
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="8"
                value={dailyHours}
                onChange={(e) =>
                  setDailyHours(e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주 근무일
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="5"
                value={weeklyDays}
                onChange={(e) =>
                  setWeeklyDays(e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
              />
            </div>
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
            <p className="text-sm text-gray-600 mb-1">예상 월급 (주휴수당 포함)</p>
            <p className="text-3xl font-bold text-brand">
              {formatWon(result.monthlyWithHoliday)}
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["시급", formatWon(result.hourly)],
              ["일급", formatWon(result.daily)],
              ["주급 (주휴수당 포함)", formatWon(result.weekly)],
              ["주휴수당 (주)", formatWon(result.weeklyHolidayPay)],
              ["월급 (주휴수당 포함)", formatWon(result.monthlyWithHoliday)],
              ["연봉 (예상)", formatWon(result.annual)],
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
            <p>* 주휴수당: 주 15시간 이상 근무 시 1일분 유급휴일 수당 포함</p>
            <p>* 월급: 주당 총 유급시간 x (365/7/12) x 시급</p>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
