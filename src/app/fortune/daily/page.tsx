"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ──────────── Deterministic hash ──────────── */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/* ──────────── Score tiers & messages ──────────── */
const TIERS = [
  { min: 90, emoji: "\uD83D\uDD25", label: "대박" },
  { min: 70, emoji: "\uD83D\uDE0A", label: "좋음" },
  { min: 50, emoji: "\uD83D\uDE42", label: "평범" },
  { min: 30, emoji: "\uD83D\uDE10", label: "쉬어감" },
  { min: 0, emoji: "\uD83D\uDE34", label: "충전" },
];

function getTier(score: number) {
  return TIERS.find((t) => score >= t.min) || TIERS[TIERS.length - 1];
}

const DAILY_MESSAGES: string[] = [
  "오늘은 평소와 다른 길로 출퇴근해 보세요.",
  "작은 친절이 큰 행운으로 돌아옵니다.",
  "오랜만에 연락 안 하던 친구에게 먼저 연락해 보세요.",
  "점심은 따뜻한 국물 요리가 좋겠어요.",
  "오늘의 키워드는 '여유'. 급하게 서두르지 마세요.",
  "새로운 도전을 시작하기 좋은 날이에요.",
  "주변 정리를 하면 마음도 가벼워져요.",
  "오늘은 자기 자신에게 선물을 해보세요.",
  "감사한 마음을 표현하면 좋은 일이 생겨요.",
  "오후에 잠깐 산책을 하면 좋은 아이디어가 떠올라요.",
  "오늘은 결정을 서두르지 말고 내일로 미루세요.",
  "보라색 계열의 옷이 행운을 불러와요.",
  "물을 충분히 마시면 에너지가 올라가요.",
  "저녁에 좋아하는 음악을 들으며 쉬세요.",
  "소소한 계획을 세우면 하루가 알차져요.",
  "누군가의 조언에 귀 기울여 보세요.",
  "오늘은 카페에서 새로운 메뉴를 시도해 보세요.",
  "일찍 잠자리에 들면 내일이 더 좋아져요.",
  "오늘의 행운은 동쪽에서 옵니다.",
  "중요한 대화는 오전에 하는 게 좋아요.",
  "달콤한 간식이 오늘의 에너지를 채워줄 거예요.",
  "웃음이 최고의 행운 부적이에요.",
  "오늘 만나는 사람이 좋은 인연이 될 수 있어요.",
  "창의적인 생각이 빛을 발하는 날이에요.",
  "지갑 속 영수증을 정리하면 금전운이 올라가요.",
  "오늘은 양보가 이기는 겁니다.",
  "SNS보다 직접 만남이 좋은 에너지를 줘요.",
  "따뜻한 차 한 잔이 마음을 안정시켜요.",
  "작은 목표 하나를 달성하면 자신감이 올라가요.",
  "밤하늘을 올려다보면 좋은 기운을 받아요.",
  "오늘은 특별히 긍정적인 말을 많이 해보세요.",
  "주변 사람에게 칭찬하면 나에게도 행운이 와요.",
];

const LUCKY_COLORS = [
  { name: "빨강", hex: "#EF4444" },
  { name: "주황", hex: "#F97316" },
  { name: "노랑", hex: "#EAB308" },
  { name: "초록", hex: "#22C55E" },
  { name: "파랑", hex: "#3B82F6" },
  { name: "남색", hex: "#6366F1" },
  { name: "보라", hex: "#A855F7" },
  { name: "분홍", hex: "#EC4899" },
  { name: "하늘", hex: "#38BDF8" },
  { name: "금색", hex: "#D4A017" },
];

/* ──────────── Fortune calculation ──────────── */
interface FortuneResult {
  overall: number;
  money: number;
  love: number;
  work: number;
  health: number;
  luckyNumbers: number[];
  luckyColor: (typeof LUCKY_COLORS)[number];
  message: string;
}

