import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') || 'The World in Numbers';
  const subtitle = searchParams.get('subtitle') || 'DHLM Studio';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        background: '#0B0F19', padding: '60px 80px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10, background: '#0D1117',
            border: '2px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 900, color: '#C73E3A',
          }}>M</div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#94A3B8', letterSpacing: 2 }}>
            DHLM STUDIO
          </span>
        </div>
        <div style={{
          fontSize: 52, fontWeight: 900, color: '#F1F5F9',
          lineHeight: 1.2, maxWidth: '90%',
        }}>
          {title}
        </div>
        <div style={{ fontSize: 20, color: '#64748B', marginTop: 16 }}>
          {subtitle}
        </div>
        <div style={{
          position: 'absolute', bottom: 40, right: 60,
          fontSize: 14, color: '#334155',
        }}>
          dhlm-studio.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
