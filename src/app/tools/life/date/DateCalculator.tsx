"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const DAY_NAMES = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

interface Result {
  diffDays: number;
  diffWeeks: number;
  diffMonths: number;
  startDay: string;
  endDay: string;
  dday: string;
}

export default function DateCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(Math.abs(diffDays) / 7);

    let diffMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (end.getDate() < start.getDate()) diffMonths--;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const endClean = new Date(endDate);
    endClean.setHours(0, 0, 0, 0);
    const dDayDiff = Math.round(
      (endClean.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    let dday: string;
    if (dDayDiff > 0) dday = `D-${dDayDiff}`;
    else if (dDayDiff === 0) dday = "D-Day";
    else dday = `D+${Math.abs(dDayDiff)}`;

    setResult({
      diffDays: Math.abs(diffDays),
      diffWeeks,
      diffMonths: Math.abs(diffMonths),
      startDay: DAY_NAMES[start.getDay()],
      endDay: DAY_NAMES[end.getDay()],
      dday,
    });
  }

  return (
    <CalculatorLayout title="날짜 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
            <p className="text-sm text-gray-600 mb-1">종료일 기준</p>
            <p className="text-3xl font-bold text-brand">{result.dday}</p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["날짜 차이", `${result.diffDays.toLocaleString("ko-KR")}일`],
              ["주 단위", `${result.diffWeeks}주 ${result.diffDays % 7}일`],
              ["월 단위", `약 ${result.diffMonths}개월`],
              ["시작일 요일", result.startDay],
              ["종료일 요일", result.endDay],
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
        </div>
      )}
    </CalculatorLayout>
  );
}
