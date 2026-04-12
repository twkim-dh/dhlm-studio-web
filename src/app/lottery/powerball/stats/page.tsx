'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { analyzeNumbers, analyzeSpecialBall, getFullFrequency, analyzeCombo, type DrawRecord, type NumberStat } from '@/lib/lottery-stats';
import { POWERBALL_DRAWS } from '@/data/lottery';
import { fmtDateCompact } from '@/lib/fmt-date';

type Period = 'all' | '1y' | '6m' | '100' | '50';

const ROASTS = {
  hot: (n: number, count: number) => `Number ${n} has appeared ${count} times. That's NOT a coincidence. Or maybe it IS. The lottery has no memory. But you'll play it anyway, won't you? PREDICTABLE.`,
  cold: (n: number, count: number) => `Number ${n} showed up only ${count} times. Is it "due"? The math says NO. Your gut says YES. Your gut is an IDIOT. But go ahead, play it.`,
  overdue: (n: number, ago: number) => `Number ${n} hasn't appeared in ${ago} draws. Missing in action. The lottery doesn't owe you ANYTHING. But dreamers gonna dream.`,
};

export default function PowerballStats() {
  const [draws, setDraws] = useState<DrawRecord[]>([]);
  const [period, setPeriod] = useState<Period>('all');
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<'hot'|'cold'|'overdue'|'ball'|'heatmap'|'combo'|'history'>('hot');

  useEffect(() => {
    fetch('/data/powerball-history.json')
      .then(r => r.json())
      .then((data: { date: string; numbers: number[]; pb: number; multiplier?: number }[]) => {
        setDraws(data.map(d => ({ date: d.date, numbers: d.numbers, special: d.pb, multiplier: d.multiplier })));
        setLoaded(true);
      })
      .catch(() => {
        setDraws(POWERBALL_DRAWS.map(d => ({ date: d.date, numbers: d.numbers, special: d.specialBall, multiplier: d.multiplier })));
        setLoaded(true);
      });
  }, []);

  const getLimit = () => {
    if (period === '50') return 50;
    if (period === '100') return 100;
    if (period === '6m') return Math.min(draws.length, 78);
    if (period === '1y') return Math.min(draws.length, 156);
    return draws.length;
  };

  const limit = getLimit();
  const { hot, cold, overdue } = analyzeNumbers(draws, 69, limit);
  const pbStats = analyzeSpecialBall(draws, 26, limit);
  const freq = getFullFrequency(draws, 69, limit);
  const combo = analyzeCombo(draws, 69, limit);
  const maxCount = hot[0]?.count || 1;
  const maxFreq = Math.max(...freq.map(f => f.count), 1);
  const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

  function BarChart({ items, color, max }: { items: NumberStat[]; color: string; max: number }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.map(s => (
          <div key={s.number} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color, fontFamily: 'var(--mono)', flexShrink: 0 }}>{s.number}</div>
            <div style={{ flex: 1, height: 14, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, width: `${(s.count / max) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#E2E8F0', width: 35, textAlign: 'right' }}>{s.count}×</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#64748B', width: 35, textAlign: 'right' }}>{s.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#EF4444', letterSpacing: 3, marginBottom: 4 }}>🔴 POWERBALL STATISTICS</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Number Analysis</h1>
            <p style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{loaded ? `${draws.length} draws · Showing ${limit === draws.length ? 'all' : `last ${limit}`}` : 'Loading...'}</p>
          </div>
          <Link href="/lottery/powerball" style={{ fontSize: 12, color: '#64748B' }}>← Results</Link>
        </div>

        {/* Period */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 16, background: '#111827', borderRadius: 10, padding: 3, border: '1px solid #1E293B', overflowX: 'auto' }}>
          {([['all','All'],['1y','1 Year'],['6m','6 Mo'],['100','100'],['50','50']] as [Period,string][]).map(([id,label]) => (
            <button key={id} onClick={() => setPeriod(id)} style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: 'none', cursor: 'pointer', background: period === id ? '#1E293B' : 'transparent', color: period === id ? '#F1F5F9' : '#64748B', fontSize: 11, fontWeight: period === id ? 700 : 500, whiteSpace: 'nowrap' }}>{label}</button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
          {([['hot','🔥 Hot'],['cold','❄️ Cold'],['overdue','⏰ Overdue'],['ball','🔴 PB Ball'],['heatmap','🗺️ Heatmap'],['combo','📊 Patterns'],['history','📋 History']] as [typeof tab, string][]).map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: tab === id ? '#EF444420' : '#111827', color: tab === id ? '#EF4444' : '#64748B', fontSize: 11, fontWeight: tab === id ? 700 : 500 }}>{label}</button>
          ))}
        </div>

        {!loaded && <p style={{ color: '#64748B' }}>Loading {draws.length > 0 ? '' : 'data'}...</p>}

        {loaded && (
          <>
            {/* Hot */}
            {tab === 'hot' && (
              <div style={{ ...card, padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#EF4444', letterSpacing: 2, marginBottom: 12 }}>🔥 HOT NUMBERS — Most Frequent (TOP 15)</div>
                <BarChart items={hot} color="#EF4444" max={maxCount} />
                <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: '#C73E3A08', border: '1px solid #C73E3A15' }}>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', margin: 0, lineHeight: 1.7 }}>&ldquo;{ROASTS.hot(hot[0]?.number, hot[0]?.count)}&rdquo;</p>
                </div>
              </div>
            )}

            {/* Cold */}
            {tab === 'cold' && (
              <div style={{ ...card, padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#3B82F6', letterSpacing: 2, marginBottom: 12 }}>❄️ COLD NUMBERS — Least Frequent (TOP 15)</div>
                <BarChart items={cold} color="#3B82F6" max={maxCount} />
                <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: '#3B82F608', border: '1px solid #3B82F615' }}>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', margin: 0, lineHeight: 1.7 }}>&ldquo;{ROASTS.cold(cold[0]?.number, cold[0]?.count)}&rdquo;</p>
                </div>
              </div>
            )}

            {/* Overdue */}
            {tab === 'overdue' && (
              <div style={{ ...card, padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#F59E0B', letterSpacing: 2, marginBottom: 12 }}>⏰ OVERDUE — Longest Without Appearing (TOP 15)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {overdue.map(s => (
                    <div key={s.number} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F59E0B20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#F59E0B', fontFamily: 'var(--mono)', flexShrink: 0 }}>{s.number}</div>
                      <div style={{ flex: 1, fontSize: 12, color: '#E2E8F0' }}>Last seen: <strong>{s.lastSeen} draws ago</strong></div>
                      <span style={{ fontSize: 10, color: '#64748B' }}>Total: {s.count}×</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: '#F59E0B08', border: '1px solid #F59E0B15' }}>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', margin: 0, lineHeight: 1.7 }}>&ldquo;{ROASTS.overdue(overdue[0]?.number, overdue[0]?.lastSeen)}&rdquo;</p>
                </div>
              </div>
            )}

            {/* Powerball */}
            {tab === 'ball' && (
              <div style={{ ...card, padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#EF4444', letterSpacing: 2, marginBottom: 12 }}>🔴 POWERBALL FREQUENCY (1-26)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {pbStats.slice(0, 15).map(s => (
                    <div key={s.number} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #EF4444, #DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 10, color: '#fff', fontFamily: 'var(--mono)', flexShrink: 0 }}>{s.number}</div>
                      <div style={{ flex: 1, height: 12, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, width: `${(s.count / (pbStats[0]?.count || 1)) * 100}%`, background: 'linear-gradient(90deg, #EF4444, #F87171)' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#E2E8F0', width: 30, textAlign: 'right' }}>{s.count}×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Heatmap */}
            {tab === 'heatmap' && (
              <div style={{ ...card, padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#A78BFA', letterSpacing: 2, marginBottom: 12 }}>🗺️ NUMBER HEATMAP — All 69 Numbers</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: 4 }}>
                  {freq.map(f => {
                    const intensity = f.count / maxFreq;
                    const bg = `rgba(239, 68, 68, ${0.1 + intensity * 0.7})`;
                    return (
                      <div key={f.number} title={`#${f.number}: ${f.count}× (${f.pct.toFixed(1)}%)`} style={{
                        width: '100%', aspectRatio: '1', borderRadius: 6, background: bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, color: intensity > 0.5 ? '#fff' : '#94A3B8',
                        fontFamily: 'var(--mono)', cursor: 'default',
                      }}>{f.number}</div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 9, color: '#475569' }}>
                  <span>← Less frequent</span><span>More frequent →</span>
                </div>
              </div>
            )}

            {/* Combo Patterns */}
            {tab === 'combo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ ...card, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 10 }}>ODD/EVEN DISTRIBUTION</div>
                  {combo.oddEven.slice(0, 6).map(p => (
                    <div key={p.pattern} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#E2E8F0', width: 60 }}>{p.pattern}</span>
                      <div style={{ flex: 1, height: 12, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, width: `${p.pct}%`, background: '#00D474' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B', width: 40, textAlign: 'right' }}>{p.pct.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
                <div style={{ ...card, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#3B82F6', letterSpacing: 2, marginBottom: 10 }}>HIGH/LOW DISTRIBUTION (1-35 vs 36-69)</div>
                  {combo.highLow.slice(0, 6).map(p => (
                    <div key={p.pattern} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#E2E8F0', width: 60 }}>{p.pattern}</span>
                      <div style={{ flex: 1, height: 12, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, width: `${p.pct}%`, background: '#3B82F6' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B', width: 40, textAlign: 'right' }}>{p.pct.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
                <div style={{ ...card, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#F59E0B', letterSpacing: 2, marginBottom: 10 }}>SUM RANGES</div>
                  {combo.sumRanges.map(p => (
                    <div key={p.pattern} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#E2E8F0', width: 60 }}>{p.pattern}</span>
                      <div style={{ flex: 1, height: 12, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, width: `${p.pct}%`, background: '#F59E0B' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B', width: 40, textAlign: 'right' }}>{p.pct.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
                <div style={{ ...card, padding: '14px 20px', fontSize: 12, color: '#94A3B8' }}>
                  Draws with consecutive numbers: <strong style={{ color: '#E2E8F0' }}>{combo.consecutive.pct.toFixed(1)}%</strong> ({combo.consecutive.has} of {limit})
                </div>
              </div>
            )}

            {/* History */}
            {tab === 'history' && (
              <div style={{ ...card, overflow: 'hidden' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, padding: '12px 20px', borderBottom: '1px solid #1E293B' }}>DRAW HISTORY ({Math.min(limit, 50)} of {draws.length})</div>
                <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                  {draws.slice(0, Math.min(limit, 50)).map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderBottom: '1px solid #1E293B15', fontSize: 11 }}>
                      <span style={{ fontFamily: 'var(--mono)', color: '#64748B', width: 80, flexShrink: 0 }}>{fmtDateCompact(d.date)}</span>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {d.numbers.map(n => (
                          <span key={n} style={{ width: 24, height: 24, borderRadius: '50%', background: '#1E293B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{n}</span>
                        ))}
                        <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#EF4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10, color: '#fff', fontFamily: 'var(--mono)' }}>{d.special}</span>
                      </div>
                      {d.multiplier && <span style={{ fontSize: 9, color: '#475569' }}>{d.multiplier}×</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
          <Link href="/lottery/number-generator" style={{ fontSize: 11, color: '#A78BFA', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🎲 Number Generator</Link>
          <Link href="/lottery/powerball" style={{ fontSize: 11, color: '#EF4444', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🔴 Latest Results</Link>
          <Link href="/lottery/mega-millions/stats" style={{ fontSize: 11, color: '#F59E0B', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🟡 MM Stats</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
          Past frequency does not predict future results. Lottery is purely random. Play responsibly. 18+ only.
        </p>
      </div>
    </div>
  );
}
