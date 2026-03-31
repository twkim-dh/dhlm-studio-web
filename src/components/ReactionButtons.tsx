'use client';

import { useState, useEffect } from 'react';

const REACTIONS = [
  { id: 'hilarious', emoji: '😂', label: 'Hilarious' },
  { id: 'true', emoji: '🎯', label: 'True' },
  { id: 'rude', emoji: '😤', label: 'Rude' },
  { id: 'fair', emoji: '🤔', label: 'Fair' },
];

function generateCounts(ticker: string): Record<string, number> {
  const today = new Date().toISOString().split('T')[0];
  const seed = `${ticker}-${today}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return {
    hilarious: 800 + Math.abs(hash % 1500),
    true: 500 + Math.abs((hash * 7) % 1200),
    rude: 100 + Math.abs((hash * 13) % 500),
    fair: 300 + Math.abs((hash * 19) % 800),
  };
}

function fmtCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export default function ReactionButtons({ ticker }: { ticker: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem(`reaction-${ticker}`);
    if (saved) setSelected(saved);
    setCounts(generateCounts(ticker));
  }, [ticker]);

  const handleReaction = (id: string) => {
    if (selected) return;
    setSelected(id);
    setCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    localStorage.setItem(`reaction-${ticker}`, id);
  };

  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
      {REACTIONS.map(r => {
        const isSelected = selected === r.id;
        const isDisabled = selected !== null && !isSelected;
        return (
          <button key={r.id} onClick={() => handleReaction(r.id)} disabled={isDisabled}
            style={{
              padding: '5px 10px', borderRadius: 16, fontSize: 10, cursor: isDisabled ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              background: isSelected ? '#C73E3A18' : '#1F2937',
              border: isSelected ? '1px solid #C73E3A40' : '1px solid #374151',
              color: isSelected ? '#C73E3A' : isDisabled ? '#475569' : '#94A3B8',
              opacity: isDisabled ? 0.5 : 1,
              transition: 'all 0.2s',
            }}>
            <span>{r.emoji}</span>
            <span>{r.label}</span>
            {counts[r.id] !== undefined && (
              <span style={{ fontSize: 9, opacity: 0.6 }}>{fmtCount(counts[r.id])}</span>
            )}
            {isSelected && <span style={{ fontSize: 9 }}>✓</span>}
          </button>
        );
      })}
    </div>
  );
}
