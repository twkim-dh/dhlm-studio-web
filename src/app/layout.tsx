import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR, Playfair_Display } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AreaProvider from "@/components/AreaProvider";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dhlm-studio.com"),
  title: {
    default: "DHLM Studio | Free Online Tools & Trending Dashboard",
    template: "%s | DHLM Studio",
  },
  description:
    "Free online tools: salary calculator, JSON formatter, QR generator, lotto number generator, typing speed test and 75+ more. Global trending dashboard updated daily.",
  keywords: [
    "DHLM Studio", "free online tools", "calculator", "salary calculator",
    "JSON formatter", "QR code generator", "lotto number generator",
    "typing speed test", "trending now", "online tools free",
    "연봉 계산기", "로또 번호 생성기", "무료 온라인 도구",
  ],
  openGraph: {
    title: "DHLM Studio | Free Online Tools & Trending Dashboard",
    description: "75+ free online tools and global trending dashboard. Salary calculator, JSON formatter, lotto generator and more.",
    url: "https://dhlm-studio.com",
    siteName: "DHLM Studio",
    locale: "ko_KR",
    alternateLocale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://dhlm-studio.com",
    languages: {
      "ko": "https://dhlm-studio.com",
      "en": "https://dhlm-studio.com",
      "x-default": "https://dhlm-studio.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${notoSerifKR.variable} ${playfair.variable} antialiased`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182634360822108"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <AreaProvider />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
