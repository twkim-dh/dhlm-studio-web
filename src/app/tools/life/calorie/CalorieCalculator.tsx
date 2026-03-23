"use client";
import { useState } from "react";

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male"|"female">("male");
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState(1.55);
  const [result, setResult] = useState<{bmr:number;tdee:number;lose:number;gain:number}|null>(null);

  const calculate = () => {
    const bmr = gender === "male"
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
    const tdee = bmr * activity;
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee), lose: Math.round(tdee - 500), gain: Math.round(tdee + 500) });
  };

  const activities = [
    { value: 1.2, label: "비활동적 (운동 안 함)" },
    { value: 1.375, label: "가벼운 활동 (주 1~3회)" },
    { value: 1.55, label: "보통 활동 (주 3~5회)" },
    { value: 1.725, label: "활발한 활동 (주 6~7회)" },
    { value: 1.9, label: "매우 활발 (하루 2회+)" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender("male")} className={`flex-1 py-2 rounded-lg ${gender==="male"?"bg-blue-600 text-white":"bg-gray-100"}`}>남성</button>
        <button onClick={() => setGender("female")} className={`flex-1 py-2 rounded-lg ${gender==="female"?"bg-pink-500 text-white":"bg-gray-100"}`}>여성</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs text-gray-500">나이</label><input type="number" value={age} onChange={e=>setAge(+e.target.value)} className="w-full p-2 border rounded-lg"/></div>
        <div><label className="text-xs text-gray-500">키(cm)</label><input type="number" value={height} onChange={e=>setHeight(+e.target.value)} className="w-full p-2 border rounded-lg"/></div>
        <div><label className="text-xs text-gray-500">몸무게(kg)</label><input type="number" value={weight} onChange={e=>setWeight(+e.target.value)} className="w-full p-2 border rounded-lg"/></div>
      </div>
      <select value={activity} onChange={e=>setActivity(+e.target.value)} className="w-full p-3 border rounded-lg">
        {activities.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
      </select>
      <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">계산하기</button>
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">기초대사량</p><p className="text-xl font-bold">{result.bmr} kcal</p></div>
          <div className="p-3 bg-blue-50 rounded-lg text-center"><p className="text-xs text-gray-500">일일 권장</p><p className="text-xl font-bold text-blue-700">{result.tdee} kcal</p></div>
          <div className="p-3 bg-green-50 rounded-lg text-center"><p className="text-xs text-gray-500">감량 목표</p><p className="text-xl font-bold text-green-600">{result.lose} kcal</p></div>
          <div className="p-3 bg-orange-50 rounded-lg text-center"><p className="text-xs text-gray-500">증량 목표</p><p className="text-xl font-bold text-orange-600">{result.gain} kcal</p></div>
        </div>
      )}
    </div>
  );
}
