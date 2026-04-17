import type { Metadata } from 'next';
import Link from 'next/link';
import { getRedis } from '@/lib/redis';
import { fmtDateLong } from '@/lib/fmt-date';
import InlineSubscribe from '@/components/InlineSubscribe';
import GiscusComments from '@/components/GiscusComments';
import type { DailyBriefData } from '@/app/api/cron/daily-brief/route';

export const dynamic = 'force-dynamic';

// ─── Data loader ──────────────────────────────────────────────────────────────
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
  const sp  = d.indices.find(q => q.symbol === '^GSPC');
  const vix = d.macro.find(q => q.symbol === '^VIX');
  const desc = sp && vix
    ? `S&P ${sp.changesPercentage > 0 ? '+' : ''}${sp.changesPercentage.toFixed(2)}% · VIX ${vix.price.toFixed(1)} · ${d.fearGreed.label}. Brutal Edge daily market brief — data-driven, zero hype.`
    : 'Brutal Edge daily market brief — data-driven, zero hype.';
  return {
    title: `Daily Brief — ${fmtDateLong(d.date)} | DHLM Studio`,
    description: desc,
    alternates: { canonical: `https://dhlm-studio.com/daily/${slug}` },
  };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────
interface Quote { symbol: string; price: number; change: number; changesPercentage: number }
interface CryptoPrice { id: string; price: number; change24h: number }

const SYMBOL_LABELS: Record<string, string> = {
  '^GSPC':   'S&P 500',
  '^IXIC':   'Nasdaq',
  '^DJI':    'Dow Jones',
  '^RUT':    'Russell 2000',
  '^VIX':    'VIX',
  'GCUSD':   'Gold',
  'CLUSD':   'Oil (WTI)',
  '^TNX':    'US 10Y',
  'DX-Y.NYB':'DXY',
  'EUR/USD': 'EUR/USD',
  'USD/JPY': 'USD/JPY',
};
const CRYPTO_LABELS: Record<string, string> = { bitcoin: 'Bitcoin', ethereum: 'Ethereum', solana: 'Solana' };

