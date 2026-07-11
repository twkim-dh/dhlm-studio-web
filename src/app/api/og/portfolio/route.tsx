import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const stocks = searchParams.get('stocks') || 'AAPL,TSLA,NVDA';
  const grade = searchParams.get('grade') || 'D-';

  const tickers = stocks.split(',').slice(0, 5);
  const gradeColor = grade.startsWith('A') || grade.startsWith('B') ? '#00D474' : grade.startsWith('C') ? '#F59E0B' : '#FF4545';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: '#FFFFFF', padding: '50px 60px', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#5B6470', letterSpacing: 2 }}>DHLM STUDIO</span>
          </div>
          <span style={{ fontSize: 12, color: '#8A929C' }}>dhlm-studio.com/markets/roast-portfolio</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
          <div style={{ fontSize: 40 }}>🔥</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#16161A' }}>PORTFOLIO ROAST REPORT</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {tickers.map(t => (
              <span key={t} style={{ fontSize: 20, fontWeight: 800, color: '#2D2F8F', padding: '6px 14px', borderRadius: 8, background: '#FAFAF8', border: '1px solid #E8E8E4' }}>{t}</span>
            ))}
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, color: gradeColor, marginTop: 16 }}>{grade}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#8A929C' }}>🤖 Informational commentary. NOT investment advice.</span>
          <span style={{ fontSize: 14, color: '#C73E3A', fontWeight: 700 }}>Get YOUR portfolio roasted →</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
