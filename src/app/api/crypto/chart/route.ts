import { NextRequest, NextResponse } from 'next/server';
import { getCoinChart } from '@/lib/coingecko';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const days = Number(searchParams.get('days') || '30');

  if (!id) return NextResponse.json({ error: 'id param required' }, { status: 400 });
  if (![1, 7, 30, 90, 365].includes(days)) return NextResponse.json({ error: 'days must be 1|7|30|90|365' }, { status: 400 });

  try {
    const points = await getCoinChart(id, days);
    return NextResponse.json({ id, days, points });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch chart' }, { status: 500 });
  }
}
