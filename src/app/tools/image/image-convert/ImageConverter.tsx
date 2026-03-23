"use client";
import { useState, useRef } from "react";

const FORMATS = [
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/jpeg", label: "JPG", ext: "jpg" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [format, setFormat] = useState("image/png");
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const convert = () => {
    if (!file || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) setResult({ url: URL.createObjectURL(blob), size: blob.size });
      }, format, 0.92);
    };
    img.src = preview;
  };

  const ext = FORMATS.find((f) => f.value === format)?.ext || "png";

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white" />
      <div className="flex gap-2">
        {FORMATS.map((f) => (
          <button key={f.value} onClick={() => setFormat(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${format === f.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
            {f.label}
          </button>
        ))}
      </div>
      {file && <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">변환하기</button>}
      {result && (
        <div className="bg-green-50 p-4 rounded-lg space-y-2">
          <p className="text-sm">변환 완료: <strong>{(result.size / 1024).toFixed(1)} KB</strong></p>
          <a href={result.url} download={`converted.${ext}`} className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg">다운로드</a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
