'use client';

// TickerLogo — renders a company logo for the given ticker.
// Priority: 1) /images/logos/{TICKER}.png (static, no CDN)
//           2) Clearbit logo CDN (fallback for tickers not in static set)
//           3) Colored letter badge
//
// Trademark notice: All company logos remain the property of their respective
// owners. The site footer carries a global identification-only disclaimer.

import { useState, useCallback } from 'react';
import { TICKER_DOMAINS } from '@/lib/ticker-domains';

function tickerBgColor(ticker: string): string {
  let hash = 0;
  for (const c of ticker) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return `hsl(${hash % 360}, 50%, 28%)`;
}

// Tickers with local SVG overrides (black-on-transparent, use white bg)
const LOCAL_SVG_OVERRIDES: Record<string, string> = {
  SPACEX:    '/logos/SPACEX.svg',
  ANTHROPIC: '/logos/ANTHROPIC.svg',
};

type BgMode = 'loading' | 'white' | 'dark' | 'fallback';

interface Props {
  ticker: string;
  size?: number;
  rounded?: boolean;
}

export default function TickerLogo({ ticker, size = 24, rounded = true }: Props) {
  if (!ticker) {
    return (
      <div
        style={{
          width: size, height: size, borderRadius: Math.max(4, Math.round(size * 0.2)),
          background: '#FFFFFF', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      />
    );
  }

  const sym = ticker.toUpperCase();
  const radius = rounded ? Math.max(4, Math.round(size * 0.2)) : 0;
  const pad = Math.max(2, Math.round(size * 0.1));

  // URL priority chain
  const svgOverride = LOCAL_SVG_OVERRIDES[sym];
  const staticUrl = svgOverride ?? `/images/logos/${sym}.png`;
  const clearbitUrl = TICKER_DOMAINS[sym] ? `https://logo.clearbit.com/${TICKER_DOMAINS[sym]}` : null;

  // State: which URL we're on and background detection result
  const [urlIndex, setUrlIndex] = useState(0); // 0=static, 1=clearbit
  const [bg, setBg] = useState<BgMode>(svgOverride ? 'white' : 'loading');

  const urls = [staticUrl, clearbitUrl].filter(Boolean) as string[];
  const currentUrl = urls[urlIndex] ?? null;

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (svgOverride && urlIndex === 0) return; // SVG overrides always use white bg
    if (urlIndex === 0 && !svgOverride) {
      // Static PNG: assume transparent — use white bg
      setBg('white');
      return;
    }
    // Clearbit: detect bg via canvas
    try {
      const img = e.currentTarget;
      const sz = 20;
      const canvas = document.createElement('canvas');
      canvas.width = sz; canvas.height = sz;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setBg('white'); return; }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sz, sz);
      ctx.drawImage(img, 0, 0, sz, sz);
      const d = ctx.getImageData(0, 0, sz, sz).data;
      let dark = 0;
      for (let i = 0; i < d.length; i += 4) {
        if ((d[i] + d[i + 1] + d[i + 2]) / 3 < 200) dark++;
      }
      setBg(dark / (sz * sz) >= 0.05 ? 'white' : 'dark');
    } catch { setBg('white'); }
  }, [urlIndex, svgOverride]);

  const handleError = useCallback(() => {
    if (urlIndex + 1 < urls.length) {
      setUrlIndex(u => u + 1);
      setBg('loading');
    } else {
      setBg('fallback');
    }
  }, [urlIndex, urls.length]);

  if (bg === 'fallback' || !currentUrl) {
    return (
      <div
        aria-label={ticker}
        style={{
          width: size, height: size, borderRadius: radius,
          background: tickerBgColor(ticker),
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: Math.max(9, Math.round(size * 0.44)), fontWeight: 800,
          color: '#16161A', fontFamily: 'var(--mono)',
          flexShrink: 0, letterSpacing: -0.5,
        }}
      >
        {ticker.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  const containerBg =
    bg === 'white' ? '#ffffff' :
    bg === 'dark'  ? '#FAFAF8' :
    '#FAFAF8';

  return (
    <div
      style={{
        width: size, height: size, borderRadius: radius,
        background: containerBg, padding: pad,
        boxSizing: 'border-box', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentUrl}
        alt={`${ticker} logo`}
        crossOrigin="anonymous"
        style={{
          width: '100%', height: '100%', objectFit: 'contain', display: 'block',
          opacity: bg === 'loading' ? 0 : 1,
          transition: 'opacity 0.1s',
        }}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
