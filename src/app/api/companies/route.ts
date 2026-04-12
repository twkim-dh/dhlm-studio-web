import { NextResponse } from 'next/server';

// Financial Modeling Prep — commercial use allowed, 250 req/day free
const FMP_KEY = process.env.FMP_API_KEY || '';
const BASE = 'https://financialmodelingprep.com/api/v3';

let cacheData: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 3_600_000; // 60 min (was 10 min — companies data doesn't change often)

export async function GET() {
  if (cacheData && Date.now() - cacheData.ts < CACHE_TTL) {
    return NextResponse.json(cacheData.data);
  }

  if (!FMP_KEY) {
    return NextResponse.json({ error: 'FMP_API_KEY not configured' }, /* graceful */);
  }

  try {
    // Get top companies by market cap
    const res = await fetch(
      `${BASE}/stock-screener?marketCapMoreThan=100000000000&limit=20&apikey=${FMP_KEY}`,
      { cache: 'no-store' }
    );
    const raw = await res.json();

    if (!Array.isArray(raw) || raw.length === 0) {
      // FMP rate limit or empty data — return empty array (not error)
      return NextResponse.json({ companies: [], error: 'Data temporarily unavailable' });
    }

    // Sort by market cap descending
    const sorted = raw.sort((a: Record<string, number>, b: Record<string, number>) => (b.marketCap || 0) - (a.marketCap || 0));

    const FLAGS: Record<string, string> = { US: '🇺🇸', CN: '🇨🇳', TW: '🇹🇼', KR: '🇰🇷', JP: '🇯🇵', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', SA: '🇸🇦', NL: '🇳🇱', CH: '🇨🇭', IE: '🇮🇪', DK: '🇩🇰' };

    const companies = sorted.slice(0, 15).map((c: Record<string, unknown>, i: number) => {
      const mktCap = c.marketCap as number || 0;
      return {
        rank: i + 1,
        ticker: c.symbol,
        name: c.companyName,
        price: c.price,
        change: c.changesPercentage || 0,
        marketCap: mktCap,
        marketCapFmt: mktCap >= 1e12 ? `$${(mktCap / 1e12).toFixed(2)}T` : `$${(mktCap / 1e9).toFixed(0)}B`,
        sector: c.sector || '',
        industry: c.industry || '',
        country: c.country || '',
        flag: FLAGS[(c.country as string) || ''] || '🏳️',
        exchange: c.exchangeShortName || c.exchange || '',
      };
    });

    const result = {
      companies,
      lastUpdated: new Date().toISOString(),
      source: 'Financial Modeling Prep',
    };

    cacheData = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch FMP data' }, /* graceful */);
  }
}
