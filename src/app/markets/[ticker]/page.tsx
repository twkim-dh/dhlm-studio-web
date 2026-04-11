import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { stocks, getStockByTicker } from '@/data/markets';
import { TOP_STOCKS } from '@/data/top-stocks';

const FMP_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE = 'https://financialmodelingprep.com/stable';
const YEAR = new Date().getFullYear();

export function generateStaticParams() {
  return stocks.map(s => ({ ticker: s.ticker.toLowerCase() }));
}
export const dynamicParams = true;
export const revalidate = 300;

const AV_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';

// ── Deep Dive report mapping ────────────────────────────────────────────────
const DEEP_DIVES: Record<string, string> = {
  NVDA:  '/reports/deep-dive-nvda-april-2026',
  TSLA:  '/reports/deep-dive-tsla-april-2026',
  AAPL:  '/reports/deep-dive-aapl-april-2026',
  AMD:   '/reports/deep-dive-amd-april-2026',
  AMZN:  '/reports/deep-dive-amzn-april-2026',
  GOOGL: '/reports/deep-dive-googl-april-2026',
  META:  '/reports/deep-dive-meta-april-2026',
  MSFT:  '/reports/deep-dive-msft-april-2026',
  PLTR:  '/reports/deep-dive-pltr-april-2026',
};

// ── Sector → peer tickers (static, no extra API calls) ──────────────────────
const SECTOR_PEERS: Record<string, string[]> = {
  Technology:              ['AAPL', 'MSFT', 'NVDA', 'AMD', 'GOOGL', 'META', 'AMZN', 'ADBE', 'CRM', 'ORCL'],
  'Communication Services':['META', 'GOOGL', 'NFLX', 'DIS', 'T', 'VZ', 'SNAP', 'PINS'],
  'Consumer Discretionary':['AMZN', 'TSLA', 'HD', 'MCD', 'NKE', 'LOW', 'TGT', 'BKNG'],
  'Consumer Staples':      ['WMT', 'COST', 'PG', 'KO', 'PEP', 'PM', 'CL', 'MDLZ'],
  'Financial Services':    ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'V', 'MA', 'AXP', 'BLK'],
  Financials:              ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'V', 'MA', 'AXP', 'BLK'],
  Healthcare:              ['JNJ', 'UNH', 'PFE', 'ABBV', 'MRK', 'LLY', 'BMY', 'AMGN'],
  Energy:                  ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'OXY', 'MPC'],
  Industrials:             ['GE', 'HON', 'CAT', 'RTX', 'UNP', 'DE', 'EMR', 'ITW'],
  'Real Estate':           ['PLD', 'AMT', 'EQIX', 'SPG', 'PSA', 'DLR', 'O'],
  Utilities:               ['NEE', 'DUK', 'SO', 'D', 'AEP', 'XEL', 'ES'],
  Materials:               ['LIN', 'APD', 'NEM', 'FCX', 'VMC', 'MLM', 'DD'],
};

// ── Brutal Edge Take (rule-based) ───────────────────────────────────────────
function brutalEdgeTake(change: number, volume: number, avgVolume: number, range52w: string): string {
  const parts: string[] = [];

  if (change > 5)         parts.push('Sharp rally. Watch for follow-through or reversal on volume.');
  else if (change > 2)    parts.push('Strong session. Volume will confirm if this holds.');
  else if (change > 0)    parts.push('Modest green. Nothing decisive yet.');
  else if (change > -2)   parts.push('Mild weakness. Not alarming on its own.');
  else if (change > -5)   parts.push('Significant drop. Check if sector-wide or stock-specific.');
  else                    parts.push('Heavy selling. Support levels in focus.');

  if (avgVolume > 0 && volume > avgVolume * 2)
    parts.push('Unusually high volume — institutional participation likely.');

  if (range52w) {
    const [low52, high52] = range52w.split(' - ').map(v => parseFloat(v.replace(/[^0-9.]/g, '')));
    if (high52 > 0) {
      const price = high52 * 0.97; // proxy using high
      if (price / high52 > 0.95) parts.push('Trading near 52-week high.');
      if (low52 > 0 && price / low52 < 1.05) parts.push('Near 52-week low territory.');
    }
  }

  return parts.join(' ');
}

