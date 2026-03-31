import type { Metadata } from "next";
import { Noto_Sans_KR, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  metadataBase: new URL("https://dhlm-studio.com"),
  title: {
    default: `DHLM Studio — The World in Numbers | ${YEAR}`,
    template: `%s | DHLM Studio`,
  },
  description: `Real-time global data: stock market movers, trending creators, billionaire rankings, cost of living comparisons, and lottery analysis. Updated daily. ${YEAR}.`,
  keywords: [
    "DHLM Studio", "stock market movers", "top stocks today", "billionaire rankings",
    "cost of living comparison", "trending creators", "GDP rankings", "world rankings",
    "lottery number generator", "QR code generator", "password generator",
    "global data", "real-time data", "market analysis",
  ],
  openGraph: {
    title: `DHLM Studio — The World in Numbers`,
    description: `Real-time stock movers, creator trends, global rankings, and city cost comparisons. Data-driven insights updated daily.`,
    url: "https://dhlm-studio.com",
    siteName: "DHLM Studio",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "DHLM Studio — The World in Numbers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DHLM Studio — The World in Numbers",
    description: "Real-time stock movers, creator trends, global rankings, and city cost comparisons.",
  },
  alternates: {
    canonical: "https://dhlm-studio.com",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSansKR.variable} ${playfair.variable} antialiased`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0B0F19" />
        {/* Google Analytics 4 — set NEXT_PUBLIC_GA_ID in .env.local and Vercel */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}} />
          </>
        )}
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182634360822108"
          crossOrigin="anonymous"
        />
        {/* JSON-LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DHLM Studio",
            "url": "https://dhlm-studio.com",
            "logo": "https://dhlm-studio.com/favicon.ico",
            "description": "Real-time global data platform: stock movers, creator trends, rankings, cost of living.",
            "sameAs": ["https://github.com/twkim-dh"],
            "contactPoint": { "@type": "ContactPoint", "email": "tw.kim@dhlm.co.kr" }
          })}}
        />
        {/* JSON-LD WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "DHLM Studio",
            "url": "https://dhlm-studio.com",
            "description": "The World in Numbers — real-time data on markets, creators, rankings, and cost of living.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://dhlm-studio.com/markets/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}}
        />
      </head>
      <body style={{ background: '#0B0F19', color: '#F1F5F9', fontFamily: "'DM Sans', -apple-system, sans-serif" }} className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
