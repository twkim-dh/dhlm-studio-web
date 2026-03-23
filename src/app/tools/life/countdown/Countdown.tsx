"use client";
import { useState, useEffect } from "react";

export default function CountdownComponent() {
  const [targetDate, setTargetDate] = useState("");
  const [targetName, setTargetName] = useState("");
  const [diff, setDiff] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || !targetDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const d = target - now;
      if (d <= 0) { setDiff({ days: 0, hours: 0, mins: 0, secs: 0 }); clearInterval(interval); return; }
      setDiff({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        mins: Math.floor((d % 3600000) / 60000),
        secs: Math.floor((d % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, targetDate]);

  const start = () => { if (targetDate) setStarted(true); };

  const presets = [
    { label: "크리스마스", date: `${new Date().getFullYear()}-12-25`, name: "크리스마스 🎄" },
    { label: "새해", date: `${new Date().getFullYear() + 1}-01-01`, name: "새해 🎆" },
    { label: "1시간 후", date: new Date(Date.now() + 3600000).toISOString().slice(0, 16), name: "1시간 타이머" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button key={p.label} onClick={() => { setTargetDate(p.date); setTargetName(p.name); setStarted(true); }}
            className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-blue-100">{p.label}</button>
        ))}
      </div>
      <input type="text" placeholder="이름 (예: 여행 D-Day)" value={targetName} onChange={e => setTargetName(e.target.value)} className="w-full p-3 border rounded-lg" />
      <input type="datetime-local" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full p-3 border rounded-lg" />
      <button onClick={start} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">시작</button>
      {diff && (
        <div className="text-center py-6">
          {targetName && <p className="text-lg font-semibold text-gray-600 mb-4">{targetName}</p>}
          <div className="flex justify-center gap-4">
            {[{ v: diff.days, l: "일" }, { v: diff.hours, l: "시간" }, { v: diff.mins, l: "분" }, { v: diff.secs, l: "초" }].map(t => (
              <div key={t.l} className="text-center">
                <p className="text-4xl font-bold text-blue-700 font-mono">{String(t.v).padStart(2, "0")}</p>
                <p className="text-xs text-gray-500 mt-1">{t.l}</p>
              </div>
            ))}
          </div>
          {diff.days === 0 && diff.hours === 0 && diff.mins === 0 && diff.secs === 0 && (
            <p className="mt-4 text-2xl font-bold text-red-500">🎉 시간이 되었습니다!</p>
          )}
        </div>
      )}
    </div>
  );
}
