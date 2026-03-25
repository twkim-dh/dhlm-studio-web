"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ──────────── Korean Jamo decomposition ──────────── */
const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
const JONG = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

// Stroke counts for initial consonants
const CHO_STROKES = [2,4,2,3,6,5,4,4,8,2,4,1,3,6,4,3,4,4,3];
// Stroke counts for vowels
const JUNG_STROKES = [2,3,3,4,2,3,3,4,2,4,5,3,3,2,4,5,3,3,1,2,1];
// Stroke counts for final consonants (0 = no final)
const JONG_STROKES = [0,2,4,4,2,5,3,3,5,7,9,9,7,9,9,8,4,4,6,2,4,1,3,4,3,4,4,3];

interface JamoInfo {
  char: string;
  cho: string;
  jung: string;
  jong: string;
  strokes: number;
}

function decomposeKorean(name: string): JamoInfo[] {
  const result: JamoInfo[] = [];
  for (const char of name) {
    const code = char.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const offset = code - 0xAC00;
      const choIdx = Math.floor(offset / (21 * 28));
      const jungIdx = Math.floor((offset % (21 * 28)) / 28);
      const jongIdx = offset % 28;
      const strokes = CHO_STROKES[choIdx] + JUNG_STROKES[jungIdx] + JONG_STROKES[jongIdx];
      result.push({
        char,
        cho: CHO[choIdx],
        jung: JUNG[jungIdx],
        jong: JONG[jongIdx],
        strokes,
      });
    }
  }
  return result;
}

/* ──────────── Hash for lucky numbers ──────────── */
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

/* ──────────── Score interpretation ──────────── */
interface NameResult {
  jamo: JamoInfo[];
  totalStrokes: number;
  score: number;
  luckyNumbers: number[];
  interpretation: string;
  detailTitle: string;
  detailDesc: string;
}

const INTERPRETATIONS: { min: number; title: string; desc: string; interp: string }[] = [
  {
    min: 90,
    title: "대길 (大吉)",
    desc: "최고의 이름이에요!",
    interp: "이름에 담긴 기운이 대단히 좋습니다. 어떤 일이든 이름의 힘이 뒷받침해 줄 것입니다. 리더십과 창의력이 빛나는 이름이에요.",
  },
  {
    min: 80,
    title: "상길 (上吉)",
    desc: "아주 좋은 이름이에요!",
    interp: "이름이 가진 에너지가 풍부합니다. 사회적으로 인정받고 주위 사람들에게 좋은 인상을 주는 이름이에요. 꾸준한 성장이 기대됩니다.",
  },
  {
    min: 70,
    title: "중길 (中吉)",
    desc: "좋은 기운의 이름이에요!",
    interp: "안정적이고 균형 잡힌 이름입니다. 대인관계에서 신뢰를 주며, 차분하면서도 단단한 에너지를 지니고 있어요.",
  },
  {
    min: 60,
    title: "소길 (小吉)",
    desc: "나쁘지 않은 이름이에요.",
    interp: "이름에 소소한 행운이 깃들어 있습니다. 노력을 더하면 이름의 기운이 더욱 빛을 발할 거예요. 꾸준함이 키워드입니다.",
  },
  {
    min: 50,
    title: "보통 (普通)",
    desc: "평범한 에너지의 이름이에요.",
    interp: "이름 자체는 무난하지만, 본인의 노력에 따라 크게 달라질 수 있습니다. 긍정적인 마음가짐이 이름의 기운을 올려줘요.",
  },
  {
    min: 0,
    title: "변화 (變化)",
    desc: "변화가 필요한 에너지예요.",
    interp: "이름의 획수 밸런스가 조금 아쉽지만, 이름보다 중요한 것은 마음입니다. 좋은 별명이나 호를 함께 사용하면 에너지가 보완돼요.",
  },
];

function calculateNameFortune(name: string): NameResult {
  const jamo = decomposeKorean(name);
  const totalStrokes = jamo.reduce((s, j) => s + j.strokes, 0);

  // Score: based on stroke total modular mapping (deterministic)
  // Map total strokes to a score range
  const base = ((totalStrokes * 7 + 13) % 51) + 50; // 50-100
  const score = Math.min(base, 100);

  // Lucky numbers
  const seed = hashCode(name);
  const rng = seededRandom(seed);
  const nums = new Set<number>();
  while (nums.size < 3) {
    nums.add(Math.floor(rng() * 45) + 1);
  }
  const luckyNumbers = Array.from(nums).sort((a, b) => a - b);

  const tier = INTERPRETATIONS.find((t) => score >= t.min) || INTERPRETATIONS[INTERPRETATIONS.length - 1];

  return {
    jamo,
    totalStrokes,
    score,
    luckyNumbers,
    interpretation: tier.interp,
    detailTitle: tier.title,
    detailDesc: tier.desc,
  };
}

