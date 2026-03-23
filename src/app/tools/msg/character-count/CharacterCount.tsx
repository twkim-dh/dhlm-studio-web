"use client";
import { useState } from "react";

export default function CharacterCount() {
  const [text, setText] = useState("");

  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?。]\s*/g).filter(s => s.trim().length > 0).length;
  const lines = text.split("\n").length;
  const bytes = new Blob([text]).size;

  const stats = [
    { label: "글자 (공백 포함)", value: chars },
    { label: "글자 (공백 제외)", value: charsNoSpace },
    { label: "단어", value: words },
    { label: "문장", value: sentences },
    { label: "줄", value: lines },
    { label: "바이트", value: bytes },
  ];

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-48 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="글자수를 세고 싶은 텍스트를 입력하세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
