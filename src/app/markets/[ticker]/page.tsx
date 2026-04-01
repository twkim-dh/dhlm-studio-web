import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { stocks, getStockByTicker } from '@/data/markets';
import { TOP_STOCKS } from '@/data/top-stocks';

const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';
const YEAR = new Date().getFullYear();

// ISR: don't pre-build any stock pages at build time (saves 1000+ FMP API calls)
// Pages are generated on first visit and cached for 1 hour
export function generateStaticParams() {
  // Only pre-build the 10 hardcoded stocks (no API calls needed)
  return stocks.map(s => ({ ticker: s.ticker.toLowerCase() }));
}

// Allow any ticker to be dynamically rendered on first visit
export const dynamicParams = true;

// Revalidate every hour — balances freshness vs API usage
export const revalidate = 3600;

async function fetchLiveData(ticker: string) {
  if (!FMP_KEY) return null;
  try {
    const [profileRes, finRes] = await Promise.all([
      fetch(`${FMP_BASE}/profile?symbol=${ticker.toUpperCase()}&apikey=${FMP_KEY}`, { next: { revalidate: 3600 } }),
      fetch(`${FMP_BASE}/income-statement?symbol=${ticker.toUpperCase()}&period=annual&limit=1&apikey=${FMP_KEY}`, { next: { revalidate: 86400 } }),
    ]);
    const profileData = await profileRes.json();
    const finData = await finRes.json();
    const p = Array.isArray(profileData) && profileData[0] ? profileData[0] : null;
    const f = Array.isArray(finData) && finData[0] ? finData[0] : null;
    if (!p) return null;
    const mc = p.marketCap as number || 0;
    return {
      ticker: p.symbol || ticker.toUpperCase(),
      name: p.companyName || ticker.toUpperCase(),
      price: p.price || 0,
      change: p.changes ? ((p.changes / (p.price - p.changes)) * 100) : 0,
      cap: mc >= 1e12 ? `$${(mc / 1e12).toFixed(2)}T` : mc >= 1e9 ? `$${(mc / 1e9).toFixed(0)}B` : `$${(mc / 1e6).toFixed(0)}M`,
      sector: p.sector || '',
      industry: p.industry || '',
      description: p.description || '',
      ceo: p.ceo || '',
      employees: p.fullTimeEmployees ? Number(p.fullTimeEmployees).toLocaleString() + '+' : '',
      hq: [p.city, p.state, p.country].filter(Boolean).join(', '),
      website: p.website ? (p.website as string).replace(/^https?:\/\//, '') : '',
      image: p.image || '',
      range52w: p.range || '',
      exchange: p.exchangeShortName || p.exchange || '',
      pe: p.peRatio ? String(Number(p.peRatio).toFixed(1)) : 'N/A',
      revenue: f?.revenue ? (f.revenue >= 1e9 ? `$${(f.revenue / 1e9).toFixed(0)}B` : `$${(f.revenue / 1e6).toFixed(0)}M`) : '',
      netIncome: f?.netIncome ? (f.netIncome >= 1e9 ? `$${(f.netIncome / 1e9).toFixed(1)}B` : `$${(f.netIncome / 1e6).toFixed(0)}M`) : '',
      eps: f?.epsDiluted ? `$${Number(f.epsDiluted).toFixed(2)}` : '',
      live: true,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  const live = await fetchLiveData(ticker);
  const stock = live || getStockByTicker(ticker);
  if (!stock) return { title: `${ticker.toUpperCase()} — Stock Profile ${YEAR}` };
  return {
    title: `${stock.ticker} — ${stock.name} Stock Price & Analysis ${YEAR}`,
    description: `${stock.name} (${stock.ticker}) stock price $${typeof stock.price === 'number' ? stock.price.toFixed(2) : stock.price}, market cap ${stock.cap}. Real-time data, company profile, key metrics. ${YEAR}.`,
    keywords: [stock.ticker, stock.name, 'stock price', 'market cap', `${stock.ticker} stock ${YEAR}`],
  };
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default async function StockPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const live = await fetchLiveData(ticker);
  const staticStock = getStockByTicker(ticker);
  // Fallback for ANY ticker when FMP is rate-limited or data unavailable
  const minimalStock = {
    ticker: ticker.toUpperCase(), name: ticker.toUpperCase(), price: 0, change: 0,
    cap: '', sector: '', description: `Stock profile for ${ticker.toUpperCase()}. Live data is temporarily unavailable — it will load automatically when the data source refreshes. Try again in a few minutes.`,
    pe: '', revenue: '', ceo: '', hq: '', employees: '', website: '',
  };
  const stock = live || staticStock || minimalStock;

  const isLive = 'live' in stock && stock.live;
  const isUp = (stock.change || 0) >= 0;
  const changeStr = typeof stock.change === 'number' ? `${isUp ? '+' : ''}${stock.change.toFixed(1)}%` : '';
  const priceStr = typeof stock.price === 'number' ? `$${stock.price.toFixed(2)}` : `$${stock.price}`;

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${stock.name} (${stock.ticker})`,
    description: stock.description || `${stock.name} stock profile`,
    url: `https://dhlm-studio.com/markets/${ticker}`,
    provider: { '@type': 'Organization', name: 'DHLM Studio' },
  };

  // Build metrics array from available data
  const metrics: { label: string; value: string }[] = [];
  if (stock.cap) metrics.push({ label: 'Market Cap', value: stock.cap });
  if (stock.pe && stock.pe !== 'N/A') metrics.push({ label: 'P/E Ratio', value: stock.pe });
  if (stock.revenue) metrics.push({ label: 'Revenue', value: stock.revenue });
  if ('netIncome' in stock && stock.netIncome) metrics.push({ label: 'Net Income', value: stock.netIncome as string });
  if ('eps' in stock && stock.eps) metrics.push({ label: 'EPS', value: stock.eps as string });
  if (stock.ceo) metrics.push({ label: 'CEO', value: stock.ceo });
  if ('employees' in stock && stock.employees) metrics.push({ label: 'Employees', value: stock.employees as string });
  if ('hq' in stock && stock.hq) metrics.push({ label: 'HQ', value: stock.hq as string });
  if ('exchange' in stock && stock.exchange) metrics.push({ label: 'Exchange', value: stock.exchange as string });
  if ('range52w' in stock && stock.range52w) metrics.push({ label: '52W Range', value: stock.range52w as string });
  if ('website' in stock && stock.website) metrics.push({ label: 'Website', value: stock.website as string });
  if ('founded' in stock && stock.founded) metrics.push({ label: 'Founded', value: String(stock.founded) });

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/markets" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Markets</Link>
          {isLive && <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE — FMP</span>}
        </div>

        {/* Header */}
        <div style={{ marginTop: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {'image' in stock && stock.image && (
              <Image src={stock.image as string} alt={stock.name || stock.ticker} width={36} height={36} style={{ borderRadius: 8 }} unoptimized />
            )}
            <span style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 800, color: '#60A5FA' }}>{stock.ticker}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>{stock.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 36, fontWeight: 900, color: '#F1F5F9' }}>{priceStr}</span>
            {changeStr && (
              <span style={{ fontSize: 16, fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: isUp ? '#00D4741A' : '#FF45451A', color: isUp ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>{changeStr}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {'tags' in stock && (stock.tags as string[])?.map((t: string) => (
              <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: '#6B728014', color: '#6B7280', fontFamily: 'var(--mono)' }}>{t}</span>
            ))}
            {stock.sector && <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--sans)', padding: '4px 0' }}>· {stock.sector}</span>}
            {'industry' in stock && stock.industry && <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--sans)', padding: '4px 0' }}>· {stock.industry as string}</span>}
          </div>
        </div>

        {/* Catalyst (static stocks only) */}
        {'catalyst' in stock && stock.catalyst && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 8 }}>WHY IT MOVED</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#E2E8F0', lineHeight: 1.7, margin: 0 }}>{stock.catalyst as string}</p>
          </div>
        )}

        {/* Company Overview */}
        {stock.description && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 8 }}>COMPANY OVERVIEW</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>{stock.description}</p>
          </div>
        )}

        {/* Key Metrics */}
        {metrics.length > 0 && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 12 }}>KEY METRICS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {metrics.map(m => (
                <div key={m.label} style={{ padding: '10px 0', borderBottom: '1px solid #1E293B' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>{m.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color: '#E2E8F0', marginTop: 2 }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internal Links */}
        <div style={{ ...card, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 10 }}>EXPLORE MORE</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link href="/markets" style={{ fontSize: 11, color: '#60A5FA', padding: '4px 10px', borderRadius: 6, background: '#3B82F610', border: '1px solid #3B82F620' }}>Today&apos;s Top Movers</Link>
            <Link href="/markets/sectors" style={{ fontSize: 11, color: '#60A5FA', padding: '4px 10px', borderRadius: 6, background: '#3B82F610', border: '1px solid #3B82F620' }}>Sector Heatmap</Link>
            <Link href="/rankings" style={{ fontSize: 11, color: '#D4A843', padding: '4px 10px', borderRadius: 6, background: '#D4A84310', border: '1px solid #D4A84320' }}>Company Rankings</Link>
            <Link href="/rankings/crypto" style={{ fontSize: 11, color: '#F59E0B', padding: '4px 10px', borderRadius: 6, background: '#F59E0B10', border: '1px solid #F59E0B20' }}>Crypto Rankings</Link>
            <Link href="/blog" style={{ fontSize: 11, color: '#A78BFA', padding: '4px 10px', borderRadius: 6, background: '#A78BFA10', border: '1px solid #A78BFA20' }}>Market Analysis</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: 24, lineHeight: 1.6, textAlign: 'center' }}>
          Market data is for informational purposes only and does not constitute investment advice.<br />
          Past performance is not indicative of future results. Always do your own research.
        </p>
      </div>
    </div>
  );
}
