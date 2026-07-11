'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I calculate position size for crypto?',
      acceptedAnswer: { '@type': 'Answer', text: 'Position size = (Portfolio 횞 Risk%) / (Entry Price ??Stop Loss Price). Example: $10,000 portfolio, 1% risk, entry at $100, stop at $95. Risk per share = $5. Max loss = $100. Position size = $100/$5 = 20 shares.' },
    },
    {
      '@type': 'Question',
      name: 'What percentage of my portfolio should I risk per trade?',
      acceptedAnswer: { '@type': 'Answer', text: 'Professional traders typically risk 0.5??% per trade. Risking over 5% per trade is high-risk territory. At 1% risk, you can lose 50 consecutive trades and still have half your portfolio. At 5% risk, 14 losses wipes 50% of your capital.' },
    },
    {
      '@type': 'Question',
      name: 'What is a good risk-reward ratio?',
      acceptedAnswer: { '@type': 'Answer', text: 'A 1:2 risk-reward ratio means you risk $1 to potentially gain $2. Many traders require at minimum 1:2 before taking a position. 1:3 or higher is considered excellent. Below 1:1 means the potential loss exceeds the potential gain ??avoid these setups.' },
    },
  ],
};

function fmt(n: number, dp = 2): string {
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(dp)}`;
}

function SliderRow({
  label, value, min, max, step, prefix, suffix, onChange, highlight,
}: {
  label: string; value: number; min: number; max: number; step: number;
  prefix?: string; suffix?: string; onChange: (v: number) => void; highlight?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label style={{ fontSize: 12, color: highlight ? '#F59E0B' : '#5B6470' }}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {prefix && <span style={{ fontSize: 12, color: '#8A929C' }}>{prefix}</span>}
          <input
            type="number" value={value} min={min} max={max} step={step}
            onChange={e => onChange(Number(e.target.value))}
            style={{ width: 90, textAlign: 'right', background: '#FAFAF8', border: `1px solid ${highlight ? '#F59E0B40' : '#334155'}`, borderRadius: 6, padding: '4px 8px', fontSize: 13, fontWeight: 700, color: '#16161A', fontFamily: 'var(--mono)', outline: 'none' }}
          />
          {suffix && <span style={{ fontSize: 12, color: '#8A929C' }}>{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: highlight ? '#F59E0B' : '#C73E3A', cursor: 'pointer' }} />
    </div>
  );
}

export default function PositionSizePage() {
  const [portfolio, setPortfolio] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(100);
  const [stop, setStop] = useState(95);
  const [target, setTarget] = useState(110);

  const result = useMemo(() => {
    if (entry <= 0 || stop <= 0 || stop >= entry) return null;

    const maxLoss = portfolio * (riskPct / 100);
    const riskPerUnit = Math.abs(entry - stop);
    const positionUnits = maxLoss / riskPerUnit;
    const positionDollars = positionUnits * entry;
    const portfolioPct = (positionDollars / portfolio) * 100;

    let rrRatio: number | null = null;
    let potentialGain: number | null = null;
    if (target > entry) {
      const rewardPerUnit = target - entry;
      rrRatio = rewardPerUnit / riskPerUnit;
      potentialGain = positionUnits * rewardPerUnit;
    }

    return { maxLoss, riskPerUnit, positionUnits, positionDollars, portfolioPct, rrRatio, potentialGain };
  }, [portfolio, riskPct, entry, stop, target]);

  const take = useMemo(() => {
    if (!result) return 'Set a stop loss below your entry price to see position size.';
    const parts: string[] = [];
    if (riskPct > 10) parts.push('This is not a position. This is a coin flip with your savings.');
    else if (riskPct > 5) parts.push('Risking more than 5% on one trade is gambling, not investing.');
    else if (riskPct <= 1) parts.push('Conservative. This is how professionals manage risk.');
    else parts.push('Moderate risk. Monitor your total open positions ??this adds up.');
    if (result.rrRatio !== null) {
      if (result.rrRatio < 1) parts.push('You are risking more than you can gain. Rethink the setup.');
      else if (result.rrRatio > 3) parts.push('Strong risk/reward. But only if your stop loss is realistic.');
      else if (result.rrRatio >= 2) parts.push('Solid 1:' + result.rrRatio.toFixed(1) + ' risk/reward. Meets minimum professional standard.');
    }
    return parts.join(' ');
  }, [result, riskPct]);

  const chartData = result ? [
    { name: 'Portfolio', value: portfolio, color: '#8A929C' },
    { name: 'Position', value: Math.round(result.positionDollars), color: '#F59E0B' },
    { name: 'Max Loss', value: Math.round(result.maxLoss), color: '#EF4444' },
    ...(result.potentialGain ? [{ name: 'Target Gain', value: Math.round(result.potentialGain), color: '#00D474' }] : []),
  ] : [];

  const stopInvalid = stop >= entry;

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 20px 60px' }}>

        <Link href="/calculators" style={{ fontSize: 12, color: '#8A929C' }}>??Calculators</Link>
        <div style={{ marginTop: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#F59E0B', letterSpacing: 3, marginBottom: 8 }}>CALCULATOR 쨌 FREE</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 400, color: '#16161A', margin: '0 0 8px' }}>
            Position Size Calculator
          </h1>
          <p style={{ fontSize: 14, color: '#8A929C', margin: 0 }}>
            How much should you invest per trade? Calculate the right position size based on your risk tolerance.
          </p>
          <p style={{ fontSize: 10, color: '#8A929C', marginTop: 4, fontFamily: 'var(--mono)' }}>Last updated: April 2026 쨌 NOT financial advice</p>
        </div>

        {/* EXPLORE MORE ??top placement */}
        <div style={{ background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4', padding: '16px 20px', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8A929C', letterSpacing: 2, marginBottom: 12 }}>EXPLORE MORE</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/reports" style={{ fontSize: 11, color: '#F59E0B', padding: '5px 12px', borderRadius: 6, background: '#F59E0B10', border: '1px solid #F59E0B20', textDecoration: 'none' }}>?뱥 Deep Dive Reports</Link>
            <Link href="/learn/crypto-101" style={{ fontSize: 11, color: '#A78BFA', padding: '5px 12px', borderRadius: 6, background: '#A78BFA10', border: '1px solid #A78BFA20', textDecoration: 'none' }}>?뱴 Crypto 101 ??Reading Charts</Link>
            <Link href="/research" style={{ fontSize: 11, color: '#8B5CF6', padding: '5px 12px', borderRadius: 6, background: '#8B5CF610', border: '1px solid #8B5CF620', textDecoration: 'none' }}>?쭬 The Mental Game</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,1fr) 1.6fr', gap: 16, alignItems: 'start' }}>

          {/* Inputs */}
          <div style={{ background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4', padding: '22px 20px', position: 'sticky', top: 80 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8A929C', letterSpacing: 2, marginBottom: 18 }}>INPUTS</div>

            <SliderRow label="Total Portfolio Value" value={portfolio} min={1000} max={500000} step={1000} prefix="$" onChange={setPortfolio} />
            <SliderRow label="Risk Per Trade" value={riskPct} min={0.5} max={10} step={0.5} suffix="%" onChange={setRiskPct} highlight />
            <SliderRow label="Entry Price" value={entry} min={0.01} max={100000} step={0.01} prefix="$" onChange={setEntry} />
            <SliderRow label="Stop Loss Price" value={stop} min={0.01} max={100000} step={0.01} prefix="$" onChange={setStop} />

            {stopInvalid && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: '#EF444420', border: '1px solid #EF444440', marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: '#EF4444', fontFamily: 'var(--mono)' }}>??Stop loss must be below entry price</span>
              </div>
            )}

            <SliderRow label="Target Price (optional)" value={target} min={0} max={100000} step={0.01} prefix="$" onChange={setTarget} />
            <div style={{ fontSize: 10, color: '#8A929C', marginTop: -10 }}>Set target = 0 to skip R/R calculation</div>
          </div>

          {/* Outputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Results */}
            {result ? (
              <div style={{ background: '#FAFAF8', borderRadius: 14, border: '1px solid #F59E0B30', padding: '20px 22px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8A929C', letterSpacing: 2, marginBottom: 16 }}>RESULTS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#8A929C', marginBottom: 4 }}>Position Size (units)</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 900, color: '#F59E0B' }}>{result.positionUnits.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#8A929C', marginBottom: 4 }}>Dollar Amount to Invest</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 900, color: '#16161A' }}>{fmt(result.positionDollars)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#8A929C', marginBottom: 4 }}>Max Loss if Stop Hit</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: '#EF4444' }}>{fmt(result.maxLoss)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#8A929C', marginBottom: 4 }}>% of Portfolio at Risk</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: riskPct > 5 ? '#EF4444' : riskPct <= 1 ? '#00D474' : '#F59E0B' }}>{riskPct.toFixed(1)}%</div>
                  </div>
                  {result.rrRatio !== null && (
                    <>
                      <div>
                        <div style={{ fontSize: 10, color: '#8A929C', marginBottom: 4 }}>Risk / Reward Ratio</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: result.rrRatio >= 2 ? '#00D474' : result.rrRatio >= 1 ? '#F59E0B' : '#EF4444' }}>
                          1 : {result.rrRatio.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#8A929C', marginBottom: 4 }}>Potential Gain</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: '#00D474' }}>+{fmt(result.potentialGain!)}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4', padding: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: '#8A929C' }}>Enter a stop loss below entry price to calculate position size.</span>
              </div>
            )}

            {/* Chart */}
            {chartData.length > 0 && (
              <div style={{ background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4', padding: '16px 20px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8A929C', letterSpacing: 2, marginBottom: 16 }}>RISK / REWARD OVERVIEW</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8A929C' }} />
                    <YAxis tick={{ fontSize: 9, fill: '#8A929C' }} tickFormatter={v => fmt(v, 0)} width={56} />
                    <Tooltip
                      contentStyle={{ background: '#FAFAF8', border: '1px solid #E8E8E4', borderRadius: 8, fontSize: 11 }}
                      formatter={(val: unknown) => [fmt(Number(val)), 'Amount']}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Position sizing reference */}
            <div style={{ background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8A929C', letterSpacing: 2, marginBottom: 12 }}>RISK LEVEL REFERENCE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { range: '??1%', label: 'Conservative ??Institutional standard', color: '#00D474' },
                  { range: '1??%', label: 'Moderate ??Common among active traders', color: '#A7F3D0' },
                  { range: '2??%', label: 'Aggressive ??High conviction only', color: '#F59E0B' },
                  { range: '5??0%', label: 'Very aggressive ??Speculative', color: '#EF4444' },
                  { range: '> 10%', label: 'Reckless ??This is not risk management', color: '#B43030' },
                ].map(r => (
                  <div key={r.range} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: '1px solid #E8E8E420' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: r.color, width: 44 }}>{r.range}</span>
                    <span style={{ fontSize: 12, color: '#5B6470' }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DHLM Take */}
            <div style={{ background: '#FAFAF8', borderRadius: 14, border: '1px solid #2D2F8F20', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#2D2F8F', letterSpacing: 2, marginBottom: 8 }}>?뵦DHLM TAKE</div>
              <p style={{ fontSize: 14, color: '#16161A', lineHeight: 1.8, margin: 0 }}>{take}</p>
              <p style={{ fontSize: 9, color: '#8A929C', margin: '10px 0 0' }}>NOT financial advice. Position sizing is risk management, not a guarantee of returns.</p>
            </div>

            {/* FAQ */}
            <div style={{ background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#8A929C', letterSpacing: 2, marginBottom: 14 }}>FAQ</div>
              {[
                { q: 'How do I calculate position size for crypto?', a: 'Position size = (Portfolio 횞 Risk%) 첨 (Entry ??Stop). Example: $10K portfolio, 1% risk, entry $100, stop $95. Max loss = $100. Risk per unit = $5. Position = 20 units ($2,000 deployed).' },
                { q: 'What percentage of my portfolio should I risk per trade?', a: 'Professional traders risk 0.5??% per trade. At 1% risk, 50 consecutive losing trades still leaves 60% of your portfolio. At 5% risk, 14 losses wipes 50% of capital.' },
                { q: 'What is a good risk-reward ratio?', a: 'Minimum 1:2 means you risk $1 to gain $2. At 50% win rate, a 1:2 R/R is profitable. Most professional setups target 1:2.5 or better before taking a trade.' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 12 : 0, paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? '1px solid #E8E8E440' : 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#16161A', marginBottom: 4 }}>{item.q}</div>
                  <div style={{ fontSize: 12, color: '#5B6470', lineHeight: 1.7 }}>{item.a}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <p style={{ fontSize: 9, color: '#8A929C', textAlign: 'center', lineHeight: 1.6, marginTop: 32 }}>
          Position sizing is a risk management tool, not a guarantee of profit. Always use stops. NOT financial advice.
        </p>
      </div>
    </div>
  );
}

