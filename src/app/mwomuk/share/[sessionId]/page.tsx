"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getSession } from "@/lib/mwomuk-firestore";
import { initKakao, shareMenu } from "@/lib/mwomuk-kakao";
import { getCategoryById } from "@/data/mwomuk/menus";
import ShareButtons from "@/components/ShareButtons";
import type { Session } from "@/types/mwomuk";

export default function SharePage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initKakao();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const s = await getSession(sessionId);
        setSession(s);
      } catch (err) {
        console.error("[SharePage] Load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="w-10 h-10 border-4 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin-slow" />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">불러오는 중...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <span className="text-5xl mb-4">😢</span>
        <p className="text-lg font-bold text-[var(--text-primary)]">
          세션을 찾을 수 없어요
        </p>
      </div>
    );
  }

  const category = getCategoryById(session.categoryId);
  const shareCode = session.shareCode;
  const shareUrl = `https://mwomuk.dhlm-studio.com/s/${shareCode}`;

  const handleKakaoShare = () => {
    shareMenu(category?.name || "메뉴", shareCode);
  };

  return (
    <div className="flex flex-col items-center flex-1 px-5 py-8">
      {/* Success Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mt-8 mb-4"
      >
        <span className="text-7xl" role="img">
          🎉
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl font-black text-[var(--text-primary)] mb-2"
      >
        메뉴 골랐어!
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col items-center gap-1 mb-8"
      >
        <p className="text-base font-medium text-[var(--text-secondary)]">
          이제 상대방 차례예요
        </p>
        <p className="text-sm text-gray-400 text-center">
          상대가 고르면 겹치는 메뉴를 알려줄게요
        </p>
      </motion.div>

      {/* Category Badge */}
      {category && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-8 shadow-sm border border-gray-100"
        >
          <span className="text-xl">{category.emoji}</span>
          <span className="text-sm font-bold text-[var(--text-primary)]">
            {category.name}
          </span>
        </motion.div>
      )}

      {/* Share Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <ShareButtons onKakaoShare={handleKakaoShare} shareUrl={shareUrl} />
      </motion.div>

      {/* Waiting Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[var(--brand-orange)] animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-[var(--brand-orange)] animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-[var(--brand-orange)] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-xs text-gray-400 text-center">
          겹치는 메뉴가 나오면 여기서 바로 볼 수 있어요
        </p>
      </motion.div>
    </div>
  );
}
