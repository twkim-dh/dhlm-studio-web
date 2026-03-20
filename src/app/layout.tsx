import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DHLM-STUDIO | 함께 고르는 즐거움",
  description:
    "매일의 작은 결정을 재밌게 만드는 서비스를 만듭니다. 오늘 뭐먹?, 똑(Ttok), App Factory 등 일상을 함께하는 서비스.",
  keywords: [
    "DHLM-STUDIO",
    "오늘 뭐먹",
    "똑",
    "Ttok",
    "App Factory",
    "일상",
    "함께 고르기",
    "메뉴 추천",
    "취향 테스트",
  ],
  openGraph: {
    title: "DHLM-STUDIO | 함께 고르는 즐거움",
    description: "매일의 작은 결정을 재밌게 만드는 서비스를 만듭니다.",
    url: "https://dhlm-studio.com",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} antialiased`}>
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182634360822108"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
