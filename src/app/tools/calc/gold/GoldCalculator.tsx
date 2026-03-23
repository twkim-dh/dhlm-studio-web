"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

// 1돈 = 3.75g, 1oz = 31.1035g
const DON_TO_GRAM = 3.75;
const OZ_TO_GRAM = 31.1035;

// 24K 1돈 기준 약 45만원 -> 1g = 450000 / 3.75 = 120000원
const PRICE_PER_GRAM_24K = 120000;

const PURITY: Record<string, { label: string; ratio: number }> = {
  "24K": { label: "24K (99.9%)", ratio: 1.0 },
  "18K": { label: "18K (75%)", ratio: 0.75 },
  "14K": { label: "14K (58.5%)", ratio: 0.585 },
};

type WeightUnit = "don" | "g" | "oz";

interface Result {
  pricePerGram: number;
  totalWeight: number;
  estimatedBuy: number;
  estimatedSell: number;
}

export default function GoldCalculator() {
  const [goldType, setGoldType] = useState("24K");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<WeightUnit>("don");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    let grams: number;
    if (unit === "don") grams = w * DON_TO_GRAM;
    else if (unit === "oz") grams = w * OZ_TO_GRAM;
    else grams = w;

    const pricePerGram = PRICE_PER_GRAM_24K * PURITY[goldType].ratio;
    const basePrice = pricePerGram * grams;

    setResult({
      pricePerGram,
      totalWeight: grams,
      estimatedBuy: Math.round(basePrice * 1.05),
      estimatedSell: Math.round(basePrice * 0.95),
    });
  }

  const units: { key: WeightUnit; label: string }[] = [
    { key: "don", label: "돈" },
    { key: "g", label: "g" },
    { key: "oz", label: "oz" },
  ];

  return (
    <CalculatorLayout title="금 시세 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              금 종류
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PURITY).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setGoldType(key)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    goldType === key
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:border-brand"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              무게 단위
            </label>
            <div className="grid grid-cols-3 gap-2">
              {units.map((u) => (
                <button
                  key={u.key}
                  onClick={() => setUnit(u.key)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    unit === u.key
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:border-brand"
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              무게 ({units.find((u) => u.key === unit)?.label})
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="무게 입력"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value.replace(/[^0-9.]/g, ""))
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
            <p className="text-sm text-gray-600 mb-1">
              {PURITY[goldType].label} 예상 매입가
            </p>
            <p className="text-3xl font-bold text-brand">
              {formatWon(result.estimatedBuy)}
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["g당 시세", formatWon(result.pricePerGram)],
              ["총 중량", `${result.totalWeight.toFixed(2)}g`],
              ["예상 매입가 (참고)", formatWon(result.estimatedBuy)],
              ["예상 매도가 (참고)", formatWon(result.estimatedSell)],
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
            * 참고용 고정 시세(24K 1돈 약 45만원)입니다. 실제 금 시세와 차이가
            있을 수 있습니다.
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
