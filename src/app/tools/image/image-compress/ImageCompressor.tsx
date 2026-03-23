"use client";
import { useState, useRef } from "react";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginal({ url: URL.createObjectURL(file), size: file.size, name: file.name });
    setCompressed(null);
  };

  const compress = () => {
    if (!original || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) setCompressed({ url: URL.createObjectURL(blob), size: blob.size });
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.src = original.url;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
      {original && (
        <>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">품질: {quality}%</label>
            <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="flex-1" />
          </div>
          <button onClick={compress} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">압축하기</button>
          <p className="text-sm text-gray-500">원본: {formatSize(original.size)}</p>
        </>
      )}
      {compressed && (
        <div className="bg-green-50 p-4 rounded-lg space-y-2">
          <p className="text-sm">압축 후: <strong>{formatSize(compressed.size)}</strong> ({Math.round((1 - compressed.size / original!.size) * 100)}% 감소)</p>
          <a href={compressed.url} download={`compressed_${original!.name}`} className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">다운로드</a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
