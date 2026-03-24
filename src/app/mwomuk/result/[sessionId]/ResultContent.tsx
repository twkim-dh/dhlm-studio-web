"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMatchResult } from "@/lib/mwomuk-firestore";
import { initKakao, shareResult } from "@/lib/mwomuk-kakao";
import { getMenuById } from "@/data/mwomuk/menus";
import MatchedMenu from "@/components/MatchedMenu";
import type { MatchResult } from "@/types/mwomuk";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ResultContent() {
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId;
  const respondentId = searchParams.get("rid") || undefined;

  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initKakao();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const r = await getMatchResult(sessionId, respondentId);
        setResult(r);
      } catch (err) {
        console.error("[ResultPage] Load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId, respondentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="w-10 h-10 border-4 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin-slow" />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">결과 불러오는 중...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <span className="text-5xl mb-4">😢</span>
        <p className="text-lg font-bold text-[var(--text-primary)] mb-2">
          결과를 찾을 수 없어요
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-2.5 rounded-xl bg-[var(--brand-orange)] text-white font-bold text-sm"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const matchedMenuItems = result.matchedMenus
    .map((id) => getMenuById(id))
    .filter(Boolean);
  const creatorMenuItems = result.creatorMenus
    .map((id) => getMenuById(id))
    .filter(Boolean);
  const respondentMenuItems = result.respondentMenus
    .map((id) => getMenuById(id))
    .filter(Boolean);
  const hasMatches = result.matchCount > 0;

  const handleKakaoShare = () => {
    shareResult(result.matchCount, sessionId);
  };

  return (
    <div className="flex flex-col items-center flex-1 px-5 py-8 overflow-x-hidden">
      {/* Result Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mt-4 mb-2"
      >
        <span className="text-7xl" role="img">
          {hasMatches ? "🎉" : "😅"}
        </span>
      </motion.div>

      {hasMatches ? (
        <>
          {/* Match Success */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-black text-green-600 mb-1 text-center"
          >
            겹치는 메뉴 {result.matchCount}개!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-base font-medium text-[var(--text-secondary)] mb-6"
          >
            오늘 저녁은 이거다!
          </motion.p>

          {/* Matched Menus */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-xs mb-8">
            {matchedMenuItems.map((item, index) =>
              item ? (
                <MatchedMenu
                  key={item.id}
                  emoji={item.emoji}
                  name={item.name}
                  index={index}
                />
              ) : null
            )}
          </div>
        </>
      ) : (
        <>
          {/* No Match */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-black text-[var(--brand-orange)] mb-1 text-center"
          >
            겹치는 메뉴가 없어요!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-base font-medium text-[var(--text-secondary)] mb-6"
          >
            다시 한 번 골라볼까요?
          </motion.p>
        </>
      )}

      {/* Picks Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full space-y-4 mb-8"
      >
        {/* Creator's picks */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">
            👤 상대가 고른 메뉴
          </h3>
          <div className="flex gap-2">
            {creatorMenuItems.map((item) =>
              item ? (
                <div
                  key={item.id}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl
                    ${
                      result.matchedMenus.includes(item.id)
                        ? "bg-orange-50 border-2 border-[var(--brand-orange)]"
                        : "bg-gray-50 border-2 border-transparent"
                    }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-medium text-center leading-tight">
                    {item.name}
                  </span>
                  {result.matchedMenus.includes(item.id) && (
                    <span className="text-[10px] font-bold text-[var(--brand-orange)]">
                      일치!
                    </span>
                  )}
                </div>
              ) : null
            )}
          </div>
        </motion.div>

        {/* Respondent's picks */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">
            🙋 {result.respondentName}님이 고른 메뉴
          </h3>
          <div className="flex gap-2">
            {respondentMenuItems.map((item) =>
              item ? (
                <div
                  key={item.id}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl
                    ${
                      result.matchedMenus.includes(item.id)
                        ? "bg-orange-50 border-2 border-[var(--brand-orange)]"
                        : "bg-gray-50 border-2 border-transparent"
                    }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-medium text-center leading-tight">
                    {item.name}
                  </span>
                  {result.matchedMenus.includes(item.id) && (
                    <span className="text-[10px] font-bold text-[var(--brand-orange)]">
                      일치!
                    </span>
                  )}
                </div>
              ) : null
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-3 w-full max-w-sm mb-8"
      >
        {/* Kakao Share */}
        <button
          type="button"
          onClick={handleKakaoShare}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl
            bg-[#FEE500] text-[#191919] font-bold text-sm
            hover:brightness-95 active:scale-[0.98] transition-all"
        >
          <span className="text-lg">📱</span>
          카카오톡으로 결과 공유
        </button>

        {/* Retry */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl
            bg-[var(--brand-orange)] text-white font-bold text-sm
            hover:brightness-95 active:scale-[0.98] transition-all"
        >
          <span className="text-lg">🔄</span>
          다른 카테고리로 다시 하기
        </Link>

        {/* Home */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl
            bg-gray-100 text-gray-700 font-bold text-sm
            hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          <span className="text-lg">🏠</span>
          홈으로
        </Link>
      </motion.div>
    </div>
  );
}
