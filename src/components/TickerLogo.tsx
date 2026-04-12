'use client';

// TickerLogo — renders a company logo for the given ticker via FMP's
// image-stock CDN. The image-stock URL is open (no API key required) and
// does not count toward the FMP API quota.
//
// Format: https://financialmodelingprep.com/image-stock/{TICKER}.png
//
// Falls back to a color badge (auto-generated per ticker) with the first
// letter of the ticker when the logo cannot be loaded.
//
// Uses a plain <img> tag (not next/image) so onError fires reliably even
// when the CDN returns HTTP 200 with a broken/empty image.
//
// Trademark notice: All company logos remain the property of their respective
// owners. The site footer carries a global identification-only disclaimer.

import { useState } from 'react';

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
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        onError={() => setError(true)}
      />
    </div>
  );
}
