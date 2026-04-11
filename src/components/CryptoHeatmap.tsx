'use client';
import Link from 'next/link';

interface HeatmapCoin {
  id: string;
  symbol: string;
  change24h: number;
  marketCap: number;
}

function pctStyle(pct: number): { background: string; color: string; border: string } {
  if (pct >= 10) return { background: '#00D47430', color: '#00D474', border: '1px solid #00D47440' };
  if (pct >= 5)  return { background: '#00D47422', color: '#00D474', border: '1px solid #00D47430' };
  if (pct >= 2)  return { background: '#00D47416', color: '#4DB882', border: '1px solid #00D47420' };
  if (pct >= 0)  return { background: '#00D4740C', color: '#4CAF85', border: '1px solid #00D47415' };
  if (pct > -2)  return { background: '#FF45450C', color: '#E06060', border: '1px solid #FF454515' };
  if (pct > -5)  return { background: '#FF454516', color: '#FF6060', border: '1px solid #FF454520' };
  if (pct > -10) return { background: '#FF454522', color: '#FF4545', border: '1px solid #FF454530' };
  return          { background: '#FF454530', color: '#FF4545', border: '1px solid #FF454540' };
}

export default function CryptoHeatmap({ coins }: { coins: HeatmapCoin[] }) {
  const top = coins.slice(0, 30);
  if (top.length === 0) return null;

  // Tile flex-basis proportional to sqrt(marketCap) for visual balance
  const totalSqrt = top.reduce((s, c) => s + Math.sqrt(Math.max(c.marketCap, 1)), 0);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 10 }}>
        CRYPTO HEATMAP — 24H PERFORMANCE
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {top.map(c => {
          const style = pctStyle(c.change24h);
          const sqrtShare = Math.sqrt(Math.max(c.marketCap, 1)) / totalSqrt * 100;
          // Clamp between 3.5% and 25% to prevent extreme size disparities
          const flexBasis = `${Math.max(3.5, Math.min(sqrtShare, 25))}%`;
          return (
            <Link key={c.id} href={`/rankings/crypto/${c.id}`} style={{ textDecoration: 'none', flexGrow: 1, flexBasis }}>
              <div style={{
                ...style,
                borderRadius: 6,
                padding: '9px 5px',
                textAlign: 'center',
                cursor: 'pointer',
                height: 52,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: style.color, lineHeight: 1 }}>
                  {c.symbol.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: style.color, lineHeight: 1 }}>
                  {c.change24h >= 0 ? '+' : ''}{c.change24h.toFixed(1)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#334155', marginTop: 6, textAlign: 'right' }}>
        Tile size = market cap · Color = 24h change · Click to drill down
      </div>
    </div>
  );
}
