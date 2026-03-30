'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { stocks } from '@/data/markets';

interface Mover {
  rank: number; ticker: string; name: string; price: number; change: number; volume: number;
  sector?: string; industry?: string; exchange?: string; country?: string;
  ceo?: string; employees?: string; description?: string; image?: string; website?: string;
  marketCap?: number; marketCapFmt?: string; range52w?: string;
  revenue?: string; netIncome?: string; eps?: string | number;
  analysis?: { catalyst: string; outlook: string; signal: 'bullish' | 'bearish' | 'neutral' } | null;
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };
const signalColors = { bullish: '#00D474', bearish: '#FF4545', neutral: '#F59E0B' };

export default function MarketsPage() {
  const [movers, setMovers] = useState<Mover[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/markets')
      .then(r => r.json())
      .then(data => {
        if (data.movers?.length > 0) { setMovers(data.movers); setIsLive(true); }
        else { setMovers(stocks.map((s, i) => ({ rank: i + 1, ticker: s.ticker, name: s.name, price: s.price, change: s.change, volume: 0, sector: s.sector })) as Mover[]); }
      })
      .catch(() => { setMovers(stocks.map((s, i) => ({ rank: i + 1, ticker: s.ticker, name: s.name, price: s.price, change: s.change, volume: 0, sector: s.sector })) as Mover[]); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 6 }}>US MARKET · TODAY</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Top Movers</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', marginTop: 4 }}>Daily top gainers — prices, company profiles, and AI analysis</p>
          </div>
          <Link href="/" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Home</Link>
        </div>

        {isLive && <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#00D474', marginBottom: 4 }}>● LIVE DATA — Alpha Vantage + Financial Modeling Prep</p>}
        {loading && <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B' }}>Loading live market data...</p>}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#334155', marginBottom: 24 }}>
          Data for informational purposes only. Not investment advice. Prices may be delayed.
        </p>

        {/* Movers list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {movers.map((s) => (
            <div key={s.ticker} style={{ ...card, padding: '20px 22px' }}>
              {/* Top row: rank + ticker + price */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 800, color: s.rank <= 3 ? '#D4A843' : '#475569', width: 30, textAlign: 'center', paddingTop: 2 }}>
                  #{s.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {s.image && <img src={s.image} alt="" width={20} height={20} style={{ borderRadius: 4 }} />}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 700, color: '#60A5FA' }}>{s.ticker}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>{s.name}</span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
                    {s.sector && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#3B82F614', color: '#3B82F6', fontFamily: 'var(--mono)' }}>{s.sector}</span>}
                    {s.industry && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#6B728014', color: '#6B7280', fontFamily: 'var(--mono)' }}>{s.industry}</span>}
                    {s.exchange && <span style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--mono)' }}>{s.exchange}</span>}
                    {s.marketCapFmt && <span style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--mono)' }}>· Cap: {s.marketCapFmt}</span>}
                  </div>

                  {/* Company info (top 5) */}
                  {s.description && (
                    <p style={{ fontSize: 12, color: '#64748B', marginTop: 8, lineHeight: 1.6 }}>{s.description}</p>
                  )}
                  {(s.ceo || s.employees) && (
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 4, fontFamily: 'var(--mono)' }}>
                      {s.ceo && `CEO: ${s.ceo}`}{s.ceo && s.employees && ' · '}{s.employees && `${Number(s.employees).toLocaleString()} employees`}
                      {s.range52w && ` · 52wk: ${s.range52w}`}
                    </div>
                  )}

                  {/* Financials (top 3) */}
                  {(s.revenue || s.netIncome) && (
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                      {s.revenue && <div><span style={{ fontSize: 10, color: '#475569' }}>Revenue</span><div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{s.revenue}</div></div>}
                      {s.netIncome && <div><span style={{ fontSize: 10, color: '#475569' }}>Net Income</span><div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{s.netIncome}</div></div>}
                      {s.eps && <div><span style={{ fontSize: 10, color: '#475569' }}>EPS</span><div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>${typeof s.eps === 'number' ? s.eps.toFixed(2) : s.eps}</div></div>}
                    </div>
                  )}

                  {/* AI Analysis (top 3) */}
                  {s.analysis && (
                    <div style={{ marginTop: 10, padding: '12px 14px', background: '#0D111B', borderRadius: 8, border: '1px solid #1E293B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--mono)', background: `${signalColors[s.analysis.signal]}14`, color: signalColors[s.analysis.signal] }}>
                          {s.analysis.signal === 'bullish' ? '▲ BULLISH' : s.analysis.signal === 'bearish' ? '▼ BEARISH' : '● NEUTRAL'}
                        </span>
                        <span style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)' }}>AI ANALYSIS</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>
                        <strong style={{ color: '#E2E8F0' }}>Why:</strong> {s.analysis.catalyst}
                      </p>
                      <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, margin: '4px 0 0' }}>
                        <strong style={{ color: '#94A3B8' }}>Outlook:</strong> {s.analysis.outlook}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price column */}
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 800, color: '#F1F5F9' }}>${s.price.toFixed(2)}</div>
                  <span style={{
                    display: 'inline-block', marginTop: 4, fontSize: 14, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                    background: s.change >= 0 ? '#00D4741A' : '#FF45451A',
                    color: s.change >= 0 ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)',
                  }}>{s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%</span>
                  {s.volume > 0 && <div style={{ fontSize: 10, color: '#475569', marginTop: 4, fontFamily: 'var(--mono)' }}>Vol: {(s.volume / 1e6).toFixed(1)}M</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimers */}
        <div style={{ marginTop: 32, padding: '16px 20px', background: '#111827', borderRadius: 12, border: '1px solid #1E293B' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: '#475569' }}>Disclaimer:</strong> Market data is for informational purposes only and does not constitute investment advice. AI analysis is algorithmic and should not be used as the sole basis for investment decisions. Past performance is not indicative of future results. Always do your own research and consult a qualified financial professional.<br /><br />
            <strong style={{ color: '#475569' }}>Data source:</strong> Alpha Vantage (gainers), Financial Modeling Prep (profiles, financials). Prices may be delayed up to 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
