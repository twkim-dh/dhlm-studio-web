"use client";
import { useState, useEffect, useRef } from "react";

const TEXTS = [
  "다람쥐 헌 쳇바퀴에 타고파. 프로그래밍은 문제 해결의 예술이다. 좋은 코드는 읽기 쉬운 코드다.",
  "오늘도 좋은 하루 되세요. 매일 조금씩 성장하는 것이 중요합니다. 함께하면 더 큰 가치를 만듭니다.",
  "The quick brown fox jumps over the lazy dog. Programming is the art of problem solving.",
  "사람의 꿈과 아이디어를 연결해 디지털 가치로 만드는 기업. 매일의 작은 결정을 재밌게 만드는 서비스.",
];

export default function TypingSpeed() {
  const [text] = useState(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 100);
    return () => clearInterval(interval);
  }, [started, finished, startTime]);

  const handleInput = (val: string) => {
    if (!started) { setStarted(true); setStartTime(Date.now()); }
    setInput(val);
    if (val.length >= text.length) {
      setFinished(true);
      setElapsed(Date.now() - startTime);
    }
  };

  const reset = () => { setInput(""); setStarted(false); setFinished(false); setElapsed(0); inputRef.current?.focus(); };

  const seconds = elapsed / 1000;
  const chars = input.length;
  const cpm = seconds > 0 ? Math.round(chars / seconds * 60) : 0;
  const wpm = seconds > 0 ? Math.round((chars / 5) / (seconds / 60)) : 0;
  const accuracy = chars > 0 ? Math.round(text.slice(0, chars).split("").filter((c, i) => c === input[i]).length / chars * 100) : 100;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg font-mono text-lg leading-relaxed">
        {text.split("").map((c, i) => {
          let color = "text-gray-400";
          if (i < input.length) color = c === input[i] ? "text-green-600" : "text-red-500 bg-red-100";
          if (i === input.length) color = "text-gray-900 underline";
          return <span key={i} className={color}>{c}</span>;
        })}
      </div>
      <textarea
        ref={inputRef}
        className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="위 텍스트를 따라 입력하세요..."
        value={input}
        onChange={e => handleInput(e.target.value)}
        disabled={finished}
        autoFocus
      />
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">시간</p><p className="text-lg font-bold">{seconds.toFixed(1)}초</p></div>
        <div className="p-3 bg-blue-50 rounded-lg text-center"><p className="text-xs text-gray-500">타/분</p><p className="text-lg font-bold text-blue-700">{cpm}</p></div>
        <div className="p-3 bg-green-50 rounded-lg text-center"><p className="text-xs text-gray-500">WPM</p><p className="text-lg font-bold text-green-700">{wpm}</p></div>
        <div className="p-3 bg-yellow-50 rounded-lg text-center"><p className="text-xs text-gray-500">정확도</p><p className="text-lg font-bold text-yellow-700">{accuracy}%</p></div>
      </div>
      {finished && (
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold text-blue-700">🎉 완료! {cpm}타/분</p>
          <button onClick={reset} className="px-6 py-2 bg-blue-600 text-white rounded-lg">다시 하기</button>
        </div>
      )}
    </div>
  );
}
