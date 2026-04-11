import { NextRequest, NextResponse } from 'next/server';
import { getCoinOHLC } from '@/lib/coingecko';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const days = Number(searchParams.get('days') || '30');

  if (!id) return NextResponse.json({ error: 'id param required' }, { status: 400 });

  const validDays = [7, 14, 30, 90].includes(days) ? days : 30;

  try {
    const points = await getCoinOHLC(id, validDays);
    return NextResponse.json({ id, days: validDays, points });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch OHLC data' }, { status: 500 });
  }
}
