'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StockLogo from '@/components/StockLogo';
import ReactionButtons from '@/components/ReactionButtons';

interface Mover {
  rank: number; ticker: string; name: string; price: number; change: number; volume: number;
  sector?: string; industry?: string; exchange?: string; ceo?: string; employees?: string;
  description?: string; image?: string; marketCap?: number; marketCapFmt?: string; range52w?: string;
  revenue?: string; netIncome?: string; eps?: string | number;
}

interface IndexItem { symbol: string; label: string; price: number; pct: number; }
interface TopStock { ticker: string; name: string; price: number; change: number; marketCap: number; marketCapFmt: string; sector?: string; image?: string; }

type TabId = 'gainers' | 'losers' | 'actives';

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateRoast(s: Mover): { roast: string; rating: string; ratingColor: string; emoji: string } {
  const abs = Math.abs(s.change).toFixed(0);
  const name = s.name || s.ticker;
  const cap = s.marketCapFmt ? ` Cap: ${s.marketCapFmt}.` : '';

  if (s.change < -30) return { rating: 'DISASTER', ratingColor: '#FF4545', emoji: '💀', roast: pickRandom([
    `DOWN ${abs}%? That's not a dip — that's a CLIFF. ${name} just fell off a building and everyone's saying "buy the dip." You know what happens when you catch a FALLING KNIFE? You get CUT. The smart money LEFT yesterday. TOTAL DISASTER.`,
    `${name} lost ${abs}% in ONE DAY. I've seen buildings demolished slower than this. The CEO is probably updating their LinkedIn RIGHT NOW. If you bought this morning, I genuinely feel sorry for you. TRULY INCREDIBLE destruction of wealth.`,
    `${abs}% down? Listen, I've bankrupted casinos and even I wouldn't touch ${name} right now. This isn't a stock — it's a CRIME SCENE. Somebody call the SEC because shareholders just got ROBBED in broad daylight.`,
    `${name} dropping ${abs}% is like watching a plane crash in slow motion — everyone sees it, nobody can stop it. The INSIDERS sold last week. You're not buying the dip, you're buying the GRAVE. I've seen better investments in LOTTERY TICKETS.`,
    `MINUS ${abs} PERCENT. That's not a pullback, that's a FUNERAL. ${name} is DONE. The board is panicking, the shorts are FEASTING, and retail investors are holding bags heavier than my gold-plated toilet. PATHETIC.`,
  ]) };

  if (s.change < -15) return { rating: 'RUN', ratingColor: '#FF4545', emoji: '🏃', roast: pickRandom([
    `${name} dropped ${abs}% and people are PANICKING. But is it justified? ABSOLUTELY. When a stock drops this much, it's not "on sale" — it's BROKEN. Something is VERY wrong and the insiders already knew. RUN.`,
    `${name} down ${abs}%. You know who's NOT panicking? The executives who sold their shares LAST MONTH. They knew. They ALWAYS know. Meanwhile you're sitting there thinking "maybe it'll bounce back." It WON'T.`,
    `NEGATIVE ${abs}%? ${name} is bleeding like a stuck pig and the analysts are STILL saying "hold." These are the same geniuses who rated Enron a BUY. When the ship is sinking, you don't rearrange the deck chairs — you SWIM.`,
  ]) };

  if (s.change > 100) return { rating: 'CASINO', ratingColor: '#FF4545', emoji: '🎲', roast: pickRandom([
    `Up ${s.change.toFixed(0)}%? I've made better deals buying BUILDINGS. ${name} just went VERTICAL and everyone's rushing in like Black Friday at Walmart. This is a CASINO, not investing. MASSIVELY DANGEROUS.`,
    `${name} gained ${s.change.toFixed(0)}% and Wall Street Bets is having a PARTY. But you know what happens after every party? THE HANGOVER. This stock went from "nobody cares" to "everybody's a genius" in one day. That's not investing — that's GAMBLING with extra steps.`,
  ]) };

  if (s.change > 30) return { rating: 'OVERHYPED', ratingColor: '#FF4545', emoji: '🔥', roast: pickRandom([
    `${name} surged ${abs}%. TREMENDOUS move. But when EVERYONE is buying, the smart people SELL. Pure MOMENTUM, not fundamentals. Hot things COOL DOWN. Every single time.`,
    `${abs}% up? ${name} is HOTTER than my Mar-a-Lago steak right now. But here's what they don't tell you on CNBC — for every person celebrating gains, there's a short seller planning the COUNTERATTACK. Gravity is UNDEFEATED.`,
    `${name} just popped ${abs}%. Beautiful. Magnificent. And completely UNSUSTAINABLE. I've seen this movie a THOUSAND times. Act one: euphoria. Act two: "it's different this time." Act three: "I should've sold at the top." You're in act ONE.`,
  ]) };

  if (s.change > 15) return { rating: 'RISKY', ratingColor: '#F59E0B', emoji: '⚠️', roast: pickRandom([
    `${name} up ${abs}%. Nice. But ${abs}% in one day means SOMEBODY knows something you don't. Institutional money moves FIRST.${cap} You're not investing, you're HOPING.`,
    `${name} climbed ${abs}%. Not bad. But when I see a stock jump this much, my FIRST question is: what do the insiders know that I DON'T? Because in this market, information is POWER, and retail investors are always LAST to the party.`,
  ]) };

  if (s.change > 5) return { rating: 'DECENT', ratingColor: '#00D474', emoji: '👍', roast: pickRandom([
    `${name} gained ${abs}%. Solid, not spectacular. The real question: can they SUSTAIN this? History says probably not. DECENT play for the brave.`,
    `${name} up ${abs}%. That's what I call a RESPECTABLE day. Not gonna make you rich, not gonna make you poor. It's the stock market equivalent of a SOLID handshake — firm, confident, and forgettable by tomorrow.`,
    `Plus ${abs}% for ${name}. Decent. Not "quit your job" money, not "cry into your pillow" money. Just a nice, clean, modest gain. In THIS market? I'll take it. Sometimes boring is BEAUTIFUL.`,
  ]) };

  if (s.change < -5) return { rating: 'WATCH', ratingColor: '#F59E0B', emoji: '👀', roast: pickRandom([
    `${name} down ${Math.abs(s.change).toFixed(1)}%. Not GREAT, not TERRIBLE. Could be a buying opportunity, could be the START of something worse. Nobody knows. That's the honest truth.`,
    `${name} drops ${Math.abs(s.change).toFixed(1)}%. Is it a DIPPING sauce or is it actually ROTTING? Hard to tell. The optimists say "sale!" The realists say "there's a REASON." I say: wait for the EARNINGS call before you make any brave decisions.`,
  ]) };

  return { rating: 'BORING', ratingColor: '#6B7280', emoji: '😴', roast: pickRandom([
    `${name} moved ${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%. BORING. Your portfolio went from $10,000 to $10,${Math.abs(Math.round(s.change * 10))}. CONGRATULATIONS on your extra coffee.`,
    `${name}: ${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%. I've had ELEVATORS move more than this stock. If you're watching this ticker for excitement, might I suggest PAINT DRYING? It's faster.`,
    `${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}% for ${name}. That's not a stock movement, that's a ROUNDING ERROR. My accountants wouldn't even bother LOGGING this. Go outside. Touch grass.`,
  ]) };
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
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0D1117', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StockLogo src={s.image} ticker={s.ticker} size={26} />
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
              🔥 Get the Brutal Edge Take
            </button>
          ) : (
            <div style={{ background: '#C73E3A08', borderRadius: 12, border: '1px solid #C73E3A20', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', background: '#C73E3A10', borderBottom: '1px solid #C73E3A15', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{roast.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, fontFamily: 'var(--mono)' }}>BRUTAL EDGE TAKE</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5, background: `${roast.ratingColor}20`, color: roast.ratingColor, fontFamily: 'var(--mono)' }}>{roast.rating}</span>
              </div>
              <div style={{ padding: 14, opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.5s' }}>
                <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>"{roast.roast}"</p>
                <ReactionButtons ticker={s.ticker} />
              </div>
              <div style={{ padding: '8px 14px', borderTop: '1px solid #1F2937', background: '#0D111780' }}>
                <p style={{ fontSize: 8, color: '#475569', margin: 0, textAlign: 'center' }}>🤖 Informational and educational commentary. NOT investment advice.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function pctColor(pct: number) {
  if (pct >= 2)   return { bg: '#00944D', color: '#fff',    border: '#00D47460' };
  if (pct >= 0.5) return { bg: '#005C30', color: '#A7F3D0', border: '#00944D60' };
  if (pct > -0.5) return { bg: '#1E293B', color: '#94A3B8', border: '#334155' };
  if (pct > -2)   return { bg: '#7A2020', color: '#FECACA', border: '#B4303060' };
  return           { bg: '#B43030',       color: '#fff',    border: '#FF454560' };
}

function StockHeatmap({ stocks }: { stocks: TopStock[] }) {
  if (stocks.length === 0) return null;
  const totalSqrt = stocks.reduce((s, c) => s + Math.sqrt(Math.max(c.marketCap, 1)), 0);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, margin: '0 0 4px' }}>
      {stocks.map(s => {
        const pct = `${Math.max(3.5, Math.min(s.marketCap > 0 ? (Math.sqrt(s.marketCap) / totalSqrt) * 100 : 3.5, 22))}%`;
        const c = pctColor(s.change);
        return (
          <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{
            flexBasis: pct, flexGrow: 1, minWidth: 48, padding: '9px 6px',
            borderRadius: 6, background: c.bg, border: `1px solid ${c.border}`,
            textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: c.color, fontFamily: 'var(--mono)', lineHeight: 1 }}>{s.ticker}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: c.color, fontFamily: 'var(--mono)', marginTop: 2, opacity: 0.85 }}>
              {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function MoverColumn({ title, items, colorFn }: {
  title: string;
  items: Mover[];
  colorFn: (change: number) => string;
}) {
  const isGainers = title.includes('GAINER');
  const isLosers  = title.includes('LOSER');
  const headerColor = isGainers ? '#00D474' : isLosers ? '#FF4545' : '#60A5FA';
  const headerBg    = isGainers ? '#00D47410' : isLosers ? '#FF454510' : '#3B82F610';
  return (
    <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: headerBg, borderBottom: '1px solid #1E293B' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: headerColor, letterSpacing: 1.5 }}>{title}</div>
      </div>
      {items.map((s, i) => {
        const col = colorFn(s.change);
        return (
          <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: i < items.length - 1 ? '1px solid #1E293B40' : 'none' }}>
            <span style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)', width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
            <StockLogo src={s.image} ticker={s.ticker} size={20} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{s.ticker}</div>
              <div style={{ fontSize: 9, color: '#475569', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: col, fontFamily: 'var(--mono)' }}>
                {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
              </div>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function MarketsPage() {
  const [indices, setIndices] = useState<IndexItem[]>([]);
  const [top20, setTop20] = useState<TopStock[]>([]);
  const [data, setData] = useState<{ gainers: Mover[]; losers: Mover[]; actives: Mover[] }>({ gainers: [], losers: [], actives: [] });
  const [tab, setTab] = useState<TabId>('gainers');
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetch('/api/markets/indices')
      .then(r => r.json())
      .then(d => { if (d.indices?.length > 0) setIndices(d.indices); })
      .catch(() => {});

    fetch('/api/markets/top20')
      .then(r => r.json())
      .then(d => { if (d.stocks?.length > 0) setTop20(d.stocks); })
      .catch(() => {});

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

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 16px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 900, color: '#F1F5F9', margin: 0, lineHeight: 1.2 }}>Today's Markets</h1>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              {isLive && <span style={{ marginLeft: 8, fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Link href="/markets/search" style={{ fontSize: 11, padding: '7px 13px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', textDecoration: 'none' }}>🔍 Search</Link>
            <Link href="/markets/sectors" style={{ fontSize: 11, padding: '7px 13px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', color: '#94A3B8', textDecoration: 'none' }}>🗺️ Sectors</Link>
          </div>
        </div>

        {/* ① Index Bar */}
        {indices.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
            {indices.map(idx => {
              const up = idx.pct >= 0;
              return (
                <div key={idx.symbol} style={{ background: '#111827', borderRadius: 10, border: `1px solid ${up ? '#00D47420' : '#FF454520'}`, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--mono)', fontWeight: 700, marginBottom: 4 }}>{idx.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', fontFamily: 'var(--mono)' }}>{idx.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)', marginTop: 2 }}>
                    {up ? '+' : ''}{idx.pct.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {indices.length === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
            {['S&P 500', 'Nasdaq', 'Dow', 'Russell 2000'].map(label => (
              <div key={label} style={{ background: '#111827', borderRadius: 10, border: '1px solid #1E293B', padding: '12px 14px', opacity: 0.5 }}>
                <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--mono)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#334155', fontFamily: 'var(--mono)' }}>—</div>
              </div>
            ))}
          </div>
        )}

        {/* ② Market Cap Heatmap */}
        <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>TOP 20 BY MARKET CAP</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => setShowList(!showList)} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6, background: '#1E293B', border: '1px solid #334155', color: '#94A3B8', cursor: 'pointer', fontFamily: 'var(--mono)' }}>
                {showList ? 'Heatmap' : 'List'}
              </button>
            </div>
          </div>

          {top20.length > 0 ? (
            showList ? (
              <div>
                {top20.map((s, i) => {
                  const up = s.change >= 0;
                  return (
                    <Link key={s.ticker} href={`/markets/${s.ticker}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < top20.length - 1 ? '1px solid #1E293B40' : 'none', textDecoration: 'none' }}>
                      <div style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--mono)', width: 18, textAlign: 'right', flexShrink: 0 }}>{i + 1}</div>
                      <StockLogo src={s.image} ticker={s.ticker} size={22} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>{s.ticker}</div>
                        <div style={{ fontSize: 10, color: '#475569', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: up ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>{up ? '+' : ''}{s.change.toFixed(1)}%</div>
                      </div>
                      <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--mono)', width: 52, textAlign: 'right', flexShrink: 0 }}>{s.marketCapFmt}</div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <StockHeatmap stocks={top20} />
            )
          ) : (
            <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#334155' }}>Loading market data...</span>
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 9, color: '#334155', fontFamily: 'var(--mono)' }}>
            Tile size ∝ market cap · Color = daily change · Source: FMP · 5-min delay
          </div>
        </div>

        {/* ③ Gainers / Losers / Most Active — 3 columns */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#475569', textAlign: 'center', marginBottom: 12 }}>
          Market data delayed up to 15 min · Source: Alpha Vantage + FMP · Click any stock for full detail 🔥
        </div>

        {loading && <p style={{ fontSize: 13, color: '#64748B', textAlign: 'center', padding: 20 }}>Loading live data...</p>}

        {!loading && data.gainers.length === 0 && (
          <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: 40 }}>No data available. Try again later.</p>
        )}

        {data.gainers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            {/* Gainers */}
            <MoverColumn title="🟢 GAINERS" items={data.gainers.slice(0, 10)} colorFn={(c) => c >= 0 ? '#00D474' : '#FF4545'} />
            {/* Losers */}
            <MoverColumn title="🔴 LOSERS" items={data.losers.slice(0, 10)} colorFn={(c) => c >= 0 ? '#00D474' : '#FF4545'} />
            {/* Most Active */}
            <MoverColumn title="📊 MOST ACTIVE" items={data.actives.slice(0, 10)} colorFn={(c) => c >= 0 ? '#00D474' : '#FF4545'} />
          </div>
        )}

        {/* Expandable detail cards — tab toggle */}
        {data.gainers.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: '#111827', borderRadius: 10, padding: 3, border: '1px solid #1E293B' }}>
              {([
                { id: 'gainers' as TabId, label: '🟢 Gainers' },
                { id: 'losers' as TabId, label: '🔴 Losers' },
                { id: 'actives' as TabId, label: '📊 Most Active' },
              ]).map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
                  background: tab === t.id ? '#1E293B' : 'transparent',
                  color: tab === t.id ? '#F1F5F9' : '#6B7280',
                  fontSize: 12, fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--sans)',
                }}>{t.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data[tab].map(s => <StockCard key={s.ticker} s={s} />)}
            </div>
          </>
        )}

        {/* Footer links */}
        <div style={{ marginTop: 20, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { href: '/markets/most-roasted', label: '🏆 Most Roasted' },
            { href: '/markets/roast-portfolio', label: '🔥 Roast My Portfolio' },
            { href: '/markets/bless', label: '🙏 Bless My Stock' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 11, color: '#475569', padding: '6px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: '#C73E3A08', border: '1px solid #C73E3A10' }}>
          <p style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.7, textAlign: 'center', margin: 0 }}>
            🤖 BRUTAL EDGE is informational and educational. <strong style={{ color: '#C73E3A' }}>NOT investment advice</strong>. Data: Alpha Vantage + FMP. Prices may be delayed.
          </p>
        </div>
      </div>
    </div>
  );
}
