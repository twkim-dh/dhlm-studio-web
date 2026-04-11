import type { Metadata } from 'next';
import Link from 'next/link';
import FearGreedDashboard from '@/components/FearGreedDashboard';

export const metadata: Metadata = {
  title: 'Fear & Greed Index — Live CNN Market Sentiment | DHLM Studio',
  description: 'Track the CNN Fear & Greed Index in real-time. 7 market indicators, historical chart, and Brutal Edge commentary on what extreme fear and extreme greed mean for the next move.',
  alternates: { canonical: 'https://dhlm-studio.com/markets/fear-and-greed' },
  openGraph: {
    title: 'CNN Fear & Greed Index — Live Market Sentiment',
    description: 'Real-time CNN Fear & Greed Index with the 7 sub-indicators that build it. Track sentiment extremes on DHLM Studio.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'CNN Fear & Greed Index — Live', description: 'Track CNN Fear & Greed Index sentiment in real-time.' },
};

export default function FearGreedPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/markets" style={{ fontSize: 12, color: '#64748B' }}>← Markets</Link>

        <div style={{ marginTop: 20, marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#A78BFA', letterSpacing: 3, marginBottom: 8 }}>📊 SENTIMENT GAUGE</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 12px', lineHeight: 1.2 }}>
            CNN Fear &amp; Greed Index
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#94A3B8', lineHeight: 1.7, margin: 0, maxWidth: 680 }}>
            The market&apos;s emotional temperature in a single number from 0 (extreme fear) to 100 (extreme greed). Built from 7 sub-indicators. Updated daily by CNN Business.
          </p>
        </div>

        <FearGreedDashboard />

        <section style={{ marginTop: 32, padding: '24px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', margin: '0 0 12px' }}>What is the Fear &amp; Greed Index?</h2>
          <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: '0 0 12px' }}>
            CNN Business publishes the Fear &amp; Greed Index daily as a composite score from 0 to 100. It measures how investors are feeling about the stock market — not what the market is doing, but what the market is afraid of doing.
          </p>
          <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: '0 0 12px' }}>
            The composite score is built from <strong style={{ color: '#E2E8F0' }}>7 sub-indicators</strong> that each measure a different dimension of market sentiment:
          </p>
          <ul style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.9, paddingLeft: 18, marginBottom: 14 }}>
            <li><strong style={{ color: '#E2E8F0' }}>Market Momentum</strong> — S&amp;P 500 vs its 125-day moving average</li>
            <li><strong style={{ color: '#E2E8F0' }}>Stock Price Strength</strong> — ratio of NYSE 52-week highs to lows</li>
            <li><strong style={{ color: '#E2E8F0' }}>Stock Price Breadth</strong> — McClellan Volume Summation</li>
            <li><strong style={{ color: '#E2E8F0' }}>Put/Call Options</strong> — 5-day average put/call ratio</li>
            <li><strong style={{ color: '#E2E8F0' }}>Market Volatility</strong> — VIX vs its 50-day moving average</li>
            <li><strong style={{ color: '#E2E8F0' }}>Safe Haven Demand</strong> — 20-day stock returns minus bond returns</li>
            <li><strong style={{ color: '#E2E8F0' }}>Junk Bond Demand</strong> — yield spread between junk bonds and treasuries</li>
          </ul>
          <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, margin: 0 }}>
            Data provided by CNN Business. <Link href="/research/fear-greed-index-stock-prediction" style={{ color: '#3B82F6' }}>Read our deep dive on whether this index actually predicts returns →</Link>
          </p>
        </section>

        <p style={{ fontSize: 10, color: '#334155', textAlign: 'center', marginTop: 20 }}>
          Sentiment data is for informational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}
