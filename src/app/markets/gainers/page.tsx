'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Mover {
  rank: number; ticker: string; name: string; price: number; change: number; volume: number;
  sector?: string; image?: string; marketCapFmt?: string;
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function GainersPage() {
  const [items, setItems] = useState<Mover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/markets')
      .then(r => r.json())
      .then(d => { if (d.gainers?.length > 0) setItems(d.gainers); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Link href="/markets" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Markets</Link>
          <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--mono)' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#00D474', letterSpacing: 3, marginBottom: 4 }}>🟢 TOP GAINERS · TODAY</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Top Gainers</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Stocks with the biggest percentage gains today</p>
        </div>

        {loading && <p style={{ fontSize: 13, color: '#64748B' }}>Loading live data...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((s, i) => (
            <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0D1117', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#60A5FA', fontFamily: 'var(--mono)', flexShrink: 0 }}>
                {s.image ? <Image src={s.image} alt={s.ticker} width={20} height={20} style={{ borderRadius: 4 }} unoptimized /> : s.ticker.slice(0, 4)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: '#60A5FA' }}>{s.ticker}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                  {s.sector && <span>{s.sector}</span>}
                  {s.marketCapFmt && <span> · {s.marketCapFmt}</span>}
                  {s.volume > 0 && <span> · Vol: {(s.volume / 1e6).toFixed(1)}M</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800, color: '#F1F5F9' }}>${s.price.toFixed(2)}</div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: '#00D4741A', color: '#00D474', fontFamily: 'var(--mono)' }}>
                  +{s.change.toFixed(1)}%
                </span>
              </div>
            </Link>
          ))}
          {!loading && items.length === 0 && (
            <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: 40 }}>No gainers data available. Try again later.</p>
          )}
        </div>
      </div>
    </div>
  );
}
