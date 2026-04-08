'use client';

// TickerLogo — looks up the corporate domain for a ticker and renders the
// Clearbit Logo API result. Falls back to a monospace badge with the first
// 2 characters of the ticker when the logo cannot be loaded (network error,
// unknown ticker, or company without a Clearbit-indexed domain).
//
// Used in: home page Market Leaders, Hot Sector card, /reports/[slug] header,
// /daily/[slug] Movers & Shakers tables, and any future Movers list.
//
// Trademark notice: All company logos remain the property of their respective
// owners. The site footer carries a global identification-only disclaimer.

import { useState } from 'react';
import Image from 'next/image';
import { tickerToLogoUrl } from '@/lib/ticker-domains';

interface Props {
  ticker: string;
  size?: number;
  /** Optional extra style overrides for the wrapper. */
  rounded?: boolean;
}

export default function TickerLogo({ ticker, size = 24, rounded = true }: Props) {
  const [error, setError] = useState(false);
  const url = tickerToLogoUrl(ticker);

  if (!url || error) {
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
