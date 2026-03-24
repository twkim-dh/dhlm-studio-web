"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/data/mwomuk/menus";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1 px-5 py-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex flex-col items-center mt-4 mb-2"
      >
        <span className="text-6xl mb-2" role="img" aria-label="plate">
          🍽️
        </span>
        <h1 className="text-4xl font-black text-[var(--brand-orange)] tracking-tight">
          오늘 뭐먹?
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-base text-[var(--text-secondary)] text-center mb-8 font-medium"
      >
        같이 고르면 싸움 없이 메뉴 결정!
      </motion.p>

      {/* Category Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 w-full mb-8"
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={itemVariants}>
            <Link
              href={`/pick/${category.id}`}
              className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl
                p-5 border-2 border-gray-100 shadow-sm
                hover:border-[var(--brand-light)] hover:shadow-md
                active:scale-95 transition-all duration-200"
            >
              <span className="text-4xl" role="img">
                {category.emoji}
              </span>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="mt-auto pt-4 pb-6">
        <p className="text-xs text-gray-400 text-center">
          만든 곳: DHLM Studio
        </p>
      </div>
    </div>
  );
}
