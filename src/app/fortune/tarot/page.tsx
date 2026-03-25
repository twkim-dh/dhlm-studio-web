"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ──────────── Major Arcana ──────────── */
interface TarotCard {
  id: number;
  name: string;
  koreanName: string;
  emoji: string;
  meaning: string;
  keywords: string;
}

const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: "The Fool", koreanName: "광대", emoji: "🃏", meaning: "새로운 시작과 모험", keywords: "자유, 가능성, 순수" },
  { id: 1, name: "The Magician", koreanName: "마법사", emoji: "🪄", meaning: "창조적 능력과 의지력", keywords: "재능, 집중, 실현" },
  { id: 2, name: "The High Priestess", koreanName: "여사제", emoji: "🌙", meaning: "직관과 내면의 지혜", keywords: "직감, 신비, 잠재력" },
  { id: 3, name: "The Empress", koreanName: "여황제", emoji: "👑", meaning: "풍요와 사랑의 에너지", keywords: "풍요, 모성, 자연" },
  { id: 4, name: "The Emperor", koreanName: "황제", emoji: "🏛️", meaning: "안정과 리더십", keywords: "권위, 구조, 통제" },
  { id: 5, name: "The Hierophant", koreanName: "교황", emoji: "📿", meaning: "전통과 영적 가르침", keywords: "지혜, 전통, 멘토" },
  { id: 6, name: "The Lovers", koreanName: "연인", emoji: "💑", meaning: "사랑과 중요한 선택", keywords: "사랑, 조화, 결합" },
  { id: 7, name: "The Chariot", koreanName: "전차", emoji: "⚡", meaning: "승리와 전진하는 힘", keywords: "의지, 승리, 결단" },
  { id: 8, name: "Strength", koreanName: "힘", emoji: "🦁", meaning: "내면의 용기와 인내", keywords: "용기, 인내, 자신감" },
  { id: 9, name: "The Hermit", koreanName: "은둔자", emoji: "🏔️", meaning: "자기 성찰과 내면의 빛", keywords: "성찰, 고독, 탐구" },
  { id: 10, name: "Wheel of Fortune", koreanName: "운명의 수레바퀴", emoji: "🎡", meaning: "운명의 전환점", keywords: "변화, 순환, 기회" },
  { id: 11, name: "Justice", koreanName: "정의", emoji: "⚖️", meaning: "공정함과 진실", keywords: "균형, 진실, 책임" },
  { id: 12, name: "The Hanged Man", koreanName: "매달린 사람", emoji: "🙃", meaning: "새로운 관점과 희생", keywords: "전환, 인내, 깨달음" },
  { id: 13, name: "Death", koreanName: "죽음", emoji: "🦋", meaning: "변화와 새로운 시작", keywords: "변환, 끝과 시작, 재탄생" },
  { id: 14, name: "Temperance", koreanName: "절제", emoji: "🌈", meaning: "균형과 조화", keywords: "절제, 인내, 치유" },
  { id: 15, name: "The Devil", koreanName: "악마", emoji: "🔗", meaning: "집착에서의 해방", keywords: "속박, 욕망, 해방" },
  { id: 16, name: "The Tower", koreanName: "탑", emoji: "🌩️", meaning: "갑작스런 변화와 깨달음", keywords: "격변, 해방, 각성" },
  { id: 17, name: "The Star", koreanName: "별", emoji: "⭐", meaning: "희망과 영감", keywords: "희망, 평화, 영감" },
  { id: 18, name: "The Moon", koreanName: "달", emoji: "🌕", meaning: "무의식과 상상력", keywords: "환상, 직관, 불안" },
  { id: 19, name: "The Sun", koreanName: "태양", emoji: "☀️", meaning: "기쁨과 성공", keywords: "행복, 활력, 성취" },
  { id: 20, name: "Judgement", koreanName: "심판", emoji: "📯", meaning: "부활과 새로운 부름", keywords: "각성, 판단, 재생" },
  { id: 21, name: "The World", koreanName: "세계", emoji: "🌍", meaning: "완성과 달성", keywords: "완성, 통합, 성취" },
];

