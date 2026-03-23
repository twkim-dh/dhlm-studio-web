"use client";
import { useState, useEffect } from "react";

export default function ScreenSize() {
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const update = () => {
      setInfo({
        "화면 해상도": `${screen.width} × ${screen.height}`,
        "뷰포트 크기": `${window.innerWidth} × ${window.innerHeight}`,
        "기기 픽셀 비율": `${window.devicePixelRatio}x`,
        "실제 해상도": `${Math.round(screen.width * window.devicePixelRatio)} × ${Math.round(screen.height * window.devicePixelRatio)}`,
        "색상 깊이": `${screen.colorDepth}bit`,
        "화면 방향": screen.orientation?.type || "알 수 없음",
        "터치 지원": "ontouchstart" in window ? "✅ 예" : "❌ 아니오",
        "User Agent": navigator.userAgent.slice(0, 80) + "...",
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="space-y-3">
      {Object.entries(info).map(([k, v]) => (
        <div key={k} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">{k}</span>
          <span className="font-mono text-sm font-semibold">{v}</span>
        </div>
      ))}
      <div className="mt-4 p-4 border-2 border-dashed border-blue-300 rounded-lg text-center">
        <p className="text-sm text-gray-500">이 박스 크기가 뷰포트 기준입니다</p>
        <p className="text-xs text-gray-400 mt-1">브라우저 크기를 바꾸면 실시간 업데이트됩니다</p>
      </div>
    </div>
  );
}
