'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Mover {
  rank: number; ticker: string; name: string; price: number; change: number; volume: number;
  sector?: string; industry?: string; exchange?: string; ceo?: string; employees?: string;
  description?: string; image?: string; marketCap?: number; marketCapFmt?: string; range52w?: string;
  revenue?: string; netIncome?: string; eps?: string | number;
}

type TabId = 'gainers' | 'losers' | 'actives';

function generateRoast(s: Mover): { roast: string; rating: string; ratingColor: string; emoji: string } {
  const absChange = Math.abs(s.change);
  if (s.change < -30) return { roast: `DOWN ${absChange.toFixed(0)}%? That's not a dip — that's a CLIFF. ${s.name} just fell off a building and everyone's saying "buy the dip." You know what happens when you catch a FALLING KNIFE? You get CUT. The smart money LEFT yesterday. TOTAL DISASTER.`, rating: 'DISASTER', ratingColor: '#FF4545', emoji: '💀' };
  if (s.change < -15) return { roast: `${s.name} dropped ${absChange.toFixed(0)}% and people are PANICKING. But is it justified? ABSOLUTELY. When a stock drops this much, it's not "on sale" — it's BROKEN. Something is VERY wrong and the insiders already knew. RUN.`, rating: 'RUN', ratingColor: '#FF4545', emoji: '🏃' };
  if (s.change > 100) return { roast: `Up ${s.change.toFixed(0)}%? I've made better deals buying BUILDINGS. ${s.name} just went VERTICAL and everyone's rushing in like Black Friday at Walmart. This is a CASINO, not investing. MASSIVELY DANGEROUS.`, rating: 'CASINO', ratingColor: '#FF4545', emoji: '🎲' };
  if (s.change > 30) return { roast: `${s.name} surged ${s.change.toFixed(0)}%. TREMENDOUS move. But when EVERYONE is buying, the smart people SELL. Pure MOMENTUM, not fundamentals. Hot things COOL DOWN. Every single time.`, rating: 'OVERHYPED', ratingColor: '#FF4545', emoji: '🔥' };
  if (s.change > 15) return { roast: `${s.name} up ${s.change.toFixed(0)}%. Nice. But ${s.change.toFixed(0)}% in one day means SOMEBODY knows something you don't. Institutional money moves FIRST. ${s.marketCapFmt ? `Cap: ${s.marketCapFmt}.` : ''} You're not investing, you're HOPING.`, rating: 'RISKY', ratingColor: '#F59E0B', emoji: '⚠️' };
  if (s.change > 5) return { roast: `${s.name} gained ${s.change.toFixed(0)}%. Solid, not spectacular. The real question: can they SUSTAIN this? History says probably not. DECENT play for the brave.`, rating: 'DECENT', ratingColor: '#00D474', emoji: '👍' };
  if (s.change < -5) return { roast: `${s.name} down ${absChange.toFixed(1)}%. Not GREAT, not TERRIBLE. Could be a buying opportunity, could be the START of something worse. Nobody knows. That's the honest truth.`, rating: 'WATCH', ratingColor: '#F59E0B', emoji: '👀' };
  return { roast: `${s.name} moved ${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%. BORING. Your portfolio went from $10,000 to $10,${Math.abs(Math.round(s.change * 10))}. CONGRATULATIONS on your extra coffee.`, rating: 'BORING', ratingColor: '#6B7280', emoji: '😴' };
}

