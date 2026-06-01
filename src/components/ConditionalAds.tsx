'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const NO_AD_PATHS = ['/contact', '/privacy', '/terms', '/disclaimer', '/about'];

export default function ConditionalAds() {
  const pathname = usePathname();
  if (NO_AD_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) return null;
  return (
    <Script
      id="adsense-deferred"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: `(function(){var l=false;function load(){if(l)return;l=true;var s=document.createElement('script');s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182634360822108';s.crossOrigin='anonymous';s.async=true;document.head.appendChild(s);}['scroll','click','touchstart','keydown'].forEach(function(e){window.addEventListener(e,load,{once:true,passive:true});});})()`}}
    />
  );
}
