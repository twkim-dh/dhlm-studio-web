'use client';

// TickerLogo — renders a company logo for the given ticker via FMP's
// image-stock CDN. The image-stock URL is open (no API key required) and
// does not count toward the FMP API quota.
//
// FMP logos are RGBA PNGs with transparent backgrounds. Some are dark-on-
// transparent (visible on white bg), others are white-on-transparent
// (invisible on white bg). We use a canvas check after onLoad to detect
// invisible logos and automatically switch to the letter fallback.
//
// FMP CDN sends Access-Control-Allow-Origin: * so canvas.getImageData works.
//
// Trademark notice: All company logos remain the property of their respective
// owners. The site footer carries a global identification-only disclaimer.

import { useState, useCallback } from 'react';

/** Deterministic hue from ticker → dark-mode-friendly HSL background */
function tickerBgColor(ticker: string): string {
  let hash = 0;
  for (const c of ticker) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return `hsl(${hash % 360}, 50%, 28%)`;
}

interface Props {
  ticker: string;
  size?: number;
  rounded?: boolean;
}

export default function TickerLogo({ ticker, size = 24, rounded = true }: Props) {
  const [error, setError] = useState(false);
  const radius = rounded ? Math.max(4, Math.round(size * 0.2)) : 0;
  const url = `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
  const pad = Math.max(2, Math.round(size * 0.1));

  // After load: composite the logo on a white canvas and check if any non-white
  // pixels remain. White-on-transparent logos (e.g. AAPL) produce 0 dark pixels
  // → show the letter fallback instead of an invisible white square.
  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    try {
      const img = e.currentTarget;
      const sz = 20; // small sample, fast
      const canvas = document.createElement('canvas');
      canvas.width = sz;
      canvas.height = sz;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sz, sz);
      ctx.drawImage(img, 0, 0, sz, sz);
      const pixels = ctx.getImageData(0, 0, sz, sz).data;
      let nonWhite = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        // Sum of R+G+B < 700 means noticeably darker than white (255+255+255=765)
        if (pixels[i] + pixels[i + 1] + pixels[i + 2] < 700) nonWhite++;
      }
      // < 4% of pixels are visible → logo is invisible on white bg → show fallback
      if (nonWhite < sz * sz * 0.04) setError(true);
    } catch {
      // Canvas blocked (e.g. CORS unexpected error) — keep logo as-is
    }
  }, []);

  if (error) {
    return (
      <div
        aria-label={ticker}
        style={{
          width: size, height: size, borderRadius: radius,
          background: tickerBgColor(ticker),
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: Math.max(9, Math.round(size * 0.44)), fontWeight: 800,
          color: '#F1F5F9', fontFamily: 'var(--mono)',
          flexShrink: 0, letterSpacing: -0.5,
        }}
      >
        {ticker.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      style={{
        width: size, height: size, borderRadius: radius,
        background: '#fff', padding: pad,
        boxSizing: 'border-box', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`${ticker} logo`}
        crossOrigin="anonymous"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        onError={() => setError(true)}
        onLoad={handleLoad}
      />
    </div>
  );
}
