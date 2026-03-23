"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

interface Result {
  workDays: number;
  workYears: number;
  dailyWage: number;
  severancePay: number;
}

export default function SeveranceCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlySalary1, setMonthlySalary1] = useState("");
  const [monthlySalary2, setMonthlySalary2] = useState("");
  const [monthlySalary3, setMonthlySalary3] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    if (!startDate || !endDate) return;
    const s1 = parseFloat(monthlySalary1);
    const s2 = parseFloat(monthlySalary2);
    const s3 = parseFloat(monthlySalary3);
    if (!s1 || !s2 || !s3 || s1 <= 0 || s2 <= 0 || s3 <= 0) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return;

    const workDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const workYears = workDays / 365;

    const totalThreeMonths = (s1 + s2 + s3) * 10000;
    const dailyWage = totalThreeMonths / 91;
    const severancePay = Math.round(dailyWage * 30 * workYears);

    setResult({
      workDays,
      workYears: Math.round(workYears * 100) / 100,
      dailyWage: Math.round(dailyWage),
      severancePay,
    });
  }

  return (
    <CalculatorLayout title="퇴직금 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              입사일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              퇴사일
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
            />
          </div>
        </div>

        <p className="text-sm font-medium text-gray-700 mb-2">
          최근 3개월 월급 (만원)
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "1개월 전", value: monthlySalary1, setter: setMonthlySalary1 },
            { label: "2개월 전", value: monthlySalary2, setter: setMonthlySalary2 },
            { label: "3개월 전", value: monthlySalary3, setter: setMonthlySalary3 },
          ].map((item) => (
            <div key={item.label}>
              <label className="block text-xs text-gray-500 mb-1">
                {item.label}
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="300"
                value={item.value}
                onChange={(e) =>
                  item.setter(e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={calculate}
          className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-brand-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">예상 퇴직금</p>
            <p className="text-3xl font-bold text-brand">
              {formatWon(result.severancePay)}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            {[
              ["총 근무일수", `${result.workDays.toLocaleString("ko-KR")}일`],
              ["근무연수", `${result.workYears}년`],
              ["1일 평균임금", formatWon(result.dailyWage)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-1 border-b border-gray-100"
              >
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-900 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            * 퇴직금 = 1일 평균임금 x 30일 x 근무연수
            <br />* 실제 퇴직금은 상여금, 연차수당 등에 따라 달라질 수 있습니다.
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
