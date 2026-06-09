'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Pages where AdSense script must NOT load:
// - Legal/policy pages (contact/privacy/terms/disclaimer/about)
// - Thin index pages (< 600 words)
// - Calculator pages
// - Learn/Research index/hub pages (not individual lessons)
const NO_AD_PATHS = [
  '/contact', '/privacy', '/terms', '/disclaimer', '/about',
  '/calculators',
];

// Exact-match thin index pages (children are content, parents are thin hubs)
const NO_AD_EXACT = new Set([
  '/learn',
  '/learn/investing-101',
  '/learn/investing-101-beginner',
  '/learn/investing-101-intermediate',
  '/learn/crypto-101',
  '/research',
]);

export default function ConditionalAds() {
  const pathname = usePathname();
  if (NO_AD_EXACT.has(pathname)) return null;
  if (NO_AD_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) return null;
  return (
    <>
      {/* Preconnect hint — only on ad-eligible pages */}
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      <Script
        id="adsense-deferred"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `(function(){var l=false;function load(){if(l)return;l=true;var s=document.createElement('script');s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182634360822108';s.crossOrigin='anonymous';s.async=true;document.head.appendChild(s);}['scroll','click','touchstart','keydown'].forEach(function(e){window.addEventListener(e,load,{once:true,passive:true});});})()`}}
      />
    </>
  );
}