const cardStyle = { background: '#111827', borderRadius: 18, border: '1px solid #1E293B', overflow: 'hidden' as const };

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
  const isUp = s.change >= 0;

  return (
    <div style={cardStyle}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0D1117', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#60A5FA', fontFamily: 'var(--mono)' }}>
          {s.image ? <img src={s.image} alt="" width={26} height={26} style={{ borderRadius: 5 }} /> : s.ticker.slice(0, 4)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{s.name || s.ticker}</div>
          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>{s.ticker}{s.sector ? ` · ${s.sector}` : ''}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: isUp ? '#00D4741A' : '#FF45451A', color: isUp ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>
            {isUp ? '+' : ''}{s.change.toFixed(1)}%
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid #1F2937' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, margin: '14px 0' }}>
            {s.marketCapFmt && <MetricBox label="Mkt Cap" value={s.marketCapFmt} />}
            {s.revenue && <MetricBox label="Revenue" value={s.revenue} />}
            {s.netIncome && <MetricBox label="Net Inc" value={s.netIncome} />}
            {s.eps && <MetricBox label="EPS" value={`$${typeof s.eps === 'number' ? s.eps.toFixed(2) : s.eps}`} />}
            {s.volume > 0 && <MetricBox label="Volume" value={`${(s.volume / 1e6).toFixed(1)}M`} />}
            {s.employees && <MetricBox label="Staff" value={Number(s.employees).toLocaleString()} />}
            {s.range52w && <MetricBox label="52W" value={s.range52w} />}
            {s.exchange && <MetricBox label="Exch" value={s.exchange} />}
          </div>
          {s.description && (
            <div style={{ padding: '10px 12px', borderRadius: 8, background: '#0D1117', border: '1px solid #1F2937', marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{s.description}</p>
              {s.ceo && <p style={{ fontSize: 10, color: '#475569', margin: '4px 0 0' }}>CEO: {s.ceo}</p>}
            </div>
          )}
          {!showRoast ? (
            <button onClick={() => { setShowRoast(true); setTimeout(() => setRevealed(true), 300); }}
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg,#C73E3A,#E85D59)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              🔥 Get the Brutal AI Take
            </button>
          ) : (
            <div style={{ background: '#C73E3A08', borderRadius: 12, border: '1px solid #C73E3A20', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', background: '#C73E3A10', borderBottom: '1px solid #C73E3A15', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{roast.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, fontFamily: 'var(--mono)' }}>BRUTAL AI TAKE</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5, background: `${roast.ratingColor}20`, color: roast.ratingColor, fontFamily: 'var(--mono)' }}>{roast.rating}</span>
              </div>
              <div style={{ padding: 14, opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.5s' }}>
                <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>"{roast.roast}"</p>
                <div style={{ display: 'flex', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
                  {[{ e: '😂', l: 'Hilarious' }, { e: '🎯', l: 'True' }, { e: '😤', l: 'Rude' }, { e: '🤔', l: 'Fair' }].map(r => (
                    <button key={r.l} style={{ padding: '5px 10px', borderRadius: 16, background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                      {r.e} {r.l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '8px 14px', borderTop: '1px solid #1F2937', background: '#0D111780' }}>
                <p style={{ fontSize: 8, color: '#475569', margin: 0, textAlign: 'center' }}>🤖 Satirical AI. Entertainment only. NOT investment advice.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MarketsPage() {
  const [data, setData] = useState<{ gainers: Mover[]; losers: Mover[]; actives: Mover[] }>({ gainers: [], losers: [], actives: [] });
  const [tab, setTab] = useState<TabId>('gainers');
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/markets')
      .then(r => r.json())
      .then(d => {
        if (d.gainers?.length > 0) {
          setData({ gainers: d.gainers, losers: d.losers || [], actives: d.actives || [] });
          setIsLive(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = data[tab];

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>DHLM</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#C73E3A', letterSpacing: 2 }}>STUDIO</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--mono)' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {isLive && <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE</span>}
          </div>
        </div>

        {/* Banner */}
        <div style={{ padding: '16px 18px', borderRadius: 14, background: 'linear-gradient(135deg,#C73E3A10,#C73E3A05)', border: '1px solid #C73E3A15', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Today's Markets</h1>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#C73E3A', letterSpacing: 2, marginTop: 1 }}>BRUTAL AI COMMENTARY</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
            Click any stock → expand → hit <strong style={{ color: '#C73E3A' }}>"Brutal AI Take"</strong> for savage, unfiltered commentary.
          </p>
        </div>

        {/* Tabs: Gainers / Losers / Most Active */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#111827', borderRadius: 10, padding: 3, border: '1px solid #1E293B' }}>
          {([
            { id: 'gainers' as TabId, label: '🟢 Gainers', count: data.gainers.length },
            { id: 'losers' as TabId, label: '🔴 Losers', count: data.losers.length },
            { id: 'actives' as TabId, label: '📊 Most Active', count: data.actives.length },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
              background: tab === t.id ? '#1E293B' : 'transparent',
              color: tab === t.id ? '#F1F5F9' : '#6B7280',
              fontSize: 12, fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--sans)',
            }}>{t.label}{t.count > 0 ? ` (${t.count})` : ''}</button>
          ))}
        </div>

        {loading && <p style={{ fontSize: 13, color: '#64748B' }}>Loading live data...</p>}

        {/* Stock list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.length > 0 ? items.map(s => <StockCard key={s.ticker} s={s} />) : (
            !loading && <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: 40 }}>No data available. Try again later.</p>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 10, background: '#C73E3A08', border: '1px solid #C73E3A10' }}>
          <p style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.7, textAlign: 'center', margin: 0 }}>
            🤖 BRUTAL AI is satirical. <strong style={{ color: '#C73E3A' }}>NOT investment advice</strong>. Data: Alpha Vantage + FMP. Prices may be delayed.
          </p>
        </div>
      </div>
    </div>
  );
}
