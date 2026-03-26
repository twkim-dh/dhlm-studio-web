"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080D1A] border-t border-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-lg font-bold text-white">
              DHLM-STUDIO
            </span>
            <p className="mt-1 text-sm text-gray-500">
              &copy; 2026 DHLM-STUDIO. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              개인정보처리방침
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              이용약관
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              회사소개
            </Link>
          </nav>

          <div className="text-sm text-gray-500">
            <a href="mailto:tw.kim@dhlm.co.kr" className="hover:text-gray-300 transition-colors">
              tw.kim@dhlm.co.kr
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
