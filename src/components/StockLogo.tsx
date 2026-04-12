'use client';

import { useState } from 'react';
import Image from 'next/image';

/** Deterministic hue from ticker string → dark-mode-friendly HSL color */
function tickerBgColor(ticker: string): string {
  let hash = 0;
  for (const c of ticker) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  const hue = hash % 360;
  return `hsl(${hue}, 50%, 28%)`;
}

export default function StockLogo({ src, ticker, size = 26 }: { src?: string; ticker: string; size?: number }) {
  const [error, setError] = useState(false);
  const radius = size > 30 ? 8 : 5;

  if (!src || error) {
    return (
      <div style={{
        width: size, height: size, borderRadius: radius,
        background: tickerBgColor(ticker),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
      position: 'relative', width: size, height: size, borderRadius: radius,
      background: '#fff', boxSizing: 'border-box',
      flexShrink: 0, display: 'inline-block', overflow: 'hidden',
    }}>
      <Image
        src={src}
        alt={ticker}
        fill
        sizes={`${size}px`}
        style={{ objectFit: 'contain' }}
        unoptimized
        onError={() => setError(true)}
      />
    </div>
  );
}
