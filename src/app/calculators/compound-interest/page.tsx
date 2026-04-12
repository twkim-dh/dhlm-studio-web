'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── SEO metadata exported separately (server-compatible) ────────────────────
// (metadata export is in a separate layout or via generateMetadata — handled below via JSON-LD)

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much will $500 a month grow in 20 years?',
      acceptedAnswer: { '@type': 'Answer', text: 'At a 7% annual return compounded monthly, $500/month over 20 years grows to approximately $260,000 — from $120,000 invested. Compounding turns $140,000 in interest into your total.' },
    },
    {
      '@type': 'Question',
      name: 'What is the formula for compound interest with monthly contributions?',
      acceptedAnswer: { '@type': 'Answer', text: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) / (r/n)]. Where P = principal, r = annual rate, n = compounds per year, t = years, PMT = periodic contribution.' },
    },
    {
      '@type': 'Question',
      name: 'How does compound frequency affect returns?',
      acceptedAnswer: { '@type': 'Answer', text: 'More frequent compounding produces slightly higher returns. Monthly compounding on a 7% rate gives an effective annual rate of ~7.23%. The difference matters more over longer time horizons.' },
    },
  ],
};

const FREQ_OPTIONS = [
  { label: 'Monthly', n: 12 },
  { label: 'Quarterly', n: 4 },
  { label: 'Annually', n: 1 },
];

