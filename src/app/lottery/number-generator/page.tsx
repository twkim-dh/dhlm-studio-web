'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generatePowerball, generateMegaMillions } from '@/data/lottery';

type Game = 'powerball' | 'megamillions';

export default function NumberGenerator() {
  const [game, setGame] = useState<Game>('powerball');
  const [results, setResults] = useState<{ numbers: number[]; special: number }[]>([]);

  const generate = () => {
    if (game === 'powerball') {
      const r = generatePowerball();
      setResults(prev => [{ numbers: r.numbers, special: r.powerball }, ...prev].slice(0, 10));
    } else {
      const r = generateMegaMillions();
      setResults(prev => [{ numbers: r.numbers, special: r.megaBall }, ...prev].slice(0, 10));
    }
  };

  const generate5 = () => {
    const sets = Array.from({ length: 5 }, () => {
      if (game === 'powerball') { const r = generatePowerball(); return { numbers: r.numbers, special: r.powerball }; }
      else { const r = generateMegaMillions(); return { numbers: r.numbers, special: r.megaBall }; }
    });
    setResults(prev => [...sets, ...prev].slice(0, 20));
  };

  const share = (r: { numbers: number[]; special: number }) => {
    const name = game === 'powerball' ? 'Powerball' : 'Mega Millions';
    const ballName = game === 'powerball' ? 'PB' : 'MB';
    const text = `🎰 My lucky ${name} numbers:\n${r.numbers.join(' - ')} + ${ballName}: ${r.special}\n\nGenerate yours → dhlm-studio.com/lottery/number-generator`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const specialColor = game === 'powerball' ? '#EF4444' : '#F59E0B';

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '80px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Link href="/lottery" style={{ fontSize: 12, color: '#64748B' }}>← Lottery</Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#A78BFA', letterSpacing: 3, marginBottom: 8 }}>🎲 NUMBER GENERATOR</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Lucky Numbers</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Cryptographically secure random numbers</p>
        </div>

        {/* Game selector */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#111827', borderRadius: 10, padding: 3, border: '1px solid #1E293B' }}>
          {[
            { id: 'powerball' as Game, label: '🔴 Powerball', desc: '5/69 + 1/26' },
            { id: 'megamillions' as Game, label: '🟡 Mega Millions', desc: '5/70 + 1/25' },
          ].map(g => (
            <button key={g.id} onClick={() => { setGame(g.id); setResults([]); }} style={{
              flex: 1, padding: '12px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: game === g.id ? '#1E293B' : 'transparent',
              color: game === g.id ? '#F1F5F9' : '#64748B',
              fontSize: 13, fontWeight: game === g.id ? 700 : 500,
            }}>
              <div>{g.label}</div>
              <div style={{ fontSize: 9, opacity: 0.6, marginTop: 2 }}>{g.desc}</div>
            </button>
          ))}
        </div>

        {/* Generate buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={generate} style={{
            flex: 2, padding: '16px 0', borderRadius: 14, border: 'none', fontWeight: 900, fontSize: 16, cursor: 'pointer',
            background: `linear-gradient(135deg, ${specialColor}, ${specialColor}CC)`, color: '#fff',
            boxShadow: `0 4px 20px ${specialColor}40`,
          }}>
            🎲 Quick Pick
          </button>
          <button onClick={generate5} style={{
            flex: 1, padding: '16px 0', borderRadius: 14, border: '1px solid #1E293B', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            background: '#111827', color: '#94A3B8',
          }}>
            5x Pick
          </button>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r, i) => (
            <div key={i} style={{
              background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              opacity: i === 0 ? 1 : 0.7 + (0.3 / (i + 1)),
            }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {r.numbers.map((n, j) => (
                  <div key={j} style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13, color: '#0F172A', fontFamily: 'var(--mono)',
                    background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}>{n}</div>
                ))}
                <span style={{ color: '#374151', fontSize: 10, margin: '0 2px' }}>+</span>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 13, color: '#fff', fontFamily: 'var(--mono)',
                  background: `linear-gradient(135deg, ${specialColor}, ${specialColor}CC)`, boxShadow: `0 2px 6px ${specialColor}40`,
                }}>{r.special}</div>
              </div>
              <button onClick={() => share(r)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#475569', padding: 4,
              }}>📤</button>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#475569', fontSize: 13 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎲</div>
            Press Quick Pick to generate your lucky numbers
          </div>
        )}

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 20 }}>
          Numbers generated using crypto.getRandomValues() — truly random. NOT a guarantee of winning.
        </p>
      </div>
    </div>
  );
}
