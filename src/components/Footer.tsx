"use client";

import Link from "next/link";

/* 처마 SVG (뒤집힌) */
const RooflineFlipped = () => (
  <svg viewBox="0 0 1200 40" className="w-full h-6 sm:h-8" preserveAspectRatio="none">
    <path d="M0,0 Q100,40 200,10 Q300,40 400,10 Q500,40 600,10 Q700,40 800,10 Q900,40 1000,10 Q1100,40 1200,10 L1200,0 Z"
      fill="#0D1117" stroke="#8B2500" strokeWidth="1.5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#0D1117] overflow-hidden">
      <RooflineFlipped />
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 text-center">
        <p className="text-xl font-bold text-[#F5F0E8] tracking-wide"
          style={{ fontFamily: "var(--font-playfair), var(--font-noto-serif-kr), serif" }}>
          ══ DHLM STUDIO ══
        </p>
        <p className="text-[10px] text-[#C5981A] tracking-[0.4em] mt-1">
          Dream &middot; Human &middot; Link &middot; Make
        </p>

        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C5981A] to-transparent mx-auto my-5" />

        <div className="flex flex-wrap justify-center gap-5 text-sm text-[#6B6B6B] mb-6">
          <Link href="/about" className="hover:text-[#C5981A] transition-colors">회사소개</Link>
          <Link href="/privacy" className="hover:text-[#C5981A] transition-colors">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-[#C5981A] transition-colors">이용약관</Link>
          <a href="mailto:tw.kim@dhlm.co.kr" className="hover:text-[#C5981A] transition-colors">tw.kim@dhlm.co.kr</a>
        </div>

        <p className="text-[11px] text-[#3A3A3A]">&copy; 2026 DHLM Studio. All rights reserved.</p>
      </div>

      {/* 오방색 하단 라인 */}
      <div className="dancheong-band" />
    </footer>
  );
}