/* ──────────── Interpretation templates ──────────── */
const INTERPRETATION_TEMPLATES = [
  "과거에 {past}의 기운이 당신의 삶을 이끌었습니다. 현재 {present}을(를) 경험하며 성장하고 있고, 미래에는 {future}의 에너지가 당신을 기다립니다.",
  "{past}의 경험이 당신을 단단하게 만들었습니다. 지금은 {present}의 시기를 지나고 있으며, 곧 {future}의 시간이 찾아올 것입니다.",
  "돌이켜보면 {past}이(가) 중요한 전환점이었죠. 현재 {present}을(를) 통해 배움을 얻고 있고, 미래에 {future}이(가) 실현될 거예요.",
  "과거 {past}의 에너지가 씨앗이 되어, 현재 {present}으로 자라나고 있습니다. 앞으로 {future}의 열매를 맺게 될 것입니다.",
  "당신의 과거는 {past}의 기운으로 가득했습니다. 지금 {present}의 기운이 흐르고 있으니, 미래의 {future}을(를) 향해 나아가세요.",
  "{past}에서 시작된 여정이 현재 {present}의 단계에 와 있습니다. 최종 목적지는 {future}입니다.",
  "과거의 {past}이(가) 교훈을 남겼고, 현재 {present}이(가) 기회를 열어주며, 미래 {future}이(가) 당신의 빛이 됩니다.",
  "한때 {past}의 흐름 속에 있었지만, 이제 {present}의 물결을 타고 있으며, {future}의 해안에 닿게 될 거예요.",
  "{past}의 기억이 힘이 되어, {present}의 현재를 살아가며, {future}의 내일을 준비하세요.",
  "당신은 {past}을(를) 통해 성숙해졌고, {present}을(를) 통해 단련되고 있으며, {future}을(를) 통해 빛날 것입니다.",
  "과거 {past}의 에너지는 이미 당신 안에 있습니다. 현재의 {present}이(가) 길을 열고 있고, 미래 {future}의 문이 곧 열립니다.",
  "{past}이(가) 남긴 흔적 위에 {present}의 꽃이 피고 있습니다. {future}의 열매가 풍성할 거예요.",
  "카드는 말합니다. {past}을(를) 받아들이고, {present}에 집중하며, {future}을(를) 믿으라고요.",
  "과거의 {past}, 현재의 {present}, 미래의 {future} — 이 세 가지 기운이 당신의 인생에 조화를 이룹니다.",
  "{past}의 시련을 거쳐, {present}의 성장을 이루고, {future}의 축복이 따를 것입니다.",
  "지나간 {past}의 기운은 교훈이요, 현재 {present}의 기운은 기회이며, 다가올 {future}의 기운은 선물입니다.",
  "과거에 {past}이(가) 있었기에 지금이 있고, 현재 {present}이(가) 있기에 미래 {future}이(가) 가능합니다.",
  "{past}의 파도를 넘어, {present}의 바다를 항해하며, {future}의 항구에 도달하세요.",
  "카드가 보여주는 흐름은 {past} → {present} → {future}입니다. 이 흐름을 믿고 따르세요.",
  "당신의 여정은 {past}에서 시작되어 {present}을(를) 지나 {future}으로 향하고 있습니다. 아름다운 여정이에요.",
];

const ADVICE_BY_SCORE: { min: number; advice: string }[] = [
  { min: 15, advice: "카드가 매우 긍정적인 에너지를 보여주고 있어요. 자신감을 가지고 앞으로 나아가세요!" },
  { min: 12, advice: "좋은 기운이 감지됩니다. 노력한 만큼 결실을 맺을 시기예요." },
  { min: 9, advice: "균형 잡힌 에너지입니다. 현재에 충실하면서 미래를 준비하세요." },
  { min: 6, advice: "잠시 쉬어가는 시간이 필요해요. 내면의 목소리에 귀 기울여 보세요." },
  { min: 0, advice: "변화의 시기입니다. 지금의 어려움이 더 큰 성장의 밑거름이 될 거예요." },
];

function getCardScore(card: TarotCard): number {
  // Positive cards get higher scores
  const positive = [0, 1, 3, 6, 7, 8, 10, 14, 17, 19, 21];
  const neutral = [2, 4, 5, 9, 11, 20];
  if (positive.includes(card.id)) return 7;
  if (neutral.includes(card.id)) return 5;
  return 3;
}

