'use client';

// StockLogo — renders a stock logo from an external src URL.
// Chains: src prop → FMP image-stock CDN → letter fallback.
//
// Uses plain <img> so onError fires reliably regardless of HTTP status.

import { useState } from 'react';

/** Deterministic hue from ticker → dark-mode-friendly HSL background */
function tickerBgColor(ticker: string): string {
  let hash = 0;
  for (const c of ticker) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return `hsl(${hash % 360}, 50%, 28%)`;
}

function fmpCdnUrl(ticker: string): string {
  return `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
}

export default function StockLogo({ src, ticker, size = 26 }: { src?: string; ticker: string; size?: number }) {
  // Stage 0: show src prop; stage 1: show FMP CDN; stage 2: show letter badge
  const [stage, setStage] = useState<0 | 1 | 2>(src ? 0 : 1);
  const radius = size > 30 ? 8 : 5;
  const pad = Math.max(2, Math.round(size * 0.1));

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
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        onError={() => setStage(prev => (prev === 0 ? 1 : 2))}
      />
    </div>
  );
}
