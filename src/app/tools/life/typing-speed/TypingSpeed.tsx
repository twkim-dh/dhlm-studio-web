"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TEXTS = [
  "다람쥐 헌 쳇바퀴에 타고파. 프로그래밍은 문제 해결의 예술이다. 좋은 코드는 읽기 쉬운 코드다.",
  "오늘도 좋은 하루 되세요. 매일 조금씩 성장하는 것이 중요합니다. 함께하면 더 큰 가치를 만듭니다.",
  "The quick brown fox jumps over the lazy dog. Programming is the art of problem solving.",
  "사람의 꿈과 아이디어를 연결해 디지털 가치로 만드는 기업. 매일의 작은 결정을 재밌게 만드는 서비스.",
  "빠르게 변하는 세상에서 꾸준함이 가장 큰 경쟁력이다. 오늘 하루도 최선을 다해 살아가자.",
  "인공지능은 인간의 창의력을 대체하는 것이 아니라 확장시키는 도구이다. 기술과 사람의 조화가 중요하다.",
];

interface TypingRecord {
  date: string;
  cpm: number;
  wpm: number;
  accuracy: number;
  time: number;
}

const STORAGE_KEY = "typing-speed-records";

function loadRecords(): TypingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecord(record: TypingRecord) {
  const records = loadRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getRank(cpm: number): { emoji: string; label: string } {
  if (cpm >= 500) return { emoji: "\uD83D\uDD25", label: "타자의 신" };
  if (cpm >= 400) return { emoji: "\u26A1", label: "번개 타자" };
  if (cpm >= 300) return { emoji: "\uD83C\uDFC3", label: "빠른 타자" };
  if (cpm >= 200) return { emoji: "\uD83D\uDEB6", label: "일반 타자" };
  return { emoji: "\uD83D\uDC22", label: "느긋한 타자" };
}

export default function TypingSpeed() {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Pick random text on mount
  useEffect(() => {
    setText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 100);
    return () => clearInterval(interval);
  }, [started, finished, startTime]);

  const handleInput = (val: string) => {
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setInput(val);
    if (val.length >= text.length) {
      setFinished(true);
      setElapsed(Date.now() - startTime);
    }
  };

  const seconds = elapsed / 1000;
  const chars = input.length;
  const cpm = seconds > 0 ? Math.round((chars / seconds) * 60) : 0;
  const wpm = seconds > 0 ? Math.round(chars / 5 / (seconds / 60)) : 0;
  const accuracy =
    chars > 0
      ? Math.round(
          (text
            .slice(0, chars)
            .split("")
            .filter((c, i) => c === input[i]).length /
            chars) *
            100
        )
      : 100;

  // Save result when finished
  useEffect(() => {
    if (finished && !saved && cpm > 0) {
      saveRecord({
        date: new Date().toISOString(),
        cpm,
        wpm,
        accuracy,
        time: parseFloat(seconds.toFixed(1)),
      });
      setSaved(true);
    }
  }, [finished, saved, cpm, wpm, accuracy, seconds]);

  const reset = useCallback(() => {
    setText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
    setInput("");
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setSaved(false);
    setShareMsg("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const rank = getRank(cpm);

  const handleShare = async () => {
    const shareText = `내 타자 속도 ${cpm}타/분! ${rank.emoji} ${rank.label}\n→ https://dhlm-studio.com/tools/life/typing-speed`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        setShareMsg("공유 완료!");
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareMsg("복사 완료!");
      } catch {
        setShareMsg("복사 실패");
      }
    }
    setTimeout(() => setShareMsg(""), 2000);
  };

  const records = loadRecords();
  const bestRecord =
    records.length > 0
      ? records.reduce((best, r) => (r.cpm > best.cpm ? r : best), records[0])
      : null;

  const chartData = records.map((r, i) => ({
    idx: i + 1,
    cpm: r.cpm,
  }));

  if (!text) return null;

  return (
    <div className="space-y-4">
      {/* Text display with colored feedback */}
      <div className="p-4 bg-gray-50 rounded-lg font-mono text-lg leading-relaxed select-none">
        {text.split("").map((c, i) => {
          let color = "text-gray-400";
          if (i < input.length)
            color =
              c === input[i]
                ? "text-green-600"
                : "text-red-500 bg-red-100";
          if (i === input.length) color = "text-gray-900 underline";
          return (
            <span key={i} className={color}>
              {c}
            </span>
          );
        })}
      </div>

      {/* Input area */}
      <textarea
        ref={inputRef}
        className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="위 텍스트를 따라 입력하세요..."
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        disabled={finished}
        autoFocus
      />

      {/* Live stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-500">시간</p>
          <p className="text-lg font-bold">{seconds.toFixed(1)}초</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-xs text-gray-500">타/분</p>
          <p className="text-lg font-bold text-blue-700">{cpm}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <p className="text-xs text-gray-500">WPM</p>
          <p className="text-lg font-bold text-green-700">{wpm}</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg text-center">
          <p className="text-xs text-gray-500">정확도</p>
          <p className="text-lg font-bold text-yellow-700">{accuracy}%</p>
        </div>
      </div>

      {/* Result screen */}
      {finished && (
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl p-6 text-center space-y-4 border border-blue-100">
          <div>
            <p className="text-5xl font-black text-blue-700">{cpm}</p>
            <p className="text-sm text-gray-500 mt-1">타/분 (CPM)</p>
          </div>

          <div className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-lg font-bold">
            {rank.emoji} {rank.label}
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <p className="text-gray-400 text-xs">WPM</p>
              <p className="font-bold text-green-700">{wpm}</p>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <p className="text-gray-400 text-xs">정확도</p>
              <p className="font-bold text-yellow-700">{accuracy}%</p>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <p className="text-gray-400 text-xs">소요시간</p>
              <p className="font-bold">{seconds.toFixed(1)}초</p>
            </div>
          </div>

          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={reset}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              {shareMsg || "공유하기"}
            </button>
          </div>
        </div>
      )}

      {/* History toggle button */}
      <div className="text-center">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          {showHistory ? "기록 닫기" : "내 기록"}
        </button>
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="space-y-4 border rounded-xl p-4 bg-gray-50">
          <h3 className="font-bold text-gray-700">내 기록</h3>

          {records.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              아직 기록이 없습니다. 테스트를 완료해보세요!
            </p>
          ) : (
            <>
              {/* CPM trend chart */}
              {chartData.length >= 2 && (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">CPM 추이</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="idx"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                      />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} width={35} />
                      <Tooltip
                        formatter={(value) => [`${value} 타/분`, "CPM"]}
                        labelFormatter={(label) => `${label}번째`}
                      />
                      <Line
                        type="monotone"
                        dataKey="cpm"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Record list */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...records]
                  .reverse()
                  .map((r, i) => {
                    const isBest =
                      bestRecord && r.cpm === bestRecord.cpm && r.date === bestRecord.date;
                    const rRank = getRank(r.cpm);
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-lg text-sm ${
                          isBest ? "bg-yellow-50 border border-yellow-200" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isBest && <span title="최고 기록">🏆</span>}
                          <span className="text-gray-400 text-xs">
                            {new Date(r.date).toLocaleDateString("ko-KR", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-blue-700">
                            {r.cpm}타/분
                          </span>
                          <span className="text-xs text-gray-500">
                            {r.accuracy}%
                          </span>
                          <span className="text-xs">
                            {rRank.emoji}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
