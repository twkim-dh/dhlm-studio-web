"use client";

import { motion } from "framer-motion";

interface MenuCardProps {
  emoji: string;
  name: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function MenuCard({
  emoji,
  name,
  selected,
  disabled,
  onClick,
}: MenuCardProps) {
  return (
    <motion.button
      type="button"
      onClick={disabled && !selected ? undefined : onClick}
      whileTap={!disabled || selected ? { scale: 0.95 } : undefined}
      className={`
        relative flex flex-col items-center justify-center gap-1 rounded-2xl p-3
        transition-all duration-200 border-2 aspect-square
        ${
          selected
            ? "bg-[var(--brand-orange)] border-[var(--brand-orange)] text-white shadow-lg shadow-orange-200"
            : disabled
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
              : "bg-white border-gray-200 text-[var(--text-primary)] hover:border-[var(--brand-light)] hover:shadow-md cursor-pointer active:scale-95"
        }
      `}
      disabled={disabled && !selected}
    >
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <svg
            className="w-3.5 h-3.5 text-[var(--brand-orange)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
      <span className="text-3xl leading-none" role="img">
        {emoji}
      </span>
      <span
        className={`text-xs font-medium leading-tight text-center ${
          selected ? "text-white" : ""
        }`}
      >
        {name}
      </span>
    </motion.button>
  );
}
