"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const RATES: Record<string, { rate: number; name: string; symbol: string }> = {
  USD: { rate: 1380, name: "미국 달러", symbol: "$" },
  JPY: { rate: 9.2, name: "일본 엔", symbol: "\u00a5" },
  EUR: { rate: 1500, name: "유로", symbol: "\u20ac" },
  CNY: { rate: 190, name: "중국 위안", symbol: "\u00a5" },
};

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

interface Result {
  krw: number;
  foreign: number;
  currency: string;
  rate: number;
}

export default function ExchangeCalculator() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [direction, setDirection] = useState<"toKRW" | "fromKRW">("toKRW");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    const { rate } = RATES[currency];
    if (direction === "toKRW") {
      setResult({ krw: Math.round(val * rate), foreign: val, currency, rate });
    } else {
      setResult({
        krw: val,
        foreign: Math.round((val / rate) * 100) / 100,
        currency,
        rate,
      });
    }
  }

  return (
    <CalculatorLayout title="환율 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              변환 방향
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["toKRW", "외화 \u2192 원화"],
                  ["fromKRW", "원화 \u2192 외화"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setDirection(val)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    direction === val
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:border-brand"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              통화
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            >
              {Object.entries(RATES).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {direction === "toKRW" ? `금액 (${currency})` : "금액 (KRW)"}
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
            <p className="text-sm text-gray-600 mb-1">변환 결과</p>
            {direction === "toKRW" ? (
              <p className="text-3xl font-bold text-brand">
                {formatWon(result.krw)}
              </p>
            ) : (
              <p className="text-3xl font-bold text-brand">
                {RATES[result.currency].symbol}
                {result.foreign.toLocaleString("ko-KR")}
              </p>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">적용 환율</span>
              <span className="font-semibold text-gray-900">
                1 {result.currency} = {result.rate.toLocaleString("ko-KR")}원
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">외화 금액</span>
              <span className="font-semibold text-gray-900">
                {RATES[result.currency].symbol}
                {result.foreign.toLocaleString("ko-KR")}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">원화 금액</span>
              <span className="font-semibold text-gray-900">
                {formatWon(result.krw)}
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            * 참고용 고정 환율입니다. 실제 환율과 차이가 있을 수 있습니다.
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
