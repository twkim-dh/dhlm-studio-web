import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ticker = searchParams.get('ticker') || 'STOCK';
  const rating = searchParams.get('rating') || 'OVERHYPED';
  const roast = searchParams.get('roast') || 'The AI has spoken.';
  const change = searchParams.get('change') || '+0.0%';

  const ratingColors: Record<string, string> = {
    DISASTER: '#FF4545', RUN: '#FF4545', CASINO: '#FF4545',
    OVERHYPED: '#FF4545', RISKY: '#F59E0B', DECENT: '#00D474',
    WATCH: '#F59E0B', BORING: '#6B7280',
  };
  const color = ratingColors[rating] || '#F59E0B';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: '#0B0F19', padding: '50px 60px', justifyContent: 'space-between',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#94A3B8', letterSpacing: 2 }}>DHLM STUDIO</span>
            <span style={{ fontSize: 12, color: '#C73E3A', fontWeight: 700 }}>BRUTAL AI</span>
          </div>
          <div style={{ fontSize: 12, color: '#475569' }}>dhlm-studio.com/markets</div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
          {/* Ticker + Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 48, fontWeight: 900, color: '#60A5FA', letterSpacing: 3 }}>${ticker}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: change.startsWith('+') ? '#00D474' : '#FF4545' }}>{change}</span>
          </div>
          {/* Rating badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 8, background: `${color}15`,
            border: `1px solid ${color}30`, width: 'fit-content',
          }}>
            <span style={{ fontSize: 20, fontWeight: 900, color, letterSpacing: 2 }}>{rating}</span>
          </div>
          {/* Roast text */}
          <div style={{
            fontSize: 22, color: '#E2E8F0', lineHeight: 1.5,
            maxWidth: '95%', fontStyle: 'italic',
          }}>
            &ldquo;{roast.slice(0, 200)}{roast.length > 200 ? '...' : ''}&rdquo;
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#334155' }}>🤖 Informational AI commentary. NOT investment advice.</span>
          <span style={{ fontSize: 13, color: '#C73E3A', fontWeight: 700 }}>🔥 Get your own roast →</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
