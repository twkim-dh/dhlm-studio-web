import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import TickerMarquee from "@/components/TickerMarquee";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  metadataBase: new URL("https://dhlm-studio.com"),
  title: {
    default: `DHLM Studio — Brutal AI Market Intelligence | ${YEAR}`,
    template: `%s | DHLM Studio`,
  },
  description: `Real-time market data, CNN Fear & Greed Index, Brutal AI Deep Dive reports, and data-driven stock analysis under editorial oversight. ${YEAR}.`,
  keywords: [
    "DHLM Studio", "Brutal AI", "stock market analysis", "Deep Dive reports",
    "Fear and Greed Index", "BAAF framework", "crypto analysis", "Bitcoin analysis",
    "data-driven stock analysis", "Hot Sector reports", "market intelligence",
    "real-time market data", "TODAY'S MARKET", "S&P 500 live",
  ],
  openGraph: {
    title: `DHLM Studio — Brutal AI Market Intelligence`,
    description: `Real-time market data, Fear & Greed Index, Deep Dive reports, and data-driven stock analysis under editorial oversight.`,
    url: "https://dhlm-studio.com",
    siteName: "DHLM Studio",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "DHLM Studio — Brutal AI Market Intelligence" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DHLM Studio — Brutal AI Market Intelligence",
    description: "Real-time market data, Fear & Greed Index, Deep Dive reports, and data-driven stock analysis.",
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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${ibmPlexMono.variable} antialiased`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0B0F19" />
        {/* No Twemoji — caused image explosion bug. Flag emojis show as text on Windows, which is acceptable. */}
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
        {/* Fonts loaded via next/font/google — no external link needed */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182634360822108"
          crossOrigin="anonymous"
          data-loading="lazy"
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
            "description": "Brutal AI market intelligence: real-time market data, Fear & Greed Index, Deep Dive reports, and data-driven stock analysis under editorial oversight.",
            "sameAs": ["https://github.com/twkim-dh"],
            "contactPoint": { "@type": "ContactPoint", "email": "dhlmstudio2026@gmail.com" }
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
            "description": "Brutal AI Market Intelligence — real-time market data, Fear & Greed Index, Deep Dive reports, and data-driven stock analysis.",
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
        <TickerMarquee />
        <div style={{ height: 28 }} /> {/* Marquee spacer */}
        <Header />
        <main id="main-content" className="flex-1 pb-14 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <CookieConsent />
      </body>
    </html>
  );
}
