// /api/markets/top20 — Redis snapshot read for home page market leaders.
//
// Price + changePercent from market:snapshot:* (written by daily cron).
// marketCapFmt from static baseline — not live but accurate enough for rank ordering.
// Zero FMP calls.

import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import type { MarketSnapshot } from '@/app/api/cron/market-snapshot/route';

export const dynamic = 'force-dynamic';

const TOP20_META: { ticker: string; name: string; sector: string; marketCap: number }[] = [
  { ticker: 'NVDA',  name: 'NVIDIA',          sector: 'Technology',         marketCap: 4_200_000_000_000 },
  { ticker: 'AAPL',  name: 'Apple',            sector: 'Technology',         marketCap: 3_800_000_000_000 },
  { ticker: 'MSFT',  name: 'Microsoft',        sector: 'Technology',         marketCap: 3_000_000_000_000 },
  { ticker: 'GOOGL', name: 'Alphabet',         sector: 'Communication',      marketCap: 3_600_000_000_000 },
  { ticker: 'AMZN',  name: 'Amazon',           sector: 'Consumer Cyclical',  marketCap: 2_300_000_000_000 },
  { ticker: 'META',  name: 'Meta',             sector: 'Communication',      marketCap: 1_700_000_000_000 },
  { ticker: 'TSLA',  name: 'Tesla',            sector: 'Consumer Cyclical',  marketCap: 1_500_000_000_000 },
  { ticker: 'AVGO',  name: 'Broadcom',         sector: 'Technology',         marketCap: 1_700_000_000_000 },
  { ticker: 'LLY',   name: 'Eli Lilly',        sector: 'Healthcare',         marketCap:   780_000_000_000 },
  { ticker: 'JPM',   name: 'JPMorgan',         sector: 'Financial',          marketCap:   850_000_000_000 },
  { ticker: 'V',     name: 'Visa',             sector: 'Financial',          marketCap:   620_000_000_000 },
  { ticker: 'MA',    name: 'Mastercard',       sector: 'Financial',          marketCap:   450_000_000_000 },
  { ticker: 'WMT',   name: 'Walmart',          sector: 'Consumer Defensive', marketCap:   680_000_000_000 },
  { ticker: 'XOM',   name: 'ExxonMobil',       sector: 'Energy',             marketCap:   510_000_000_000 },
  { ticker: 'UNH',   name: 'UnitedHealth',     sector: 'Healthcare',         marketCap:   450_000_000_000 },
  { ticker: 'JNJ',   name: 'Johnson & J.',     sector: 'Healthcare',         marketCap:   380_000_000_000 },
  { ticker: 'ORCL',  name: 'Oracle',           sector: 'Technology',         marketCap:   480_000_000_000 },
  { ticker: 'BAC',   name: 'Bank of America',  sector: 'Financial',          marketCap:   330_000_000_000 },
  { ticker: 'GE',    name: 'GE Aerospace',     sector: 'Industrials',        marketCap:   220_000_000_000 },
  { ticker: 'CVX',   name: 'Chevron',          sector: 'Energy',             marketCap:   280_000_000_000 },
];

function fmtCap(v: number): string {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9)  return `$${(v / 1e9).toFixed(0)}B`;
  return `$${(v / 1e6).toFixed(0)}M`;
}

export async function GET() {
  try {
    const redis = getRedis();

    const latestDate = await redis.get('market:snapshot:latest');
    if (!latestDate) {
      // No snapshot yet — return static metadata with zero prices so UI renders
      const stocks = TOP20_META.map(s => ({
        ticker: s.ticker, name: s.name, sector: s.sector,
        price: 0, change: 0,
        marketCap: s.marketCap, marketCapFmt: fmtCap(s.marketCap),
        image: `https://financialmodelingprep.com/image-stock/${s.ticker}.png`,
      }));
      return NextResponse.json({ stocks, stale: true });
    }

    const raw = await redis.get(`market:snapshot:${latestDate}`);
    if (!raw) {
      const stocks = TOP20_META.map(s => ({
        ticker: s.ticker, name: s.name, sector: s.sector,
        price: 0, change: 0,
        marketCap: s.marketCap, marketCapFmt: fmtCap(s.marketCap),
        image: `https://financialmodelingprep.com/image-stock/${s.ticker}.png`,
      }));
      return NextResponse.json({ stocks, stale: true });
    }

    const snapshot = JSON.parse(raw) as MarketSnapshot;
    const priceMap = new Map(snapshot.top30.map(s => [s.symbol, s]));

    const stocks = TOP20_META.map(s => {
      const live = priceMap.get(s.ticker);
      return {
        ticker: s.ticker,
        name: s.name,
        sector: s.sector,
        price: live?.price ?? 0,
        change: live?.changePercent ?? 0,
        marketCap: s.marketCap,
        marketCapFmt: fmtCap(s.marketCap),
        image: `https://financialmodelingprep.com/image-stock/${s.ticker}.png`,
      };
    });

    return NextResponse.json({ stocks, tradingDate: snapshot.tradingDate, asOf: snapshot.asOf });
  } catch {
    const stocks = TOP20_META.map(s => ({
      ticker: s.ticker, name: s.name, sector: s.sector,
      price: 0, change: 0,
      marketCap: s.marketCap, marketCapFmt: fmtCap(s.marketCap),
      image: `https://financialmodelingprep.com/image-stock/${s.ticker}.png`,
    }));
    return NextResponse.json({ stocks, stale: true });
  }
}
