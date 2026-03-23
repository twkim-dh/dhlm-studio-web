"use client";
import { useState, useRef, useCallback } from "react";

function formatTime(ms: number) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
}

export default function StopwatchComponent() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    startTimeRef.current = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  }, [running, time]);

  const stop = useCallback(() => {
    if (!running) return;
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [running]);

  const reset = useCallback(() => {
    stop();
    setTime(0);
    setLaps([]);
  }, [stop]);

  const lap = useCallback(() => {
    if (running) setLaps(prev => [...prev, time]);
  }, [running, time]);

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl font-mono font-bold text-gray-900 py-8">{formatTime(time)}</div>
      <div className="flex justify-center gap-3">
        {!running ? (
          <button onClick={start} className="px-8 py-3 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700">시작</button>
        ) : (
          <button onClick={stop} className="px-8 py-3 bg-red-500 text-white rounded-xl text-lg font-bold hover:bg-red-600">정지</button>
        )}
        <button onClick={lap} disabled={!running} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-40">랩</button>
        <button onClick={reset} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300">리셋</button>
      </div>
      {laps.length > 0 && (
        <div className="text-left max-w-xs mx-auto">
          <h3 className="font-semibold text-sm text-gray-500 mb-2">랩 기록</h3>
          {laps.map((l, i) => (
            <div key={i} className="flex justify-between py-1 border-b text-sm">
              <span className="text-gray-500">#{i + 1}</span>
              <span className="font-mono">{formatTime(l)}</span>
              {i > 0 && <span className="text-xs text-gray-400">+{formatTime(l - laps[i - 1])}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
