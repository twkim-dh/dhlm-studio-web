"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

interface Result {
  totalPrincipal: number;
  preTaxInterest: number;
  tax: number;
  afterTaxInterest: number;
  maturityAmount: number;
}

export default function DepositCalculator() {
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [taxType, setTaxType] = useState<"normal" | "taxfree">("normal");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const monthlyAmount = parseFloat(monthly);
    const annualRate = parseFloat(rate);
    const totalMonths = parseInt(months);
    if (
      !monthlyAmount ||
      !annualRate ||
      !totalMonths ||
      monthlyAmount <= 0 ||
      annualRate <= 0 ||
      totalMonths <= 0
    )
      return;

    const deposit = monthlyAmount * 10000;
    const totalPrincipal = deposit * totalMonths;
    const monthlyRate = annualRate / 100 / 12;

    // 정기적금 이자 계산 (단리)
    let preTaxInterest = 0;
    for (let m = 1; m <= totalMonths; m++) {
      const remainingMonths = totalMonths - m + 1;
      preTaxInterest += deposit * monthlyRate * remainingMonths;
    }
    preTaxInterest = Math.round(preTaxInterest);

    const taxRate = taxType === "normal" ? 0.154 : 0;
    const tax = Math.round(preTaxInterest * taxRate);
    const afterTaxInterest = preTaxInterest - tax;
    const maturityAmount = totalPrincipal + afterTaxInterest;

    setResult({
      totalPrincipal,
      preTaxInterest,
      tax,
      afterTaxInterest,
      maturityAmount,
    });
  }

  return (
    <CalculatorLayout title="적금 이자 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월 납입액 (만원)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="예: 50"
              value={monthly}
              onChange={(e) =>
                setMonthly(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연이율 (%)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="예: 3.5"
                value={rate}
                onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기간 (개월)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="예: 12"
                value={months}
                onChange={(e) =>
                  setMonths(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이자 과세
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["normal", "taxfree"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTaxType(t)}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    taxType === t
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t === "normal" ? "일반과세 (15.4%)" : "비과세"}
                </button>
              ))}
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
            <p className="text-sm text-gray-600 mb-1">만기 수령액</p>
            <p className="text-3xl font-bold text-brand">
              {formatWon(result.maturityAmount)}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            {[
              ["원금 합계", formatWon(result.totalPrincipal)],
              ["세전 이자", formatWon(result.preTaxInterest)],
              [
                taxType === "normal" ? "이자 과세 (15.4%)" : "이자 과세",
                taxType === "normal"
                  ? `-${formatWon(result.tax)}`
                  : "비과세",
              ],
              ["세후 이자", formatWon(result.afterTaxInterest)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-1 border-b border-gray-100"
              >
                <span className="text-gray-600">{label}</span>
                <span
                  className={`font-medium ${
                    String(value).startsWith("-")
                      ? "text-red-500"
                      : "text-gray-900"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
