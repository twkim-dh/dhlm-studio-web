'use client';

import { useState, useEffect } from 'react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
}

const FALLBACK: TickerItem[] = [
  { symbol: 'NVDA', price: 132.65, change: 2.4 },
  { symbol: 'AAPL', price: 228.40, change: -0.8 },
  { symbol: 'MSFT', price: 420.72, change: 1.2 },
  { symbol: 'AMZN', price: 198.65, change: -1.5 },
  { symbol: 'GOOGL', price: 178.30, change: 0.6 },
  { symbol: 'TSLA', price: 262.50, change: 3.2 },
  { symbol: 'META', price: 582.10, change: 1.8 },
  { symbol: 'BTC', price: 66699, change: 1.3 },
  { symbol: 'ETH', price: 2022, change: 2.0 },
  { symbol: 'SPY', price: 562.30, change: -0.4 },
];

export default function TickerMarquee() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK);

  useEffect(() => {
    fetch('/api/markets')
      .then(r => r.json())
      .then(d => {
        if (d.gainers?.length > 0) {
          const live = [...(d.gainers || []), ...(d.losers || []), ...(d.actives || [])]
            .slice(0, 12)
            .map((m: { ticker: string; price: number; change: number }) => ({
              symbol: m.ticker,
              price: m.price,
              change: m.change,
            }));
          if (live.length > 0) setItems(live);
        }
      })
      .catch(() => {});
  }, []);

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 110,
      height: 28, overflow: 'hidden',
      background: '#080C14', borderBottom: '1px solid #1E293B40',
    }}>
      <div className="marquee-track" style={{
        display: 'flex', alignItems: 'center', height: '100%',
        width: 'max-content',
      }}>
        {doubled.map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 20px', whiteSpace: 'nowrap',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#94A3B8' }}>{t.symbol}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: '#E2E8F0' }}>
              ${t.price >= 1000 ? t.price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : t.price.toFixed(2)}
            </span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
              color: t.change >= 0 ? '#00D474' : '#FF4545',
            }}>
              {t.change >= 0 ? '▲' : '▼'} {Math.abs(t.change).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
