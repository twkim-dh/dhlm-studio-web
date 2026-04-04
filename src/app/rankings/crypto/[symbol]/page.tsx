import type { Metadata } from 'next';
import Link from 'next/link';
import { TOP_CRYPTOS } from '@/data/top-cryptos';
import LikeButton from '@/components/LikeButton';
import BrutalCryptoRoast from '@/components/BrutalCryptoRoast';

const YEAR = new Date().getFullYear();

export function generateStaticParams() {
  return TOP_CRYPTOS.map(id => ({ symbol: id }));
}

async function fetchCoinData(id: string) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
      { next: { revalidate: 300 } } // 5 min ISR
    );
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  const coin = await fetchCoinData(symbol);
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
  const coin = await fetchCoinData(symbol);

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
  const ath = md?.ath?.usd || 0;
  const athDate = md?.ath_date?.usd ? new Date(md.ath_date.usd).toLocaleDateString('en-US') : '';
  const rank = coin.market_cap_rank || '?';
  const desc = coin.description?.en?.replace(/<[^>]+>/g, '').slice(0, 500) || '';
  const isUp = change24h >= 0;

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
          <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE — CoinGecko</span>
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

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'Market Cap', value: fmtUsd(mcap) },
            { label: '24h Volume', value: fmtUsd(vol24h) },
            { label: '7d Change', value: `${change7d >= 0 ? '+' : ''}${change7d.toFixed(1)}%`, color: change7d >= 0 ? '#00D474' : '#FF4545' },
            { label: '30d Change', value: `${change30d >= 0 ? '+' : ''}${change30d.toFixed(1)}%`, color: change30d >= 0 ? '#00D474' : '#FF4545' },
            { label: 'All-Time High', value: fmtPrice(ath) },
            { label: 'ATH Date', value: athDate },
          ].map(m => (
            <div key={m.label} style={{ ...card, padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>{m.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: ('color' in m && m.color) || '#E2E8F0', fontFamily: 'var(--mono)', marginTop: 4 }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {desc && (
          <div style={{ ...card, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 8 }}>ABOUT {coin.name?.toUpperCase()}</div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>{desc}{desc.length >= 500 ? '...' : ''}</p>
          </div>
        )}

        {/* Brutal AI Roast */}
        <BrutalCryptoRoast symbol={symbol} />

        {/* Internal Links */}
        <div style={{ ...card, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 10 }}>EXPLORE MORE</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link href="/rankings/crypto" style={{ fontSize: 11, color: '#F59E0B', padding: '4px 10px', borderRadius: 6, background: '#F59E0B10', border: '1px solid #F59E0B20' }}>All Crypto Rankings</Link>
            <Link href="/markets" style={{ fontSize: 11, color: '#60A5FA', padding: '4px 10px', borderRadius: 6, background: '#3B82F610', border: '1px solid #3B82F620' }}>Stock Markets</Link>
            <Link href="/rankings" style={{ fontSize: 11, color: '#D4A843', padding: '4px 10px', borderRadius: 6, background: '#D4A84310', border: '1px solid #D4A84320' }}>World Rankings</Link>
            <Link href="/blog" style={{ fontSize: 11, color: '#A78BFA', padding: '4px 10px', borderRadius: 6, background: '#A78BFA10', border: '1px solid #A78BFA20' }}>Analysis Blog</Link>
          </div>
        </div>

        <p style={{ fontSize: 10, color: '#334155', textAlign: 'center', lineHeight: 1.6 }}>
          Cryptocurrency data from CoinGecko. NOT financial advice. Always DYOR.
        </p>
      </div>
    </div>
  );
}
