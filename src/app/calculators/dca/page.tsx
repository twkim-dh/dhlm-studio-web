'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is DCA better than lump sum investing?',
      acceptedAnswer: { '@type': 'Answer', text: 'Statistically, lump sum investing outperforms DCA about two-thirds of the time in rising markets, because more capital is deployed earlier. DCA reduces timing risk and emotional volatility, making it better for investors who cannot handle sharp drawdowns.' },
    },
    {
      '@type': 'Question',
      name: 'How much should I DCA into Bitcoin per month?',
      acceptedAnswer: { '@type': 'Answer', text: 'Invest only what you can afford to lose entirely. A common framework: allocate no more than 1–5% of your portfolio to any single crypto asset. For Bitcoin specifically, many retail investors use $50–$200/month as a disciplined starting point.' },
    },
    {
      '@type': 'Question',
      name: 'Does dollar cost averaging work in a bear market?',
      acceptedAnswer: { '@type': 'Answer', text: 'DCA does not prevent losses in a bear market, but it lowers your average cost basis over time. If the asset recovers, your average entry price is lower than a lump sum bought at the peak. Time horizon matters: DCA requires patience.' },
    },
  ],
};

const ASSETS = ['BTC', 'ETH', 'S&P 500', 'Custom'];
const FREQ = ['monthly', 'weekly', 'biweekly'] as const;
const FREQ_LABEL: Record<string, string> = { monthly: 'Monthly', weekly: 'Weekly', biweekly: 'Bi-weekly' };
const PERIODS_PER_YEAR: Record<string, number> = { monthly: 12, weekly: 52, biweekly: 26 };
// Approximate historical annualized returns for preset assets
const PRESET_RETURNS: Record<string, number> = { BTC: 60, ETH: 55, 'S&P 500': 10.5 };

function fmt(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function pct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}

