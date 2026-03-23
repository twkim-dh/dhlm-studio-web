"use client";
import { useState } from "react";

const SIZES = [
  { name: "기본", key: "default", w: 120, h: 90 },
  { name: "중간", key: "mqdefault", w: 320, h: 180 },
  { name: "높은 품질", key: "hqdefault", w: 480, h: 360 },
  { name: "표준", key: "sddefault", w: 640, h: 480 },
  { name: "최대 해상도", key: "maxresdefault", w: 1280, h: 720 },
];

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function YoutubeThumbnailComponent() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

  const extract = () => {
    const id = extractVideoId(url.trim());
    setVideoId(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="유튜브 URL 또는 영상 ID 입력"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && extract()}
        />
        <button onClick={extract} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shrink-0">추출</button>
      </div>
      {videoId === null && url.trim() && <p className="text-red-500 text-sm">유효한 유튜브 URL을 입력하세요</p>}
      {videoId && (
        <div className="space-y-4">
          {SIZES.map((s) => (
            <div key={s.key} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{s.name} ({s.w}×{s.h})</span>
                <a
                  href={`https://img.youtube.com/vi/${videoId}/${s.key}.jpg`}
                  download={`${videoId}_${s.key}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >다운로드</a>
              </div>
              <img
                src={`https://img.youtube.com/vi/${videoId}/${s.key}.jpg`}
                alt={s.name}
                className="w-full rounded"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
