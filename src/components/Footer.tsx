"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0B0D17]">
      {/* 뒤집힌 처마 */}
      <svg viewBox="0 0 1440 50" className="w-full h-8 sm:h-12 rotate-180" preserveAspectRatio="none">
        <path d="M0,50 C120,10 240,40 360,20 C480,0 600,35 720,15 C840,-5 960,30 1080,10 C1200,-5 1320,35 1440,18 L1440,50 Z"
          fill="#0B0D17" />
        <path d="M0,45 C120,15 240,38 360,22 C480,5 600,32 720,18 C840,0 960,28 1080,12 C1200,0 1320,32 1440,20"
          fill="none" stroke="#8B2500" strokeWidth="2" />
      </svg>

      <div className="mx-auto max-w-6xl px-5 pt-4 pb-16 sm:px-8 text-center">
        <p className="text-2xl sm:text-3xl font-bold tracking-[0.15em] text-[#C5981A]"
          style={{ fontFamily: "var(--font-playfair), var(--font-noto-serif-kr), serif" }}>
          DHLM STUDIO
        </p>
        <p className="text-[10px] tracking-[0.4em] text-[#5A5A6A] mt-2">
          Dream &middot; Human &middot; Link &middot; Make
        </p>

        <div className="w-24 h-[2px] mx-auto my-8"
          style={{ background: 'linear-gradient(90deg, #8B2500, #C5981A, #1B5E20, #1A237E)' }} />

        <div className="flex flex-wrap justify-center gap-8 text-sm text-[#5A5A6A] mb-8">
          <Link href="/about" className="hover:text-[#C5981A] transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-[#C5981A] transition-colors">Privacy</Link>
          <a href="mailto:tw.kim@dhlm.co.kr" className="hover:text-[#C5981A] transition-colors">Contact</a>
        </div>

        <p className="text-[11px] text-[#2A2A3A]">&copy; 2026 DHLM Studio</p>
      </div>
    </footer>
  );
}
