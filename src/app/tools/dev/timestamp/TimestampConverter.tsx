"use client";
import { useState, useEffect } from "react";

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [ts, setTs] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [tsResult, setTsResult] = useState("");
  const [dateResult, setDateResult] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const tsToDate = () => {
    const num = Number(ts);
    if (!num) { setTsResult("유효한 숫자를 입력하세요"); return; }
    const d = num > 1e12 ? new Date(num) : new Date(num * 1000);
    setTsResult(d.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
  };

  const dateToTs = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) { setDateResult("유효한 날짜를 입력하세요"); return; }
    setDateResult(`초: ${Math.floor(d.getTime() / 1000)}\n밀리초: ${d.getTime()}`);
  };

  const [copied, setCopied] = useState(false);
  const copyNow = async () => { await navigator.clipboard.writeText(String(now)); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-xs text-gray-500">현재 Unix 타임스탬프</p>
        <p className="text-3xl font-bold font-mono text-blue-700">{now}</p>
        <button onClick={copyNow} className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">타임스탬프 → 날짜</h3>
        <div className="flex gap-2">
          <input type="text" placeholder="1711929600" value={ts} onChange={e => setTs(e.target.value)} className="flex-1 p-2 border rounded-lg font-mono" />
          <button onClick={tsToDate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">변환</button>
        </div>
        {tsResult && <p className="p-3 bg-gray-50 rounded-lg font-mono text-sm">{tsResult}</p>}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">날짜 → 타임스탬프</h3>
        <div className="flex gap-2">
          <input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)} className="flex-1 p-2 border rounded-lg" />
          <button onClick={dateToTs} className="px-4 py-2 bg-green-600 text-white rounded-lg">변환</button>
        </div>
        {dateResult && <pre className="p-3 bg-gray-50 rounded-lg font-mono text-sm whitespace-pre-wrap">{dateResult}</pre>}
      </div>
    </div>
  );
}
