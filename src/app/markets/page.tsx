'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { stocks } from '@/data/markets';

interface LiveMover {
  rank: number; ticker: string; name: string; price: number; change: number; volume: number;
  sector?: string; industry?: string; exchange?: string;
  weekHigh52?: number; weekLow52?: number; prevClose?: number;
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function MarketsPage() {
  const [liveMovers, setLiveMovers] = useState<LiveMover[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch('/api/markets')
      .then(r => r.json())
      .then(data => {
        if (data.movers && data.movers.length > 0) {
          setLiveMovers(data.movers);
          setIsLive(true);
        }
      })
      .catch(() => {}); // Fallback to hardcoded
  }, []);

  const displayStocks = isLive
    ? liveMovers.map(m => ({
        ticker: m.ticker,
        name: m.name || m.ticker,
        price: m.price,
        change: m.change,
        sector: m.sector || '',
        industry: m.industry || '',
        exchange: m.exchange || '',
        volume: m.volume,
        weekHigh52: m.weekHigh52 || 0,
        weekLow52: m.weekLow52 || 0,
      }))
    : stocks.map(s => ({ ticker: s.ticker, name: s.name, price: s.price, change: s.change, sector: s.sector, industry: '', exchange: '', volume: 0, weekHigh52: 0, weekLow52: 0 }));

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 6 }}>US MARKET · TODAY</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Top Movers</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', marginTop: 4 }}>Daily top gainers on NASDAQ & NYSE</p>
          </div>
          <Link href="/" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Home</Link>
        </div>

        {isLive && (
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#00D474', marginBottom: 8 }}>● LIVE DATA — Alpha Vantage API</p>
        )}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#334155', marginBottom: 24 }}>
          {isLive ? 'Real-time data. ' : ''}Data for informational purposes only. Not investment advice.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {displayStocks.map((s, i) => (
            <div key={s.ticker} style={{ ...card, display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 14, padding: '18px 20px', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 800, color: i < 3 ? '#D4A843' : '#475569', textAlign: 'center' }}>#{i + 1}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: '#60A5FA' }}>{s.ticker}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{s.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    {s.sector && <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: '#3B82F614', color: '#3B82F6', fontFamily: 'var(--mono)' }}>{s.sector}</span>}
                    {s.industry && <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: '#6B728014', color: '#6B7280', fontFamily: 'var(--mono)' }}>{s.industry}</span>}
                    {s.exchange && <span style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--mono)' }}>{s.exchange}</span>}
                  </div>
                  {s.weekHigh52 > 0 && (
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 6, fontFamily: 'var(--mono)' }}>
                      52wk: ${s.weekLow52.toFixed(2)} — ${s.weekHigh52.toFixed(2)}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 800, color: '#F1F5F9' }}>${s.price.toFixed(2)}</div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{
                      fontSize: 14, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                      background: s.change >= 0 ? '#00D4741A' : '#FF45451A',
                      color: s.change >= 0 ? '#00D474' : '#FF4545',
                      fontFamily: 'var(--mono)',
                    }}>{s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%</span>
                  </div>
                  {s.volume > 0 && <div style={{ fontSize: 10, color: '#475569', marginTop: 4, fontFamily: 'var(--mono)' }}>Vol: {(s.volume / 1e6).toFixed(1)}M</div>}
                </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Market data is for informational purposes only and does not constitute investment advice.
        </p>
      </div>
    </div>
  );
}
