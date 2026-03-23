"use client";
import { useState, useRef } from "react";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [preview, setPreview] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(img.width); setHeight(img.height); };
    img.src = url;
    setResult(null);
  };

  const changeW = (w: number) => {
    setWidth(w);
    if (lock && origW > 0) setHeight(Math.round((w / origW) * origH));
  };

  const changeH = (h: number) => {
    setHeight(h);
    if (lock && origH > 0) setWidth(Math.round((h / origH) * origW));
  };

  const applyPreset = (scale: number) => {
    setWidth(Math.round(origW * scale));
    setHeight(Math.round(origH * scale));
  };

  const applyWidthPreset = (w: number) => {
    setWidth(w);
    if (lock && origW > 0) setHeight(Math.round((w / origW) * origH));
  };

  const resize = () => {
    if (!file || !canvasRef.current || width <= 0 || height <= 0) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) setResult({ url: URL.createObjectURL(blob), size: blob.size });
      }, "image/png");
    };
    img.src = preview;
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white" />
      {file && (
        <>
          <p className="text-sm text-gray-500">원본: {origW} × {origH}px</p>
          <div className="flex flex-wrap gap-2">
            {[0.5, 0.75, 1.5, 2].map((s) => (
              <button key={s} onClick={() => applyPreset(s)} className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-blue-100">{s * 100}%</button>
            ))}
            {[1080, 1920].map((w) => (
              <button key={w} onClick={() => applyWidthPreset(w)} className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-blue-100">{w}px</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div>
              <label className="text-xs text-gray-500">너비</label>
              <input type="number" value={width} onChange={(e) => changeW(Number(e.target.value))} className="w-24 p-2 border rounded-lg text-sm" />
            </div>
            <span className="mt-4">×</span>
            <div>
              <label className="text-xs text-gray-500">높이</label>
              <input type="number" value={height} onChange={(e) => changeH(Number(e.target.value))} className="w-24 p-2 border rounded-lg text-sm" />
            </div>
            <label className="mt-4 flex items-center gap-1 text-sm">
              <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> 비율 유지
            </label>
          </div>
          <button onClick={resize} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">변환하기</button>
        </>
      )}
      {result && (
        <div className="bg-green-50 p-4 rounded-lg space-y-2">
          <p className="text-sm">변환: {width} × {height}px ({(result.size / 1024).toFixed(1)} KB)</p>
          <a href={result.url} download="resized.png" className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg">다운로드</a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
