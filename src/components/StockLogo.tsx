'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function StockLogo({ src, ticker, size = 26 }: { src?: string; ticker: string; size?: number }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size > 30 ? 8 : 5,
        background: '#0D1117', border: '1px solid #1F2937',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38, fontWeight: 800, color: '#60A5FA', fontFamily: 'var(--mono)',
      }}>
        {ticker.slice(0, 2)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={ticker}
      width={size}
      height={size}
      style={{ borderRadius: size > 30 ? 8 : 5 }}
      unoptimized
      onError={() => setError(true)}
    />
  );
}
