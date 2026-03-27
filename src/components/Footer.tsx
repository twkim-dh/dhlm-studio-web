"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: '#111111', borderTop: '1px solid #333' }}>
      <div className="mx-auto px-6 text-center" style={{ maxWidth: '960px', padding: '60px 24px' }}>
        <p className="text-[11px] tracking-[0.3em]" style={{ color: '#BCBCBC' }}>DHLM STUDIO</p>
        <div className="flex justify-center gap-6 mt-4 text-[13px]" style={{ color: '#4B5563' }}>
          <Link href="/about" className="transition-colors duration-200 hover:text-[#9CA3AF]">About</Link>
          <Link href="/privacy" className="transition-colors duration-200 hover:text-[#9CA3AF]">Privacy</Link>
          <a href="mailto:tw.kim@dhlm.co.kr" className="transition-colors duration-200 hover:text-[#9CA3AF]">Contact</a>
        </div>
        <p className="text-xs mt-4" style={{ color: '#333' }}>&copy; 2026</p>
      </div>
    </footer>
  );
}
