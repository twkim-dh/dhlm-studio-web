'use client';

// TickerLogo — renders a company logo for the given ticker via FMP's
// image-stock CDN. The image-stock URL is open (no API key required) and
// does not count toward the FMP API quota — it serves logos as a static
// CDN.
//
// Format: https://financialmodelingprep.com/image-stock/{TICKER}.png
//
// Falls back to a monospace badge with the first 2 characters of the
// ticker when the logo cannot be loaded.
//
// Trademark notice: All company logos remain the property of their respective
// owners. The site footer carries a global identification-only disclaimer.

import { useState } from 'react';
import Image from 'next/image';

function tickerToLogoUrl(ticker: string): string {
  // FMP uses upper-case ticker with .png. BRK-B → BRK-B.png works.
  return `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
}

interface Props {
  ticker: string;
  size?: number;
  /** Optional extra style overrides for the wrapper. */
  rounded?: boolean;
}

export default function TickerLogo({ ticker, size = 24, rounded = true }: Props) {
  const [error, setError] = useState(false);
  const url = tickerToLogoUrl(ticker);

  if (error) {
    return (
      <div
        aria-label={ticker}
        style={{
          width: size,
          height: size,
          borderRadius: rounded ? Math.max(4, size * 0.2) : 0,
          background: '#0D1117',
          border: '1px solid #1F2937',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.max(8, size * 0.36),
          fontWeight: 800,
          color: '#60A5FA',
          fontFamily: 'var(--mono)',
          flexShrink: 0,
        }}
      >
        {ticker.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={`${ticker} logo`}
      width={size}
      height={size}
      style={{
        borderRadius: rounded ? Math.max(4, size * 0.2) : 0,
        background: '#fff',
        objectFit: 'contain',
        flexShrink: 0,
      }}
      unoptimized
      onError={() => setError(true)}
    />
  );
}
