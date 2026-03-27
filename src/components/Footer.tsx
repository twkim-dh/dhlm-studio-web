"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] py-16 px-5">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-[12px] tracking-[0.35em] uppercase" style={{ color: '#C5981A' }}>
          DHLM Studio
        </p>

        <div className="w-12 h-[1px] bg-[#C5981A] mx-auto my-6 opacity-30" />

        <div className="flex flex-wrap justify-center gap-8 text-[12px] tracking-widest mb-6" style={{ color: 'rgba(245,240,232,0.25)' }}>
          <Link href="/about" className="hover:text-[#C5981A] transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-[#C5981A] transition-colors">Privacy</Link>
          <a href="mailto:tw.kim@dhlm.co.kr" className="hover:text-[#C5981A] transition-colors">Contact</a>
        </div>

        <p className="text-[10px] tracking-widest" style={{ color: 'rgba(245,240,232,0.12)' }}>&copy; 2026</p>
      </div>
    </footer>
  );
}
