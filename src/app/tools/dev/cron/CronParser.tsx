"use client";
import { useState } from "react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function parseCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "5개 필드가 필요합니다 (분 시 일 월 요일)";
  const [min, hour, day, month, weekday] = parts;
  const desc: string[] = [];

  // Weekday
  if (weekday !== "*") {
    if (weekday.includes("-")) {
      const [s, e] = weekday.split("-").map(Number);
      desc.push(`${DAYS[s]}~${DAYS[e]}요일`);
    } else if (weekday.includes(",")) {
      desc.push(weekday.split(",").map((d) => DAYS[Number(d)] + "요일").join(", "));
    } else {
      desc.push(`${DAYS[Number(weekday)]}요일`);
    }
  }

  // Month
  if (month !== "*") desc.push(`${month}월`);

  // Day
  if (day !== "*") {
    if (day.includes("/")) {
      desc.push(`${day.split("/")[1]}일마다`);
    } else {
      desc.push(`${day}일`);
    }
  }

  // Hour
  if (hour !== "*") {
    if (hour.includes("/")) {
      desc.push(`${hour.split("/")[1]}시간마다`);
    } else {
      const h = Number(hour);
      desc.push(h < 12 ? `오전 ${h}시` : h === 12 ? "오후 12시" : `오후 ${h - 12}시`);
    }
  } else {
    desc.push("매시간");
  }

  // Minute
  if (min !== "*") {
    if (min.includes("/")) {
      desc.push(`${min.split("/")[1]}분마다`);
    } else {
      desc.push(`${min}분`);
    }
  } else {
    desc.push("매분");
  }

  if (desc.length === 0) return "매분 실행";
  return desc.join(" ");
}

const PRESETS = [
  { label: "매분", value: "* * * * *" },
  { label: "매시간", value: "0 * * * *" },
  { label: "매일 오전 9시", value: "0 9 * * *" },
  { label: "매주 월요일 9시", value: "0 9 * * 1" },
  { label: "매월 1일 0시", value: "0 0 1 * *" },
  { label: "평일 오전 9시", value: "0 9 * * 1-5" },
];

export default function CronParserComponent() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [result, setResult] = useState("");

  const parse = () => setResult(parseCron(expr));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.value} onClick={() => { setExpr(p.value); setResult(parseCron(p.value)); }}
            className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700">
            {p.label}
          </button>
        ))}
      </div>
      <input
        className="w-full p-3 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="0 9 * * 1-5"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
      />
      <button onClick={parse} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">해석하기</button>
      {result && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">해석 결과</p>
          <p className="text-lg font-semibold text-blue-700">{result}</p>
        </div>
      )}
      <div className="text-xs text-gray-400 space-y-1">
        <p>형식: 분(0-59) 시(0-23) 일(1-31) 월(1-12) 요일(0-6, 0=일)</p>
        <p>* = 매번, */N = N마다, 1-5 = 범위, 1,3,5 = 목록</p>
      </div>
    </div>
  );
}