/* ──────────── Share ──────────── */
async function shareResult(name: string, score: number) {
  const text = `"${name}" 이름 운세 ${score}점! ⭐\nhttps://dhlm-studio.com/fortune/name`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "이름 운세", text });
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
export default function NameFortunePage() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<NameResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(() => {
    setError("");
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 4) {
      setError("2~4글자의 한글 이름을 입력해주세요.");
      return;
    }
    // Check all chars are Korean
    const koreanOnly = /^[가-힣]+$/.test(trimmed);
    if (!koreanOnly) {
      setError("한글 이름만 입력 가능해요.");
      return;
    }
    setResult(calculateNameFortune(trimmed));
  }, [name]);

  /* ── Input ── */
  if (!result) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{
          background:
            "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #92400E 100%)",
        }}
      >
        <motion.div
          className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-6xl block mb-4">✍️</span>
          <h1 className="text-2xl font-bold text-white mb-2">이름 운세</h1>
          <p className="text-amber-100 mb-6">
            이름에 담긴 운명의 점수를 확인하세요
          </p>
          <input
            type="text"
            maxLength={4}
            placeholder="한글 이름 (예: 홍길동)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-amber-200 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 mb-2"
          />
          {error && <p className="text-red-300 text-sm mb-2">{error}</p>}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-white text-amber-700 font-bold text-lg hover:bg-amber-50 transition-colors mt-2"
          >
            이름 분석하기 ✨
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── Result ── */
  const scoreColor =
    result.score >= 80 ? "#EF4444" : result.score >= 60 ? "#F97316" : result.score >= 50 ? "#EAB308" : "#6366F1";

  return (
    <div
      className="min-h-screen px-5 py-8"
      style={{
        background:
          "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #92400E 100%)",
      }}
    >
      <div className="mx-auto max-w-lg">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black text-white">이름 운세 ✍️</h1>
        </motion.div>

        {/* Name display */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-4xl font-black text-white mb-2 tracking-widest">
            {result.jamo.map((j) => j.char).join("")}
          </p>
          <p className="text-amber-200 text-sm">총 획수: {result.totalStrokes}획</p>
        </motion.div>

        {/* Score */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-amber-200 text-sm mb-1">{result.detailTitle}</p>
          <p className="text-5xl font-black text-white mb-1">{result.score}점</p>
          <p className="text-amber-100">{result.detailDesc}</p>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden mt-3">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: scoreColor }}
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Jamo breakdown */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-amber-200 text-xs mb-3">글자별 획수 분석</p>
          <div className="grid grid-cols-3 gap-3">
            {result.jamo.map((j, i) => (
              <div key={i} className="text-center bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-bold text-white mb-1">{j.char}</p>
                <p className="text-amber-200 text-xs">
                  {j.cho} + {j.jung}
                  {j.jong ? ` + ${j.jong}` : ""}
                </p>
                <p className="text-white font-bold text-sm mt-1">{j.strokes}획</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interpretation */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-amber-200 text-xs mb-2">이름 해석</p>
          <p className="text-white leading-relaxed">{result.interpretation}</p>
        </motion.div>

        {/* Lucky numbers */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-amber-200 text-xs mb-2">행운의 숫자</p>
          <div className="flex gap-3 justify-center">
            {result.luckyNumbers.map((n) => (
              <span
                key={n}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-500/50 text-white font-bold"
              >
                {n}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() =>
              shareResult(
                result.jamo.map((j) => j.char).join(""),
                result.score
              )
            }
            className="w-full py-3 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition-colors"
          >
            📤 결과 공유하기
          </button>
          <button
            onClick={() => {
              setResult(null);
              setName("");
            }}
            className="w-full py-3 rounded-xl bg-amber-500/50 text-white font-bold hover:bg-amber-500/70 transition-colors"
          >
            다른 이름 분석하기
          </button>
        </motion.div>

        <div className="text-center mt-6">
          <Link href="/fortune" className="text-amber-200 text-sm hover:text-white">
            ← 운세 메인으로
          </Link>
        </div>
      </div>
    </div>
  );
}
