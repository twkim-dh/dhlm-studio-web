"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(window.location.pathname === "/");
  }, []);

  return (
    <footer className={isHome ? "bg-[#080D1A] border-t border-gray-800" : "bg-gray-50 border-t border-gray-200"}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className={`text-lg font-bold ${isHome ? "text-white" : ""}`}
              style={isHome ? {} : { color: "var(--brand-green)" }}>
              DHLM-STUDIO
            </span>
            <p className={`mt-1 text-sm ${isHome ? "text-gray-500" : "text-gray-500"}`}>
              &copy; 2026 DHLM-STUDIO. All rights reserved.
            </p>
          </div>

          <nav className={`flex flex-wrap gap-4 text-sm ${isHome ? "text-gray-500" : "text-gray-500"}`}>
            <Link href="/privacy" className={`transition-colors ${isHome ? "hover:text-gray-300" : "hover:text-[var(--brand-green)]"}`}>
              개인정보처리방침
            </Link>
            <span className={isHome ? "text-gray-700" : "text-gray-300"}>|</span>
            <Link href="/terms" className={`transition-colors ${isHome ? "hover:text-gray-300" : "hover:text-[var(--brand-green)]"}`}>
              이용약관
            </Link>
            <span className={isHome ? "text-gray-700" : "text-gray-300"}>|</span>
            <Link href="/about" className={`transition-colors ${isHome ? "hover:text-gray-300" : "hover:text-[var(--brand-green)]"}`}>
              회사소개
            </Link>
          </nav>

          <div className={`text-sm ${isHome ? "text-gray-500" : "text-gray-500"}`}>
            <a href="mailto:tw.kim@dhlm.co.kr"
              className={`transition-colors ${isHome ? "hover:text-gray-300" : "hover:text-[var(--brand-green)]"}`}>
              tw.kim@dhlm.co.kr
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
