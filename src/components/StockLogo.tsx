'use client';

// StockLogo — renders a stock logo, chaining:
//   src prop (from API) → FMP image-stock CDN → letter fallback
//
// Same white/dark canvas detection as TickerLogo. Logos with white content
// (e.g. PLTR) are shown on a dark background; dark logos on white.

import { useState, useCallback } from 'react';

function tickerBgColor(ticker: string): string {
  let hash = 0;
  for (const c of ticker) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return `hsl(${hash % 360}, 50%, 28%)`;
}

function fmpCdnUrl(ticker: string): string {
  return `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
}

function visibleRatio(img: HTMLImageElement, fillHex: string): number {
  try {
    const sz = 20;
    const canvas = document.createElement('canvas');
    canvas.width = sz; canvas.height = sz;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    ctx.fillStyle = fillHex;
    ctx.fillRect(0, 0, sz, sz);
    ctx.drawImage(img, 0, 0, sz, sz);
    const d = ctx.getImageData(0, 0, sz, sz).data;
    const isWhiteBg = fillHex === '#ffffff';
    let count = 0;
    for (let i = 0; i < d.length; i += 4) {
      const b = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (isWhiteBg ? b < 200 : b > 55) count++;
    }
    return count / (sz * sz);
  } catch { return 0; }
}

type BgMode = 'loading' | 'white' | 'dark' | 'fallback';

export default function StockLogo({ src, ticker, size = 26 }: { src?: string; ticker: string; size?: number }) {
  const [srcStage, setSrcStage] = useState<0 | 1>(src ? 0 : 1); // 0=API src, 1=FMP CDN
  const [bg, setBg] = useState<BgMode>('loading');
  const radius = size > 30 ? 8 : 5;
  const pad = Math.max(2, Math.round(size * 0.1));

  const activeSrc = srcStage === 0 ? (src ?? '') : fmpCdnUrl(ticker);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const THRESHOLD = 0.05;
    if (visibleRatio(img, '#ffffff') >= THRESHOLD) {
      setBg('white');
    } else if (visibleRatio(img, '#111827') >= THRESHOLD) {
      setBg('dark');
    } else {
      // Not visible on either bg — try FMP CDN if not already tried
      if (srcStage === 0) {
        setSrcStage(1);
        setBg('loading');
      } else {
        setBg('fallback');
      }
    }
  }, [srcStage]);

  const handleError = useCallback(() => {
    if (srcStage === 0) {
      setSrcStage(1);
      setBg('loading');
    } else {
      setBg('fallback');
    }
  }, [srcStage]);

  if (bg === 'fallback') {
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

  const containerBg = bg === 'white' ? '#ffffff' : '#111827';

  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: containerBg, padding: pad,
      boxSizing: 'border-box', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeSrc}
        alt={ticker}
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
