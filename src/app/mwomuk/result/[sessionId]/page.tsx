"use client";

import { Suspense } from "react";
import ResultContent from "./ResultContent";

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <div className="w-10 h-10 border-4 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin-slow" />
          <p className="mt-4 text-sm text-[var(--text-secondary)]">불러오는 중...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
