'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TickerLogo from '@/components/TickerLogo';

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

function Change({ value }: { value: number }) {
  const up = value > 0;
  return <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: up ? '#00D4741A' : '#FF45451A', color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>{up ? '+' : ''}{value.toFixed(1)}%</span>;
}

/* ═══ Counter — IntersectionObserver animated count-up ═══ */
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  // Always render the final value. The visual count-up animation was causing
  // "0+ Stocks" to display whenever JS hadn't completed the animation, which
  // looks broken to AdSense crawlers and first-time visitors.
  return <span>{to.toLocaleString()}{suffix}</span>;
}

/* ═══ Market Leaders (Top 10 by market cap) ═══ */
// Fallback data — updated 2026-04-13 (post-tariff values). Live data overrides via /api/markets/top20.
const MARKET_LEADERS = [
  { ticker: 'AAPL',  name: 'Apple',              cap: '$3.20T', price: 198.50, change: -0.8 },
  { ticker: 'MSFT',  name: 'Microsoft',          cap: '$2.90T', price: 392.10, change:  0.6 },
  { ticker: 'NVDA',  name: 'NVIDIA',             cap: '$2.80T', price: 114.50, change:  1.8 },
  { ticker: 'GOOGL', name: 'Alphabet',           cap: '$1.80T', price: 151.80, change: -0.4 },
  { ticker: 'AMZN',  name: 'Amazon',             cap: '$1.80T', price: 179.20, change: -1.2 },
  { ticker: 'META',  name: 'Meta Platforms',     cap: '$1.40T', price: 535.40, change:  0.9 },
  { ticker: 'BRK-B', name: 'Berkshire Hathaway', cap: '$960B',  price: 460.10, change:  0.3 },
  { ticker: 'TSLA',  name: 'Tesla',              cap: '$780B',  price: 248.20, change:  2.1 },
  { ticker: 'AVGO',  name: 'Broadcom',           cap: '$730B',  price: 162.30, change:  0.7 },
  { ticker: 'JPM',   name: 'JPMorgan Chase',     cap: '$590B',  price: 207.40, change: -0.5 },
];

export function LiveMarketsPreview() {
  const [leaders, setLeaders] = useState(MARKET_LEADERS);

  useEffect(() => {
    // Primary: fetch live top20 from /api/markets/top20 which returns marketCapFmt.
    // Fallback: /api/markets (gainers/losers/actives) for price+change only.
    fetch('/api/markets/top20')
      .then(r => r.json())
      .then(data => {
        if (!data.stocks || !data.stocks.length) return;
        // Build a map by ticker from the live top-20 response
        const liveMap: Record<string, { price: number; change: number; cap: string }> = {};
        for (const s of data.stocks) {
          if (s?.ticker) liveMap[s.ticker] = { price: s.price, change: s.change, cap: s.marketCapFmt };
        }
        if (Object.keys(liveMap).length === 0) return;
        // Re-sort leaders by live market cap order if possible, then update values
        setLeaders(prev => {
          const updated = prev.map(l =>
            liveMap[l.ticker] ? { ...l, price: liveMap[l.ticker].price, change: liveMap[l.ticker].change, cap: liveMap[l.ticker].cap } : l
          );
          return updated.sort((a, b) => {
            const toNum = (s: string) => {
              const n = parseFloat(s.replace(/[^0-9.]/g, ''));
              if (s.includes('T')) return n * 1e12;
              if (s.includes('B')) return n * 1e9;
              return n * 1e6;
            };
            return toNum(b.cap) - toNum(a.cap);
          });
        });
      })
      .catch(() => {
        // Fallback: try /api/markets for price+change only
        fetch('/api/markets')
          .then(r => r.json())
          .then(data => {
            const live: Record<string, { price: number; change: number }> = {};
            for (const g of [...(data.gainers || []), ...(data.losers || []), ...(data.actives || [])]) {
              if (g?.ticker) live[g.ticker] = { price: g.price, change: g.change };
            }
            if (Object.keys(live).length > 0) {
              setLeaders(prev => prev.map(l => live[l.ticker] ? { ...l, ...live[l.ticker] } : l));
            }
          })
          .catch(() => {});
      });
  }, []);

  return (
    <div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#00D474', marginBottom: 8 }}>● LIVE — Top 10 by Market Cap</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {leaders.map((s, i) => (
          <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ ...card, display: 'grid', gridTemplateColumns: '28px 28px 1fr auto auto', gap: 12, padding: '14px 18px', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 800, color: i < 3 ? '#D4A843' : '#475569', textAlign: 'center' }}>#{i + 1}</div>
            <TickerLogo ticker={s.ticker} size={26} />
            <div style={{ minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: '#60A5FA' }}>{s.ticker}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: '#E2E8F0', marginLeft: 8 }}>{s.name}</span>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B', marginTop: 2 }}>{s.cap}</div>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800, color: '#F1F5F9', textAlign: 'right' }}>${s.price.toFixed(2)}</div>
            <Change value={s.change} />
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
