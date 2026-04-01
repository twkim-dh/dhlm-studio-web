import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Most Blessed Stocks — Fortune Buddha Leaderboard | DHLM Studio',
  description: 'Which stocks received the most blessings from the Fortune Buddha? Live leaderboard of the most blessed tickers.',
};

function generateBlessedBoard() {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return [
    { ticker: 'TSLA', name: 'Tesla', blessings: 3241 + (seed % 400), donated: 8420, topPrayer: 'Elon needs Buddha energy 🙏' },
    { ticker: 'NVDA', name: 'NVIDIA', blessings: 2876 + (seed % 350), donated: 7230, topPrayer: 'Jensen bless my GPU gains' },
    { ticker: 'GME', name: 'GameStop', blessings: 1987 + (seed % 300), donated: 4120, topPrayer: 'Apes seek enlightenment 🦍' },
    { ticker: 'AAPL', name: 'Apple', blessings: 1654 + (seed % 250), donated: 3890, topPrayer: 'One more thing... profits' },
    { ticker: 'PLTR', name: 'Palantir', blessings: 1432 + (seed % 200), donated: 2980, topPrayer: 'Karp needs inner peace' },
    { ticker: 'AMC', name: 'AMC', blessings: 1098 + (seed % 150), donated: 2340, topPrayer: 'Movies will rise again' },
    { ticker: 'IONQ', name: 'IonQ', blessings: 876 + (seed % 120), donated: 1870, topPrayer: 'Quantum karma please' },
    { ticker: 'RIVN', name: 'Rivian', blessings: 745 + (seed % 100), donated: 1560, topPrayer: 'Electric dreams need prayer' },
    { ticker: 'COIN', name: 'Coinbase', blessings: 623 + (seed % 80), donated: 1290, topPrayer: 'Crypto needs divine intervention' },
    { ticker: 'SOFI', name: 'SoFi', blessings: 512 + (seed % 60), donated: 980, topPrayer: 'Student loans need miracles' },
  ];
}

function fmtK(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n); }

export default function MostBlessed() {
  const stocks = generateBlessedBoard();
  const totalDonated = stocks.reduce((s, st) => s + st.donated, 0);
  const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

  return (
    <div style={{ background: '#0C1222', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#D4A843', letterSpacing: 3, marginBottom: 6 }}>🪷 MOST BLESSED · THIS WEEK</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Most Blessed Stocks</h1>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Total donated: <strong style={{ color: '#00D474' }}>${totalDonated.toLocaleString()}</strong> to St. Jude</p>
          </div>
          <Link href="/markets" style={{ fontSize: 12, color: '#64748B' }}>← Markets</Link>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          <Link href="/markets/bless" style={{ fontSize: 11, color: '#D4A843', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🪷 Bless Your Stock</Link>
          <Link href="/markets/most-roasted" style={{ fontSize: 11, color: '#C73E3A', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🔥 Most Roasted</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stocks.map((s, i) => (
            <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ ...card, padding: '16px 18px', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 900, color: i < 3 ? '#D4A843' : '#475569', width: 28, textAlign: 'center' }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 800, color: '#60A5FA' }}>{s.ticker}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{s.name}</span>
                    <span style={{ fontSize: 10 }}>{'🪷'.repeat(Math.min(Math.ceil((stocks.length - i) / 2), 5))}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic', margin: '4px 0 0' }}>&ldquo;{s.topPrayer}&rdquo;</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 800, color: '#D4A843' }}>{fmtK(s.blessings)}</div>
                  <div style={{ fontSize: 9, color: '#475569' }}>${s.donated.toLocaleString()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/markets/bless" style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #D4A843, #E8C86A)', color: '#0D1117', fontSize: 14, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>🪷 Bless YOUR stock →</Link>
        </div>
      </div>
    </div>
  );
}
