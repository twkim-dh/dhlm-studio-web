import type { Metadata } from 'next';
import Link from 'next/link';
import { TOP_CRYPTOS } from '@/data/top-cryptos';
import LikeButton from '@/components/LikeButton';
import CandlestickChart from '@/components/CandlestickChart';
import { getCoinDetail, getCoinOHLC } from '@/lib/coingecko';

const YEAR = new Date().getFullYear();

// Pre-render only top 20 at build time — the rest generate on first visit (ISR).
// This limits build-time CoinGecko calls to 20 instead of 100+.
export function generateStaticParams() {
  return TOP_CRYPTOS.slice(0, 20).map(id => ({ symbol: id }));
}

export const dynamicParams = true; // other coins rendered on-demand

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  const coin = await getCoinDetail(symbol);
  const name = coin?.name || symbol;
  const price = coin?.market_data?.current_price?.usd;
  return {
    title: `${name} Price & Analysis ${YEAR} | Crypto Rankings`,
    description: `${name} cryptocurrency: ${price ? `$${price.toLocaleString()}` : 'live price'}, market cap, 24h change, and analysis. ${YEAR}.`,
  };
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default async function CryptoDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const coin = await getCoinDetail(symbol);

  if (!coin) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28 }}>Crypto Not Found</h1>
        <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>Data for &ldquo;{symbol}&rdquo; is unavailable.</p>
        <Link href="/rankings/crypto" style={{ color: '#F59E0B', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← Crypto Rankings</Link>
      </div>
    );
  }

  const md = coin.market_data;
  const price = md?.current_price?.usd || 0;
  const change24h = md?.price_change_percentage_24h || 0;
  const change7d = md?.price_change_percentage_7d || 0;
  const change30d = md?.price_change_percentage_30d || 0;
  const mcap = md?.market_cap?.usd || 0;
  const vol24h = md?.total_volume?.usd || 0;
  const high24h = md?.high_24h?.usd || 0;
  const low24h  = md?.low_24h?.usd || 0;
  const ath = md?.ath?.usd || 0;
  const athDate = md?.ath_date?.usd ? new Date(md.ath_date.usd).toLocaleDateString('en-US') : '';
  const athChangePct = md?.ath_change_percentage?.usd || 0;
  const circSupply = md?.circulating_supply || 0;
  const totalSupply = md?.total_supply || 0;
  const rank = coin.market_cap_rank || '?';
  const desc = coin.description?.en?.replace(/<[^>]+>/g, '').slice(0, 500) || '';
  const isUp = change24h >= 0;

  // Brutal Edge Take (rule-based)
  function cryptoTake(): string {
    const parts: string[] = [];
    if (change24h > 10)      parts.push('Double-digit move in 24 hours. Sharp rally — watch volume for conviction.');
    else if (change24h > 5)  parts.push('Strong session. Momentum is building, but crypto moves fast in both directions.');
    else if (change24h > 2)  parts.push('Solid 24h gain. Not decisive on its own — context matters.');
    else if (change24h > 0)  parts.push('Modest green. Nothing to act on yet.');
    else if (change24h > -2) parts.push('Mild weakness. No alarm — within normal volatility range.');
    else if (change24h > -5) parts.push('Meaningful drop. Check if BTC-wide or coin-specific.');
    else if (change24h > -10)parts.push('Significant selling pressure. Support levels being tested.');
    else                      parts.push('Heavy 24h selling. Risk-off or specific catalyst — verify before acting.');
    if (change7d > 20)  parts.push(' 7-day trend is strongly bullish.');
    else if (change7d < -20) parts.push(' 7-day trend is sharply negative — broader trend under pressure.');
    if (price > 0 && ath > 0 && (price / ath) > 0.95) parts.push(' Trading near all-time high.');
    else if (ath > 0 && athChangePct < -80) parts.push(' More than 80% below ATH — deep in drawdown territory.');
    return parts.join('');
  }
  const beTake = cryptoTake();

  // Related coins (top coins from list, exclude current)
  const relatedCoins = TOP_CRYPTOS.filter(id => id !== symbol).slice(0, 6);

  // Fetch 30-day OHLC for candlestick chart — fail gracefully
  const ohlcPoints = await getCoinOHLC(symbol, 30).catch(() => []);

  const fmtUsd = (n: number) => n >= 1e12 ? `$${(n/1e12).toFixed(2)}T` : n >= 1e9 ? `$${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(0)}M` : `$${n.toLocaleString()}`;
  const fmtPrice = (n: number) => n >= 1000 ? `$${n.toLocaleString(undefined, {maximumFractionDigits:0})}` : n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(6)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${coin.name} (${coin.symbol?.toUpperCase()})`,
    description: desc.slice(0, 200),
    url: `https://dhlm-studio.com/rankings/crypto/${symbol}`,
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/rankings/crypto" style={{ fontSize: 12, color: '#64748B' }}>← Crypto Rankings</Link>
          <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: coin.stale ? '#47556918' : '#00D47418', color: coin.stale ? '#94A3B8' : '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>
            {coin.stale ? '● Data may be delayed' : '● LIVE — CoinGecko'}
          </span>
        </div>

        {/* Header */}
        <div style={{ marginTop: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {coin.image?.small && <img src={coin.image.small} alt="" width={36} height={36} style={{ borderRadius: 8 }} />}
            <span style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 800, color: '#F59E0B' }}>{coin.symbol?.toUpperCase()}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>{coin.name}</span>
            <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--mono)' }}>Rank #{rank}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 36, fontWeight: 900, color: '#F1F5F9' }}>{fmtPrice(price)}</span>
            <span style={{ fontSize: 16, fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: isUp ? '#00D4741A' : '#FF45451A', color: isUp ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>
              {isUp ? '+' : ''}{change24h.toFixed(1)}%
            </span>
          </div>
          <div style={{ marginTop: 8 }}><LikeButton pageId={`crypto-${symbol}`} /></div>
        </div>

        {/* ③ Key Metrics table */}
        <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 12 }}>KEY METRICS</div>
          {([
            ['Market Cap',       fmtUsd(mcap),                '24h Volume',    fmtUsd(vol24h)],
            ['24h High',         fmtPrice(high24h),            '24h Low',       fmtPrice(low24h)],
            ['7d Change',        `${change7d >= 0 ? '+' : ''}${change7d.toFixed(1)}%`, '30d Change', `${change30d >= 0 ? '+' : ''}${change30d.toFixed(1)}%`],
            ['All-Time High',    fmtPrice(ath),                'ATH Date',      athDate],
            ['vs ATH',           `${athChangePct.toFixed(1)}%`, 'Rank',          `#${rank}`],
            ...(circSupply ? [['Circulating Supply', `${(circSupply / 1e6).toFixed(1)}M`, 'Total Supply', totalSupply ? `${(totalSupply / 1e6).toFixed(1)}M` : '—']] : []),
          ] as string[][]).map((row, i) => {
            const c7d = row[0] === '7d Change' ? (change7d >= 0 ? '#00D474' : '#FF4545') : undefined;
            const c30d = row[2] === '30d Change' ? (change30d >= 0 ? '#00D474' : '#FF4545') : undefined;
            const cAth = row[0] === 'vs ATH' ? '#F59E0B' : undefined;
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: i < 5 ? '1px solid #1E293B40' : 'none', padding: '8px 0' }}>
                <div style={{ padding: '0 4px' }}>
                  <div style={{ fontSize: 11, color: '#475569' }}>{row[0]}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c7d || cAth || '#E2E8F0', fontFamily: 'var(--mono)' }}>{row[1]}</div>
                </div>
                <div style={{ padding: '0 4px' }}>
                  <div style={{ fontSize: 11, color: '#475569' }}>{row[2]}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c30d || '#E2E8F0', fontFamily: 'var(--mono)' }}>{row[3]}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Candlestick chart */}
        {ohlcPoints.length > 0 && (
          <div style={{ ...card, padding: '16px 12px 8px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 4, paddingLeft: 4 }}>CANDLESTICK CHART</div>
            <CandlestickChart coinId={symbol} initialCandles={ohlcPoints} />
          </div>
        )}

        {/* Description */}
        {desc && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 8 }}>ABOUT {coin.name?.toUpperCase()}</div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>{desc}{desc.length >= 500 ? '...' : ''}</p>
          </div>
        )}

        {/* ④ Brutal Edge Take */}
        {beTake && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16, borderColor: '#C73E3A20' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>🔥 BRUTAL EDGE TAKE</div>
            <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, margin: 0 }}>{beTake}</p>
            <p style={{ fontSize: 9, color: '#475569', margin: '10px 0 0' }}>Informational and educational. NOT financial advice.</p>
          </div>
        )}

        {/* ⑥ Related Coins */}
        {relatedCoins.length > 0 && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 12 }}>RELATED COINS</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {relatedCoins.map(id => (
                <Link key={id} href={`/rankings/crypto/${id}`} style={{ padding: '8px 14px', borderRadius: 8, background: '#0D1117', border: '1px solid #1E293B', textDecoration: 'none' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', fontFamily: 'var(--mono)' }}>
                    {id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 16)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Internal Links */}
        <div style={{ ...card, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 10 }}>EXPLORE MORE</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link href="/rankings/crypto" style={{ fontSize: 11, color: '#F59E0B', padding: '4px 10px', borderRadius: 6, background: '#F59E0B10', border: '1px solid #F59E0B20' }}>All Crypto Rankings</Link>
            <Link href="/crypto-101" style={{ fontSize: 11, color: '#A78BFA', padding: '4px 10px', borderRadius: 6, background: '#A78BFA10', border: '1px solid #A78BFA20' }}>📚 Crypto 101</Link>
            <Link href="/markets" style={{ fontSize: 11, color: '#60A5FA', padding: '4px 10px', borderRadius: 6, background: '#3B82F610', border: '1px solid #3B82F620' }}>Stock Markets</Link>
            <Link href="/rankings" style={{ fontSize: 11, color: '#D4A843', padding: '4px 10px', borderRadius: 6, background: '#D4A84310', border: '1px solid #D4A84320' }}>World Rankings</Link>
          </div>
        </div>

        <p style={{ fontSize: 10, color: '#334155', textAlign: 'center', lineHeight: 1.6 }}>
          Cryptocurrency data from CoinGecko. NOT financial advice. Always DYOR.
        </p>
      </div>
    </div>
  );
}