function SliderRow({
  label, value, min, max, step, prefix, suffix, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  prefix?: string; suffix?: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label style={{ fontSize: 12, color: '#94A3B8' }}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {prefix && <span style={{ fontSize: 12, color: '#64748B' }}>{prefix}</span>}
          <input
            type="number" value={value} min={min} max={max} step={step}
            onChange={e => onChange(Number(e.target.value))}
            style={{ width: 80, textAlign: 'right', background: '#0D1117', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', fontSize: 13, fontWeight: 700, color: '#F1F5F9', fontFamily: 'var(--mono)', outline: 'none' }}
          />
          {suffix && <span style={{ fontSize: 12, color: '#64748B' }}>{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }} />
    </div>
  );
}

export default function DCAPage() {
  const [asset, setAsset] = useState('BTC');
  const [amount, setAmount] = useState(100);
  const [freq, setFreq] = useState<'monthly' | 'weekly' | 'biweekly'>('monthly');
  const [years, setYears] = useState(5);
  const [customRate, setCustomRate] = useState(15);

  const annualReturn = asset === 'Custom' ? customRate : (PRESET_RETURNS[asset] ?? 10);
  const periodsPerYear = PERIODS_PER_YEAR[freq];
  const ratePerPeriod = annualReturn / 100 / periodsPerYear;
  const totalPeriods = years * periodsPerYear;

  const result = useMemo(() => {
    const rows: { period: number; year: number; invested: number; value: number }[] = [];
    let value = 0;
    let invested = 0;

    for (let p = 1; p <= totalPeriods; p++) {
      invested += amount;
      value = (value + amount) * (1 + ratePerPeriod);
      if (p % periodsPerYear === 0 || p === totalPeriods) {
        rows.push({ period: p, year: Math.ceil(p / periodsPerYear), invested: Math.round(invested), value: Math.round(value) });
      }
    }

    const finalValue = value;
    const totalInvested = invested;
    const totalReturn = finalValue - totalInvested;
    const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // Lump sum comparison: invest all at once at start
    const lumpSumFV = totalInvested * Math.pow(1 + annualReturn / 100, years);
    const lumpSumReturn = lumpSumFV - totalInvested;

    // Average cost basis (DCA averages purchase price over time)
    const avgCostBasis = totalInvested / totalPeriods;

    return { finalValue, totalInvested, totalReturn, returnPct, lumpSumFV, lumpSumReturn, rows, avgCostBasis, totalPeriods };
  }, [amount, freq, years, ratePerPeriod, totalPeriods, periodsPerYear, annualReturn]);

  const take = useMemo(() => {
    const parts: string[] = [];
    if (result.totalReturn < 0) parts.push('Even DCA cannot save you from a bear market. But it can reduce the damage.');
    else if (result.finalValue > result.lumpSumFV) parts.push('DCA outperformed lump sum here. Volatility was your friend.');
    else parts.push('Lump sum won this time. DCA trades upside for peace of mind.');
    if (years < 1) parts.push('DCA needs time to work. A few months is barely a warm-up.');
    if (asset === 'BTC' || asset === 'ETH') parts.push(`Historical ${asset} returns are extraordinary and may not repeat. This is a scenario model, not a forecast.`);
    return parts.join(' ');
  }, [result, years, asset]);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 20px 60px' }}>

        <Link href="/calculators" style={{ fontSize: 12, color: '#64748B' }}>← Calculators</Link>
        <div style={{ marginTop: 20, marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#F59E0B', letterSpacing: 3, marginBottom: 8 }}>CALCULATOR · FREE</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 8px' }}>
            DCA Calculator
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            Dollar cost averaging simulation — see projected portfolio value vs. lump sum investing.
          </p>
          <p style={{ fontSize: 10, color: '#334155', marginTop: 4, fontFamily: 'var(--mono)' }}>
            Phase 1: Uses historical average return rates. Actual historical price data (BTC/ETH) in Phase 2. · NOT financial advice
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,1fr) 1.6fr', gap: 16, alignItems: 'start' }}>

          {/* Inputs */}
          <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '22px 20px', position: 'sticky', top: 80 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 18 }}>INPUTS</div>

            {/* Asset */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>Asset</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {ASSETS.map(a => (
                  <button key={a} onClick={() => setAsset(a)} style={{
                    padding: '8px 6px', borderRadius: 8, border: '1px solid',
                    borderColor: asset === a ? '#F59E0B' : '#1E293B',
                    background: asset === a ? '#F59E0B18' : '#0D1117',
                    color: asset === a ? '#F59E0B' : '#64748B',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--mono)',
                  }}>{a}</button>
                ))}
              </div>
              {asset !== 'Custom' && (
                <div style={{ marginTop: 8, fontSize: 10, color: '#475569', fontFamily: 'var(--mono)' }}>
                  Using historical avg: <span style={{ color: '#F59E0B' }}>{PRESET_RETURNS[asset]}% /yr</span>
                </div>
              )}
            </div>

            {/* Custom rate (only for Custom) */}
            {asset === 'Custom' && (
              <SliderRow label="Expected Annual Return" value={customRate} min={0} max={50} step={0.5} suffix="%" onChange={setCustomRate} />
            )}

            <SliderRow label="Amount per Period" value={amount} min={10} max={10000} step={10} prefix="$" onChange={setAmount} />

            {/* Frequency */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>Frequency</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(Object.keys(FREQ_LABEL) as Array<'monthly' | 'weekly' | 'biweekly'>).map(f => (
                  <button key={f} onClick={() => setFreq(f)} style={{
                    flex: 1, padding: '7px 4px', borderRadius: 8, border: '1px solid',
                    borderColor: freq === f ? '#F59E0B' : '#1E293B',
                    background: freq === f ? '#F59E0B18' : '#0D1117',
                    color: freq === f ? '#F59E0B' : '#64748B',
                    fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--mono)',
                  }}>{FREQ_LABEL[f]}</button>
                ))}
              </div>
            </div>

            <SliderRow label="Duration" value={years} min={1} max={30} step={1} suffix=" yrs" onChange={setYears} />
          </div>

          {/* Outputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Results */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #F59E0B30', padding: '20px 22px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 16 }}>RESULTS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>DCA Portfolio Value</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 900, color: '#F59E0B' }}>{fmt(result.finalValue)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Lump Sum (same total)</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 900, color: '#A78BFA' }}>{fmt(result.lumpSumFV)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Total Invested</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: '#E2E8F0' }}>{fmt(result.totalInvested)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Total Return</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: result.totalReturn >= 0 ? '#00D474' : '#FF4545' }}>
                    {fmt(result.totalReturn)} ({pct(result.returnPct)})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Avg Cost Basis / Period</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color: '#94A3B8' }}>${result.avgCostBasis.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Total Purchases</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color: '#94A3B8' }}>{result.totalPeriods}</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '16px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 16 }}>PORTFOLIO VALUE OVER TIME</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={result.rows} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dcaInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="dcaValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={v => `Yr ${v}`} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={v => fmt(v)} width={56} />
                  <Tooltip
                    contentStyle={{ background: '#0D1117', border: '1px solid #1E293B', borderRadius: 8, fontSize: 11 }}
                    formatter={(val: unknown, name: unknown) => [fmt(Number(val)), String(name)]}
                    labelFormatter={l => `Year ${l}`}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="invested" name="Total Invested" stroke="#3B82F6" fill="url(#dcaInvested)" strokeWidth={2} />
                  <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="#F59E0B" fill="url(#dcaValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Brutal Edge Take */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #C73E3A20', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 8 }}>🔥 BRUTAL EDGE TAKE</div>
              <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, margin: 0 }}>{take}</p>
              <p style={{ fontSize: 9, color: '#475569', margin: '10px 0 0' }}>NOT financial advice. Returns are projections, not guarantees.</p>
            </div>

            {/* FAQ */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 14 }}>FAQ</div>
              {[
                { q: 'Is DCA better than lump sum investing?', a: 'Statistically, lump sum wins ~2/3 of the time in rising markets. DCA reduces emotional risk and lowers average cost in volatile assets. The right choice depends on your risk tolerance.' },
                { q: 'How much should I DCA into Bitcoin per month?', a: 'Only invest what you can afford to lose entirely. Many start with $50–$200/month. Allocate no more than 5% of your total portfolio to any single crypto asset.' },
                { q: 'Does dollar cost averaging work in a bear market?', a: 'DCA lowers your average cost basis over time. If the asset recovers, your entry price is better than a lump sum at the peak. It requires patience — years, not months.' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 12 : 0, paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? '1px solid #1E293B40' : 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>{item.q}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.7 }}>{item.a}</div>
                </div>
              ))}
            </div>

            {/* Internal Links */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '16px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 12 }}>EXPLORE MORE</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href="/calculators/compound-interest" style={{ fontSize: 11, color: '#F59E0B', padding: '5px 12px', borderRadius: 6, background: '#F59E0B10', border: '1px solid #F59E0B20', textDecoration: 'none' }}>📈 Compound Interest Calculator</Link>
                <Link href="/crypto-101" style={{ fontSize: 11, color: '#A78BFA', padding: '5px 12px', borderRadius: 6, background: '#A78BFA10', border: '1px solid #A78BFA20', textDecoration: 'none' }}>📚 Crypto 101 — Week 4: How to Buy</Link>
                <Link href="/learn/crypto-101" style={{ fontSize: 11, color: '#60A5FA', padding: '5px 12px', borderRadius: 6, background: '#3B82F610', border: '1px solid #3B82F620', textDecoration: 'none' }}>📚 Crypto 101 — How to Buy</Link>
                <Link href="/research" style={{ fontSize: 11, color: '#A78BFA', padding: '5px 12px', borderRadius: 6, background: '#A78BFA10', border: '1px solid #A78BFA20', textDecoration: 'none' }}>🧠 The Mental Game</Link>
              </div>
            </div>

          </div>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', lineHeight: 1.6, marginTop: 32 }}>
          Projections use average historical return rates, not actual price data. Past performance does not guarantee future results. NOT financial advice.
        </p>
      </div>
    </div>
  );
}
