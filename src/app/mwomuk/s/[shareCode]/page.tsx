"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import {
  getSessionByShareCode,
  saveSelection,
  getSelections,
  saveMatchResult,
} from "@/lib/mwomuk-firestore";
import { getMenusByCategory, getCategoryById } from "@/data/mwomuk/menus";
import MenuCard from "@/components/MenuCard";
import type { Session } from "@/types/mwomuk";

type Stage = "intro" | "nickname" | "picking" | "calculating";
const MAX_SELECTIONS = 3;

export default function RespondentPage() {
  const params = useParams<{ shareCode: string }>();
  const router = useRouter();
  const shareCode = params.shareCode;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stage, setStage] = useState<Stage>("intro");
  const [nickname, setNickname] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const s = await getSessionByShareCode(shareCode);
        if (s) {
          setSession(s);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("[RespondentPage] Load error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shareCode]);

  const toggleMenu = (menuId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(menuId)) {
        return prev.filter((id) => id !== menuId);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev;
      }
      return [...prev, menuId];
    });
  };

  const handleSubmit = async () => {
    if (!session || selectedIds.length !== MAX_SELECTIONS) return;
    setStage("calculating");

    try {
      const respondentId = nanoid();
      const respondentName = nickname.trim() || "상대방";

      // Save respondent selection
      await saveSelection(
        session.id,
        "respondent",
        selectedIds,
        respondentId,
        respondentName
      );

      // Get both selections
      const selections = await getSelections(session.id);
      const creatorMenuIds = selections.creator?.menuIds || [];
      const respondentMenuIds = selectedIds;

      // Calculate matches (intersection)
      const matchedMenuIds = creatorMenuIds.filter((id: string) =>
        respondentMenuIds.includes(id)
      );

      // Save match result
      await saveMatchResult(session.id, {
        respondentId,
        respondentName,
        matchedMenus: matchedMenuIds,
        creatorMenus: creatorMenuIds,
        respondentMenus: respondentMenuIds,
        matchCount: matchedMenuIds.length,
      });

      // Navigate to result
      router.push(`/result/${session.id}?rid=${respondentId}`);
    } catch (err) {
      console.error("[RespondentPage] Submit error:", err);
      alert("저장 중 오류가 발생했어요. 다시 시도해주세요.");
      setStage("picking");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="w-10 h-10 border-4 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin-slow" />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">불러오는 중...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <span className="text-5xl mb-4">😢</span>
        <p className="text-lg font-bold text-[var(--text-primary)] mb-2">
          링크를 찾을 수 없어요
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          링크가 만료되었거나 잘못되었을 수 있어요
        </p>
      </div>
    );
  }

  const category = getCategoryById(session.categoryId);
  const menuItems = getMenusByCategory(session.categoryId);

  // Stage: Intro
  if (stage === "intro") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-5 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center"
        >
          <span className="text-7xl mb-6" role="img">
            🍽️
          </span>
          <h1 className="text-2xl font-black text-[var(--text-primary)] text-center mb-3">
            상대가 고른 메뉴와
            <br />
            겹치는 걸 찾아보세요!
          </h1>

          {category && (
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-6 shadow-sm border border-gray-100">
              <span className="text-xl">{category.emoji}</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {category.name}
              </span>
            </div>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setStage("nickname")}
            className="w-full max-w-xs py-3.5 px-8 rounded-xl bg-[var(--brand-orange)] text-white
              font-bold text-base shadow-md shadow-orange-200 hover:brightness-95 transition-all"
          >
            시작하기
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Stage: Nickname
  if (stage === "nickname") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center w-full max-w-xs"
        >
          <span className="text-5xl mb-4" role="img">
            👋
          </span>
          <h1 className="text-xl font-black text-[var(--text-primary)] mb-6">
            이름을 알려주세요
          </h1>

          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="이름 또는 별명"
            maxLength={10}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-center
              text-base font-medium focus:border-[var(--brand-orange)] focus:outline-none
              transition-colors mb-4"
            onKeyDown={(e) => {
              if (e.key === "Enter" && nickname.trim()) {
                setStage("picking");
              }
            }}
          />

          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setStage("picking")}
            disabled={!nickname.trim()}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all
              ${
                nickname.trim()
                  ? "bg-[var(--brand-orange)] text-white shadow-md shadow-orange-200 hover:brightness-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            다음
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Stage: Calculating
  if (stage === "calculating") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-6">
            <span className="text-6xl animate-bounce-gentle">🔍</span>
          </div>
          <div className="w-10 h-10 border-4 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin-slow mb-4" />
          <p className="text-base font-bold text-[var(--text-primary)]">
            겹치는 메뉴 찾는 중...
          </p>
        </motion.div>
      </div>
    );
  }

  // Stage: Picking
  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-[var(--brand-bg)] px-5 pt-6 pb-4"
      >
        <div className="flex items-center gap-2 mb-1">
          {category && (
            <span className="text-3xl" role="img">
              {category.emoji}
            </span>
          )}
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            {category?.name}
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          {nickname}님, 먹고 싶은 메뉴 3개를 골라주세요!
        </p>
      </motion.div>

      {/* Menu Grid */}
      <div className="grid grid-cols-3 gap-2.5 px-5 py-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <MenuCard
              emoji={item.emoji}
              name={item.name}
              selected={selectedIds.includes(item.id)}
              disabled={
                selectedIds.length >= MAX_SELECTIONS &&
                !selectedIds.includes(item.id)
              }
              onClick={() => toggleMenu(item.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 px-5 py-4 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: MAX_SELECTIONS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    i < selectedIds.length
                      ? "bg-[var(--brand-orange)] scale-110"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-[var(--text-secondary)]">
              {selectedIds.length}/{MAX_SELECTIONS} 선택
            </span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedIds.length !== MAX_SELECTIONS}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all
              ${
                selectedIds.length === MAX_SELECTIONS
                  ? "bg-[var(--brand-orange)] text-white shadow-md shadow-orange-200 hover:brightness-95 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            결과 보기 🎉
          </button>
        </div>
      </div>
    </div>
  );
}