function calculateFortune(birthday: string, dateStr: string): FortuneResult {
  const seed = hashCode(birthday + dateStr);
  const rng = seededRandom(seed);

  const overall = Math.floor(rng() * 100) + 1;
  const money = Math.floor(rng() * 5) + 1;
  const love = Math.floor(rng() * 5) + 1;
  const work = Math.floor(rng() * 5) + 1;
  const health = Math.floor(rng() * 5) + 1;

  const nums = new Set<number>();
  while (nums.size < 3) {
    nums.add(Math.floor(rng() * 45) + 1);
  }
  const luckyNumbers = Array.from(nums).sort((a, b) => a - b);

  const colorIdx = Math.floor(rng() * LUCKY_COLORS.length);
  const luckyColor = LUCKY_COLORS[colorIdx];

  const msgIdx = Math.floor(rng() * DAILY_MESSAGES.length);
  const message = DAILY_MESSAGES[msgIdx];

  return { overall, money, love, work, health, luckyNumbers, luckyColor, message };
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ──────────── Star rating ──────────── */
function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-400">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

/* ──────────── Gauge bar ──────────── */
function Gauge({ score }: { score: number }) {
  const tier = getTier(score);
  const color =
    score >= 90
      ? "#EF4444"
      : score >= 70
        ? "#F97316"
        : score >= 50
          ? "#EAB308"
          : score >= 30
            ? "#6366F1"
            : "#9CA3AF";

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-2">
        <span className="text-5xl font-black text-white">{score}</span>
        <span className="text-2xl">
          {tier.emoji} {tier.label}
        </span>
      </div>
      <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ──────────── Share ──────────── */
async function shareResult(score: number) {
  const text = `오늘 내 운세 ${score}점! ⭐ https://dhlm-studio.com/fortune/daily`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "오늘의 운세", text });
      return;
    } catch {
      /* user cancelled */
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    alert("결과가 클립보드에 복사되었어요!");
  } catch {
    alert("공유하기를 지원하지 않는 환경이에요.");
  }
}

/* ──────────── Component ──────────── */
export default function DailyFortunePage() {
  const [birthday, setBirthday] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<FortuneResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fortune_birthday");
    if (saved) {
      setBirthday(saved);
    }
  }, []);

  useEffect(() => {
    if (birthday) {
      const r = calculateFortune(birthday, todayStr());
      setResult(r);
    }
  }, [birthday]);

  const handleSubmit = useCallback(() => {
    const v = inputValue.replace(/[^0-9]/g, "");
    if (v.length !== 8) {
      alert("생년월일 8자리를 입력해주세요 (예: 19901231)");
      return;
    }
    localStorage.setItem("fortune_birthday", v);
    setBirthday(v);
  }, [inputValue]);

  /* ── Birthday input ── */
  if (!birthday) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{
          background:
            "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)",
        }}
      >
        <motion.div
          className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-6xl block mb-4">🔮</span>
          <h1 className="text-2xl font-bold text-white mb-2">오늘의 운세</h1>
          <p className="text-purple-200 mb-6">
            생년월일을 입력하면 매일 새로운 운세를 확인할 수 있어요
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            placeholder="생년월일 8자리 (예: 19901231)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-purple-300 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 mb-4"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-white text-purple-700 font-bold text-lg hover:bg-purple-50 transition-colors"
          >
            운세 보기 ✨
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── Result ── */
  if (!result) return null;

  const categories = [
    { label: "금전운", value: result.money, emoji: "💰" },
    { label: "연애운", value: result.love, emoji: "❤️" },
    { label: "직장운", value: result.work, emoji: "💼" },
    { label: "건강운", value: result.health, emoji: "💪" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)",
      }}
    >
      <div className="mx-auto max-w-lg px-5 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-purple-300 text-sm mb-1">{todayStr()}</p>
          <h1 className="text-3xl font-black text-white">오늘의 운세 🔮</h1>
        </motion.div>

        {/* Overall gauge */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-purple-200 text-sm mb-3">전체운</p>
          <Gauge score={result.overall} />
        </motion.div>

        {/* Category stars */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <p className="text-white text-sm font-medium mt-1">{cat.label}</p>
              <Stars count={cat.value} />
            </div>
          ))}
        </motion.div>

        {/* Lucky numbers & color */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-4 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-purple-200 text-xs mb-1">행운의 숫자</p>
            <div className="flex gap-2">
              {result.luckyNumbers.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/50 text-white font-bold text-sm"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-purple-200 text-xs mb-1">행운의 색</p>
            <div
              className="w-10 h-10 rounded-full mx-auto shadow-lg border-2 border-white/30"
              style={{ backgroundColor: result.luckyColor.hex }}
            />
            <p className="text-white text-xs mt-1">{result.luckyColor.name}</p>
          </div>
        </motion.div>

        {/* Daily message */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-purple-200 text-xs mb-2">오늘의 한마디</p>
          <p className="text-white text-lg font-medium leading-relaxed">
            &ldquo;{result.message}&rdquo;
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/lotto"
            className="block w-full py-3 rounded-xl bg-yellow-500 text-center font-bold text-white hover:bg-yellow-400 transition-colors"
          >
            🎱 행운의 숫자로 로또 뽑기
          </Link>
          <button
            onClick={() => shareResult(result.overall)}
            className="w-full py-3 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition-colors"
          >
            📤 결과 공유하기
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("fortune_birthday");
              setBirthday("");
              setResult(null);
              setInputValue("");
            }}
            className="w-full py-2 text-purple-300 text-sm hover:text-white transition-colors"
          >
            생년월일 다시 입력하기
          </button>
        </motion.div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link href="/fortune" className="text-purple-300 text-sm hover:text-white">
            ← 운세 메인으로
          </Link>
        </div>
      </div>
    </div>
  );
}
