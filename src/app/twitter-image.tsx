import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DHLM Studio — Brutal Edge Market Intelligence';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        background: 'linear-gradient(135deg, #0B0F19 0%, #111827 100%)',
        padding: '60px 80px',
      }}>
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: 'linear-gradient(135deg, #C73E3A, #8B1E1B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 900, color: '#fff',
            border: '2px solid #C73E3A40',
          }}>D</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#F1F5F9', letterSpacing: 1 }}>DHLM STUDIO</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginTop: 2 }}>BRUTAL EDGE™</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: '#F1F5F9', lineHeight: 1.1 }}>
            Brutal Edge
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: '#00D474', lineHeight: 1.1 }}>
            Market Intelligence
          </div>
        </div>

        {/* Subhead */}
        <div style={{ fontSize: 22, color: '#94A3B8', marginTop: 24, lineHeight: 1.4 }}>
          Real-time market data, Fear &amp; Greed Index,
        </div>
        <div style={{ fontSize: 22, color: '#94A3B8', marginTop: 4, lineHeight: 1.4 }}>
          Deep Dive reports, and data-driven stock analysis.
        </div>

        {/* Tag chips */}
        <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
          {['Stocks', 'Crypto', 'Fear & Greed', 'Deep Dives'].map(tag => (
            <div key={tag} style={{
              padding: '8px 16px', borderRadius: 8,
              background: '#0D1117', border: '1px solid #1E293B',
              fontSize: 14, fontWeight: 700, color: '#94A3B8',
            }}>{tag}</div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 18, color: '#475569', fontWeight: 600 }}>
          dhlm-studio.com
        </div>
        {/* Editorial badge */}
        <div style={{
          position: 'absolute', bottom: 40, left: 80,
          fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: '#00D474' }}>✓</span>
          <span>Data-driven analysis · Not investment advice</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