function fmt(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
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
        <label style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'var(--sans)' }}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {prefix && <span style={{ fontSize: 12, color: '#64748B' }}>{prefix}</span>}
          <input
            type="number" value={value} min={min} max={max} step={step}
            onChange={e => onChange(Number(e.target.value))}
            style={{ width: 90, textAlign: 'right', background: '#0D1117', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', fontSize: 13, fontWeight: 700, color: '#F1F5F9', fontFamily: 'var(--mono)', outline: 'none' }}
          />
          {suffix && <span style={{ fontSize: 12, color: '#64748B' }}>{suffix}</span>}
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
      />
    </div>
  );
}

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [freqIdx, setFreqIdx] = useState(0); // 0=monthly

  const freq = FREQ_OPTIONS[freqIdx];

  const result = useMemo(() => {
    const r = rate / 100;
    const n = freq.n;
    const t = years;
    const P = principal;
    const PMT = monthly * (12 / n); // convert monthly → per-period

    const rows: { year: number; balance: number; contributions: number; interest: number }[] = [];
    let balance = P;
    let totalContrib = P;

    for (let yr = 1; yr <= t; yr++) {
      // Compound for `n` periods within this year
      const prevBalance = balance;
      const prevContrib = totalContrib;
      for (let period = 0; period < n; period++) {
        balance = balance * (1 + r / n) + PMT;
        totalContrib += PMT;
      }
      rows.push({
        year: yr,
        balance: Math.round(balance),
        contributions: Math.round(totalContrib),
        interest: Math.round(balance - totalContrib),
      });
    }

    const finalBalance = balance;
    const totalContributions = totalContrib;
    const totalInterest = finalBalance - totalContributions;

    return { finalBalance, totalContributions, totalInterest, rows };
  }, [principal, monthly, rate, years, freqIdx, freq.n]);

  // Brutal Edge Take
  const take = useMemo(() => {
    const parts: string[] = [];
    if (rate > 15) parts.push('If someone promised you this rate, ask harder questions.');
    else if (rate > 10) parts.push('10%+ annual returns are historically rare. Plan conservatively.');
    if (result.totalInterest > result.totalContributions) parts.push('Your money earned more than you put in. That is compounding.');
    if (years >= 20) parts.push('Time is the most powerful variable here. Not the rate.');
    if (monthly === 0) parts.push('Compounding works better when you keep adding fuel.');
    if (parts.length === 0) parts.push('Consistent contributions over time beat trying to time the market.');
    return parts.join(' ');
  }, [rate, result.totalInterest, result.totalContributions, years, monthly]);

  const chartData = result.rows.filter((_, i) => i % Math.max(1, Math.floor(years / 20)) === 0 || _ === result.rows[result.rows.length - 1]);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 20px 60px' }}>

        {/* Header */}
        <Link href="/calculators" style={{ fontSize: 12, color: '#64748B' }}>← Calculators</Link>
        <div style={{ marginTop: 20, marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#F59E0B', letterSpacing: 3, marginBottom: 8 }}>CALCULATOR · FREE</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 8px' }}>
            Compound Interest Calculator
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            See how your money grows over time — with contributions included. Real-time results, no account needed.
          </p>
          <p style={{ fontSize: 10, color: '#334155', marginTop: 4, fontFamily: 'var(--mono)' }}>Last updated: April 2026 · NOT financial advice</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,1fr) 1.6fr', gap: 16, alignItems: 'start' }}>

          {/* ── Inputs ── */}
          <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '22px 20px', position: 'sticky', top: 80 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 18 }}>INPUTS</div>

            <SliderRow label="Initial Investment" value={principal} min={0} max={500000} step={1000} prefix="$" onChange={setPrincipal} />
            <SliderRow label="Monthly Contribution" value={monthly} min={0} max={10000} step={50} prefix="$" onChange={setMonthly} />
            <SliderRow label="Annual Interest Rate" value={rate} min={0.1} max={20} step={0.1} suffix="%" onChange={setRate} />
            <SliderRow label="Investment Period" value={years} min={1} max={50} step={1} suffix=" yrs" onChange={setYears} />

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>Compound Frequency</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {FREQ_OPTIONS.map((f, i) => (
                  <button key={f.label} onClick={() => setFreqIdx(i)} style={{
                    flex: 1, padding: '7px 0', borderRadius: 8, border: '1px solid',
                    borderColor: freqIdx === i ? '#F59E0B' : '#1E293B',
                    background: freqIdx === i ? '#F59E0B18' : '#0D1117',
                    color: freqIdx === i ? '#F59E0B' : '#64748B',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--mono)',
                  }}>{f.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Outputs ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Big numbers */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #F59E0B30', padding: '20px 22px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 16 }}>RESULTS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Final Balance</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 900, color: '#F59E0B' }}>{fmt(result.finalBalance)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Total Interest Earned</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 900, color: '#00D474' }}>{fmt(result.totalInterest)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Total Contributions</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: '#E2E8F0' }}>{fmt(result.totalContributions)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>Interest % of Balance</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: '#A78BFA' }}>
                    {((result.totalInterest / result.finalBalance) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '16px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 16 }}>GROWTH CHART</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={result.rows} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="contributions" name="Contributions" stroke="#3B82F6" fill="url(#gContrib)" strokeWidth={2} />
                  <Area type="monotone" dataKey="balance" name="Total Balance" stroke="#F59E0B" fill="url(#gBalance)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Year-by-year table */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '16px 20px', overflowX: 'auto' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 12 }}>YEAR-BY-YEAR BREAKDOWN</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}>
                    {['Year', 'Balance', 'Contributions', 'Interest'].map(h => (
                      <th key={h} style={{ textAlign: 'right', padding: '6px 8px', color: '#475569', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.filter((_, i) => i % Math.max(1, Math.floor(years / 15)) === 0 || i === result.rows.length - 1).map(row => (
                    <tr key={row.year} style={{ borderBottom: '1px solid #1E293B20' }}>
                      <td style={{ textAlign: 'right', padding: '5px 8px', color: '#64748B', fontFamily: 'var(--mono)' }}>{row.year}</td>
                      <td style={{ textAlign: 'right', padding: '5px 8px', color: '#F59E0B', fontFamily: 'var(--mono)', fontWeight: 700 }}>{fmt(row.balance)}</td>
                      <td style={{ textAlign: 'right', padding: '5px 8px', color: '#3B82F6', fontFamily: 'var(--mono)' }}>{fmt(row.contributions)}</td>
                      <td style={{ textAlign: 'right', padding: '5px 8px', color: '#00D474', fontFamily: 'var(--mono)' }}>{fmt(row.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Brutal Edge Take */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #C73E3A20', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 8 }}>🔥 BRUTAL EDGE TAKE</div>
              <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, margin: 0 }}>{take}</p>
              <p style={{ fontSize: 9, color: '#475569', margin: '10px 0 0' }}>NOT financial advice. For educational purposes only.</p>
            </div>

            {/* FAQ */}
            <div style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 14 }}>FAQ</div>
              {[
                { q: 'How much will $500 a month grow in 20 years?', a: 'At 7% annual return compounded monthly, $500/month over 20 years grows to ~$260K from $121K invested. Interest earned exceeds contributions — that\'s compounding in action.' },
                { q: 'What is the formula for compound interest?', a: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) / (r/n)]. P = principal, r = annual rate, n = compounds/year, t = years, PMT = periodic payment.' },
                { q: 'How does compound frequency affect returns?', a: 'Monthly compounding slightly beats quarterly, which beats annual. On $10K at 7% over 20 years: monthly = $40,996 vs annual = $38,697. Small difference, but it adds up.' },
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
                <Link href="/calculators/dca" style={{ fontSize: 11, color: '#F59E0B', padding: '5px 12px', borderRadius: 6, background: '#F59E0B10', border: '1px solid #F59E0B20', textDecoration: 'none' }}>📊 DCA Calculator</Link>
                <Link href="/calculators/position-size" style={{ fontSize: 11, color: '#A78BFA', padding: '5px 12px', borderRadius: 6, background: '#A78BFA10', border: '1px solid #A78BFA20', textDecoration: 'none' }}>🎯 Position Size Calculator</Link>
                <Link href="/crypto-101" style={{ fontSize: 11, color: '#60A5FA', padding: '5px 12px', borderRadius: 6, background: '#3B82F610', border: '1px solid #3B82F620', textDecoration: 'none' }}>📚 Crypto 101 — Staking Yields</Link>
                <Link href="/daily" style={{ fontSize: 11, color: '#00D474', padding: '5px 12px', borderRadius: 6, background: '#00D47410', border: '1px solid #00D47420', textDecoration: 'none' }}>📰 Today&apos;s Market Brief</Link>
              </div>
            </div>

          </div>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', lineHeight: 1.6, marginTop: 32 }}>
          Results are projections based on constant rate assumptions. Past returns do not guarantee future results. NOT financial advice.
        </p>
      </div>
    </div>
  );
}
