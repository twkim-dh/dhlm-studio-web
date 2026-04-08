'use client';

import { useState } from 'react';
import { getCryptoRoast } from '@/lib/crypto-roast';

export default function BrutalCryptoRoast({ symbol }: { symbol: string }) {
  const [revealed, setRevealed] = useState(false);
  const [roast, setRoast] = useState<{ roast: string; rating: string; ratingColor: string } | null>(null);

  const generate = () => {
    setRoast(getCryptoRoast(symbol));
    setRevealed(true);
  };

  return (
    <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: revealed ? '1px solid #1E293B' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2 }}>🔥 BRUTAL AI TAKE</div>
          {!revealed && (
            <button onClick={generate} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #C73E3A, #EF4444)', color: '#fff',
              fontSize: 11, fontWeight: 700,
            }}>
              Get the Brutal AI Take
            </button>
          )}
          {revealed && roast && (
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5, background: `${roast.ratingColor}20`, color: roast.ratingColor, fontFamily: 'var(--mono)' }}>
              {roast.rating}
            </span>
          )}
        </div>
      </div>
      {revealed && roast && (
        <div style={{ padding: '14px 18px' }}>
          <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
            &ldquo;{roast.roast}&rdquo;
          </p>
          <div style={{ padding: '6px 12px', borderTop: '1px solid #1F2937', marginTop: 12, background: '#0D111780' }}>
            <p style={{ fontSize: 8, color: '#475569', margin: 0, textAlign: 'center' }}>🤖 Informational and educational commentary. NOT investment advice.</p>
          </div>
        </div>
      )}
    </div>
  );
}
