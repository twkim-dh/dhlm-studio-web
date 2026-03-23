"use client";
import { useState } from "react";

const FONTS = [
  "Noto Sans KR", "Pretendard", "Nanum Gothic", "Nanum Myeongjo",
  "Black Han Sans", "Do Hyeon", "Jua", "Gamja Flower",
  "Arial", "Georgia", "Times New Roman", "Courier New",
  "Verdana", "Impact", "Comic Sans MS", "Trebuchet MS",
];

export default function FontPreviewComponent() {
  const [text, setText] = useState("다람쥐 헌 쳇바퀴에 타고파 The quick brown fox jumps over the lazy dog 0123456789");
  const [size, setSize] = useState(24);
  const [weight, setWeight] = useState(400);
  const [color, setColor] = useState("#000000");

  return (
    <div className="space-y-4">
      <input className="w-full p-3 border rounded-lg" placeholder="미리볼 텍스트 입력" value={text} onChange={e => setText(e.target.value)} />
      <div className="flex flex-wrap gap-3 items-center">
        <div><label className="text-xs text-gray-500">크기: {size}px</label><input type="range" min={10} max={72} value={size} onChange={e => setSize(+e.target.value)} className="w-32" /></div>
        <div><label className="text-xs text-gray-500">두께: {weight}</label><input type="range" min={100} max={900} step={100} value={weight} onChange={e => setWeight(+e.target.value)} className="w-32" /></div>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
      </div>
      <div className="space-y-3">
        {FONTS.map(font => (
          <div key={font} className="p-4 border rounded-lg hover:bg-gray-50">
            <p className="text-xs text-gray-400 mb-1">{font}</p>
            <p style={{ fontFamily: `"${font}", sans-serif`, fontSize: size, fontWeight: weight, color }} className="break-words">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
