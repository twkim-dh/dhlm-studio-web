import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ticker = searchParams.get('ticker') || 'STOCK';
  const name = searchParams.get('name') || 'Anonymous';
  const amount = searchParams.get('amount') || '$1';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: '#0C1222', padding: '50px 60px',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
      }}>
        {/* Header */}
        <div style={{ position: 'absolute', top: 40, left: 60, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#5B6470', letterSpacing: 2 }}>DHLM STUDIO</span>
        </div>

        {/* Lotus emoji */}
        <div style={{ fontSize: 64, marginBottom: 16 }}>🪷</div>

        {/* Blessed text */}
        <div style={{ fontSize: 42, fontWeight: 900, color: '#D4A843', marginBottom: 8 }}>
          ${ticker} has been blessed
        </div>

        <div style={{ fontSize: 18, color: '#5B6470', marginBottom: 24 }}>
          The Fortune Buddha smiles upon this ticker
        </div>

        {/* Details */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ padding: '12px 24px', borderRadius: 10, background: '#FAFAF8', border: '1px solid #E8E8E4' }}>
            <div style={{ fontSize: 11, color: '#8A929C' }}>DONATED</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#D4A843' }}>{amount}</div>
          </div>
          <div style={{ padding: '12px 24px', borderRadius: 10, background: '#FAFAF8', border: '1px solid #E8E8E4' }}>
            <div style={{ fontSize: 11, color: '#8A929C' }}>BY</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#16161A' }}>{name}</div>
          </div>
        </div>

        {/* Charity note */}
        <div style={{ position: 'absolute', bottom: 40, fontSize: 13, color: '#8A929C' }}>
          ❤️ 100% donated to St. Jude Children&apos;s Research Hospital — dhlm-studio.com/markets/bless
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
