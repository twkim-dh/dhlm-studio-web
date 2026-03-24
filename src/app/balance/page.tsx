"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getTodayQuestion } from "@/data/balance/questions";
import { getVotes, vote } from "@/lib/balance-firestore";
import { initKakao, shareBalance, shareResult } from "@/lib/balance-kakao";
import { BalanceQuestion, VoteData } from "@/types/balance";

function getLocalStorageKey(questionId: number): string {
  return `voted_q_${questionId}`;
}

function getLocalChoice(questionId: number): "A" | "B" | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(getLocalStorageKey(questionId));
  if (val === "A" || val === "B") return val;
  return null;
}

function setLocalChoice(questionId: number, choice: "A" | "B"): void {
  localStorage.setItem(getLocalStorageKey(questionId), choice);
}

export default function HomePage() {
  const [question, setQuestion] = useState<BalanceQuestion | null>(null);
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [myChoice, setMyChoice] = useState<"A" | "B" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    initKakao();
    const q = getTodayQuestion();
    setQuestion(q);

    const existing = getLocalChoice(q.id);
    if (existing) {
      setMyChoice(existing);
      setHasVoted(true);
      setShowResult(true);
      getVotes(q.id).then((data) => setVoteData(data));
    }
  }, []);

  const handleVote = useCallback(
    async (option: "A" | "B") => {
      if (!question || isVoting || hasVoted) return;
      setIsVoting(true);
      try {
        const data = await vote(question.id, option);
        setVoteData(data);
        setMyChoice(option);
        setHasVoted(true);
        setLocalChoice(question.id, option);
        setTimeout(() => setShowResult(true), 300);
      } catch {
        alert("투표에 실패했어요. 다시 시도해주세요!");
      } finally {
        setIsVoting(false);
      }
    },
    [question, isVoting, hasVoted]
  );

  const handleShare = useCallback(() => {
    if (!question || !voteData) return;
    const total = voteData.totalVotes || 1;
    const pA = Math.round((voteData.optionA / total) * 100);
    const pB = Math.round((voteData.optionB / total) * 100);
    const questionText = `${question.optionA} vs ${question.optionB}`;

    if (hasVoted && myChoice) {
      const chosen = myChoice === "A" ? question.optionA : question.optionB;
      shareResult(questionText, chosen, pA, pB);
    } else {
      shareBalance(questionText);
    }
  }, [question, voteData, hasVoted, myChoice]);

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-lg text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const total = voteData?.totalVotes || 0;
  const percentA = total > 0 ? Math.round(((voteData?.optionA || 0) / total) * 100) : 50;
  const percentB = total > 0 ? 100 - percentA : 50;

  return (
    <main className="w-full max-w-[480px] mx-auto px-5 py-8 flex flex-col items-center gap-6 min-h-dvh">
      {/* Title */}
      <motion.h1
        className="text-2xl font-black text-center tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        오늘의 밸런스 ⚡
      </motion.h1>

      <p className="text-sm text-gray-400 -mt-3">매일 새로운 질문이 나와요</p>

      {/* Cards + VS */}
      <div className="w-full flex flex-col items-center gap-0 relative mt-2">
        {/* Option A - Blue */}
        <motion.button
          className="option-card-a w-full rounded-2xl p-8 text-center cursor-pointer border-2 relative overflow-hidden"
          style={{
            backgroundColor: hasVoted && myChoice === "A" ? "#3B82F6" : "#EFF6FF",
            borderColor: "#3B82F6",
            color: hasVoted && myChoice === "A" ? "#ffffff" : "#1E40AF",
          }}
          onClick={() => handleVote("A")}
          disabled={hasVoted || isVoting}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileTap={!hasVoted ? { scale: 0.97 } : undefined}
        >
          {hasVoted && myChoice === "A" && (
            <span className="absolute top-3 right-3 text-xs font-bold bg-white/30 px-2 py-1 rounded-full">
              MY PICK
            </span>
          )}
          <span className="text-2xl font-black leading-tight block">
            {question.optionA}
          </span>
        </motion.button>

        {/* VS Badge */}
        <motion.div
          className="vs-animate z-10 -my-5 w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
        >
          <span className="text-white text-xl font-black">VS</span>
        </motion.div>

        {/* Option B - Red */}
        <motion.button
          className="option-card-b w-full rounded-2xl p-8 text-center cursor-pointer border-2 relative overflow-hidden"
          style={{
            backgroundColor: hasVoted && myChoice === "B" ? "#EF4444" : "#FEF2F2",
            borderColor: "#EF4444",
            color: hasVoted && myChoice === "B" ? "#ffffff" : "#991B1B",
          }}
          onClick={() => handleVote("B")}
          disabled={hasVoted || isVoting}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileTap={!hasVoted ? { scale: 0.97 } : undefined}
        >
          {hasVoted && myChoice === "B" && (
            <span className="absolute top-3 right-3 text-xs font-bold bg-white/30 px-2 py-1 rounded-full">
              MY PICK
            </span>
          )}
          <span className="text-2xl font-black leading-tight block">
            {question.optionB}
          </span>
        </motion.button>
      </div>

      {/* Voting indicator */}
      {isVoting && (
        <p className="text-sm text-gray-400 animate-pulse">투표 중...</p>
      )}

      {/* Results */}
      <AnimatePresence>
        {showResult && voteData && (
          <motion.div
            className="w-full flex flex-col gap-4 mt-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Percentage bars */}
            <div className="w-full rounded-2xl bg-gray-100 p-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-500 text-center">
                실시간 투표 결과
              </h3>

              {/* Option A bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-blue">{question.optionA}</span>
                  <span className="text-blue">{percentA}%</span>
                </div>
                <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#3B82F6" }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${percentA}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Option B bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-red">{question.optionB}</span>
                  <span className="text-red">{percentB}%</span>
                </div>
                <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#EF4444" }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${percentB}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
              </div>

              {/* Total votes */}
              <p className="text-center text-xs text-gray-400 mt-1">
                총 {total.toLocaleString()}명 참여
              </p>
            </div>

            {/* Share button */}
            <button className="kakao-btn" onClick={handleShare}>
              카카오톡으로 공유 💬
            </button>

            {/* Tomorrow message */}
            <p className="text-center text-sm text-gray-400 mt-1">
              내일 다시 오세요! 새로운 질문이 기다리고 있어요 🌙
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Archive link */}
      <Link
        href="/archive"
        className="mt-auto pt-6 pb-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-4"
      >
        아카이브 보기 →
      </Link>
    </main>
  );
}
