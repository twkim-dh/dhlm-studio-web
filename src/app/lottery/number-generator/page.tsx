'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generatePowerball, generateMegaMillions } from '@/data/lottery';
import { analyzeNumbers, type DrawRecord } from '@/lib/lottery-stats';

type Game = 'powerball' | 'megamillions';
type Mode = 'quick' | 'hot' | 'cold' | 'balanced';

export default function NumberGenerator() {
  const [game, setGame] = useState<Game>('powerball');
  const [mode, setMode] = useState<Mode>('quick');
  const [results, setResults] = useState<{ numbers: number[]; special: number; mode: string }[]>([]);
  const [draws, setDraws] = useState<DrawRecord[]>([]);

  useEffect(() => {
    const file = game === 'powerball' ? '/data/powerball-history.json' : '/data/megamillions-history.json';
    const key = game === 'powerball' ? 'pb' : 'mb';
    fetch(file).then(r => r.json()).then((data: Record<string, unknown>[]) => {
      setDraws(data.map((d: Record<string, unknown>) => ({
        date: d.date as string,
        numbers: d.numbers as number[],
        special: d[key] as number,
      })));
    }).catch(() => {});
  }, [game]);

  const maxNum = game === 'powerball' ? 69 : 70;
  const maxSpecial = game === 'powerball' ? 26 : 25;

  function weightedPick(weights: number[], count: number, max: number): number[] {
    const nums = new Set<number>();
    while (nums.size < count) {
      let totalWeight = 0;
      for (let i = 1; i <= max; i++) if (!nums.has(i)) totalWeight += (weights[i] || 1);
      let rand = Math.random() * totalWeight;
      for (let i = 1; i <= max; i++) {
        if (nums.has(i)) continue;
        rand -= (weights[i] || 1);
        if (rand <= 0) { nums.add(i); break; }
      }
    }
    return [...nums].sort((a, b) => a - b);
  }

  function generate() {
    let numbers: number[];
    let special: number;

    if (mode === 'quick') {
      if (game === 'powerball') {
        const r = generatePowerball();
        numbers = r.numbers; special = r.powerball;
      } else {
        const r = generateMegaMillions();
        numbers = r.numbers; special = r.megaBall;
      }
    } else if (mode === 'hot') {
      const { hot } = analyzeNumbers(draws, maxNum, 100);
      const weights: number[] = new Array(maxNum + 1).fill(1);
      hot.forEach(h => { weights[h.number] = 3 + h.count; });
      numbers = weightedPick(weights, 5, maxNum);
      const a = new Uint32Array(1); crypto.getRandomValues(a);
      special = (a[0] % maxSpecial) + 1;
    } else if (mode === 'cold') {
      const { cold } = analyzeNumbers(draws, maxNum, 100);
      const weights: number[] = new Array(maxNum + 1).fill(1);
      cold.forEach(c => { weights[c.number] = 3 + (20 - c.count); });
      numbers = weightedPick(weights, 5, maxNum);
      const a = new Uint32Array(1); crypto.getRandomValues(a);
      special = (a[0] % maxSpecial) + 1;
    } else {
      // Balanced: 3 odd + 2 even, mix of high/low, sum 100-170
      let attempts = 0;
      const mid = Math.ceil(maxNum / 2);
      do {
        if (game === 'powerball') {
          const r = generatePowerball();
          numbers = r.numbers; special = r.powerball;
        } else {
          const r = generateMegaMillions();
          numbers = r.numbers; special = r.megaBall;
        }
        const odds = numbers.filter(n => n % 2).length;
        const lows = numbers.filter(n => n <= mid).length;
        const sum = numbers.reduce((a, b) => a + b, 0);
        if ((odds === 3 || odds === 2) && (lows === 2 || lows === 3) && sum >= 100 && sum <= 180) break;
        attempts++;
      } while (attempts < 50);
    }

    setResults(prev => [{ numbers: numbers!, special: special!, mode }, ...prev].slice(0, 15));
  }

  function generate5() { for (let i = 0; i < 5; i++) generate(); }

  const share = (r: { numbers: number[]; special: number }) => {
    const name = game === 'powerball' ? 'Powerball' : 'Mega Millions';
    const ball = game === 'powerball' ? 'PB' : 'MB';
    const text = `🎰 My ${name} ${mode} pick:\n${r.numbers.join(' - ')} + ${ball}: ${r.special}\n\nGenerate yours → dhlm-studio.com/lottery/number-generator`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const specialColor = game === 'powerball' ? '#EF4444' : '#F59E0B';
  const modeLabels: Record<Mode, { icon: string; name: string; desc: string }> = {
    quick: { icon: '🎲', name: 'Quick Pick', desc: 'Pure random' },
    hot: { icon: '🔥', name: 'Hot Pick', desc: 'Weighted by frequent numbers' },
    cold: { icon: '❄️', name: 'Cold Pick', desc: 'Weighted by overdue numbers' },
    balanced: { icon: '⚖️', name: 'Balanced', desc: '3:2 odd/even, sum 100-180' },
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '80px 16px' }}>
        <Link href="/lottery" style={{ fontSize: 12, color: '#64748B' }}>← Lottery</Link>

        <div style={{ textAlign: 'center', margin: '20px 0 20px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#A78BFA', letterSpacing: 3, marginBottom: 8 }}>🎲 NUMBER GENERATOR</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Lucky Numbers</h1>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>4 strategies · {draws.length > 0 ? `${draws.length} draws analyzed` : 'Loading data...'}</p>
        </div>

        {/* Game selector */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 12, background: '#111827', borderRadius: 10, padding: 3, border: '1px solid #1E293B' }}>
          {([['powerball', '🔴 Powerball'] as [Game, string], ['megamillions', '🟡 Mega Millions'] as [Game, string]]).map(([id, label]) => (
            <button key={id} onClick={() => { setGame(id); setResults([]); }} style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: game === id ? '#1E293B' : 'transparent',
              color: game === id ? '#F1F5F9' : '#64748B', fontSize: 12, fontWeight: game === id ? 700 : 500,
            }}>{label}</button>
          ))}
        </div>

        {/* Mode selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 16 }}>
          {(Object.entries(modeLabels) as [Mode, typeof modeLabels.quick][]).map(([id, m]) => (
            <button key={id} onClick={() => setMode(id)} style={{
              padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: mode === id ? `${specialColor}15` : '#111827',
              borderWidth: 1, borderStyle: 'solid',
              borderColor: mode === id ? `${specialColor}40` : '#1E293B',
              color: mode === id ? specialColor : '#64748B',
            }}>
              <div style={{ fontSize: 16 }}>{m.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>{m.name}</div>
              <div style={{ fontSize: 8, marginTop: 1, opacity: 0.7 }}>{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Generate buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={generate} style={{
            flex: 2, padding: '14px 0', borderRadius: 14, border: 'none', fontWeight: 900, fontSize: 15, cursor: 'pointer',
            background: `linear-gradient(135deg, ${specialColor}, ${specialColor}CC)`, color: '#fff',
            boxShadow: `0 4px 20px ${specialColor}40`,
          }}>
            {modeLabels[mode].icon} {modeLabels[mode].name}
          </button>
          <button onClick={generate5} style={{
            flex: 1, padding: '14px 0', borderRadius: 14, border: '1px solid #1E293B', fontWeight: 700, fontSize: 12, cursor: 'pointer',
            background: '#111827', color: '#94A3B8',
          }}>5× Pick</button>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map((r, i) => (
            <div key={i} style={{
              background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '12px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              opacity: 1 - i * 0.04,
            }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {r.numbers.map((n, j) => (
                  <div key={j} style={{
                    width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 12, color: '#0F172A', fontFamily: 'var(--mono)',
                    background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}>{n}</div>
                ))}
                <span style={{ color: '#374151', fontSize: 9, margin: '0 1px' }}>+</span>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 12, color: '#fff', fontFamily: 'var(--mono)',
                  background: `linear-gradient(135deg, ${specialColor}, ${specialColor}CC)`,
                }}>{r.special}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 8, color: '#475569', fontFamily: 'var(--mono)' }}>{r.mode}</span>
                <button onClick={() => share(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#475569', padding: 2 }}>📤</button>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, color: '#475569', fontSize: 12 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎲</div>
            Choose a mode and press the button
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
          <Link href="/lottery/powerball/stats" style={{ fontSize: 11, color: '#EF4444', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>📊 PB Stats</Link>
          <Link href="/lottery/mega-millions/stats" style={{ fontSize: 11, color: '#F59E0B', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>📊 MM Stats</Link>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
          Numbers generated using crypto.getRandomValues(). Hot/Cold modes weighted by historical frequency — does NOT improve odds. Lottery is random. Play responsibly. 18+.
        </p>
      </div>
    </div>
  );
}
