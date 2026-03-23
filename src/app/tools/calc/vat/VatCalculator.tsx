"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

interface Result {
  supplyPrice: number;
  vatAmount: number;
  totalPrice: number;
}

export default function VatCalculator() {
  const [amount, setAmount] = useState("");
  const [taxRate, setTaxRate] = useState("10");
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const value = parseFloat(amount);
    const rate = parseFloat(taxRate);
    if (!value || value <= 0 || !rate || rate < 0) return;

    const rateDecimal = rate / 100;

    if (mode === "include") {
      // 부가세 포함 금액 -> 분리
      const supplyPrice = Math.round(value / (1 + rateDecimal));
      const vatAmount = value - supplyPrice;
      setResult({ supplyPrice, vatAmount, totalPrice: value });
    } else {
      // 부가세 제외 금액 -> 포함
      const vatAmount = Math.round(value * rateDecimal);
      setResult({
        supplyPrice: value,
        vatAmount,
        totalPrice: value + vatAmount,
      });
    }
  }

  return (
    <CalculatorLayout title="부가세 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계산 모드
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["include", "exclude"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    mode === m
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {m === "include"
                    ? "VAT 포함 → 분리"
                    : "VAT 제외 → 포함"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === "include" ? "부가세 포함 금액 (원)" : "공급가액 (원)"}
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="예: 110000"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              세율 (%)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="10"
              value={taxRate}
              onChange={(e) =>
                setTaxRate(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
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
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">공급가액</span>
              <span className="text-lg font-bold text-gray-900">
                {formatWon(result.supplyPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">부가세 ({taxRate}%)</span>
              <span className="text-lg font-bold text-red-500">
                {formatWon(result.vatAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 bg-brand-50 rounded-lg px-3">
              <span className="text-gray-700 font-semibold">합계</span>
              <span className="text-2xl font-bold text-brand">
                {formatWon(result.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
