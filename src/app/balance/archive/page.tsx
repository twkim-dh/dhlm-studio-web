"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { questions } from "@/data/balance/questions";
import { getVotes } from "@/lib/balance-firestore";
import { VoteData, BalanceQuestion } from "@/types/balance";

function getLocalChoice(questionId: number): "A" | "B" | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(`voted_q_${questionId}`);
  if (val === "A" || val === "B") return val;
  return null;
}

interface QuestionCardProps {
  question: BalanceQuestion;
  index: number;
  onVisible: (id: number) => void;
}

function QuestionCard({ question, index, onVisible }: QuestionCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const myChoice = getLocalChoice(question.id);
  const hasVoted = myChoice !== null;

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(question.id);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [question.id, onVisible]);

  const handleExpand = async () => {
    if (!expanded && !loaded) {
      try {
        const data = await getVotes(question.id);
        setVoteData(data);
        setLoaded(true);
      } catch {
        setVoteData({ optionA: 0, optionB: 0, totalVotes: 0 });
        setLoaded(true);
      }
    }
    setExpanded(!expanded);
  };

  const total = voteData?.totalVotes || 0;
  const percentA = total > 0 ? Math.round(((voteData?.optionA || 0) / total) * 100) : 50;
  const percentB = total > 0 ? 100 - percentA : 50;

  return (
    <motion.div
      ref={ref}
      className="w-full rounded-2xl overflow-hidden cursor-pointer"
      style={{
        backgroundColor: hasVoted ? "#F0F9FF" : "#F9FAFB",
        border: hasVoted ? "2px solid #3B82F6" : "2px solid #E5E7EB",
      }}
      onClick={handleExpand}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-300 w-6">
            #{question.id}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue text-sm">
              {question.optionA}
            </span>
            <span className="text-xs text-gray-400 font-bold">vs</span>
            <span className="font-bold text-red text-sm">
              {question.optionB}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasVoted && (
            <span className="text-[10px] bg-blue text-white px-2 py-0.5 rounded-full font-bold">
              투표 완료
            </span>
          )}
          <span
            className="text-gray-400 text-xs transition-transform"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </div>
      </div>

      {expanded && (
        <motion.div
          className="px-4 pb-4 flex flex-col gap-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {!loaded ? (
            <p className="text-xs text-gray-400 text-center py-2">
              로딩 중...
            </p>
          ) : (
            <>
              {/* Option A bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-blue">{question.optionA}</span>
                  <span className="text-blue">{percentA}%</span>
                </div>
                <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#3B82F6" }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${percentA}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Option B bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-red">{question.optionB}</span>
                  <span className="text-red">{percentB}%</span>
                </div>
                <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#EF4444" }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${percentB}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  />
                </div>
              </div>

              <p className="text-center text-[10px] text-gray-400">
                총 {total.toLocaleString()}명 참여
              </p>

              {hasVoted && myChoice && (
                <p className="text-center text-xs text-gray-500">
                  내 선택:{" "}
                  <span
                    className="font-bold"
                    style={{ color: myChoice === "A" ? "#3B82F6" : "#EF4444" }}
                  >
                    {myChoice === "A" ? question.optionA : question.optionB}
                  </span>
                </p>
              )}
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ArchivePage() {
  const handleVisible = useCallback((_id: number) => {
    // Lazy load trigger - votes loaded on expand
  }, []);

  return (
    <main className="w-full max-w-[480px] mx-auto px-5 py-8 flex flex-col items-center gap-4 min-h-dvh">
      <div className="w-full flex items-center justify-between mb-2">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 오늘의 질문
        </Link>
        <h1 className="text-lg font-black">아카이브 📚</h1>
        <div className="w-16" />
      </div>

      <p className="text-xs text-gray-400 -mt-2 mb-2">
        지금까지의 밸런스 게임 모아보기
      </p>

      <div className="w-full flex flex-col gap-3">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            onVisible={handleVisible}
          />
        ))}
      </div>

      <Link
        href="/"
        className="mt-6 mb-4 text-sm font-medium text-blue hover:underline"
      >
        오늘의 질문으로 돌아가기 →
      </Link>
    </main>
  );
}
