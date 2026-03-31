'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

/* Sector data — 2026 March approximate weights & daily changes */
const SECTORS = [
  {
    name: 'Technology', weight: 32, change: 1.8, color: '#3B82F6',
    stocks: [
      { ticker: 'NVDA', name: 'NVIDIA', cap: '$4.2T', change: 2.4, weight: 14 },
      { ticker: 'AAPL', name: 'Apple', cap: '$3.8T', change: -0.8, weight: 12 },
      { ticker: 'MSFT', name: 'Microsoft', cap: '$3.0T', change: 1.2, weight: 10 },
      { ticker: 'AVGO', name: 'Broadcom', cap: '$1.7T', change: 3.1, weight: 5.5 },
      { ticker: 'ORCL', name: 'Oracle', cap: '$480B', change: 0.9, weight: 2 },
      { ticker: 'CRM', name: 'Salesforce', cap: '$270B', change: -1.2, weight: 1 },
    ],
  },
  {
    name: 'Communication', weight: 12, change: 0.9, color: '#8B5CF6',
    stocks: [
      { ticker: 'GOOGL', name: 'Alphabet', cap: '$3.6T', change: 0.6, weight: 9 },
      { ticker: 'META', name: 'Meta', cap: '$1.7T', change: 1.8, weight: 6 },
      { ticker: 'NFLX', name: 'Netflix', cap: '$400B', change: -0.3, weight: 1.5 },
      { ticker: 'DIS', name: 'Disney', cap: '$210B', change: 0.2, weight: 0.8 },
    ],
  },
  {
    name: 'Consumer Cyclical', weight: 11, change: -0.5, color: '#F59E0B',
    stocks: [
      { ticker: 'AMZN', name: 'Amazon', cap: '$2.3T', change: -1.5, weight: 7 },
      { ticker: 'TSLA', name: 'Tesla', cap: '$1.5T', change: 3.2, weight: 5 },
      { ticker: 'HD', name: 'Home Depot', cap: '$380B', change: -0.6, weight: 1.2 },
      { ticker: 'NKE', name: 'Nike', cap: '$120B', change: -2.1, weight: 0.4 },
    ],
  },
  {
    name: 'Healthcare', weight: 12, change: -0.3, color: '#10B981',
    stocks: [
      { ticker: 'LLY', name: 'Eli Lilly', cap: '$780B', change: 1.4, weight: 3 },
      { ticker: 'UNH', name: 'UnitedHealth', cap: '$450B', change: -0.8, weight: 2 },
      { ticker: 'JNJ', name: 'Johnson & J.', cap: '$380B', change: 0.2, weight: 1.5 },
      { ticker: 'PFE', name: 'Pfizer', cap: '$160B', change: -1.5, weight: 0.6 },
    ],
  },
  {
    name: 'Financial', weight: 13, change: 0.4, color: '#06B6D4',
    stocks: [
      { ticker: 'JPM', name: 'JPMorgan', cap: '$850B', change: 0.9, weight: 3.5 },
      { ticker: 'V', name: 'Visa', cap: '$620B', change: 0.3, weight: 2.5 },
      { ticker: 'MA', name: 'Mastercard', cap: '$450B', change: 0.5, weight: 1.8 },
      { ticker: 'BAC', name: 'Bank of America', cap: '$330B', change: -0.4, weight: 1.3 },
    ],
  },
  {
    name: 'Energy', weight: 4, change: -1.2, color: '#EF4444',
    stocks: [
      { ticker: 'XOM', name: 'ExxonMobil', cap: '$510B', change: -1.5, weight: 2 },
      { ticker: 'CVX', name: 'Chevron', cap: '$280B', change: -0.8, weight: 1.1 },
    ],
  },
  {
    name: 'Industrials', weight: 8, change: 0.2, color: '#64748B',
    stocks: [
      { ticker: 'GE', name: 'GE Aerospace', cap: '$220B', change: 0.6, weight: 1.2 },
      { ticker: 'CAT', name: 'Caterpillar', cap: '$180B', change: -0.3, weight: 1 },
      { ticker: 'RTX', name: 'RTX Corp', cap: '$165B', change: 0.8, weight: 0.8 },
    ],
  },
  {
    name: 'Consumer Defensive', weight: 5, change: 0.1, color: '#D4A843',
    stocks: [
      { ticker: 'WMT', name: 'Walmart', cap: '$680B', change: 0.4, weight: 2.5 },
      { ticker: 'PG', name: 'Procter & Gamble', cap: '$380B', change: -0.2, weight: 1.5 },
      { ticker: 'KO', name: 'Coca-Cola', cap: '$280B', change: 0.1, weight: 1 },
    ],
  },
];

