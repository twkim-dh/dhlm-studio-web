'use client';

// TickerLogo — renders a company logo for the given ticker via FMP's
// image-stock CDN. The image-stock URL is open (no API key required) and
// does not count toward the FMP API quota — it serves logos as a static CDN.
//
// Format: https://financialmodelingprep.com/image-stock/{TICKER}.png
//
// Falls back to a color badge (auto-generated per ticker) with the first
// letter of the ticker when the logo cannot be loaded.
//
// Trademark notice: All company logos remain the property of their respective
// owners. The site footer carries a global identification-only disclaimer.

import { useState } from 'react';
import Image from 'next/image';

function tickerToLogoUrl(ticker: string): string {
  return `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
}

/** Deterministic hue from ticker string → dark-mode-friendly HSL color */
function tickerBgColor(ticker: string): string {
  let hash = 0;
  for (const c of ticker) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  const hue = hash % 360;
  return `hsl(${hue}, 50%, 28%)`;
}

interface Props {
  ticker: string;
  size?: number;
  rounded?: boolean;
}

export default function TickerLogo({ ticker, size = 24, rounded = true }: Props) {
  const [error, setError] = useState(false);
  const url = tickerToLogoUrl(ticker);
  const radius = rounded ? Math.max(4, Math.round(size * 0.2)) : 0;

  if (error) {
    return (
      <div
        aria-label={ticker}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: tickerBgColor(ticker),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.max(9, Math.round(size * 0.44)),
          fontWeight: 800,
          color: '#F1F5F9',
          fontFamily: 'var(--mono)',
          flexShrink: 0,
          letterSpacing: -0.5,
        }}
      >
        {ticker.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  const padding = Math.max(2, Math.round(size * 0.12));
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: radius,
        background: '#fff',
        padding,
        boxSizing: 'border-box',
        flexShrink: 0,
        display: 'inline-block',
        overflow: 'hidden',
      }}
    >
      <Image
        src={url}
        alt={`${ticker} logo`}
        fill
        sizes={`${size}px`}
        style={{ objectFit: 'contain' }}
        unoptimized
        onError={() => setError(true)}
      />
    </div>
  );
}
