"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

// 간이세액표 기반 근사 소득세 계산
function calcIncomeTax(monthlyTaxable: number): number {
  const annual = monthlyTaxable * 12;
  let tax = 0;
  if (annual <= 14_000_000) {
    tax = annual * 0.06;
  } else if (annual <= 50_000_000) {
    tax = 840_000 + (annual - 14_000_000) * 0.15;
  } else if (annual <= 88_000_000) {
    tax = 6_240_000 + (annual - 50_000_000) * 0.24;
  } else if (annual <= 150_000_000) {
    tax = 15_360_000 + (annual - 88_000_000) * 0.35;
  } else if (annual <= 300_000_000) {
    tax = 37_060_000 + (annual - 150_000_000) * 0.38;
  } else if (annual <= 500_000_000) {
    tax = 94_060_000 + (annual - 300_000_000) * 0.4;
  } else if (annual <= 1_000_000_000) {
    tax = 174_060_000 + (annual - 500_000_000) * 0.42;
  } else {
    tax = 384_060_000 + (annual - 1_000_000_000) * 0.45;
  }
  return Math.round(tax / 12);
}

interface Result {
  monthlyGross: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  totalDeduction: number;
  monthlyNet: number;
  annualNet: number;
}

export default function SalaryCalculator() {
  const [salary, setSalary] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const annualManwon = parseFloat(salary);
    if (!annualManwon || annualManwon <= 0) return;

    const annual = annualManwon * 10000;
    const monthly = Math.round(annual / 12);

    const nationalPension = Math.round(monthly * 0.045);
    const healthInsurance = Math.round(monthly * 0.03545);
    const longTermCare = Math.round(healthInsurance * 0.1281);
    const employmentInsurance = Math.round(monthly * 0.009);
    const incomeTax = calcIncomeTax(monthly);
    const localIncomeTax = Math.round(incomeTax * 0.1);

    const totalDeduction =
      nationalPension +
      healthInsurance +
      longTermCare +
      employmentInsurance +
      incomeTax +
      localIncomeTax;

    const monthlyNet = monthly - totalDeduction;

    setResult({
      monthlyGross: monthly,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localIncomeTax,
      totalDeduction,
      monthlyNet,
      annualNet: monthlyNet * 12,
    });
  }

  return (
    <CalculatorLayout title="연봉 실수령액 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          연봉 (만원)
        </label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="예: 4000"
          value={salary}
          onChange={(e) => setSalary(e.target.value.replace(/[^0-9.]/g, ""))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
        />
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
            <p className="text-sm text-gray-600 mb-1">월 실수령액</p>
            <p className="text-3xl font-bold text-brand">
              {formatWon(result.monthlyNet)}
            </p>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            공제 항목
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ["월 급여", result.monthlyGross],
              ["국민연금 (4.5%)", -result.nationalPension],
              ["건강보험 (3.545%)", -result.healthInsurance],
              ["장기요양보험 (12.81%)", -result.longTermCare],
              ["고용보험 (0.9%)", -result.employmentInsurance],
              ["소득세", -result.incomeTax],
              ["지방소득세 (10%)", -result.localIncomeTax],
            ].map(([label, amount]) => (
              <div
                key={label as string}
                className="flex justify-between py-1 border-b border-gray-100"
              >
                <span className="text-gray-600">{label as string}</span>
                <span
                  className={
                    (amount as number) < 0 ? "text-red-500" : "text-gray-900"
                  }
                >
                  {(amount as number) < 0 ? "-" : ""}
                  {formatWon(Math.abs(amount as number))}
                </span>
              </div>
            ))}
            <div className="flex justify-between py-2 font-semibold border-t-2 border-gray-200 mt-2">
              <span>총 공제액</span>
              <span className="text-red-500">
                -{formatWon(result.totalDeduction)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
            연간 실수령액: <strong>{formatWon(result.annualNet)}</strong>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
