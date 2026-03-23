"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

type Mode = "cost_margin" | "sell_margin" | "cost_sell";

interface Result {
  cost: number;
  sellPrice: number;
  profit: number;
  marginRate: number;
  markupRate: number;
}

export default function MarginCalculator() {
  const [mode, setMode] = useState<Mode>("cost_margin");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const v1 = parseFloat(input1);
    const v2 = parseFloat(input2);
    if (!v1 || v1 <= 0 || !v2 || v2 <= 0) return;

    let cost: number, sellPrice: number, profit: number;

    if (mode === "cost_margin") {
      cost = v1;
      sellPrice = Math.round(cost / (1 - v2 / 100));
      profit = sellPrice - cost;
    } else if (mode === "sell_margin") {
      sellPrice = v1;
      cost = Math.round(sellPrice * (1 - v2 / 100));
      profit = sellPrice - cost;
    } else {
      cost = v1;
      sellPrice = v2;
      profit = sellPrice - cost;
    }

    const marginRate = sellPrice > 0 ? (profit / sellPrice) * 100 : 0;
    const markupRate = cost > 0 ? (profit / cost) * 100 : 0;

    setResult({
      cost,
      sellPrice,
      profit,
      marginRate: Math.round(marginRate * 100) / 100,
      markupRate: Math.round(markupRate * 100) / 100,
    });
  }

  const modes: { key: Mode; label: string }[] = [
    { key: "cost_margin", label: "원가 + 마진율" },
    { key: "sell_margin", label: "판매가 + 마진율" },
    { key: "cost_sell", label: "원가 + 판매가" },
  ];

  const labels: Record<Mode, [string, string]> = {
    cost_margin: ["원가 (원)", "마진율 (%)"],
    sell_margin: ["판매가 (원)", "마진율 (%)"],
    cost_sell: ["원가 (원)", "판매가 (원)"],
  };

  return (
    <CalculatorLayout title="마진 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계산 모드
            </label>
            <div className="grid grid-cols-3 gap-2">
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    setMode(m.key);
                    setInput1("");
                    setInput2("");
                    setResult(null);
                  }}
                  className={`py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                    mode === m.key
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {labels[mode][0]}
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="입력"
              value={input1}
              onChange={(e) =>
                setInput1(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {labels[mode][1]}
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="입력"
              value={input2}
              onChange={(e) =>
                setInput2(e.target.value.replace(/[^0-9.]/g, ""))
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
          <div className="space-y-3 text-sm">
            {[
              ["원가", formatWon(result.cost)],
              ["판매가", formatWon(result.sellPrice)],
              ["이익", formatWon(result.profit)],
              ["마진율", `${result.marginRate}%`],
              ["마크업율", `${result.markupRate}%`],
            ].map(([label, value]) => (
              <div
                key={label}
                className={`flex justify-between items-center py-2 ${
                  label === "이익"
                    ? "bg-brand-50 rounded-lg px-3"
                    : "border-b border-gray-100"
                }`}
              >
                <span className="text-gray-600 font-medium">{label}</span>
                <span
                  className={`font-bold ${
                    label === "이익"
                      ? result.profit >= 0
                        ? "text-brand text-xl"
                        : "text-red-500 text-xl"
                      : "text-gray-900"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            * 마진율 = 이익 / 판매가 x 100
            <br />* 마크업율 = 이익 / 원가 x 100
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
