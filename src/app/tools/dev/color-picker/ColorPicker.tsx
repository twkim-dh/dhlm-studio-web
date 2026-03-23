"use client";
import { useState } from "react";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPickerComponent() {
  const [hex, setHex] = useState("#2563EB");
  const [copied, setCopied] = useState("");

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const values = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "RGB값", value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-20 h-20 rounded-lg cursor-pointer border-0" />
        <input className="flex-1 p-3 border rounded-lg font-mono" value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#000000" />
      </div>
      <div className="w-full h-24 rounded-xl border" style={{ backgroundColor: hex }} />
      <div className="grid gap-2">
        {values.map((v) => (
          <div key={v.label} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
            <span className="text-sm text-gray-500">{v.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{v.value}</span>
              <button onClick={() => copy(v.value, v.label)} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                {copied === v.label ? "✓" : "복사"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
