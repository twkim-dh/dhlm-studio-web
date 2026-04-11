'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCryptoRoast } from '@/lib/crypto-roast';

interface Coin {
  rank: number; id: string; symbol: string; name: string; image: string;
  price: number; marketCap: number; change24h: number; change7d: number; volume24h: number;
}

function fmt(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

function fmtPrice(n: number): string {
  if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function CryptoPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    fetch('/api/crypto')
      .then(r => r.json())
      .then(data => {
        if (data.coins?.length > 0) {
          setCoins(data.coins);
        }
        // If coins is empty array (429 / error), just leave loading spinner
        // briefly then show empty gracefully
      })
      .catch(() => setDelayed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#F59E0B', letterSpacing: 3, marginBottom: 6 }}>CRYPTO · LIVE</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Crypto Rankings</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', marginTop: 4 }}>Top cryptocurrencies by market cap — real-time from CoinGecko</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/rankings" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>Rankings</Link>
            <Link href="/" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>Home</Link>
          </div>
        </div>

        {loading && <p style={{ color: '#64748B', fontSize: 14, fontFamily: 'var(--sans)' }}>Loading live crypto data...</p>}
        {!loading && delayed && <p style={{ color: '#94A3B8', fontSize: 13, fontFamily: 'var(--sans)' }}>Data may be delayed. Retrying shortly...</p>}

        {coins.length > 0 && (
          <>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#00D474', marginBottom: 16 }}>● LIVE DATA — CoinGecko API</p>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>

            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1fr 1fr 1fr', gap: 8, padding: '8px 20px', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569' }}>#</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569' }}>NAME</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', textAlign: 'right' }}>PRICE</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', textAlign: 'right' }}>24H</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', textAlign: 'right' }}>MARKET CAP</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {coins.map((c) => {
                const roast = c.rank <= 20 ? getCryptoRoast(c.id) : null;
                return (
                <Link key={c.id} href={`/rankings/crypto/${c.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    ...card, display: 'grid', gridTemplateColumns: '36px 2fr 1fr 1fr 1fr',
                    gap: 8, padding: '14px 20px', alignItems: 'center',
                    cursor: 'pointer', transition: 'border-color 0.2s',
                  }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 800, color: c.rank <= 3 ? '#D4A843' : '#475569', textAlign: 'center' }}>
                      {c.rank}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {c.image && <Image src={c.image} alt={c.name} width={24} height={24} style={{ borderRadius: '50%' }} unoptimized />}
                      <div>
                        <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{c.name}</span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#475569', marginLeft: 6 }}>{c.symbol}</span>
                        {roast && <div style={{ fontSize: 9, color: '#C73E3A', fontStyle: 'italic', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>🔥 {roast.roast.slice(0, 50)}...</div>}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 700, color: '#F1F5F9', textAlign: 'right' }}>
                      {fmtPrice(c.price)}
                    </span>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, textAlign: 'right',
                      color: c.change24h >= 0 ? '#00D474' : '#FF4545',
                    }}>
                      {c.change24h >= 0 ? '+' : ''}{c.change24h?.toFixed(1)}%
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#94A3B8', textAlign: 'right' }}>
                      {fmt(c.marketCap)}
                    </span>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
          </>
        )}

        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: 24, lineHeight: 1.6, textAlign: 'center' }}>
          Cryptocurrency prices are highly volatile. This data is for informational purposes only and does not constitute investment advice.<br />
          Data source: CoinGecko API (free tier). Prices may have a slight delay.
        </p>
      </div>
    </div>
  );
}
