import { NextResponse } from 'next/server';

let cacheData: Record<string, { data: unknown; ts: number }> = {};
const CACHE_TTL = 86400000; // 24 hours (World Bank data changes infrequently)

const COUNTRY_FLAGS: Record<string, string> = {
  'US': '🇺🇸', 'CN': '🇨🇳', 'DE': '🇩🇪', 'JP': '🇯🇵', 'IN': '🇮🇳',
  'GB': '🇬🇧', 'FR': '🇫🇷', 'BR': '🇧🇷', 'IT': '🇮🇹', 'CA': '🇨🇦',
  'RU': '🇷🇺', 'KR': '🇰🇷', 'AU': '🇦🇺', 'ES': '🇪🇸', 'MX': '🇲🇽',
  'ID': '🇮🇩', 'NL': '🇳🇱', 'SA': '🇸🇦', 'TR': '🇹🇷', 'CH': '🇨🇭',
  'PK': '🇵🇰', 'NG': '🇳🇬', 'BD': '🇧🇩', 'PH': '🇵🇭', 'EG': '🇪🇬',
};

async function fetchWorldBank(indicator: string, countries: string, year = '2024') {
  const cacheKey = `${indicator}_${year}`;
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].ts < CACHE_TTL) {
    return cacheData[cacheKey].data;
  }

  try {
    const url = `https://api.worldbank.org/v2/country/${countries}/indicator/${indicator}?format=json&date=${year}&per_page=50`;
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();

    if (!json[1]) return null;

    const data = json[1]
      .filter((d: Record<string, unknown>) => d.value !== null)
      .map((d: Record<string, unknown>) => ({
        country: (d.country as Record<string, string>).value,
        code: (d.country as Record<string, string>).id,
        flag: COUNTRY_FLAGS[(d.country as Record<string, string>).id] || '🏳️',
        value: d.value as number,
        year: d.date as string,
      }))
      .sort((a: { value: number }, b: { value: number }) => b.value - a.value);

    cacheData[cacheKey] = { data, ts: Date.now() };
    return data;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'gdp';

  const countries = 'US;CN;DE;JP;IN;GB;FR;BR;IT;CA;RU;KR;AU;ES;MX;ID;NL;SA;TR;CH';

  let indicator: string;
  let label: string;
  let format: (v: number) => string;

  switch (type) {
    case 'gdp':
      indicator = 'NY.GDP.MKTP.CD';
      label = 'GDP (Nominal)';
      format = (v) => `$${(v / 1e12).toFixed(1)}T`;
      break;
    case 'population':
      indicator = 'SP.POP.TOTL';
      label = 'Population';
      format = (v) => v > 1e9 ? `${(v / 1e9).toFixed(2)}B` : `${(v / 1e6).toFixed(0)}M`;
      break;
    case 'gdp-per-capita':
      indicator = 'NY.GDP.PCAP.CD';
      label = 'GDP per Capita';
      format = (v) => `$${Math.round(v).toLocaleString()}`;
      break;
    default:
      indicator = 'NY.GDP.MKTP.CD';
      label = 'GDP (Nominal)';
      format = (v) => `$${(v / 1e12).toFixed(1)}T`;
  }

  const data = await fetchWorldBank(indicator, countries);

  if (!data) {
    return NextResponse.json({ error: 'Failed to fetch World Bank data' }, { status: 503 });
  }

  const rankings = (data as { country: string; code: string; flag: string; value: number; year: string }[]).map((d, i) => ({
    rank: i + 1,
    name: d.country,
    code: d.code,
    flag: d.flag,
    value: format(d.value),
    rawValue: d.value,
    year: d.year,
  }));

  return NextResponse.json({
    type,
    label,
    rankings: rankings.slice(0, 20),
    lastUpdated: new Date().toISOString(),
    source: 'World Bank Open Data',
  });
}
