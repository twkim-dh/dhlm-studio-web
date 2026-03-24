"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { getMenusByCategory, getCategoryById } from "@/data/mwomuk/menus";
import { createSession, saveSelection } from "@/lib/mwomuk-firestore";
import MenuCard from "@/components/MenuCard";

const MAX_SELECTIONS = 3;

export default function PickPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const categoryId = params.categoryId;

  const category = getCategoryById(categoryId);
  const menuItems = getMenusByCategory(categoryId);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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

  const handleNext = async () => {
    if (selectedIds.length !== MAX_SELECTIONS) return;
    setSaving(true);

    try {
      const creatorId = nanoid();
      const session = await createSession(creatorId, categoryId);
      await saveSelection(session.id, "creator", selectedIds);
      router.push(`/share/${session.id}`);
    } catch (err) {
      console.error("[PickPage] Save error:", err);
      alert("저장 중 오류가 발생했어요. 다시 시도해주세요.");
      setSaving(false);
    }
  };

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <p className="text-lg text-gray-500">카테고리를 찾을 수 없어요 😢</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-[var(--brand-bg)] px-5 pt-6 pb-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl" role="img">
            {category.emoji}
          </span>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            {category.name}
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          먹고 싶은 메뉴 3개를 골라주세요!
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
            onClick={handleNext}
            disabled={selectedIds.length !== MAX_SELECTIONS || saving}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all
              ${
                selectedIds.length === MAX_SELECTIONS && !saving
                  ? "bg-[var(--brand-orange)] text-white shadow-md shadow-orange-200 hover:brightness-95 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {saving ? "저장 중..." : "다음 →"}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 shadow-xl">
            <div className="w-10 h-10 border-4 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin-slow" />
            <p className="text-sm font-bold text-[var(--text-primary)]">
              메뉴 저장 중...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
