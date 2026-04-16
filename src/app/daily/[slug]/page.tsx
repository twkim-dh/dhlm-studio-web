import type { Metadata } from 'next';
import Link from 'next/link';
import { getRedis } from '@/lib/redis';
import { fmtDateLong } from '@/lib/fmt-date';
import InlineSubscribe from '@/components/InlineSubscribe';
import GiscusComments from '@/components/GiscusComments';
import type { DailyBriefData } from '@/app/api/cron/daily-brief/route';

export const dynamic = 'force-dynamic';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Quote { symbol: string; price: number; change: number; changesPercentage: number }
interface CryptoPrice { id: string; price: number; change24h: number }

// ─── Data Loader ──────────────────────────────────────────────────────────────
async function getBrief(slug: string): Promise<DailyBriefData | null> {
  try {
    const redis = getRedis();
    const raw = await redis.get(`daily-brief:${slug}`);
    if (!raw) return null;
    return JSON.parse(raw) as DailyBriefData;
  } catch { return null; }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const d = await getBrief(slug);
  if (!d || d.status !== 'ok') {
    return { title: 'Daily Brief | DHLM Studio', robots: { index: false, follow: false } };
  }
  const sp = d.indices.find(q => q.symbol === '^GSPC');
  const vix = d.macro.find(q => q.symbol === '^VIX');
  const title = `Daily Brief — ${fmtDateLong(d.date)} | DHLM Studio`;
  const description = sp && vix
    ? `S&P 500 ${sp.changesPercentage > 0 ? '+' : ''}${sp.changesPercentage.toFixed(2)}% · VIX ${vix.price.toFixed(1)} · ${d.fearGreed.label}. Brutal Edge daily market brief — data-driven, zero hype.`
    : 'Brutal Edge daily market brief — data-driven, zero hype.';
  return {
    title,
    description,
    alternates: { canonical: `https://dhlm-studio.com/daily/${slug}` },
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────
const SYMBOL_LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500', '^IXIC': 'Nasdaq', '^DJI': 'Dow Jones',
  '^VIX': 'VIX', 'GCUSD': 'Gold', 'CLUSD': 'Oil (WTI)', '^TNX': '10Y Yield',
};
const CRYPTO_LABELS: Record<string, string> = { bitcoin: 'Bitcoin', ethereum: 'Ethereum' };

function fmtPct(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
}
function pctColor(n: number): string {
  return n > 0 ? '#00D474' : n < 0 ? '#C73E3A' : '#94A3B8';
}

// ─── Section 1: The Number ────────────────────────────────────────────────────
function getTheNumber(d: DailyBriefData): {
  label: string; value: string; change: string; color: string; context: string
} {
  const sp   = d.indices.find(q => q.symbol === '^GSPC');
  const vix  = d.macro.find(q => q.symbol === '^VIX');
  const btc  = d.crypto.find(c => c.id === 'bitcoin');

  if (vix && vix.price > 30) {
    return {
      label: 'VIX (Fear Index)', value: vix.price.toFixed(2),
      change: fmtPct(vix.changesPercentage), color: '#C73E3A',
      context: `Elevated volatility regime. Options traders pricing in ±${(vix.price / Math.sqrt(252)).toFixed(1)}% daily S&P moves.`,
    };
  }
  const bigIdx = d.indices.length
    ? d.indices.reduce((a, b) => Math.abs(a.changesPercentage) > Math.abs(b.changesPercentage) ? a : b)
    : null;
  if (bigIdx && Math.abs(bigIdx.changesPercentage) >= 1.5) {
    const up = bigIdx.changesPercentage >= 0;
    return {
      label: SYMBOL_LABELS[bigIdx.symbol] || bigIdx.symbol,
      value: bigIdx.price.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      change: fmtPct(bigIdx.changesPercentage), color: up ? '#00D474' : '#C73E3A',
      context: up ? 'Broad equity rally. Risk assets in demand.' : 'Broad equity selloff. Elevated macro uncertainty.',
    };
  }
  if (btc && Math.abs(btc.change24h) >= 5) {
    const up = btc.change24h > 0;
    return {
      label: 'Bitcoin', value: '$' + Math.round(btc.price).toLocaleString(),
      change: fmtPct(btc.change24h), color: up ? '#F7931A' : '#C73E3A',
      context: up ? 'Crypto in demand. BTC leading risk appetite.' : 'Crypto under pressure. Risk appetite retreating.',
    };
  }
  const color = sp ? (sp.changesPercentage >= 0 ? '#00D474' : '#C73E3A') : '#94A3B8';
  return {
    label: 'S&P 500',
    value: sp ? sp.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—',
    change: sp ? fmtPct(sp.changesPercentage) : '—', color,
    context: 'Equity markets closed within normal range. No extreme readings today.',
  };
}

// ─── Section 3: Key Observations ─────────────────────────────────────────────
function generateObservations(d: DailyBriefData): string[] {
  const obs: string[] = [];
  const sp   = d.indices.find(q => q.symbol === '^GSPC');
  const vix  = d.macro.find(q => q.symbol === '^VIX');
  const gold = d.macro.find(q => q.symbol === 'GCUSD');
  const oil  = d.macro.find(q => q.symbol === 'CLUSD');
  const tnx  = d.macro.find(q => q.symbol === '^TNX');
  const btc  = d.crypto.find(c => c.id === 'bitcoin');
  const eth  = d.crypto.find(c => c.id === 'ethereum');
  const fg   = d.fearGreed;

  if (sp) {
    if (sp.changesPercentage > 2)
      obs.push(`S&P 500 gained ${sp.changesPercentage.toFixed(2)}%, closing at ${sp.price.toLocaleString()}. A gain of this size in a single session compresses year-to-date losses or extends an already stretched rally — either way, tomorrow's open will be different from today's.`);
    else if (sp.changesPercentage < -2)
      obs.push(`S&P 500 shed ${Math.abs(sp.changesPercentage).toFixed(2)}%, closing at ${sp.price.toLocaleString()}. At elevated multiples, even moderate selling pressure accelerates once institutional desks start trimming. Watch for follow-through.`);
    else
      obs.push(`S&P 500 closed at ${sp.price.toLocaleString()} (${fmtPct(sp.changesPercentage)}). A session without drama — the kind of tape where nothing happens until something does.`);
  }

  if (vix) {
    if (vix.price > 30)
      obs.push(`VIX at ${vix.price.toFixed(1)} is pricing in daily S&P moves of approximately ±${(vix.price / Math.sqrt(252)).toFixed(1)}%. The last time VIX sustained above 30 for more than two weeks, it marked either the end of a correction or the beginning of a real bear market. History is not yet clear which one this is.`);
    else if (vix.price < 15)
      obs.push(`VIX at ${vix.price.toFixed(1)} is the option market's version of "nothing to see here." Sub-15 readings are historically associated with late-cycle complacency. They don't end badly on average — they end badly suddenly.`);
    else
      obs.push(`VIX at ${vix.price.toFixed(1)} (${fmtPct(vix.changesPercentage)}) remains in normal operating range. The option market is not pricing a crisis. That's data, not a prediction.`);
  }

  if (btc && eth) {
    const btcUp = btc.change24h > 0;
    const spUp  = sp ? sp.changesPercentage > 0 : null;
    if (spUp !== null && btcUp === spUp)
      obs.push(`Bitcoin (${fmtPct(btc.change24h)} 24h) moved with equities today, reflecting shared risk-asset sentiment. BTC led ${Math.abs(btc.change24h) > Math.abs(eth.change24h) ? 'with ETH following' : 'ETH outperformed on the session'}.`);
    else
      obs.push(`Bitcoin diverged from equities: ${fmtPct(btc.change24h)} 24h while S&P moved ${sp ? fmtPct(sp.changesPercentage) : 'flat'}. Crypto-equity decoupling is historically brief. One side is pricing something the other hasn't seen yet.`);
  }

  if (gold && oil) {
    if (gold.changesPercentage > 0.5 && oil.changesPercentage < -0.5)
      obs.push(`Gold rallied ${gold.changesPercentage.toFixed(2)}% while oil fell ${Math.abs(oil.changesPercentage).toFixed(2)}%. The combination — flight-to-safety demand without an energy inflation shock — is the most benign macro mix for bond markets. It doesn't last, but it's welcome when it does.`);
    else if (oil.changesPercentage > 1)
      obs.push(`WTI crude up ${oil.changesPercentage.toFixed(2)}% to $${oil.price.toFixed(2)}. Oil above $80 starts appearing in airline earnings revisions, logistics margin updates, and every consumer discretionary model built around "normal" energy costs.`);
    else
      obs.push(`Gold at $${gold.price.toLocaleString()} (${fmtPct(gold.changesPercentage)}), oil at $${oil.price.toFixed(2)} (${fmtPct(oil.changesPercentage)}). Commodity markets are not sending a macro crisis signal today.`);
  }

  if (fg) {
    if (fg.value < 25)
      obs.push(`CNN Fear & Greed at ${fg.value} (${fg.label}). Extreme fear has historically preceded recoveries — but "historically preceded" doesn't mean "immediately preceded." This is where patience is the position, not a trade.`);
    else if (fg.value > 75)
      obs.push(`CNN Fear & Greed at ${fg.value} (${fg.label}). Greed this elevated isn't a sell signal — it's a warning that the margin for error on new positions is thin and crowded trades unwind faster than they build.`);
    else
      obs.push(`CNN Fear & Greed at ${fg.value} (${fg.label}). The market's emotional temperature is neither feverish nor frozen — a condition that typically persists longer than any forecast suggests.`);
  }

  if (tnx && obs.length < 5)
    obs.push(`10-Year Treasury yield at ${tnx.price.toFixed(2)}% (${fmtPct(tnx.changesPercentage)}). ${
      tnx.price > 4.5
        ? 'Yields above 4.5% continue to compete with equities for institutional capital. Every stock with an earnings yield below 4.5% is a bond in a growth-stock costume.'
        : tnx.price < 4
        ? 'Sub-4% yield is lifting the ceiling on equity valuations — a meaningful tailwind if it sustains and if the reason is benign rather than recessionary.'
        : 'The 10Y sits in the range where it\'s neither obviously cheap nor obviously competitive with equity risk premium. No strong bond-vs-equity signal today.'}`);

  return obs.slice(0, 5);
}

// ─── Section 4: Signals ───────────────────────────────────────────────────────
type SignalDir = 'bullish' | 'bearish' | 'neutral';

function generateSignals(d: DailyBriefData): { name: string; signal: SignalDir; value: string; note: string }[] {
  const sp   = d.indices.find(q => q.symbol === '^GSPC');
  const vix  = d.macro.find(q => q.symbol === '^VIX');
  const gold = d.macro.find(q => q.symbol === 'GCUSD');
  const tnx  = d.macro.find(q => q.symbol === '^TNX');
  const btc  = d.crypto.find(c => c.id === 'bitcoin');
  const fg   = d.fearGreed;

  const out: { name: string; signal: SignalDir; value: string; note: string }[] = [];

  if (sp) out.push({
    name: 'Equity Trend',
    signal: sp.changesPercentage > 0.5 ? 'bullish' : sp.changesPercentage < -0.5 ? 'bearish' : 'neutral',
    value: fmtPct(sp.changesPercentage),
    note: sp.changesPercentage > 0.5 ? 'S&P closed higher' : sp.changesPercentage < -0.5 ? 'S&P closed lower' : 'Flat session',
  });

  if (vix) out.push({
    name: 'Volatility Regime',
    signal: vix.price > 25 ? 'bearish' : vix.price < 15 ? 'neutral' : 'neutral',
    value: vix.price.toFixed(1),
    note: vix.price > 30 ? 'High fear — options expensive' : vix.price > 20 ? 'Elevated uncertainty' : 'Calm market conditions',
  });

  if (fg) out.push({
    name: 'Risk Sentiment',
    signal: fg.value > 60 ? 'bullish' : fg.value < 40 ? 'bearish' : 'neutral',
    value: `${fg.value} — ${fg.label}`,
    note: fg.value > 75 ? 'Greed elevated — watch for mean reversion' : fg.value < 25 ? 'Fear extreme — contrarian opportunity zone' : 'Sentiment in neutral range',
  });

  if (gold && tnx) {
    const safeHaven = gold.changesPercentage > 0.5 && tnx.changesPercentage < 0;
    const riskOn    = gold.changesPercentage < -0.3 && tnx.changesPercentage > 0;
    out.push({
      name: 'Safe Haven Demand',
      signal: safeHaven ? 'bearish' : riskOn ? 'bullish' : 'neutral',
      value: `Gold ${fmtPct(gold.changesPercentage)}`,
      note: safeHaven ? 'Defensive rotation active' : riskOn ? 'Risk-on positioning' : 'No clear flight-to-safety signal',
    });
  }

  if (btc) out.push({
    name: 'Crypto Momentum',
    signal: btc.change24h > 2 ? 'bullish' : btc.change24h < -2 ? 'bearish' : 'neutral',
    value: `BTC ${fmtPct(btc.change24h)}`,
    note: btc.change24h > 5 ? 'Strong BTC bid — altcoin spillover likely' : btc.change24h < -5 ? 'BTC under pressure — watch liquidity' : 'Crypto in consolidation range',
  });

  return out;
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
const signalColors: Record<SignalDir, { bg: string; text: string; dot: string }> = {
  bullish: { bg: '#00D47414', text: '#00D474', dot: '#00D474' },
  bearish: { bg: '#C73E3A14', text: '#C73E3A', dot: '#C73E3A' },
  neutral: { bg: '#94A3B814', text: '#94A3B8', dot: '#94A3B8' },
};

function QuoteRow({ q, priceDecimals = 2 }: { q: Quote; priceDecimals?: number }) {
  const color = pctColor(q.changesPercentage);
  return (
    <tr>
      <td style={{ padding: '8px 12px', color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>
        {SYMBOL_LABELS[q.symbol] || q.symbol}
      </td>
      <td style={{ padding: '8px 12px', color: '#F1F5F9', fontSize: 13, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700 }}>
        {q.price.toLocaleString('en-US', { minimumFractionDigits: priceDecimals, maximumFractionDigits: priceDecimals })}
      </td>
      <td style={{ padding: '8px 12px', color, fontSize: 12, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700 }}>
        {fmtPct(q.changesPercentage)}
      </td>
    </tr>
  );
}

function CryptoRow({ c }: { c: CryptoPrice }) {
  const color = pctColor(c.change24h);
  return (
    <tr>
      <td style={{ padding: '8px 12px', color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>
        {CRYPTO_LABELS[c.id] || c.id}
      </td>
      <td style={{ padding: '8px 12px', color: '#F1F5F9', fontSize: 13, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700 }}>
        ${Math.round(c.price).toLocaleString()}
      </td>
      <td style={{ padding: '8px 12px', color, fontSize: 12, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700 }}>
        {fmtPct(c.change24h)}
      </td>
    </tr>
  );
}

const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: 12,
};
const thStyle: React.CSSProperties = {
  padding: '6px 12px', borderBottom: '2px solid #1E293B', color: '#475569',
  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: 1, textAlign: 'left',
};
const thRight: React.CSSProperties = { ...thStyle, textAlign: 'right' };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DailyBriefPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const d = await getBrief(slug);

  // Not found
  if (!d) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 26, marginBottom: 12 }}>Brief Not Found</h1>
        <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>No Daily Brief was generated for {fmtDateLong(slug)}.</p>
        <Link href="/daily" style={{ color: '#C73E3A', fontSize: 13, fontWeight: 700 }}>← All Daily Briefs</Link>
      </div>
    );
  }

  // Under maintenance (validation failed)
  if (d.status === 'maintenance') {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔧</div>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 26, marginBottom: 12 }}>Under Maintenance</h1>
        <p style={{ color: '#64748B', fontSize: 14, maxWidth: 440, margin: '0 auto 24px' }}>
          The Daily Brief for {fmtDateLong(d.date)} could not be published. Our data validation flagged an issue with today&apos;s market data. We&apos;ll investigate and republish if data is confirmed.
        </p>
        <Link href="/daily" style={{ color: '#C73E3A', fontSize: 13, fontWeight: 700 }}>← All Daily Briefs</Link>
      </div>
    );
  }

  const theNumber   = getTheNumber(d);
  const observations = generateObservations(d);
  const signals     = generateSignals(d);

  const sp  = d.indices.find(q => q.symbol === '^GSPC');
  const vix = d.macro.find(q => q.symbol === '^VIX');

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: `Brutal Edge Daily Brief — ${fmtDateLong(d.date)}`,
    description: sp ? `S&P ${sp.price.toLocaleString()} · VIX ${vix?.price.toFixed(1)} · ${d.fearGreed.label}` : 'Brutal Edge daily market brief.',
    datePublished: d.date, dateModified: d.date,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
    mainEntityOfPage: `https://dhlm-studio.com/daily/${slug}`,
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/daily" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← All Daily Briefs</Link>

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #C73E3A08, #C73E3A03)', border: '1px solid #C73E3A20', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>BRUTAL EDGE&trade; DAILY BRIEF</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Data-driven. Zero feelings. No BS.</div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#C73E3A', marginBottom: 8 }}>
          {fmtDateLong(d.date)}
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.25, margin: '0 0 16px' }}>
          Daily Brief
        </h1>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 36 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 5, background: '#00D47412', color: '#00D474', border: '1px solid #00D47425' }}>✓ Auto-Generated</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 5, background: '#3B82F612', color: '#3B82F6', border: '1px solid #3B82F625' }}>✓ 3-Stage Data Validation</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 5, background: '#8B5CF612', color: '#8B5CF6', border: '1px solid #8B5CF625' }}>
            Source: {d.source === 'live' ? 'Live Close' : d.source === 'cached' ? 'Cached Close' : 'Verified Data'}
          </span>
        </div>

        {/* ── Section 1: The Number ────────────────────────────────────────────── */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 14 }}>THE NUMBER</div>
          <div style={{ padding: '28px 28px 24px', borderRadius: 14, background: `linear-gradient(135deg, ${theNumber.color}10, #111827)`, border: `1px solid ${theNumber.color}25`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: theNumber.color }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: 1, marginBottom: 8 }}>
              {theNumber.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1 }}>
                {theNumber.value}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 800, color: theNumber.color }}>
                {theNumber.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
              {theNumber.context}
            </p>
          </div>
        </section>

        {/* ── Section 2: Market Snapshot ───────────────────────────────────────── */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 14 }}>MARKET SNAPSHOT</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>

            {/* Indices */}
            <div style={{ padding: '0', borderRadius: 12, background: '#111827', border: '1px solid #1E293B', overflow: 'hidden' }}>
              <div style={{ padding: '10px 12px 6px', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2 }}>INDICES</div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Asset</th>
                    <th style={thRight}>Price</th>
                    <th style={thRight}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {d.indices.map(q => (
                    <QuoteRow key={q.symbol} q={q} priceDecimals={2} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Macro */}
            <div style={{ padding: '0', borderRadius: 12, background: '#111827', border: '1px solid #1E293B', overflow: 'hidden' }}>
              <div style={{ padding: '10px 12px 6px', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2 }}>MACRO</div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Asset</th>
                    <th style={thRight}>Price</th>
                    <th style={thRight}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {d.macro.map(q => (
                    <QuoteRow key={q.symbol} q={q} priceDecimals={q.symbol === '^TNX' ? 2 : 2} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Crypto */}
            <div style={{ padding: '0', borderRadius: 12, background: '#111827', border: '1px solid #1E293B', overflow: 'hidden' }}>
              <div style={{ padding: '10px 12px 6px', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2 }}>CRYPTO</div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Asset</th>
                    <th style={thRight}>Price</th>
                    <th style={thRight}>24h</th>
                  </tr>
                </thead>
                <tbody>
                  {d.crypto.map(c => <CryptoRow key={c.id} c={c} />)}
                </tbody>
              </table>
            </div>

            {/* Sentiment */}
            <div style={{ padding: '20px 22px', borderRadius: 12, background: '#111827', border: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 6 }}>CNN FEAR &amp; GREED</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 40, fontWeight: 900, color: (() => {
                  const v = d.fearGreed.value;
                  if (v <= 25) return '#C73E3A';
                  if (v >= 75) return '#00D474';
                  return '#D4A843';
                })(), lineHeight: 1 }}>{d.fearGreed.value}</div>
                <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, fontWeight: 600 }}>{d.fearGreed.label}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: '#1E293B', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${d.fearGreed.value}%`,
                    background: (() => {
                      const v = d.fearGreed.value;
                      if (v <= 25) return '#C73E3A';
                      if (v >= 75) return '#00D474';
                      return '#D4A843';
                    })(),
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 9, color: '#475569' }}>
                  <span>Fear</span><span>Neutral</span><span>Greed</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>Source: CNN Business</div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Section 3: Key Observations ─────────────────────────────────────── */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 14 }}>KEY OBSERVATIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {observations.map((obs, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 18px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#C73E3A', flexShrink: 0, marginTop: 1 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.75, margin: 0 }}>{obs}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Signals ───────────────────────────────────────────────── */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 14 }}>SIGNALS</div>
          <div style={{ borderRadius: 12, background: '#111827', border: '1px solid #1E293B', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1E293B' }}>
                  <th style={{ ...thStyle, padding: '10px 16px' }}>Signal</th>
                  <th style={{ ...thStyle, padding: '10px 16px' }}>Direction</th>
                  <th style={{ ...thStyle, padding: '10px 16px', textAlign: 'right' }}>Value</th>
                  <th style={{ ...thStyle, padding: '10px 16px', display: 'none' } as React.CSSProperties}>Note</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((s, i) => {
                  const sc = signalColors[s.signal];
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #1E293B30' }}>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#E2E8F0', fontWeight: 600 }}>
                        {s.name}
                        <div style={{ fontSize: 11, color: '#475569', fontWeight: 400, marginTop: 2 }}>{s.note}</div>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: sc.bg, color: sc.text }}>
                          ● {s.signal.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: '#F1F5F9', textAlign: 'right' }}>
                        {s.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 5: Brutal Edge Verdict ──────────────────────────────────── */}
        {d.verdict?.text && (
          <section style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 14 }}>BRUTAL EDGE VERDICT</div>
            <div style={{ padding: '24px 26px', borderRadius: 14, background: 'linear-gradient(135deg, #C73E3A0C, #0B0F19)', border: '1px solid #C73E3A25', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: '#C73E3A', borderRadius: '4px 0 0 4px' }} />
              <p style={{ fontSize: 16, color: '#E2E8F0', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                &ldquo;{d.verdict.text}&rdquo;
              </p>
              {d.verdict.trigger && d.verdict.trigger !== 'neutral' && (
                <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 10, color: '#475569' }}>
                  Trigger: {d.verdict.trigger}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Newsletter ──────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 32 }}>
          <InlineSubscribe
            source="daily"
            headline="Never miss a brief"
            description="Tomorrow's Brutal Edge Daily lands in your inbox at 4:05 PM ET. Free."
          />
        </div>

        {/* ── Comments ────────────────────────────────────────────────────────── */}
        <GiscusComments slug={`daily:${slug}`} />

        {/* ── Disclaimer ──────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 40, padding: '18px 20px', borderRadius: 12, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 6 }}>🔥 PUBLISHED BY BRUTAL EDGE&trade;</div>
          <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>
            Auto-generated from verified market close data. Informational and educational only.<br />
            Data: Financial Modeling Prep · Alpha Vantage · CoinGecko · CNN Business<br />
            NOT investment advice. Always do your own research.
          </div>
          <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 9, color: '#334155' }}>
            Generated {new Date(d.generatedAt).toUTCString()}
          </div>
        </div>

      </article>
    </div>
  );
}
