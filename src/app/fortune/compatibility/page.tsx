"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

/* ──────────── Hash ──────────── */
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

/* ──────────── Calculate ──────────── */
interface CompatResult {
  total: number;
  love: number;
  friendship: number;
  work: number;
  message: string;
}

const MESSAGES: { min: number; text: string }[] = [
  { min: 90, text: "환상의 궁합이에요! 천생연분이라 해도 과언이 아니에요. 서로를 꼭 잡으세요! 💫" },
  { min: 80, text: "아주 좋은 궁합이네요! 서로에게 긍정적인 에너지를 주는 관계예요. ✨" },
  { min: 70, text: "좋은 궁합이에요. 서로의 장점을 잘 살려주는 관계가 될 수 있어요. 😊" },
  { min: 60, text: "괜찮은 궁합이에요. 서로 노력하면 더 좋은 관계가 될 수 있어요. 🙂" },
  { min: 50, text: "보통의 궁합이에요. 서로를 이해하려는 노력이 필요해요. 💪" },
  { min: 40, text: "조금 맞지 않는 부분도 있지만, 대화로 풀어갈 수 있어요. 🗣️" },
  { min: 30, text: "차이점이 좀 있네요. 하지만 다름이 매력이 될 수도 있어요! 🌈" },
  { min: 0, text: "정반대의 궁합이에요. 오히려 서로에게 새로운 세계를 열어줄 수도! 🔮" },
];

function calculateCompatibility(b1: string, b2: string): CompatResult {
  // Sort so order doesn't matter
  const sorted = [b1, b2].sort().join("+");
  const seed = hashCode(sorted);
  const rng = seededRandom(seed);

  const total = Math.floor(rng() * 61) + 40; // 40-100
  const love = Math.floor(rng() * 61) + 40;
  const friendship = Math.floor(rng() * 61) + 40;
  const work = Math.floor(rng() * 61) + 40;

  const msg = MESSAGES.find((m) => total >= m.min) || MESSAGES[MESSAGES.length - 1];

  return { total, love, friendship, work, message: msg.text };
}

/* ──────────── Animated bar ──────────── */
function PercentBar({ label, emoji, value, delay }: { label: string; emoji: string; value: number; delay: number }) {
  const color =
    value >= 80 ? "#EC4899" : value >= 60 ? "#A855F7" : value >= 40 ? "#6366F1" : "#9CA3AF";

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-white text-sm font-medium">
          {emoji} {label}
        </span>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

/* ──────────── Share ──────────── */
async function shareResult(total: number, b1: string, b2: string) {
  const url = `https://dhlm-studio.com/fortune/compatibility?b1=${b1}&b2=${b2}`;
  const text = `우리 궁합 ${total}%래! 💕\n${url}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "궁합 결과", text });
      return;
    } catch {
      /* cancelled */
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
export default function CompatibilityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EC4899 0%, #9333EA 50%, #5B21B6 100%)" }}>
        <span className="text-white text-lg">로딩 중...</span>
      </div>
    }>
      <CompatibilityContent />
    </Suspense>
  );
}

function CompatibilityContent() {
  const searchParams = useSearchParams();
  const [birthday1, setBirthday1] = useState("");
  const [birthday2, setBirthday2] = useState("");
  const [result, setResult] = useState<CompatResult | null>(null);

  useEffect(() => {
    const b1 = searchParams.get("b1");
    const b2 = searchParams.get("b2");
    if (b1 && b2 && b1.length === 8 && b2.length === 8) {
      setBirthday1(b1);
      setBirthday2(b2);
      setResult(calculateCompatibility(b1, b2));
    }
  }, [searchParams]);

  const handleSubmit = useCallback(() => {
    const v1 = birthday1.replace(/[^0-9]/g, "");
    const v2 = birthday2.replace(/[^0-9]/g, "");
    if (v1.length !== 8 || v2.length !== 8) {
      alert("생년월일 8자리를 입력해주세요 (예: 19901231)");
      return;
    }
    setResult(calculateCompatibility(v1, v2));
  }, [birthday1, birthday2]);

  /* ── Input form ── */
  if (!result) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{
          background:
            "linear-gradient(135deg, #EC4899 0%, #9333EA 50%, #5B21B6 100%)",
        }}
      >
        <motion.div
          className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-6xl block mb-4">💕</span>
          <h1 className="text-2xl font-bold text-white mb-2">궁합 보기</h1>
          <p className="text-pink-200 mb-6">
            두 사람의 생년월일을 입력해주세요
          </p>

          <div className="space-y-3 mb-6">
            <div>
              <label className="text-pink-200 text-xs block mb-1 text-left">나의 생년월일</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="예: 19901231"
                value={birthday1}
                onChange={(e) => setBirthday1(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-pink-300 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div className="text-2xl text-white">❤️</div>
            <div>
              <label className="text-pink-200 text-xs block mb-1 text-left">상대방 생년월일</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="예: 19951015"
                value={birthday2}
                onChange={(e) => setBirthday2(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-pink-300 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-white text-pink-600 font-bold text-lg hover:bg-pink-50 transition-colors"
          >
            궁합 확인하기 💕
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── Result ── */
  return (
    <div
      className="min-h-screen px-5 py-8"
      style={{
        background:
          "linear-gradient(135deg, #EC4899 0%, #9333EA 50%, #5B21B6 100%)",
      }}
    >
      <div className="mx-auto max-w-lg">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black text-white">궁합 결과 💕</h1>
        </motion.div>

        {/* Total score */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-pink-200 text-sm mb-2">총 궁합</p>
          <p className="text-6xl font-black text-white mb-1">{result.total}%</p>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden mt-3">
            <motion.div
              className="h-full rounded-full bg-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${result.total}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Category bars */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PercentBar label="연애 궁합" emoji="❤️" value={result.love} delay={0.5} />
          <PercentBar label="우정 궁합" emoji="🤝" value={result.friendship} delay={0.6} />
          <PercentBar label="업무 궁합" emoji="💼" value={result.work} delay={0.7} />
        </motion.div>

        {/* Message */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white leading-relaxed">{result.message}</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() =>
              shareResult(
                result.total,
                birthday1.replace(/[^0-9]/g, ""),
                birthday2.replace(/[^0-9]/g, "")
              )
            }
            className="w-full py-3 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition-colors"
          >
            📤 결과 공유하기
          </button>
          <button
            onClick={() => {
              setResult(null);
              setBirthday1("");
              setBirthday2("");
            }}
            className="w-full py-3 rounded-xl bg-pink-500/50 text-white font-bold hover:bg-pink-500/70 transition-colors"
          >
            다시 해보기
          </button>
        </motion.div>

        <div className="text-center mt-6">
          <Link href="/fortune" className="text-pink-200 text-sm hover:text-white">
            ← 운세 메인으로
          </Link>
        </div>
      </div>
    </div>
  );
}
