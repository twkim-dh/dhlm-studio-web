"use client";

import { motion } from "framer-motion";

interface MatchedMenuProps {
  emoji: string;
  name: string;
  index?: number;
}

export default function MatchedMenu({ emoji, name, index = 0 }: MatchedMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2 + index * 0.15,
      }}
      className="relative flex flex-col items-center gap-2 p-4 rounded-2xl
        bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-[var(--brand-orange)]
        shadow-lg shadow-orange-100"
    >
      {/* Confetti-like decorations */}
      <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-yellow-300 opacity-60" />
      <div className="absolute -top-2 right-3 w-2 h-2 rounded-full bg-pink-300 opacity-60" />
      <div className="absolute bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-300 opacity-60" />
      <div className="absolute -bottom-1 left-4 w-2 h-2 rounded-full bg-blue-300 opacity-60" />

      <motion.span
        className="text-5xl leading-none"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        }}
        role="img"
      >
        {emoji}
      </motion.span>
      <span className="text-sm font-bold text-[var(--text-primary)]">{name}</span>
    </motion.div>
  );
}
