"use client";

import Link from "next/link";

export default function CalculatorLayout({
  title,
  category,
  children,
}: {
  title: string;
  category?: string;
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "description": `${title} - 무료 온라인 도구`,
    "url": typeof window !== "undefined" ? window.location.href : "",
    "applicationCategory": category === "금융" ? "FinanceApplication" : category === "생활" ? "LifestyleApplication" : "UtilitiesApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "operatingSystem": "All",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand">
          홈
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{title}</span>
      </nav>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
      {children}
    </div>
  );
}