function fmtPct(n: number, decimals = 2): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(decimals)}%`;
}
function pctColor(n: number): string {
  return n > 0 ? '#00D474' : n < 0 ? '#C73E3A' : '#94A3B8';
}

// ─── Headline summary (one liner for header) ─────────────────────────────────
function getHeadlineSummary(d: DailyBriefData): string {
  const sp  = d.indices.find(q => q.symbol === '^GSPC');
  const vix = d.macro.find(q => q.symbol === '^VIX');
  const btc = d.crypto.find(c => c.id === 'bitcoin');
  const fg  = d.fearGreed;

  if (vix && vix.price > 35)
    return `VIX at ${vix.price.toFixed(1)} — volatility regime active. Markets pricing elevated uncertainty.`;
  if (sp && sp.changesPercentage > 2)
    return `S&P ${fmtPct(sp.changesPercentage)} to ${sp.price.toLocaleString()} — strong broad-market session.`;
  if (sp && sp.changesPercentage < -2)
    return `S&P ${fmtPct(sp.changesPercentage)} to ${sp.price.toLocaleString()} — significant single-session decline.`;
  if (btc && btc.change24h > 5)
    return `Bitcoin ${fmtPct(btc.change24h)} 24h — crypto outperforming equities today.`;
  if (fg && fg.value < 25) return `Fear & Greed at ${fg.value} (${fg.label}) — extreme fear reading.`;
  if (fg && fg.value > 75) return `Fear & Greed at ${fg.value} (${fg.label}) — elevated greed; watch for mean reversion.`;
  if (sp)
    return `S&P ${fmtPct(sp.changesPercentage)} to ${sp.price.toLocaleString()} — ${Math.abs(sp.changesPercentage) < 0.3 ? 'flat session, markets consolidating.' : 'equity markets within normal range.'}`;
  return 'Markets closed. Data-driven brief below.';
}

// ─── The Number ───────────────────────────────────────────────────────────────
function getTheNumber(d: DailyBriefData): { label: string; value: string; change: string; color: string; context: string } {
  const sp  = d.indices.find(q => q.symbol === '^GSPC');
  const vix = d.macro.find(q => q.symbol === '^VIX');
  const btc = d.crypto.find(c => c.id === 'bitcoin');

  if (vix && vix.price > 30)
    return { label: 'VIX (Fear Index)', value: vix.price.toFixed(2), change: fmtPct(vix.changesPercentage), color: '#C73E3A',
      context: `Elevated volatility regime. Options traders pricing in ±${(vix.price / Math.sqrt(252)).toFixed(1)}% daily S&P moves.` };

  const bigIdx = d.indices.length
    ? d.indices.reduce((a, b) => Math.abs(a.changesPercentage) > Math.abs(b.changesPercentage) ? a : b) : null;
  if (bigIdx && Math.abs(bigIdx.changesPercentage) >= 1.5) {
    const up = bigIdx.changesPercentage >= 0;
    return { label: SYMBOL_LABELS[bigIdx.symbol] || bigIdx.symbol,
      value: bigIdx.price.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      change: fmtPct(bigIdx.changesPercentage), color: up ? '#00D474' : '#C73E3A',
      context: up ? 'Broad equity rally. Risk assets in demand.' : 'Broad equity selloff. Elevated macro uncertainty.' };
  }
  if (btc && Math.abs(btc.change24h) >= 5) {
    const up = btc.change24h > 0;
    return { label: 'Bitcoin', value: '$' + Math.round(btc.price).toLocaleString(),
      change: fmtPct(btc.change24h), color: up ? '#F7931A' : '#C73E3A',
      context: up ? 'Crypto in demand. BTC leading risk appetite.' : 'Crypto under pressure. Risk appetite retreating.' };
  }
  const color = sp ? (sp.changesPercentage >= 0 ? '#00D474' : '#C73E3A') : '#94A3B8';
  return { label: 'S&P 500',
    value: sp ? sp.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—',
    change: sp ? fmtPct(sp.changesPercentage) : '—', color,
    context: 'Equity markets closed within normal range. No extreme readings today.' };
}

// ─── Auto-generated signals ───────────────────────────────────────────────────
type SignalDir = 'bullish' | 'bearish' | 'neutral';
interface Signal { name: string; reading: string; interpretation: string; dir: SignalDir }

function generateSignals(d: DailyBriefData): Signal[] {
  const sp   = d.indices.find(q => q.symbol === '^GSPC');
  const vix  = d.macro.find(q => q.symbol === '^VIX');
  const gold = d.macro.find(q => q.symbol === 'GCUSD');
  const tnx  = d.macro.find(q => q.symbol === '^TNX');
  const btc  = d.crypto.find(c => c.id === 'bitcoin');
  const fg   = d.fearGreed;
  const out: Signal[] = [];

  if (vix) out.push({
    name: 'VIX', reading: `${vix.price.toFixed(2)} (${fmtPct(vix.changesPercentage)})`,
    dir: vix.price > 25 ? 'bearish' : vix.price < 15 ? 'neutral' : 'neutral',
    interpretation: vix.price > 30 ? 'Elevated but compressing — bears losing urgency' : vix.price > 20 ? 'Elevated uncertainty — watch for follow-through' : 'Calm conditions — option market not pricing stress',
  });

  if (fg) out.push({
    name: 'Fear & Greed', reading: `${fg.value} (${fg.label}) — CNN`,
    dir: fg.value > 60 ? 'bullish' : fg.value < 40 ? 'bearish' : 'neutral',
    interpretation: fg.value > 75 ? 'Greed elevated — risk-on resuming, watch crowding' : fg.value < 25 ? 'Fear extreme — contrarian setup building' : 'Sentiment in neutral zone',
  });

  if (btc && sp) {
    const aligned = (btc.change24h > 0) === (sp.changesPercentage > 0);
    out.push({
      name: 'BTC vs SPX', reading: `BTC ${fmtPct(btc.change24h)} / SPX ${fmtPct(sp.changesPercentage)}`,
      dir: aligned ? (sp.changesPercentage > 0 ? 'bullish' : 'bearish') : 'neutral',
      interpretation: aligned ? 'Risk assets aligned' : 'Crypto-equity divergence — watch for convergence',
    });
  }

  if (tnx) out.push({
    name: '10Y Yield', reading: `${tnx.price.toFixed(2)}% (${fmtPct(tnx.changesPercentage)})`,
    dir: tnx.changesPercentage > 0 ? 'bearish' : 'bullish',
    interpretation: tnx.price > 4.5 ? 'Yields drifting up — watch for bond repricing' : tnx.price < 4 ? 'Sub-4% supporting equity valuations' : 'Yield range-bound — no strong bond signal',
  });

  if (d.dxy) out.push({
    name: 'DXY', reading: `${d.dxy.price.toFixed(2)} (${fmtPct(d.dxy.changesPercentage)})`,
    dir: d.dxy.changesPercentage > 0.3 ? 'bearish' : d.dxy.changesPercentage < -0.3 ? 'bullish' : 'neutral',
    interpretation: d.dxy.changesPercentage > 0.3 ? 'Dollar strengthening — headwind for multinationals' : d.dxy.changesPercentage < -0.3 ? 'Dollar weakening — tailwind for risk assets' : 'Dollar stable — no FX signal today',
  });

  if (gold) out.push({
    name: 'Gold', reading: `$${gold.price.toLocaleString()} (${fmtPct(gold.changesPercentage)})`,
    dir: gold.changesPercentage > 0.5 ? 'bearish' : 'neutral',
    interpretation: gold.changesPercentage > 0.5 ? 'Defensive rotation active — safe haven demand elevated' : 'Gold quiet — no crisis bid today',
  });

  return out;
}

// ─── UI primitives ────────────────────────────────────────────────────────────
const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
  color: '#475569', letterSpacing: 3, marginBottom: 14,
};

const TABLE_STYLE: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const TH: React.CSSProperties = {
  padding: '6px 12px', borderBottom: '2px solid #1E293B',
  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
  color: '#475569', letterSpacing: 1, textAlign: 'left',
};
const TH_R: React.CSSProperties = { ...TH, textAlign: 'right' };

const signalColors: Record<SignalDir, { bg: string; text: string }> = {
  bullish: { bg: '#00D47414', text: '#00D474' },
  bearish: { bg: '#C73E3A14', text: '#C73E3A' },
  neutral: { bg: '#94A3B814', text: '#94A3B8' },
};

function impColor(imp: 'High' | 'Medium' | 'Low'): string {
  return imp === 'High' ? '#C73E3A' : imp === 'Medium' ? '#D4A843' : '#475569';
}

function QuoteRow({ q, decimals = 2 }: { q: Quote; decimals?: number }) {
  const c = pctColor(q.changesPercentage);
  return (
    <tr>
      <td style={{ padding: '8px 12px', color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>
        {SYMBOL_LABELS[q.symbol] || q.symbol}
      </td>
      <td style={{ padding: '8px 12px', color: '#F1F5F9', fontSize: 13, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700 }}>
        {q.price.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      </td>
      <td style={{ padding: '8px 12px', color: c, fontSize: 12, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700 }}>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DailyBriefPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const d = await getBrief(slug);

  if (!d) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 26, margin: '0 0 12px' }}>Brief Not Found</h1>
        <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>No Daily Brief was generated for {fmtDateLong(slug)}.</p>
        <Link href="/daily" style={{ color: '#C73E3A', fontSize: 13, fontWeight: 700 }}>← All Daily Briefs</Link>
      </div>
    );
  }

  if (d.status === 'maintenance') {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔧</div>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 26, margin: '0 0 12px' }}>Under Maintenance</h1>
        <p style={{ color: '#64748B', fontSize: 14, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
          The Daily Brief for {fmtDateLong(d.date)} could not be published. Our data validation
          flagged an issue and we chose not to show unverified numbers. We&apos;ll investigate.
        </p>
        <Link href="/daily" style={{ color: '#C73E3A', fontSize: 13, fontWeight: 700 }}>← All Daily Briefs</Link>
      </div>
    );
  }

  const headline  = getHeadlineSummary(d);
  const theNumber = getTheNumber(d);
  const signals   = generateSignals(d);
  const sp  = d.indices.find(q => q.symbol === '^GSPC');
  const vix = d.macro.find(q => q.symbol === '^VIX');
  const fg  = d.fearGreed;

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: `Brutal Edge Daily Brief — ${fmtDateLong(d.date)}`,
    description: headline,
    datePublished: d.date, dateModified: d.date,
    author: { '@type': 'Organization', name: 'DHLM Studio' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio' },
    mainEntityOfPage: `https://dhlm-studio.com/daily/${slug}`,
  };

  const cardStyle: React.CSSProperties = {
    padding: '0', borderRadius: 12, background: '#111827', border: '1px solid #1E293B', overflow: 'hidden',
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/daily" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>← All Daily Briefs</Link>

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #C73E3A08, transparent)', border: '1px solid #C73E3A20', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>BRUTAL EDGE&trade; DAILY BRIEF</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Data-driven · Zero feelings · No BS</div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#C73E3A', marginBottom: 8 }}>
          {fmtDateLong(d.date)} (ET)
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.25, margin: '0 0 12px' }}>
          Daily Brief
        </h1>

        {/* Headline one-liner */}
        <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.6, margin: '0 0 8px', fontStyle: 'italic' }}>
          {headline}
        </p>
        <div style={{ fontSize: 11, color: '#334155', marginBottom: 28 }}>Read time: ~2 min</div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 36 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 5, background: '#00D47412', color: '#00D474', border: '1px solid #00D47425' }}>✓ Auto-Generated</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 5, background: '#3B82F612', color: '#3B82F6', border: '1px solid #3B82F625' }}>✓ 3-Stage Validated</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 5, background: '#8B5CF612', color: '#8B5CF6', border: '1px solid #8B5CF625' }}>
            {d.source === 'live' ? 'Live Close Data' : d.source === 'cached' ? 'Cached Close Data' : 'Verified Data'}
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: THE NUMBER
        ════════════════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 36 }}>
          <div style={SECTION_LABEL_STYLE}>THE NUMBER</div>
          <div style={{ padding: '28px', borderRadius: 14, background: `linear-gradient(135deg, ${theNumber.color}10, #111827)`, border: `1px solid ${theNumber.color}25`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: theNumber.color }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: 1, marginBottom: 8 }}>
              {theNumber.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1 }}>
                {theNumber.value}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 800, color: theNumber.color }}>
                {theNumber.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              {theNumber.context}
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: MARKET SNAPSHOT
        ════════════════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 36 }}>
          <div style={SECTION_LABEL_STYLE}>MARKET SNAPSHOT</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>

            {/* US Indices */}
            <div style={cardStyle}>
              <div style={{ padding: '10px 12px 6px', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2 }}>US INDICES</div>
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <th style={TH}>Index</th>
                    <th style={TH_R}>Last</th>
                    <th style={TH_R}>Daily %</th>
                  </tr>
                </thead>
                <tbody>
                  {d.indices.map(q => <QuoteRow key={q.symbol} q={q} />)}
                  {d.russell2000 && <QuoteRow q={d.russell2000} />}
                </tbody>
              </table>
            </div>

            {/* Macro */}
            <div style={cardStyle}>
              <div style={{ padding: '10px 12px 6px', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2 }}>MACRO</div>
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <th style={TH}>Asset</th>
                    <th style={TH_R}>Last</th>
                    <th style={TH_R}>Daily %</th>
                  </tr>
                </thead>
                <tbody>
                  {d.macro.map(q => <QuoteRow key={q.symbol} q={q} />)}
                  {d.dxy    && <QuoteRow q={d.dxy}    />}
                  {d.eurusd && <QuoteRow q={d.eurusd} decimals={4} />}
                  {d.usdjpy && <QuoteRow q={d.usdjpy} decimals={2} />}
                </tbody>
              </table>
            </div>

            {/* Crypto */}
            <div style={cardStyle}>
              <div style={{ padding: '10px 12px 6px', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2 }}>CRYPTO</div>
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <th style={TH}>Coin</th>
                    <th style={TH_R}>Last</th>
                    <th style={TH_R}>24h %</th>
                  </tr>
                </thead>
                <tbody>
                  {d.crypto.map(c => <CryptoRow key={c.id} c={c} />)}
                  {d.solana && <CryptoRow c={d.solana} />}
                </tbody>
              </table>
            </div>

            {/* Sentiment */}
            <div style={{ ...cardStyle, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 6 }}>CNN FEAR &amp; GREED</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 44, fontWeight: 900, lineHeight: 1, color: (() => {
                  const v = fg.value;
                  if (v <= 25) return '#C73E3A';
                  if (v >= 75) return '#00D474';
                  return '#D4A843';
                })() }}>{fg.value}</div>
                <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, fontWeight: 600 }}>{fg.label}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: '#1E293B', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ height: '100%', borderRadius: 4, width: `${fg.value}%`, background: (() => {
                    const v = fg.value;
                    if (v <= 25) return '#C73E3A';
                    if (v >= 75) return '#00D474';
                    return '#D4A843';
                  })() }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 9, color: '#475569' }}>
                  <span>Fear</span><span>Neutral</span><span>Greed</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: TODAY'S MOVERS
        ════════════════════════════════════════════════════════════════════ */}
        {d.movers && d.movers.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <div style={SECTION_LABEL_STYLE}>TODAY&apos;S MOVERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {d.movers.map((m, i) => {
                const pctColor2 = m.direction === 'up' ? '#00D474' : '#C73E3A';
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 16px', borderRadius: 10, background: '#111827', border: `1px solid ${pctColor2}20`, alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, minWidth: 120 }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 900, color: '#F1F5F9' }}>
                        ${m.symbol}
                      </div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 800, color: pctColor2, marginTop: 2 }}>
                        {m.pct > 0 ? '+' : ''}{m.pct.toFixed(2)}%
                      </div>
                      {m.price > 0 && (
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', marginTop: 2 }}>
                          ${m.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, paddingTop: 2 }}>
                      {m.reason}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: TODAY'S NEWS
        ════════════════════════════════════════════════════════════════════ */}
        {d.news && d.news.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <div style={SECTION_LABEL_STYLE}>TODAY&apos;S NEWS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {d.news.map((n, i) => (
                <div key={i} style={{ padding: '14px 18px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <span style={{ color: '#C73E3A', fontSize: 14, flexShrink: 0, marginTop: 1 }}>▸</span>
                    <div>
                      {n.url ? (
                        <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', textDecoration: 'none', lineHeight: 1.4, display: 'block' }}>
                          {n.headline}
                        </a>
                      ) : (
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>
                          {n.headline}
                        </div>
                      )}
                      {n.summary && (
                        <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65, margin: '6px 0 0' }}>
                          {n.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#334155', paddingLeft: 24 }}>
                    via {n.source}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5: SIGNALS
        ════════════════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 36 }}>
          <div style={SECTION_LABEL_STYLE}>SIGNALS</div>
          <div style={{ borderRadius: 12, background: '#111827', border: '1px solid #1E293B', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1E293B' }}>
                  <th style={{ ...TH, padding: '10px 14px' }}>Signal</th>
                  <th style={{ ...TH, padding: '10px 14px', textAlign: 'right' }}>Reading</th>
                  <th style={{ ...TH, padding: '10px 14px' }}>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((s, i) => {
                  const sc = signalColors[s.dir];
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #1E293B30' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 3, background: sc.bg, color: sc.text, flexShrink: 0 }}>
                            {s.dir.toUpperCase()}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: '#F1F5F9', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {s.reading}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
                        {s.interpretation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6: BRUTAL EDGE VERDICT
        ════════════════════════════════════════════════════════════════════ */}
        {d.verdict?.text && (
          <section style={{ marginBottom: 36 }}>
            <div style={SECTION_LABEL_STYLE}>🔥 BRUTAL EDGE&trade; VERDICT</div>
            <div style={{ padding: '24px 26px', borderRadius: 14, background: 'linear-gradient(135deg, #C73E3A0C, #0B0F19)', border: '1px solid #C73E3A25', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: '#C73E3A', borderRadius: '4px 0 0 4px' }} />
              <p style={{ fontSize: 16, color: '#E2E8F0', lineHeight: 1.85, margin: 0, fontStyle: 'italic' }}>
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

        {/* ═══════════════════════════════════════════════════════════════════
            FOOTER: WHAT TO WATCH TOMORROW
        ════════════════════════════════════════════════════════════════════ */}
        {d.tomorrow && d.tomorrow.length > 0 && (
          <section style={{ marginBottom: 32, padding: '20px 22px', borderRadius: 12, background: '#0D1117', border: '1px solid #1E293B' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 12 }}>WHAT TO WATCH TOMORROW</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {d.tomorrow.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: '#D4A843', fontSize: 12, flexShrink: 0 }}>▸</span>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{e.event}</span>
                    {e.time && e.time !== 'TBD' && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569', marginLeft: 8 }}>{e.time}</span>
                    )}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: `${impColor(e.importance)}18`, color: impColor(e.importance), marginLeft: 6 }}>
                      {e.importance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Data timestamp */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#334155', marginBottom: 28, textAlign: 'center' }}>
          Data timestamp: {d.date} 16:05 ET
          {[
            sp   ? `S&P ${sp.price.toLocaleString()}` : null,
            vix  ? `VIX ${vix.price.toFixed(1)}` : null,
            fg   ? `F&G ${fg.value}` : null,
          ].filter(Boolean).join(' · ')}
          {' '}| Sources: FMP · Alpha Vantage · CoinGecko · CNN Business
        </div>

        {/* Newsletter */}
        <div style={{ marginTop: 16, marginBottom: 32 }}>
          <InlineSubscribe
            source="daily"
            headline="Never miss a brief"
            description="Tomorrow's Brutal Edge Daily lands in your inbox at 4:05 PM ET. Free."
          />
        </div>

        {/* Comments */}
        <GiscusComments slug={`daily:${slug}`} />

        {/* Disclaimer */}
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
