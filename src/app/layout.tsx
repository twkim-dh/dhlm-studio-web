import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWidgets from "./ClientWidgets";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    default: `DHLM Studio — One Investor's Notes`,
    template: `%s | DHLM Studio`,
  },
  description: `I research the stocks I invest in, and share what I find. Notes on AI, semiconductors, quantum computing, and the companies I hold.`,
  keywords: [
    "DHLM Studio", "individual investor", "stock research", "investment notes",
    "AI stocks", "semiconductor investing", "quantum computing stocks", "Micron", "IonQ",
    "personal finance", "long-term investing", "portfolio notes",
  ],
  openGraph: {
    title: `DHLM Studio — One Investor's Notes`,
    description: `I research the stocks I invest in, and share what I find. Notes on AI, semiconductors, quantum computing, and the companies I hold.`,
    url: "https://dhlm-studio.com",
    siteName: "DHLM Studio",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "DHLM Studio — One Investor's Notes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DHLM Studio — One Investor's Notes",
    description: "I research the stocks I invest in, and share what I find. Notes on AI, semiconductors, quantum computing, and the companies I hold.",
    images: [{ url: "https://dhlm-studio.com/twitter-image", width: 1200, height: 630, alt: "DHLM Studio — One Investor's Notes" }],
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
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable} ${ibmPlexMono.variable} antialiased`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFFFFF" />
        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Fonts loaded via next/font/google — no external link needed */}
        <meta name="google-adsense-account" content="ca-pub-5182634360822108" />
        {/* JSON-LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DHLM Studio",
            "url": "https://dhlm-studio.com",
            "logo": "https://dhlm-studio.com/favicon.ico",
            "description": "One investor's research notes on AI, semiconductor, and quantum computing stocks.",
            "sameAs": ["https://github.com/twkim-dh"],
            "contactPoint": { "@type": "ContactPoint", "email": "dhlmstudio2026@gmail.com" }
          })}}
        />
        {/* JSON-LD WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "DHLM Studio",
            "url": "https://dhlm-studio.com",
            "description": "One investor's research notes on AI, semiconductor, and quantum computing stocks.",
          })}}
        />
      </head>
      <body style={{ background: '#FFFFFF', color: '#16161A', fontFamily: "var(--sans)" }} className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <Header />
        <main id="main-content" className="flex-1 pb-14 md:pb-0">{children}</main>
        <Footer />
        <ClientWidgets showModal={process.env.NEXT_PUBLIC_NEWSLETTER_MODAL_ENABLED === 'true'} />
        {/* GA4 — afterInteractive: loads after page becomes interactive, not render-blocking */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}}
            />
          </>
        )}
      </body>
    </html>
  );
}