function getHeatColor(change: number): string {
  if (change >= 3) return '#00D474';
  if (change >= 1.5) return '#00B460';
  if (change >= 0.5) return '#00944D';
  if (change > 0) return '#007A40';
  if (change === 0) return '#374151';
  if (change > -0.5) return '#7A3030';
  if (change > -1.5) return '#943030';
  if (change > -3) return '#B43030';
  return '#FF4545';
}

export default function SectorHeatmap() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 6 }}>SECTOR HEATMAP · S&P 500</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Market Sectors</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', marginTop: 4 }}>Size = market weight · Color = daily change</p>
          </div>
          <Link href="/markets" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Markets</Link>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: '3%+', color: '#00D474' },
            { label: '1-3%', color: '#00944D' },
            { label: '0-1%', color: '#007A40' },
            { label: '0%', color: '#374151' },
            { label: '-1-0%', color: '#7A3030' },
            { label: '-3-(-1)%', color: '#B43030' },
            { label: '<-3%', color: '#FF4545' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 9, color: '#64748B', fontFamily: 'var(--mono)' }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Heatmap Grid — Treemap style */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, borderRadius: 14, overflow: 'hidden' }}>
          {SECTORS.map(sector => (
            <div key={sector.name} style={{
              width: `calc(${Math.max(sector.weight, 8)}% - 3px)`,
              minWidth: 140,
              background: '#111827',
              borderRadius: 8,
              overflow: 'hidden',
              flex: `${sector.weight} 1 auto`,
            }}>
              {/* Sector header */}
              <div style={{
                padding: '8px 10px',
                background: `${sector.color}15`,
                borderBottom: '1px solid #1E293B',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: sector.color }}>{sector.name}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, fontFamily: 'var(--mono)',
                  color: sector.change >= 0 ? '#00D474' : '#FF4545',
                }}>{sector.change >= 0 ? '+' : ''}{sector.change.toFixed(1)}%</span>
              </div>
              {/* Stocks grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 3 }}>
                {sector.stocks.map(stock => {
                  const isHovered = hover === stock.ticker;
                  return (
                    <Link key={stock.ticker} href={`/markets/${stock.ticker}`}
                      onMouseEnter={() => setHover(stock.ticker)}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        flex: `${Math.max(stock.weight, 1)} 1 ${Math.max(stock.weight * 8, 50)}px`,
                        minHeight: Math.max(stock.weight * 6, 36),
                        background: getHeatColor(stock.change),
                        borderRadius: 4,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '4px 6px', textDecoration: 'none',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.4)' : 'none',
                        position: 'relative',
                      }}>
                      <span style={{ fontSize: stock.weight > 3 ? 12 : 9, fontWeight: 800, color: '#fff', fontFamily: 'var(--mono)' }}>{stock.ticker}</span>
                      <span style={{ fontSize: stock.weight > 3 ? 10 : 8, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--mono)' }}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
                      </span>
                      {isHovered && stock.weight > 2 && (
                        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>{stock.cap}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          {SECTORS.sort((a, b) => b.change - a.change).slice(0, 3).map(s => (
            <div key={s.name} style={{ flex: 1, minWidth: 120, padding: '12px 14px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--mono)' }}>TOP SECTOR</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.name}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#00D474', fontFamily: 'var(--mono)', marginTop: 2 }}>+{s.change.toFixed(1)}%</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 20 }}>
          Data is approximate and for informational purposes only. NOT investment advice.
        </p>
      </div>
    </div>
  );
}
