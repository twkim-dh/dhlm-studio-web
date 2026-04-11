import { NextResponse } from 'next/server';
import { getCryptoMarkets } from '@/lib/coingecko';

export async function GET() {
  try {
    const coins = await getCryptoMarkets(20);
    return NextResponse.json({ coins, lastUpdated: new Date().toISOString(), source: 'CoinGecko' });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch crypto data' });
  }
}
