import { NextResponse } from 'next/server';
import { getCryptoGainersLosers } from '@/lib/coingecko';

export async function GET() {
  try {
    const data = await getCryptoGainersLosers();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gainers/losers' }, { status: 500 });
  }
}
