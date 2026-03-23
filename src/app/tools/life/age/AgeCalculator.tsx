"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const ZODIAC_ANIMALS = [
  "원숭이", "닭", "개", "돼지", "쥐", "소",
  "호랑이", "토끼", "용", "뱀", "말", "양",
];

function getZodiac(year: number): string {
  return ZODIAC_ANIMALS[year % 12] + "띠";
}

function getConstellation(month: number, day: number): string {
  const signs = [
    { name: "염소자리", end: [1, 19] },
    { name: "물병자리", end: [2, 18] },
    { name: "물고기자리", end: [3, 20] },
    { name: "양자리", end: [4, 19] },
    { name: "황소자리", end: [5, 20] },
    { name: "쌍둥이자리", end: [6, 21] },
    { name: "게자리", end: [7, 22] },
    { name: "사자자리", end: [8, 22] },
    { name: "처녀자리", end: [9, 22] },
    { name: "천칭자리", end: [10, 23] },
    { name: "전갈자리", end: [11, 22] },
    { name: "사수자리", end: [12, 21] },
    { name: "염소자리", end: [12, 31] },
  ];
  for (const s of signs) {
    if (month < s.end[0] || (month === s.end[0] && day <= s.end[1])) {
      return s.name;
    }
  }
  return "염소자리";
}

interface Result {
  internationalAge: number;
  koreanAge: number;
  zodiac: string;
  constellation: string;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime()) || birth > today) return;

    const birthYear = birth.getFullYear();
    const birthMonth = birth.getMonth();
    const birthDay = birth.getDate();

    let internationalAge = today.getFullYear() - birthYear;
    if (
      today.getMonth() < birthMonth ||
      (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
      internationalAge--;
    }

    const koreanAge = today.getFullYear() - birthYear;

    setResult({
      internationalAge,
      koreanAge,
      zodiac: getZodiac(birthYear),
      constellation: getConstellation(birthMonth + 1, birthDay),
    });
  }

  return (
    <CalculatorLayout title="나이 계산기">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          생년월일
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
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
            <p className="text-sm text-gray-600 mb-1">만 나이</p>
            <p className="text-3xl font-bold text-brand">
              {result.internationalAge}세
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["만 나이", `${result.internationalAge}세`],
              ["연 나이 (한국 나이)", `${result.koreanAge}세`],
              ["띠", result.zodiac],
              ["별자리", result.constellation],
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
            * 만 나이: 생일 기준으로 계산 / 연 나이: 현재연도 - 출생연도
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
