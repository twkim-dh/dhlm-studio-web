import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const redis = getRedis();
    const [raw, lastDate] = await Promise.all([
      redis.get('companies:snapshot'),
      redis.get('market:snapshot:latest'),
    ]);
    if (!raw) {
      return NextResponse.json({
        companies: [],
        status: 'unavailable',
        message: 'Company data updates daily after market close.',
        lastUpdated: null,
      });
    }
    const companies = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return NextResponse.json({
      companies,
      lastUpdated: lastDate ? String(lastDate) : null,
      source: 'redis',
    });
  } catch {
    return NextResponse.json({ companies: [], status: 'error' });
  }
}
