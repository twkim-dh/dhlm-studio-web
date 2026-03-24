"use client";

import { useState, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

const DON_TO_GRAM = 3.75;
const OZ_TO_GRAM = 31.1035;

type WeightUnit = "don" | "g" | "oz";

interface GoldPrice {
  gold24kPerGram: number;
  gold18kPerGram: number;
  gold14kPerGram: number;
  goldUsdPerOz: number;
  usdToKrw: number;
  goldPerDon: number;
  updatedAt: string | null;
  isFallback: boolean;
}

interface Result {
  pricePerGram: number;
  totalWeight: number;
  estimatedBuy: number;
  estimatedSell: number;
  weightInDon: number;
  weightInGram: number;
  weightInOz: number;
}

export default function GoldCalculator() {
  const [goldType, setGoldType] = useState("24K");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<WeightUnit>("don");
  const [result, setResult] = useState<Result | null>(null);
  const [price, setPrice] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gold")
      .then((r) => r.json())
      .then((data) => {
        setPrice(data);
        setLoading(false);
      })
      .catch(() => {
        setPrice({
          gold24kPerGram: 135000,
          gold18kPerGram: 101250,
          gold14kPerGram: 78975,
          goldUsdPerOz: 2350,
          usdToKrw: 1380,
          goldPerDon: 506250,
          updatedAt: null,
          isFallback: true,
        });
        setLoading(false);
      });
  }, []);

  function getPricePerGram(): number {
    if (!price) return 0;
    if (goldType === "18K") return price.gold18kPerGram;
    if (goldType === "14K") return price.gold14kPerGram;
    return price.gold24kPerGram;
  }

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0 || !price) {
      setResult(null);
      return;
    }

    let grams: number;
    if (unit === "don") grams = w * DON_TO_GRAM;
    else if (unit === "oz") grams = w * OZ_TO_GRAM;
    else grams = w;

    const pricePerGram = getPricePerGram();
    const basePrice = pricePerGram * grams;

    setResult({
      pricePerGram,
      totalWeight: grams,
      estimatedBuy: Math.round(basePrice * 1.05),
      estimatedSell: Math.round(basePrice * 0.95),
      weightInDon: grams / DON_TO_GRAM,
      weightInGram: grams,
      weightInOz: grams / OZ_TO_GRAM,
    });
  }

  // Real-time calculation whenever inputs change
  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, unit, goldType, price]);

  const units: { key: WeightUnit; label: string }[] = [
    { key: "don", label: "돈" },
    { key: "g", label: "g" },
    { key: "oz", label: "oz" },
  ];

  const purityOptions = [
    { key: "24K", label: "24K (99.9%)" },
    { key: "18K", label: "18K (75%)" },
    { key: "14K", label: "14K (58.5%)" },
  ];

  return (
    <CalculatorLayout title="금 시세 계산기" category="금융">
      {/* 실시간 시세 표시 */}
      {price && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-yellow-800">🥇 현재 금 시세</h2>
            <span className="text-xs text-yellow-600">
              {price.updatedAt
                ? `${new Date(price.updatedAt).toLocaleString("ko-KR")} 기준`
                : "참고 시세"}
              {price.isFallback && " (기본값)"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-500">1g</p>
              <p className="text-lg font-bold text-gray-900">
                {loading ? "..." : formatWon(price.gold24kPerGram)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">1돈 (3.75g)</p>
              <p className="text-lg font-bold text-gray-900">
                {loading ? "..." : formatWon(price.goldPerDon)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">1oz</p>
              <p className="text-lg font-bold text-gray-900">
                {loading ? "..." : formatWon(price.gold24kPerGram * OZ_TO_GRAM)}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400 text-center">
            국제 금시세 ${price.goldUsdPerOz}/oz · 환율 ₩{price.usdToKrw}/$ 기준
          </div>
        </div>
      )}

      {/* 계산기 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">금 종류</label>
            <div className="grid grid-cols-3 gap-2">
              {purityOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setGoldType(key)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    goldType === key
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
            <label className="block text-sm font-medium text-gray-700 mb-2">무게 단위</label>
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
              onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          disabled={loading}
          className="w-full mt-4 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {loading ? "시세 로딩 중..." : "계산하기"}
        </button>
      </div>

      {/* 결과 */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">
              {purityOptions.find(p => p.key === goldType)?.label} 예상 매입가
            </p>
            <p className="text-3xl font-bold text-yellow-700">{formatWon(result.estimatedBuy)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">단위 환산</p>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="font-bold text-gray-800">{result.weightInDon.toFixed(2)}</p>
                <p className="text-xs text-gray-500">돈</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">{result.weightInGram.toFixed(2)}</p>
                <p className="text-xs text-gray-500">g</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">{result.weightInOz.toFixed(4)}</p>
                <p className="text-xs text-gray-500">oz</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["g당 시세", formatWon(result.pricePerGram)],
              ["총 중량", `${result.totalWeight.toFixed(2)}g`],
              ["예상 매입가 (+5%)", formatWon(result.estimatedBuy)],
              ["예상 매도가 (-5%)", formatWon(result.estimatedSell)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            * 실시간 국제 금시세와 환율을 기반으로 계산한 참고 가격입니다.
            실제 거래 시세와 차이가 있을 수 있습니다.
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
