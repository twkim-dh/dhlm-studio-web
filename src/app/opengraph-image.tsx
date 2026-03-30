import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DHLM Studio — The World in Numbers';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        background: '#0B0F19', padding: '60px 80px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12, background: '#0D1117',
            border: '2px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 900, color: '#C73E3A',
          }}>M</div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#94A3B8', letterSpacing: 3 }}>
            DHLM STUDIO
          </span>
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, color: '#F1F5F9', lineHeight: 1.2 }}>
          The World in
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, color: '#00D474', lineHeight: 1.2 }}>
          Numbers
        </div>
        <div style={{ fontSize: 20, color: '#64748B', marginTop: 20 }}>
          Stock movers · Creator trends · Global rankings · Cost of living
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 16, color: '#334155' }}>
          dhlm-studio.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