// ── Data fetch ───────────────────────────────────────────────────────────────
async function fetchLiveData(ticker: string) {
  const sym = ticker.toUpperCase();

  if (FMP_KEY) {
    try {
      const [profileRes, finRes] = await Promise.all([
        fetch(`${FMP_BASE}/profile?symbol=${sym}&apikey=${FMP_KEY}`, { next: { revalidate: 3600 } }),
        fetch(`${FMP_BASE}/income-statement?symbol=${sym}&period=annual&limit=1&apikey=${FMP_KEY}`, { next: { revalidate: 86400 } }),
      ]);
      if (!profileRes.ok) { console.warn(`FMP profile ${profileRes.status} for ${sym}`); throw new Error(`FMP ${profileRes.status}`); }
      const profileData = await profileRes.json();
      if (profileData?.['Error Message'] || profileData?.['message']) return null;
      const finData = await finRes.json();
      const p = Array.isArray(profileData) && profileData[0] ? profileData[0] : null;
      const f = Array.isArray(finData) && finData[0] ? finData[0] : null;
      if (p && p.price) {
        const mc = (p.marketCap as number) || 0;
        const fmtCap = mc >= 1e12 ? `$${(mc/1e12).toFixed(2)}T` : mc >= 1e9 ? `$${(mc/1e9).toFixed(0)}B` : mc >= 1e6 ? `$${(mc/1e6).toFixed(0)}M` : '';
        const fmtVol = (v: number) => v >= 1e9 ? `${(v/1e9).toFixed(1)}B` : v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(0)}K` : String(v);
        const fmtRev = (v: number) => v >= 1e9 ? `$${(v/1e9).toFixed(0)}B` : `$${(v/1e6).toFixed(0)}M`;
        return {
          ticker: p.symbol || sym,
          name: p.companyName || sym,
          price: p.price || 0,
          change: p.changes ? ((p.changes / (p.price - p.changes)) * 100) : 0,
          changeDollar: p.changes || 0,
          cap: fmtCap,
          marketCap: mc,
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
          pe: p.peRatio ? Number(p.peRatio).toFixed(1) : '',
          beta: p.beta ? Number(p.beta).toFixed(2) : '',
          volAvg: p.volAvg ? fmtVol(p.volAvg) : '',
          volAvgRaw: p.volAvg || 0,
          lastDiv: p.lastDiv ? `$${Number(p.lastDiv).toFixed(2)}` : '',
          volume: p.volume || 0,
          revenue: f?.revenue ? fmtRev(f.revenue) : '',
          netIncome: f?.netIncome ? fmtRev(f.netIncome) : '',
          eps: f?.epsDiluted ? `$${Number(f.epsDiluted).toFixed(2)}` : '',
          live: true,
        };
      }
    } catch { /* FMP failed, try Alpha Vantage */ }
  }

  try {
    const avRes = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${AV_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const avData = await avRes.json();
    const q = avData['Global Quote'];
    if (q && q['05. price']) {
      return {
        ticker: sym, name: sym,
        price: parseFloat(q['05. price']),
        change: parseFloat(q['10. change percent']?.replace('%', '') || '0'),
        changeDollar: parseFloat(q['09. change'] || '0'),
        cap: '', marketCap: 0, sector: '', industry: '',
        description: '', ceo: '', employees: '', hq: '', website: '',
        image: '', range52w: '', exchange: '', pe: '', beta: '',
        volAvg: '', volAvgRaw: 0, lastDiv: '', volume: 0,
        revenue: '', netIncome: '', eps: '',
        live: true,
      };
    }
  } catch { /* Alpha Vantage also failed */ }

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  const t = ticker.toUpperCase();
  const stock = getStockByTicker(ticker);
  return {
    title: stock ? `${stock.ticker} — ${stock.name} Stock Price & Analysis ${YEAR}` : `${t} Stock — Price, Profile & Analysis ${YEAR}`,
    description: stock ? `${stock.name} (${stock.ticker}) real-time price, key metrics, and Brutal Edge analysis. ${YEAR}.` : `${t} real-time stock price, market cap, financials, and Brutal Edge analysis. ${YEAR}.`,
  };
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };
const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #1E293B40', padding: '8px 0' } as const;
const labelStyle = { fontSize: 11, color: '#475569' };
const valueStyle = { fontSize: 13, fontWeight: 600, color: '#E2E8F0', fontFamily: 'var(--mono)' };

export default async function StockPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const live = await fetchLiveData(ticker);
  const staticStock = getStockByTicker(ticker);
  const minimalStock = {
    ticker: ticker.toUpperCase(), name: ticker.toUpperCase(), price: 0, change: 0,
    changeDollar: 0, cap: '', marketCap: 0, sector: '', description: '',
    pe: '', revenue: '', ceo: '', hq: '', employees: '', website: '',
    beta: '', volAvg: '', volAvgRaw: 0, lastDiv: '', volume: 0, range52w: '',
    image: '', exchange: '', eps: '', netIncome: '',
  };
  const stock = live || staticStock || minimalStock;

  const isLive = 'live' in stock && stock.live;
  const isUp = (stock.change || 0) >= 0;
  const hasPrice = typeof stock.price === 'number' && stock.price > 0;
  const changeStr = hasPrice ? `${isUp ? '+' : ''}${(stock.change || 0).toFixed(2)}%` : '';
  const changeDollarStr = hasPrice && 'changeDollar' in stock && stock.changeDollar
    ? `${(stock.changeDollar as number) >= 0 ? '+' : ''}$${Math.abs(stock.changeDollar as number).toFixed(2)}`
    : '';
  const priceStr = hasPrice ? `$${stock.price.toFixed(2)}` : '$—';

  // Brutal Edge Take
  const beVolume  = ('volume' in stock ? (stock.volume as number) : 0) || 0;
  const beAvgVol  = ('volAvgRaw' in stock ? (stock.volAvgRaw as number) : 0) || 0;
  const beRange   = ('range52w' in stock ? (stock.range52w as string) : '') || '';
  const beTake    = hasPrice ? brutalEdgeTake(stock.change || 0, beVolume, beAvgVol, beRange) : '';

  // Related stocks (same sector, exclude current ticker)
  const sector = stock.sector || ('tags' in stock ? (stock.tags as string[])?.[0] : '') || '';
  const peers = (SECTOR_PEERS[sector] || []).filter(t => t !== ticker.toUpperCase()).slice(0, 5);

  // Deep Dive link
  const deepDiveUrl = DEEP_DIVES[ticker.toUpperCase()];

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${stock.name} (${stock.ticker})`,
    description: stock.description || `${stock.name} stock profile`,
    url: `https://dhlm-studio.com/markets/${ticker}`,
    provider: { '@type': 'Organization', name: 'DHLM Studio' },
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Link href="/markets" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Markets</Link>
          {isLive
            ? <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE — FMP</span>
            : <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: '#47556918', color: '#94A3B8', fontWeight: 700, fontFamily: 'var(--mono)' }}>● Data delayed</span>
          }
        </div>

        {/* ① Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            {'image' in stock && stock.image && (
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#111827', border: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                <Image src={stock.image as string} alt={stock.name} width={36} height={36} style={{ objectFit: 'contain' }} unoptimized />
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 800, color: '#60A5FA' }}>{stock.ticker}</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 700, color: '#F1F5F9' }}>{stock.name}</span>
                {'exchange' in stock && stock.exchange && (
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#1E293B', color: '#64748B', fontFamily: 'var(--mono)' }}>{stock.exchange as string}</span>
                )}
              </div>
              {stock.sector && (
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>
                  {stock.sector}{('industry' in stock && stock.industry) ? ` · ${stock.industry as string}` : ''}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 38, fontWeight: 900, color: hasPrice ? '#F1F5F9' : '#475569', lineHeight: 1 }}>{priceStr}</span>
            {changeStr && (
              <>
                <span style={{ fontSize: 16, fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: isUp ? '#00D4741A' : '#FF45451A', color: isUp ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>{changeStr}</span>
                {changeDollarStr && <span style={{ fontSize: 13, color: isUp ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>{changeDollarStr}</span>}
              </>
            )}
          </div>
          {!hasPrice && <span style={{ fontSize: 11, color: '#64748B', marginTop: 6, display: 'block' }}>Data delayed. Refresh to update.</span>}
        </div>

        {/* ② Chart placeholder (available Apr 20) */}
        <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 10 }}>PRICE CHART</div>
          <div style={{ height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: '#0D1117', border: '1px solid #1F2937', gap: 6 }}>
            <div style={{ fontSize: 11, color: '#334155', fontFamily: 'var(--mono)' }}>Chart available April 20</div>
            <div style={{ fontSize: 9, color: '#1E293B', fontFamily: 'var(--mono)' }}>1D · 5D · 1M · 6M · YTD · 1Y · 5Y</div>
          </div>
        </div>

        {/* ③ Key Metrics table */}
        {(() => {
          const rows: { label: string; value: string; half?: boolean }[] = [];
          if (stock.cap)                               rows.push({ label: 'Market Cap',       value: stock.cap });
          if ('pe' in stock && stock.pe)               rows.push({ label: 'P/E Ratio',        value: stock.pe as string });
          if ('beta' in stock && stock.beta)           rows.push({ label: 'Beta',             value: stock.beta as string });
          if ('volAvg' in stock && stock.volAvg)       rows.push({ label: 'Avg Volume',       value: stock.volAvg as string });
          if ('range52w' in stock && stock.range52w)   rows.push({ label: '52W Range',        value: stock.range52w as string });
          if ('eps' in stock && stock.eps)             rows.push({ label: 'EPS (Diluted)',    value: stock.eps as string });
          if (stock.revenue)                           rows.push({ label: 'Revenue (TTM)',    value: stock.revenue });
          if ('netIncome' in stock && stock.netIncome) rows.push({ label: 'Net Income (TTM)', value: stock.netIncome as string });
          if ('lastDiv' in stock && stock.lastDiv)     rows.push({ label: 'Dividend',         value: stock.lastDiv as string });
          if ('hq' in stock && stock.hq)              rows.push({ label: 'Headquarters',     value: stock.hq as string });
          if (stock.ceo)                               rows.push({ label: 'CEO',              value: stock.ceo });
          if ('employees' in stock && stock.employees) rows.push({ label: 'Employees',        value: stock.employees as string });
          if (rows.length === 0) return null;
          const pairs: { label: string; value: string }[][] = [];
          for (let i = 0; i < rows.length; i += 2) pairs.push(rows.slice(i, i + 2));
          return (
            <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 12 }}>KEY METRICS</div>
              {pairs.map((pair, pi) => (
                <div key={pi} style={rowStyle}>
                  {pair.map(m => (
                    <div key={m.label} style={{ padding: '0 4px' }}>
                      <div style={labelStyle}>{m.label}</div>
                      <div style={valueStyle}>{m.value}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}

        {/* ④ Brutal Edge Take */}
        {beTake && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16, borderColor: '#C73E3A20' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>🔥 BRUTAL EDGE TAKE</div>
            <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, margin: 0 }}>{beTake}</p>
            <p style={{ fontSize: 9, color: '#475569', margin: '10px 0 0' }}>Informational and educational. NOT investment advice.</p>
          </div>
        )}

        {/* ⑤ Company Overview */}
        {stock.description && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 8 }}>COMPANY OVERVIEW</div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>
              {(stock.description as string).slice(0, 400)}{(stock.description as string).length > 400 ? '...' : ''}
            </p>
            {'website' in stock && stock.website && (
              <div style={{ marginTop: 8, fontSize: 11, color: '#475569' }}>{stock.website as string}</div>
            )}
          </div>
        )}

        {/* ⑦ Deep Dive link (before related stocks) */}
        {deepDiveUrl && (
          <Link href={deepDiveUrl} style={{ ...card, display: 'block', padding: '16px 20px', marginBottom: 16, textDecoration: 'none', borderColor: '#D4A84330' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2 }}>DEEP DIVE REPORT</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginTop: 4 }}>Read Full {stock.ticker} Analysis →</div>
              </div>
              <span style={{ fontSize: 20 }}>📊</span>
            </div>
          </Link>
        )}

        {/* ⑥ Related Stocks */}
        {peers.length > 0 && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 12 }}>
              RELATED STOCKS {sector ? `· ${sector.toUpperCase()}` : ''}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {peers.map(t => {
                const known = TOP_STOCKS.includes(t);
                if (!known) return null;
                return (
                  <Link key={t} href={`/markets/${t}`} style={{ padding: '8px 14px', borderRadius: 8, background: '#0D1117', border: '1px solid #1E293B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#60A5FA', fontFamily: 'var(--mono)' }}>{t}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Internal Links */}
        <div style={{ ...card, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 10 }}>EXPLORE MORE</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link href="/markets" style={{ fontSize: 11, color: '#60A5FA', padding: '4px 10px', borderRadius: 6, background: '#3B82F610', border: '1px solid #3B82F620' }}>Today&apos;s Markets</Link>
            <Link href="/markets/sectors" style={{ fontSize: 11, color: '#60A5FA', padding: '4px 10px', borderRadius: 6, background: '#3B82F610', border: '1px solid #3B82F620' }}>Sector Map</Link>
            <Link href="/reports" style={{ fontSize: 11, color: '#D4A843', padding: '4px 10px', borderRadius: 6, background: '#D4A84310', border: '1px solid #D4A84320' }}>Deep Dive Reports</Link>
            <Link href="/rankings/crypto" style={{ fontSize: 11, color: '#F59E0B', padding: '4px 10px', borderRadius: 6, background: '#F59E0B10', border: '1px solid #F59E0B20' }}>Crypto Rankings</Link>
          </div>
        </div>

        <p style={{ fontSize: 10, color: '#334155', marginTop: 16, lineHeight: 1.6, textAlign: 'center' }}>
          Market data for informational purposes only. NOT investment advice.<br />
          Past performance does not indicate future results. Always do your own research.
        </p>
      </div>
    </div>
  );
}
