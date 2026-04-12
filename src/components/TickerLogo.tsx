'use client';

// TickerLogo — renders a company logo for the given ticker via FMP's
// image-stock CDN (open URL, no API key, does not count toward FMP quota).
//
// FMP logos are RGBA PNGs with transparent backgrounds — two types:
//   • Dark logo on transparent  (e.g. TSLA, NVDA) → visible on white bg
//   • White logo on transparent (e.g. PLTR, AAPL) → visible on dark bg only
//
// Strategy: after onLoad, composite the image onto a 20×20 white canvas and
// count "meaningfully dark" pixels. If < 5%, try a dark canvas instead.
// If < 5% there too → show letter fallback. FMP CDN sends
// Access-Control-Allow-Origin: * so canvas.getImageData() works.
//
// Trademark notice: All company logos remain the property of their respective
// owners. The site footer carries a global identification-only disclaimer.

import { useState, useCallback } from 'react';

function tickerBgColor(ticker: string): string {
  let hash = 0;
  for (const c of ticker) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return `hsl(${hash % 360}, 50%, 28%)`;
}

// Tickers whose FMP CDN logo is too faint/broken — use local SVG from /logos/
// The local SVG is black on transparent, so we show it on a white background.
const LOCAL_LOGO_OVERRIDES: Record<string, string> = {
  PLTR: '/logos/PLTR.svg',
};

/** Count visible pixels when composited on a given fill color. Returns 0–1 ratio. */
function visibleRatio(img: HTMLImageElement, fillHex: string): number {
  try {
    const sz = 20;
    const canvas = document.createElement('canvas');
    canvas.width = sz;
    canvas.height = sz;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    ctx.fillStyle = fillHex;
    ctx.fillRect(0, 0, sz, sz);
    ctx.drawImage(img, 0, 0, sz, sz);
    const d = ctx.getImageData(0, 0, sz, sz).data;
    const isWhiteBg = fillHex === '#ffffff';
    let count = 0;
    for (let i = 0; i < d.length; i += 4) {
      const brightness = (d[i] + d[i + 1] + d[i + 2]) / 3;
      // On white bg: look for pixels noticeably darker than white (< 200)
      // On dark bg:  look for pixels noticeably lighter than dark  (> 55)
      if (isWhiteBg ? brightness < 200 : brightness > 55) count++;
    }
    return count / (sz * sz);
  } catch {
    return 0;
  }
}

type BgMode = 'loading' | 'white' | 'dark' | 'fallback';

interface Props {
  ticker: string;
  size?: number;
  rounded?: boolean;
}

export default function TickerLogo({ ticker, size = 24, rounded = true }: Props) {
  const localOverride = LOCAL_LOGO_OVERRIDES[ticker.toUpperCase()];
  // Local overrides are black-on-transparent SVGs → always use white bg, skip canvas check
  const [bg, setBg] = useState<BgMode>(localOverride ? 'white' : 'loading');
  const radius = rounded ? Math.max(4, Math.round(size * 0.2)) : 0;
  const url = localOverride ?? `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
  const pad = Math.max(2, Math.round(size * 0.1));

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (localOverride) return; // local SVGs: bg already set to 'white', skip check
    const img = e.currentTarget;
    const THRESHOLD = 0.05;
    if (visibleRatio(img, '#ffffff') >= THRESHOLD) {
      setBg('white');
    } else if (visibleRatio(img, '#111827') >= THRESHOLD) {
      setBg('dark');
    } else {
      setBg('fallback');
    }
  }, [localOverride]);

  if (bg === 'fallback') {
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

  const containerBg =
    bg === 'white' ? '#ffffff' :
    bg === 'dark'  ? '#111827' :
    '#111827'; // 'loading' → dark so image is invisible during check

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
        src={url}
        alt={`${ticker} logo`}
        crossOrigin="anonymous"
        style={{
          width: '100%', height: '100%', objectFit: 'contain', display: 'block',
          // Hide during canvas check to avoid flash of wrong-background logo
          opacity: bg === 'loading' ? 0 : 1,
          transition: 'opacity 0.1s',
        }}
        onError={() => setBg('fallback')}
        onLoad={handleLoad}
      />
    </div>
  );
}
