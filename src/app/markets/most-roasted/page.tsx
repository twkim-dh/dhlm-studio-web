import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Most Roasted Stocks This Week — Brutal AI Leaderboard | DHLM Studio',
  description: 'Which stocks got destroyed the most by Brutal AI? Live leaderboard of the most roasted tickers on DHLM Studio.',
};

// Simulated data — seed-based so it's consistent per day
function generateLeaderboard() {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const stocks = [
    { ticker: 'TSLA', name: 'Tesla', roasts: 4827 + (seed % 500), topRoast: 'DOWN again? Elon, focus on the CARS.', hilarious: 2100, true_: 1400, rude: 892, fair: 534 },
    { ticker: 'NVDA', name: 'NVIDIA', roasts: 3421 + (seed % 400), topRoast: 'P/E of 65? SIXTY-FIVE?', hilarious: 1800, true_: 987, rude: 312, fair: 324 },
    { ticker: 'GME', name: 'GameStop', roasts: 2156 + (seed % 300), topRoast: 'Still holding? REALLY?', hilarious: 1200, true_: 456, rude: 234, fair: 266 },
    { ticker: 'PLTR', name: 'Palantir', roasts: 1987 + (seed % 250), topRoast: 'Spy tech at 165x earnings. GENIUS.', hilarious: 1100, true_: 387, rude: 278, fair: 222 },
    { ticker: 'AAPL', name: 'Apple', roasts: 1654 + (seed % 200), topRoast: 'Same phone. Every. Year.', hilarious: 890, true_: 367, rude: 198, fair: 199 },
    { ticker: 'AMC', name: 'AMC Entertainment', roasts: 1432 + (seed % 180), topRoast: 'Movies are dying. So is this stock.', hilarious: 780, true_: 312, rude: 189, fair: 151 },
    { ticker: 'META', name: 'Meta', roasts: 1298 + (seed % 160), topRoast: '$36B on virtual LEGS.', hilarious: 720, true_: 278, rude: 156, fair: 144 },
    { ticker: 'COIN', name: 'Coinbase', roasts: 1087 + (seed % 140), topRoast: 'Crypto casino with extra steps.', hilarious: 610, true_: 234, rude: 132, fair: 111 },
    { ticker: 'RIVN', name: 'Rivian', roasts: 956 + (seed % 120), topRoast: 'More losses than cars produced.', hilarious: 540, true_: 198, rude: 118, fair: 100 },
    { ticker: 'SNAP', name: 'Snap', roasts: 823 + (seed % 100), topRoast: 'Disappearing messages, disappearing revenue.', hilarious: 460, true_: 167, rude: 98, fair: 98 },
  ];
  return stocks;
}

function fmtK(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n); }

export default function MostRoasted() {
  const stocks = generateLeaderboard();
  const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 6 }}>🔥 MOST ROASTED · THIS WEEK</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Most Roasted Stocks</h1>
          </div>
          <Link href="/markets" style={{ fontSize: 12, color: '#64748B' }}>← Markets</Link>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          <Link href="/markets/roast-portfolio" style={{ fontSize: 11, color: '#C73E3A', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🔥 Roast My Portfolio</Link>
          <Link href="/markets/most-blessed" style={{ fontSize: 11, color: '#D4A843', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🪷 Most Blessed</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stocks.map((s, i) => (
            <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ ...card, padding: '16px 18px', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 900, color: i < 3 ? '#C73E3A' : '#475569', width: 28, textAlign: 'center' }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 800, color: '#60A5FA' }}>{s.ticker}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{s.name}</span>
                    <span style={{ fontSize: 10, color: '#C73E3A' }}>{'🔥'.repeat(Math.min(Math.ceil((stocks.length - i) / 2), 5))}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic', margin: '4px 0 6px' }}>&ldquo;{s.topRoast}&rdquo;</p>
                  <div style={{ display: 'flex', gap: 8, fontSize: 10, color: '#475569' }}>
                    <span>😂 {fmtK(s.hilarious)}</span>
                    <span>🎯 {fmtK(s.true_)}</span>
                    <span>😤 {fmtK(s.rude)}</span>
                    <span>🤔 {fmtK(s.fair)}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800, color: '#E2E8F0' }}>{fmtK(s.roasts)}</div>
                  <div style={{ fontSize: 9, color: '#475569' }}>roasts</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/markets/roast-portfolio" style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #C73E3A, #EF4444)', color: '#fff', fontSize: 14, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>🔥 Get YOUR stocks roasted →</Link>
        </div>
      </div>
    </div>
  );
}
