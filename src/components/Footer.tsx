"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] border-t border-[#2D2D4E]">
      <div className="h-[2px] bg-gradient-to-r from-[#C73E3A] via-[#D4A853] to-[#4A90D9]" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-[#F0E6D3]" style={{ fontFamily: "var(--font-playfair), var(--font-noto-serif-kr), serif" }}>
            DHLM Studio
          </p>
          <p className="text-xs text-[#D4A853] tracking-[0.3em] mt-1">Dream &middot; Human &middot; Link &middot; Make</p>
          <p className="text-sm text-[#6B6B80] mt-3 max-w-sm mx-auto">
            사람의 꿈과 아이디어를 연결해 디지털 가치로 만듭니다
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#6B6B80] mb-8">
          <Link href="/about" className="hover:text-[#D4A853] transition-colors">회사소개</Link>
          <Link href="/privacy" className="hover:text-[#D4A853] transition-colors">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-[#D4A853] transition-colors">이용약관</Link>
          <a href="mailto:tw.kim@dhlm.co.kr" className="hover:text-[#D4A853] transition-colors">tw.kim@dhlm.co.kr</a>
        </div>

        <p className="text-center text-xs text-[#4A4A5E]">
          &copy; 2026 DHLM Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
