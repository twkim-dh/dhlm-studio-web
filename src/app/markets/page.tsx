'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { stocks } from '@/data/markets';

interface Mover {
  rank: number; ticker: string; name: string; price: number; change: number; volume: number;
  sector?: string; industry?: string; exchange?: string; ceo?: string; employees?: string;
  description?: string; image?: string; marketCap?: number; marketCapFmt?: string; range52w?: string;
  revenue?: string; netIncome?: string; eps?: string | number;
  analysis?: { catalyst: string; outlook: string; signal: 'bullish' | 'bearish' | 'neutral' } | null;
}

// Pre-generated Brutal AI roasts (in production, generated per-stock from FMP data)
function generateRoast(s: Mover): { roast: string; rating: string; ratingColor: string; emoji: string } {
  const pe = s.marketCap && s.netIncome ? Math.round(s.marketCap / (parseFloat(s.netIncome.replace(/[$BMT,]/g, '')) * (s.netIncome.includes('B') ? 1e9 : s.netIncome.includes('M') ? 1e6 : 1))) : 0;

  if (s.change > 100) {
    return { roast: `Up ${s.change.toFixed(0)}%? ${s.change.toFixed(0)} PERCENT? I've made better deals buying BUILDINGS. ${s.name} just went vertical and everyone's rushing in like it's Black Friday at Walmart. When you see a stock up ${s.change.toFixed(0)}% in one day, that's not investing — that's a CASINO. And casinos always win. ALWAYS. The smart money is SELLING into this. MASSIVELY DANGEROUS.`, rating: 'CASINO', ratingColor: '#FF4545', emoji: '🎲' };
  }
  if (s.change > 30) {
    return { roast: `${s.name} surged ${s.change.toFixed(0)}% today. TREMENDOUS move — I'll give them that. But here's what nobody's telling you: when EVERYONE is buying, that's when the smart people SELL. This kind of move is PURE MOMENTUM, not fundamentals. ${s.sector || 'This sector'} is HOT right now, sure, but hot things COOL DOWN. Every single time. The question isn't IF it pulls back, it's WHEN. Proceed with EXTREME caution.`, rating: 'OVERHYPED', ratingColor: '#FF4545', emoji: '🔥' };
  }
  if (s.change > 15) {
    return { roast: `${s.name} up ${s.change.toFixed(0)}%. Nice move, very nice. ${s.ceo ? `${s.ceo} must be having a GREAT day.` : ''} But let me tell you something — ${s.change.toFixed(0)}% in one day means SOMEBODY knows something you don't. Institutional money moves FIRST, retail investors get the SCRAPS. ${s.marketCapFmt ? `Market cap of ${s.marketCapFmt}?` : ''} At these levels, you're not investing, you're HOPING. And hope is NOT a strategy.`, rating: 'RISKY', ratingColor: '#F59E0B', emoji: '⚠️' };
  }
  if (s.change > 8) {
    return { roast: `${s.name} gained ${s.change.toFixed(0)}% — solid move, not SPECTACULAR, but solid. ${s.sector === 'Technology' ? 'Tech stocks have been on a TEAR lately, and everyone thinks they\'re a genius.' : `${s.sector || 'This'} sector is seeing some interest.`} The real question is: can they SUSTAIN this? History says probably not. But what do I know? I only built a BILLION-dollar empire. DECENT play for the brave.`, rating: 'DECENT', ratingColor: '#00D474', emoji: '👍' };
  }
  return { roast: `${s.name} up ${s.change.toFixed(1)}%. Honestly? BORING. This is the kind of move that makes your portfolio go from $10,000 to $10,080. CONGRATULATIONS. You can now afford an extra coffee. ${s.sector || 'The market'} is doing its thing, nothing EXCITING here. Move along, folks. Nothing to see.`, rating: 'BORING', ratingColor: '#6B7280', emoji: '😴' };
}

const card = { background: '#111827', borderRadius: 18, border: '1px solid #1E293B', overflow: 'hidden' as const };

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '10px 8px', borderRadius: 10, background: '#0D1117', textAlign: 'center', border: '1px solid #1F2937' }}>
      <div style={{ fontSize: 9, color: '#6B7280', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', fontFamily: 'var(--mono)', marginTop: 3 }}>{value}</div>
    </div>
  );
}

