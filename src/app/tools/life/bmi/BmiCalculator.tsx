"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

interface Result {
  bmi: number;
  label: string;
  color: string;
}

function judge(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "저체중", color: "text-blue-500" };
  if (bmi < 23) return { label: "정상", color: "text-green-600" };
  if (bmi < 25) return { label: "과체중", color: "text-yellow-600" };
  return { label: "비만", color: "text-red-500" };
}

export default function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;

    const m = h / 100;
    const bmi = w / (m * m);
    const { label, color } = judge(bmi);
    setResult({ bmi, label, color });
  }

  return (
    <CalculatorLayout title="BMI 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              키 (cm)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="예: 170"
              value={height}
              onChange={(e) => setHeight(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              몸무게 (kg)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="예: 65"
              value={weight}
              onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
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
            <p className="text-sm text-gray-600 mb-1">BMI 수치</p>
            <p className="text-3xl font-bold text-brand">
              {result.bmi.toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">판정: </span>
            <span className={`text-xl font-bold ${result.color}`}>
              {result.label}
            </span>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
            <p className="font-medium mb-1">BMI 판정 기준 (대한비만학회)</p>
            <div className="grid grid-cols-2 gap-1">
              <span>저체중: 18.5 미만</span>
              <span>정상: 18.5 ~ 22.9</span>
              <span>과체중: 23.0 ~ 24.9</span>
              <span>비만: 25.0 이상</span>
            </div>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
