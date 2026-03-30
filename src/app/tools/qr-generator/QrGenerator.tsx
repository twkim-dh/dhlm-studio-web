"use client";
import { useState } from "react";

const COLORS = [
  { label: "검정", value: "000000" },
  { label: "파랑", value: "2563EB" },
  { label: "빨강", value: "DC2626" },
  { label: "초록", value: "16A34A" },
];

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [color, setColor] = useState("000000");
  const [qrUrl, setQrUrl] = useState("");

  const generate = () => {
    if (!text.trim()) return;
    const encoded = encodeURIComponent(text.trim());
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=${color}`);
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="URL 또는 텍스트를 입력하세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && generate()}
      />
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500">크기: {size}px</label>
          <input type="range" min={128} max={512} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
        </div>
      </div>
      <div className="flex gap-2">
        {COLORS.map((c) => (
          <button key={c.value} onClick={() => setColor(c.value)}
            className={`px-3 py-1 text-sm rounded-full border-2 ${color === c.value ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}>
            <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: `#${c.value}` }} />
            {c.label}
          </button>
        ))}
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">생성하기</button>
      {qrUrl && (
        <div className="flex flex-col items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <img src={qrUrl} alt="QR Code" className="border rounded" />
          <a href={qrUrl} download="qrcode.png" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">다운로드</a>
        </div>
      )}
    </div>
  );
}
