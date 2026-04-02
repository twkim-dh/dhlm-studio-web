import { NextResponse } from 'next/server';

let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 3600000; // 1 hour

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', { cache: 'no-store' });
    const raw = await res.json();

    const majors = ['EUR', 'GBP', 'JPY', 'KRW', 'CNY', 'CAD', 'AUD', 'CHF', 'INR', 'BRL', 'MXN', 'SGD', 'HKD', 'THB', 'VND'];
    const flags: Record<string, string> = {
      EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', KRW: '🇰🇷', CNY: '🇨🇳', CAD: '🇨🇦', AUD: '🇦🇺',
      CHF: '🇨🇭', INR: '🇮🇳', BRL: '🇧🇷', MXN: '🇲🇽', SGD: '🇸🇬', HKD: '🇭🇰', THB: '🇹🇭', VND: '🇻🇳',
    };
    const names: Record<string, string> = {
      EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen', KRW: 'Korean Won', CNY: 'Chinese Yuan',
      CAD: 'Canadian Dollar', AUD: 'Australian Dollar', CHF: 'Swiss Franc', INR: 'Indian Rupee',
      BRL: 'Brazilian Real', MXN: 'Mexican Peso', SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar',
      THB: 'Thai Baht', VND: 'Vietnamese Dong',
    };

    const rates = majors.map(code => ({
      code,
      name: names[code] || code,
      flag: flags[code] || '🏳️',
      rate: raw.rates[code],
      inverse: +(1 / raw.rates[code]).toFixed(4),
    }));

    const result = {
      base: 'USD',
      date: raw.date,
      rates,
      lastUpdated: new Date().toISOString(),
      source: 'exchangerate-api.com',
    };

    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch exchange rates' }, /* graceful */);
  }
}
