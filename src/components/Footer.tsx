"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  const area = pathname.startsWith('/lotto') ? 'lotto'
    : (pathname.startsWith('/blog') || pathname.startsWith('/korea')) ? 'korea'
    : pathname.startsWith('/tools') ? 'tools' : 'main';

  const isDark = area === 'lotto' || area === 'main';
  const bg = isDark ? '#0B0D17' : area === 'tools' ? '#1A237E' : '#2C1810';
  const textColor = '#F5F0E8';
  const mutedColor = isDark ? '#3A3A4A' : 'rgba(245,240,232,0.4)';
  const linkColor = isDark ? '#5A5A6A' : 'rgba(245,240,232,0.5)';

  return (
    <footer style={{ background: bg }}>
      {/* 처마 SVG */}
      <svg viewBox="0 0 1440 40" className="w-full h-6 sm:h-10 rotate-180" preserveAspectRatio="none">
        <path d="M0,40 C180,5 360,35 540,10 C720,35 900,5 1080,30 C1260,5 1350,35 1440,15 L1440,40 Z" fill={bg} />
        <path d="M0,35 C180,8 360,32 540,14 C720,32 900,8 1080,28" fill="none" stroke="#8B2500" strokeWidth="1.5" opacity="0.5" />
      </svg>

      <div className="mx-auto max-w-6xl px-5 pt-2 pb-12 sm:px-8 text-center">
        <p className="text-xl sm:text-2xl font-bold tracking-[0.12em]"
          style={{ fontFamily: "var(--font-playfair), var(--font-noto-serif-kr), serif", color: '#C5981A' }}>
          DHLM STUDIO
        </p>
        <p className="text-[9px] tracking-[0.4em] mt-1.5" style={{ color: linkColor }}>
          Dream &middot; Human &middot; Link &middot; Make
        </p>

        <div className="w-20 h-[2px] mx-auto my-6"
          style={{ background: 'linear-gradient(90deg, #8B2500, #C5981A, #1B5E20, #1A237E)' }} />

        <div className="flex flex-wrap justify-center gap-6 text-sm mb-6" style={{ color: linkColor }}>
          <Link href="/" className="hover:text-[#C5981A] transition-colors">Home</Link>
          <Link href="/blog" className="hover:text-[#C5981A] transition-colors">Korea</Link>
          <Link href="/lotto" className="hover:text-[#C5981A] transition-colors">Lottery</Link>
          <Link href="/tools" className="hover:text-[#C5981A] transition-colors">Tools</Link>
          <Link href="/about" className="hover:text-[#C5981A] transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-[#C5981A] transition-colors">Privacy</Link>
        </div>

        <p className="text-[10px]" style={{ color: mutedColor }}>&copy; 2026 DHLM Studio</p>
      </div>

      <div className="dancheong-line" />
    </footer>
  );
}
