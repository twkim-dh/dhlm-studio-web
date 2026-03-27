import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const categoryColors: Record<string, string> = {
  superstitions: '#7C3AED',
  food: '#F97316',
  lifestyle: '#10B981',
  traditions: '#DC2626',
  kpop: '#EC4899',
  travel: '#3B82F6',
  language: '#EAB308',
  business: '#1E40AF',
  technology: '#06B6D4',
  comparison: '#6B7280',
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') || 'DHLM Studio';
  const emoji = searchParams.get('emoji') || '🇰🇷';
  const category = searchParams.get('category') || 'superstitions';
  const color = categoryColors[category] || '#7C3AED';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
          padding: '40px 60px',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>{emoji}</div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: '90%',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 20,
          }}
        >
          Discover Korea | DHLM Studio
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
