'use client';

// StockLogo — renders a stock logo from an external src URL.
// Chains: src prop → FMP image-stock CDN → letter fallback.
//
// After onLoad, uses canvas to detect white-on-transparent logos that would
// be invisible on the white container background, triggering the fallback.
// FMP CDN sends Access-Control-Allow-Origin: * so getImageData works.

import { useState, useCallback } from 'react';

/** Deterministic hue from ticker → dark-mode-friendly HSL background */
function tickerBgColor(ticker: string): string {
  let hash = 0;
  for (const c of ticker) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return `hsl(${hash % 360}, 50%, 28%)`;
}

function fmpCdnUrl(ticker: string): string {
  return `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
}

/** Returns true if the image is invisible when composited on white */
function isInvisibleOnWhite(img: HTMLImageElement): boolean {
  try {
    const sz = 20;
    const canvas = document.createElement('canvas');
    canvas.width = sz;
    canvas.height = sz;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sz, sz);
    ctx.drawImage(img, 0, 0, sz, sz);
    const pixels = ctx.getImageData(0, 0, sz, sz).data;
    let nonWhite = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      // sum < 600: only count pixels visibly darker than light gray.
      // Filters alpha=36 ghosts (~219/219/219 = 657) that look white to human eyes.
      if (pixels[i] + pixels[i + 1] + pixels[i + 2] < 600) nonWhite++;
    }
    return nonWhite < sz * sz * 0.05;
  } catch {
    return false;
  }
}

export default function StockLogo({ src, ticker, size = 26 }: { src?: string; ticker: string; size?: number }) {
  // stage 0 = try src prop, stage 1 = try FMP CDN, stage 2 = letter badge
  const [stage, setStage] = useState<0 | 1 | 2>(src ? 0 : 1);
  const radius = size > 30 ? 8 : 5;
  const pad = Math.max(2, Math.round(size * 0.1));

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (isInvisibleOnWhite(e.currentTarget)) {
      setStage(prev => (prev < 2 ? (prev + 1) as 1 | 2 : 2));
    }
  }, []);

  const activeSrc = stage === 0 ? (src ?? '') : fmpCdnUrl(ticker);

  if (stage === 2) {
    return (
      <div style={{
        width: size, height: size, borderRadius: radius,
        background: tickerBgColor(ticker),
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.max(9, Math.round(size * 0.44)), fontWeight: 800,
        color: '#F1F5F9', fontFamily: 'var(--mono)',
        flexShrink: 0, letterSpacing: -0.5,
      }}>
        {ticker.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: '#fff', padding: pad,
      boxSizing: 'border-box', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeSrc}
        alt={ticker}
        crossOrigin="anonymous"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        onError={() => setStage(prev => (prev === 0 ? 1 : 2))}
        onLoad={handleLoad}
      />
    </div>
  );
}