function StockCard({ s }: { s: Mover }) {
  const [expanded, setExpanded] = useState(false);
  const [showRoast, setShowRoast] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const roast = generateRoast(s);

  return (
    <div style={card}>
      {/* Header — always visible */}
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#0D1117', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#60A5FA', fontFamily: 'var(--mono)' }}>
          {s.image ? <img src={s.image} alt="" width={28} height={28} style={{ borderRadius: 6 }} /> : s.ticker.slice(0, 4)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0' }}>{s.name || s.ticker}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{s.ticker} · {s.sector}{s.industry ? ` · ${s.industry}` : ''}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#F1F5F9', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
          <span style={{ display: 'inline-block', marginTop: 3, fontSize: 13, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: s.change >= 0 ? '#00D4741A' : '#FF45451A', color: s.change >= 0 ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>
            {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1F2937' }}>
          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, margin: '16px 0' }}>
            {s.marketCapFmt && <MetricBox label="Mkt Cap" value={s.marketCapFmt} />}
            {s.revenue && <MetricBox label="Revenue" value={s.revenue} />}
            {s.netIncome && <MetricBox label="Net Inc" value={s.netIncome} />}
            {s.eps && <MetricBox label="EPS" value={`$${typeof s.eps === 'number' ? s.eps.toFixed(2) : s.eps}`} />}
            {s.volume > 0 && <MetricBox label="Volume" value={`${(s.volume / 1e6).toFixed(1)}M`} />}
            {s.employees && <MetricBox label="Employees" value={Number(s.employees).toLocaleString()} />}
            {s.range52w && <MetricBox label="52W Range" value={s.range52w} />}
            {s.exchange && <MetricBox label="Exchange" value={s.exchange} />}
          </div>

          {/* Company desc */}
          {s.description && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1F2937', marginBottom: 14 }}>
              <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>{s.description}</p>
              {s.ceo && <p style={{ fontSize: 10, color: '#475569', marginTop: 6 }}>CEO: {s.ceo}</p>}
            </div>
          )}

          {/* Brutal AI Button or Roast */}
          {!showRoast ? (
            <button onClick={() => { setShowRoast(true); setTimeout(() => setRevealed(true), 300); }}
              style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'linear-gradient(135deg, #C73E3A, #E85D59)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px #C73E3A30' }}>
              <span style={{ fontSize: 18 }}>🔥</span> Get the Brutal AI Take
            </button>
          ) : (
            <div style={{ background: '#C73E3A08', borderRadius: 14, border: '1px solid #C73E3A20', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', background: '#C73E3A10', borderBottom: '1px solid #C73E3A15', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{roast.emoji}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, fontFamily: 'var(--mono)' }}>BRUTAL AI TAKE</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>{s.ticker} · {s.name}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 6, background: `${roast.ratingColor}20`, border: `1px solid ${roast.ratingColor}30`, color: roast.ratingColor, fontFamily: 'var(--mono)', letterSpacing: 1 }}>{roast.rating}</span>
              </div>

              <div style={{ padding: 16, opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.6s' }}>
                <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>"{roast.roast}"</p>

                <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                  {[{ e: '😂', l: 'Hilarious' }, { e: '🎯', l: 'So True' }, { e: '😤', l: 'Rude' }, { e: '🤔', l: 'Fair Point' }].map(r => (
                    <button key={r.l} style={{ padding: '6px 12px', borderRadius: 20, background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{r.e}</span> {r.l}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '10px 16px', borderTop: '1px solid #1F2937', background: '#0D111780' }}>
                <p style={{ fontSize: 9, color: '#475569', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                  🤖 AI-generated satirical commentary. Entertainment only, NOT investment advice.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MarketsPage() {
  const [movers, setMovers] = useState<Mover[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/markets')
      .then(r => r.json())
      .then(data => {
        if (data.movers?.length > 0) { setMovers(data.movers); setIsLive(true); }
        else { setMovers(stocks.map((s, i) => ({ rank: i + 1, ticker: s.ticker, name: s.name, price: s.price, change: s.change, volume: 0, sector: s.sector })) as Mover[]); }
      })
      .catch(() => { setMovers(stocks.map((s, i) => ({ rank: i + 1, ticker: s.ticker, name: s.name, price: s.price, change: s.change, volume: 0, sector: s.sector })) as Mover[]); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <Link href="/" style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>DHLM</Link>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#C73E3A', letterSpacing: 2 }}>STUDIO</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--mono)' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {isLive && <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE</span>}
          </div>
        </div>

        {/* Feature Banner */}
        <div style={{ padding: '18px 20px', borderRadius: 14, background: 'linear-gradient(135deg, #C73E3A10, #C73E3A05)', border: '1px solid #C73E3A15', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>🔥</span>
            <div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Today's Markets</h1>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#C73E3A', letterSpacing: 2, marginTop: 2 }}>NOW WITH BRUTAL AI COMMENTARY</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
            Click any stock → view the data → then hit <strong style={{ color: '#C73E3A' }}>"Get the Brutal AI Take"</strong> for an unfiltered AI roast. Savage, honest, and definitely not financial advice.
          </p>
        </div>

        {loading && <p style={{ fontSize: 13, color: '#64748B' }}>Loading live market data...</p>}

        {/* Stock Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {movers.map(s => <StockCard key={s.ticker} s={s} />)}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 24, padding: 20, borderRadius: 14, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>🤖</div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', margin: '0 0 4px' }}>Want the AI to roast YOUR stock?</p>
          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: '0 0 14px' }}>
            Coming soon: search any stock and get the brutal, unfiltered AI take.
          </p>
        </div>

        {/* Global Disclaimer */}
        <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 12, background: '#C73E3A08', border: '1px solid #C73E3A10' }}>
          <p style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.8, textAlign: 'center', margin: 0 }}>
            🤖 <strong style={{ color: '#94A3B8' }}>BRUTAL AI</strong> is a satirical AI character. All commentary is <strong style={{ color: '#94A3B8' }}>entertainment only</strong>.
            <br />This is <strong style={{ color: '#C73E3A' }}>NOT investment advice</strong>. DHLM Studio is not responsible for any investment decisions.
            <br />Data: Alpha Vantage + Financial Modeling Prep. Prices may be delayed up to 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