/* ──────────── Daily limit ──────────── */
function getTarotCount(): number {
  if (typeof window === "undefined") return 0;
  const key = "tarot_daily_" + new Date().toISOString().slice(0, 10);
  return parseInt(localStorage.getItem(key) || "0", 10);
}

function incrementTarotCount(): void {
  if (typeof window === "undefined") return;
  const key = "tarot_daily_" + new Date().toISOString().slice(0, 10);
  const cur = parseInt(localStorage.getItem(key) || "0", 10);
  localStorage.setItem(key, String(cur + 1));
}

/* ──────────── Share ──────────── */
async function shareResult(cards: TarotCard[]) {
  const text = `타로 결과: 과거${cards[0].emoji} 현재${cards[1].emoji} 미래${cards[2].emoji}\nhttps://dhlm-studio.com/fortune/tarot`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "타로 결과", text });
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
type Step = "concern" | "pick" | "result";

export default function TarotPage() {
  const [step, setStep] = useState<Step>("concern");
  const [concern, setConcern] = useState("");
  const [shuffled, setShuffled] = useState<TarotCard[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (getTarotCount() >= 3) {
      setLimitReached(true);
    }
  }, []);

  const startPicking = useCallback(() => {
    if (getTarotCount() >= 3) {
      setLimitReached(true);
      return;
    }
    // Shuffle and pick 10 from 22
    const arr = [...MAJOR_ARCANA];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr.slice(0, 10));
    setPicked([]);
    setFlipped(new Set());
    setStep("pick");
  }, []);

  const handlePick = useCallback(
    (idx: number) => {
      if (picked.includes(idx) || picked.length >= 3) return;
      const newPicked = [...picked, idx];
      const newFlipped = new Set(flipped);
      newFlipped.add(idx);
      setPicked(newPicked);
      setFlipped(newFlipped);

      if (newPicked.length === 3) {
        incrementTarotCount();
        setTimeout(() => setStep("result"), 800);
      }
    },
    [picked, flipped]
  );

  const selectedCards = picked.map((i) => shuffled[i]);

  /* ── Limit reached ── */
  if (limitReached) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{
          background:
            "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)",
        }}
      >
        <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full">
          <span className="text-6xl block mb-4">🃏</span>
          <h1 className="text-2xl font-bold text-white mb-2">오늘의 타로 완료</h1>
          <p className="text-purple-200 mb-6">
            오늘의 타로는 3회까지 가능해요.
            <br />
            내일 다시 만나요!
          </p>
          <Link
            href="/fortune"
            className="inline-block px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors"
          >
            운세 메인으로
          </Link>
        </div>
      </div>
    );
  }

  /* ── Step: Concern ── */
  if (step === "concern") {
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
        >
          <span className="text-6xl block mb-4">🃏</span>
          <h1 className="text-2xl font-bold text-white mb-2">타로 카드</h1>
          <p className="text-purple-200 mb-6">
            고민이 있다면 적어보세요 (선택)
          </p>
          <textarea
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="예: 이직을 할까 말까..."
            maxLength={100}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 mb-4 resize-none"
          />
          <button
            onClick={startPicking}
            className="w-full py-3 rounded-xl bg-white text-purple-700 font-bold text-lg hover:bg-purple-50 transition-colors"
          >
            카드 뽑기 시작 ✨
          </button>
          <p className="text-purple-300 text-xs mt-4">
            오늘 {3 - getTarotCount()}회 남음
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── Step: Pick ── */
  if (step === "pick") {
    return (
      <div
        className="min-h-screen px-5 py-8"
        style={{
          background:
            "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)",
        }}
      >
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            카드를 3장 골라주세요
          </h1>
          <p className="text-purple-200 mb-1 text-sm">
            과거 · 현재 · 미래를 나타낼 카드입니다
          </p>
          <p className="text-purple-300 text-xs mb-6">
            {picked.length}/3 선택됨
          </p>

          <div className="grid grid-cols-5 gap-3 mb-6">
            {shuffled.map((card, idx) => {
              const isFlipped = flipped.has(idx);
              return (
                <motion.div
                  key={card.id}
                  className="relative cursor-pointer"
                  style={{ perspective: 600 }}
                  onClick={() => handlePick(idx)}
                  whileHover={!isFlipped ? { scale: 1.08 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <motion.div
                    className="relative w-full"
                    style={{ transformStyle: "preserve-3d", aspectRatio: "2/3" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Front (face-down) */}
                    <div
                      className="absolute inset-0 rounded-lg flex items-center justify-center"
                      style={{
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #6D28D9, #4C1D95)",
                        border: "2px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <span className="text-2xl">✨</span>
                    </div>
                    {/* Back (face-up) */}
                    <div
                      className="absolute inset-0 rounded-lg flex flex-col items-center justify-center p-1"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(135deg, #EDE9FE, #F5F3FF)",
                        border: "2px solid #7C3AED",
                      }}
                    >
                      <span className="text-xl">{card.emoji}</span>
                      <span className="text-[9px] text-purple-700 font-bold mt-0.5 leading-tight text-center">
                        {card.koreanName}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {picked.length > 0 && picked.length < 3 && (
            <p className="text-purple-200 text-sm">
              {["과거", "현재", "미래"][picked.length]} 카드를 선택해주세요
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ── Step: Result ── */
  const labels = ["과거", "현재", "미래"];
  const labelEmojis = ["🕰️", "✨", "🔮"];
  const totalScore = selectedCards.reduce((s, c) => s + getCardScore(c), 0);
  const adviceItem = ADVICE_BY_SCORE.find((a) => totalScore >= a.min) || ADVICE_BY_SCORE[ADVICE_BY_SCORE.length - 1];

  // Pick template deterministically based on card IDs
  const templateIdx =
    (selectedCards[0].id + selectedCards[1].id + selectedCards[2].id) %
    INTERPRETATION_TEMPLATES.length;
  const interpretation = INTERPRETATION_TEMPLATES[templateIdx]
    .replace(/\{past\}/g, selectedCards[0].meaning)
    .replace(/\{present\}/g, selectedCards[1].meaning)
    .replace(/\{future\}/g, selectedCards[2].meaning);

  return (
    <div
      className="min-h-screen px-5 py-8"
      style={{
        background:
          "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)",
      }}
    >
      <div className="mx-auto max-w-lg">
        <motion.h1
          className="text-2xl font-bold text-white text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          타로 결과 🃏
        </motion.h1>

        {concern && (
          <motion.div
            className="bg-white/10 rounded-xl p-4 mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-purple-200 text-xs mb-1">나의 고민</p>
            <p className="text-white text-sm">&ldquo;{concern}&rdquo;</p>
          </motion.div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {selectedCards.map((card, i) => (
            <motion.div
              key={card.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <p className="text-purple-300 text-xs mb-2">
                {labelEmojis[i]} {labels[i]}
              </p>
              <span className="text-4xl block mb-2">{card.emoji}</span>
              <p className="text-white font-bold text-sm">{card.koreanName}</p>
              <p className="text-purple-200 text-xs mt-1">{card.keywords}</p>
            </motion.div>
          ))}
        </div>

        {/* Interpretation */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-purple-200 text-xs mb-2">카드 해석</p>
          <p className="text-white leading-relaxed">{interpretation}</p>
        </motion.div>

        {/* Advice */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-purple-200 text-xs mb-2">조언</p>
          <p className="text-white leading-relaxed">{adviceItem.advice}</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => shareResult(selectedCards)}
            className="w-full py-3 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition-colors"
          >
            📤 결과 공유하기
          </button>
          <button
            onClick={() => {
              if (getTarotCount() >= 3) {
                setLimitReached(true);
              } else {
                setStep("concern");
                setConcern("");
              }
            }}
            className="w-full py-3 rounded-xl bg-purple-500/50 text-white font-bold hover:bg-purple-500/70 transition-colors"
          >
            다시 뽑기 ({3 - getTarotCount()}회 남음)
          </button>
        </motion.div>

        <div className="text-center mt-6">
          <Link href="/fortune" className="text-purple-300 text-sm hover:text-white">
            ← 운세 메인으로
          </Link>
        </div>
      </div>
    </div>
  );
}
