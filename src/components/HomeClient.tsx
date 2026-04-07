'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

function Change({ value }: { value: number }) {
  const up = value > 0;
  return <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: up ? '#00D4741A' : '#FF45451A', color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>{up ? '+' : ''}{value.toFixed(1)}%</span>;
}

/* ═══ Counter — IntersectionObserver animated count-up ═══ */
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  // Render the final value immediately so SSR/no-JS/before-scroll users never
  // see "0+". On mount, animate from 0 → to once when the element scrolls in.
  const [v, setV] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);
  useEffect(() => {
    setV(0);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const s = Date.now();
        const t = () => { const p = Math.min((Date.now() - s) / 1600, 1); setV(Math.floor((1 - (1 - p) ** 3) * to)); if (p < 1) requestAnimationFrame(t); };
        t();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

/* ═══ Live Markets Preview (Alpha Vantage) ═══ */
const FALLBACK_MOVERS = [
  { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 132.65, change: 2.4 },
  { ticker: 'TSLA', name: 'Tesla, Inc.', price: 262.50, change: 3.2 },
  { ticker: 'META', name: 'Meta Platforms', price: 582.10, change: 1.8 },
  { ticker: 'MSFT', name: 'Microsoft', price: 420.72, change: 1.2 },
  { ticker: 'AMZN', name: 'Amazon.com', price: 198.65, change: -1.5 },
];

export function LiveMarketsPreview() {
  // Start with fallback so the section never shows "Loading…" or empty.
  const [movers, setMovers] = useState<{ticker:string;name:string;price:number;change:number}[]>(FALLBACK_MOVERS);

  useEffect(() => {
    fetch('/api/markets')
      .then(r => r.json())
      .then(data => {
        if (data.gainers && data.gainers.length > 0) {
          setMovers(data.gainers.slice(0, 5).map((g: {ticker:string;name:string;price:number;change:number}) => ({
            ticker: g.ticker, name: g.name || g.ticker, price: g.price, change: g.change,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#00D474', marginBottom: 8 }}>● LIVE — Alpha Vantage</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {movers.map((s, i) => (
          <Link key={s.ticker} href="/markets" style={{ ...card, display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 14, padding: '16px 18px', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 800, color: i < 3 ? '#D4A843' : '#475569', textAlign: 'center' }}>#{i + 1}</div>
            <div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 700, color: '#60A5FA' }}>{s.ticker}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: '#E2E8F0', marginLeft: 8 }}>{s.name}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>${s.price.toFixed(2)}</div>
              <Change value={s.change} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ═══ Crypto Preview (CoinGecko) ═══ */
const FALLBACK_COINS = [
  { name: 'Bitcoin',  symbol: 'btc', price: 66699,  change24h: 1.3, marketCap: 1.3e12, image: '' },
  { name: 'Ethereum', symbol: 'eth', price: 2022,   change24h: 2.0, marketCap: 2.4e11, image: '' },
  { name: 'Solana',   symbol: 'sol', price: 152.40, change24h: 3.8, marketCap: 7.0e10, image: '' },
  { name: 'BNB',      symbol: 'bnb', price: 580.20, change24h: 0.6, marketCap: 8.5e10, image: '' },
  { name: 'XRP',      symbol: 'xrp', price: 0.52,   change24h: -0.4, marketCap: 2.9e10, image: '' },
];

export function CryptoPreview() {
  const [coins, setCoins] = useState<{name:string;symbol:string;price:number;change24h:number;marketCap:number;image:string}[]>(FALLBACK_COINS);

  useEffect(() => {
    fetch('/api/crypto')
      .then(r => r.json())
      .then(data => { if (data.coins && data.coins.length > 0) setCoins(data.coins.slice(0, 5)); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#00D474', marginBottom: 4 }}>● LIVE — CoinGecko</p>
      {coins.map((c, i) => (
        <Link key={c.symbol} href="/rankings/crypto" style={{
          background: '#111827', borderRadius: 14, border: '1px solid #1E293B',
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', textDecoration: 'none',
        }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 800, color: i < 3 ? '#D4A843' : '#475569', width: 24, textAlign: 'center' }}>
            {i + 1}
          </span>
          {c.image && <Image src={c.image} alt={c.name} width={24} height={24} style={{ borderRadius: '50%' }} unoptimized />}
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{c.name}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#475569', marginLeft: 6 }}>{c.symbol.toUpperCase()}</span>
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>
            ${c.price >= 1000 ? c.price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : c.price >= 1 ? c.price.toFixed(2) : c.price.toFixed(4)}
          </span>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, minWidth: 60, textAlign: 'right',
            color: c.change24h >= 0 ? '#00D474' : '#FF4545',
          }}>
            {c.change24h >= 0 ? '+' : ''}{c.change24h?.toFixed(1)}%
          </span>
        </Link>
      ))}
    </div>
  );
}
