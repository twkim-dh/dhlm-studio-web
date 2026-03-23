"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

interface Result {
  monthlyUsd: number;
  monthlyKrw: number;
  annualUsd: number;
  annualKrw: number;
}

export default function YoutubeCalculator() {
  const [views, setViews] = useState("");
  const [cpm, setCpm] = useState(3);
  const [subscribers, setSubscribers] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const exchangeRate = 1350;

  function calculate() {
    const monthlyViews = parseFloat(views);
    if (!monthlyViews || monthlyViews <= 0) return;

    const monthlyUsd = (monthlyViews / 1000) * cpm;
    const monthlyKrw = Math.round(monthlyUsd * exchangeRate);

    setResult({
      monthlyUsd: Math.round(monthlyUsd * 100) / 100,
      monthlyKrw,
      annualUsd: Math.round(monthlyUsd * 12 * 100) / 100,
      annualKrw: monthlyKrw * 12,
    });
  }

  return (
    <CalculatorLayout title="유튜브 수익 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월 조회수
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="예: 100000"
              value={views}
              onChange={(e) => setViews(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPM (1,000회당 광고 수익): ${cpm.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={cpm}
              onChange={(e) => setCpm(parseFloat(e.target.value))}
              className="w-full accent-brand"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$0.5</span>
              <span>$5.0</span>
              <span>$10.0</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              구독자 수 (참고용)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="예: 10000"
              value={subscribers}
              onChange={(e) =>
                setSubscribers(e.target.value.replace(/[^0-9]/g, ""))
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
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-brand-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">월 예상 수익</p>
              <p className="text-xl font-bold text-brand">
                {formatNumber(result.monthlyKrw)}원
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ${formatNumber(result.monthlyUsd)}
              </p>
            </div>
            <div className="bg-brand-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">연 예상 수익</p>
              <p className="text-xl font-bold text-brand">
                {formatNumber(result.annualKrw)}원
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ${formatNumber(result.annualUsd)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
            <p>* 수익 = 월 조회수 / 1,000 x CPM</p>
            <p>* 적용 환율: $1 = {formatNumber(exchangeRate)}원</p>
            <p>
              * 실제 수익은 채널 주제, 시청자 국가, 광고 유형 등에 따라 크게
              달라질 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
