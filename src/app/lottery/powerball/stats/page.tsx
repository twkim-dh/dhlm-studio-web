'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { analyzeNumbers, analyzeSpecialBall, type DrawRecord } from '@/lib/lottery-stats';
import { POWERBALL_DRAWS } from '@/data/lottery';

type Period = 'all' | '1y' | '6m' | '100';

export default function PowerballStats() {
  const [draws, setDraws] = useState<DrawRecord[]>([]);
  const [period, setPeriod] = useState<Period>('all');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Try to load full history from JSON
    fetch('/data/powerball-history.json')
      .then(r => r.json())
      .then((data: { date: string; numbers: number[]; pb: number; multiplier?: number }[]) => {
        setDraws(data.map(d => ({ date: d.date, numbers: d.numbers, special: d.pb, multiplier: d.multiplier })));
        setLoaded(true);
      })
      .catch(() => {
        // Fallback to hardcoded data
        setDraws(POWERBALL_DRAWS.map(d => ({ date: d.date, numbers: d.numbers, special: d.specialBall, multiplier: d.multiplier })));
        setLoaded(true);
      });
  }, []);

  const getLimit = () => {
    if (period === '100') return 100;
    if (period === '6m') return Math.min(draws.length, 78); // ~78 draws in 6 months
    if (period === '1y') return Math.min(draws.length, 156); // ~156 draws in 1 year
    return draws.length;
  };

  const limit = getLimit();
  const { hot, cold, overdue } = analyzeNumbers(draws, 69, limit);
  const pbStats = analyzeSpecialBall(draws, 26, limit);
  const maxCount = hot[0]?.count || 1;
  const maxPB = pbStats[0]?.count || 1;

  const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#EF4444', letterSpacing: 3, marginBottom: 6 }}>🔴 POWERBALL STATISTICS</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Number Analysis</h1>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
              {loaded ? `${draws.length} total draws · Showing ${limit === draws.length ? 'all' : `last ${limit}`}` : 'Loading...'}
            </p>
          </div>
          <Link href="/lottery/powerball" style={{ fontSize: 12, color: '#64748B' }}>← Results</Link>
        </div>

        {/* Period selector */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#111827', borderRadius: 10, padding: 3, border: '1px solid #1E293B' }}>
          {([
            { id: 'all' as Period, label: 'All Time' },
            { id: '1y' as Period, label: 'Last Year' },
            { id: '6m' as Period, label: '6 Months' },
            { id: '100' as Period, label: 'Last 100' },
          ]).map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)} style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: period === p.id ? '#1E293B' : 'transparent',
              color: period === p.id ? '#F1F5F9' : '#64748B',
              fontSize: 12, fontWeight: period === p.id ? 700 : 500,
            }}>{p.label}</button>
          ))}
        </div>

        {!loaded && <p style={{ color: '#64748B', fontSize: 13 }}>Loading statistics...</p>}

        {loaded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hot Numbers */}
            <div style={{ ...card, padding: '18px 22px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#EF4444', letterSpacing: 2, marginBottom: 14 }}>🔥 HOT NUMBERS — Most Frequent</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {hot.map(s => (
                  <div key={s.number} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EF444420', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#EF4444', fontFamily: 'var(--mono)', flexShrink: 0 }}>{s.number}</div>
                    <div style={{ flex: 1, height: 14, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${(s.count / maxCount) * 100}%`, background: 'linear-gradient(90deg, #EF4444, #F87171)', transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: '#E2E8F0', width: 40, textAlign: 'right' }}>{s.count}×</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B', width: 40, textAlign: 'right' }}>{s.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cold Numbers */}
            <div style={{ ...card, padding: '18px 22px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#3B82F6', letterSpacing: 2, marginBottom: 14 }}>❄️ COLD NUMBERS — Least Frequent</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cold.map(s => (
                  <div key={s.number} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#3B82F620', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#3B82F6', fontFamily: 'var(--mono)', flexShrink: 0 }}>{s.number}</div>
                    <div style={{ flex: 1, height: 14, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${Math.max((s.count / maxCount) * 100, 3)}%`, background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: '#E2E8F0', width: 40, textAlign: 'right' }}>{s.count}×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overdue Numbers */}
            <div style={{ ...card, padding: '18px 22px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#F59E0B', letterSpacing: 2, marginBottom: 14 }}>⏰ OVERDUE NUMBERS — Longest Without Appearing</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {overdue.map(s => (
                  <div key={s.number} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F59E0B20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#F59E0B', fontFamily: 'var(--mono)', flexShrink: 0 }}>{s.number}</div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#E2E8F0' }}>Last seen: <strong>{s.lastSeen} draws ago</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Powerball Frequency */}
            <div style={{ ...card, padding: '18px 22px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#EF4444', letterSpacing: 2, marginBottom: 14 }}>🔴 POWERBALL FREQUENCY (1-26)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {pbStats.slice(0, 10).map(s => (
                  <div key={s.number} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #EF4444, #DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: '#fff', fontFamily: 'var(--mono)', flexShrink: 0 }}>{s.number}</div>
                    <div style={{ flex: 1, height: 12, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${(s.count / maxPB) * 100}%`, background: 'linear-gradient(90deg, #EF4444, #F87171)' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#E2E8F0', width: 35, textAlign: 'right' }}>{s.count}×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
          <Link href="/lottery/number-generator" style={{ fontSize: 11, color: '#A78BFA', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🎲 Generate Numbers</Link>
          <Link href="/lottery/powerball" style={{ fontSize: 11, color: '#EF4444', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🔴 Latest Results</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 16 }}>Past frequency does not predict future results. Lottery is random. Play responsibly.</p>
      </div>
    </div>
  );
}
