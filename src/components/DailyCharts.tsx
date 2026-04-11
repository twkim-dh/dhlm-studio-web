'use client';
/**
 * DailyCharts — Index Return BarChart + Fear & Greed SVG gauge
 * Used in /daily/[slug]/page.tsx
 * Data is passed as props from parsed frontmatter (spPct, nasPct, dowPct, fgScore, fgLabel)
 */
import { BarChart, Bar, XAxis, YAxis, Cell, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  spPct:  number;
  nasPct: number;
  dowPct: number;
  fgScore: number;
  fgLabel: string;
}

function fgColor(score: number): string {
  if (score <= 25) return '#C73E3A';
  if (score <= 45) return '#F59E0B';
  if (score <= 55) return '#94A3B8';
  if (score <= 75) return '#60A5FA';
  return '#00D474';
}

/** SVG half-circle gauge, left = 0, right = 100 */
function FGGauge({ score, color }: { score: number; color: string }) {
  const r = 32, cx = 40, cy = 38;
  // angle in standard math: π at score=0, 0 at score=100
  const angle  = Math.PI - (score / 100) * Math.PI;
  const x2     = cx + r * Math.cos(angle);
  const y2     = cy - r * Math.sin(angle); // SVG Y is flipped
  const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const fgPath = score > 0 && score < 100
    ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
    : score >= 100 ? bgPath : '';

  return (
    <svg width={80} height={46} viewBox="0 0 80 46" style={{ display: 'block' }}>
      <path d={bgPath} fill="none" stroke="#1E293B" strokeWidth={7} strokeLinecap="round" />
      {fgPath && <path d={fgPath} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />}
    </svg>
  );
}

export default function DailyCharts({ spPct, nasPct, dowPct, fgScore, fgLabel }: Props) {
  const indexData = [
    { name: 'Dow',    pct: dowPct  },
    { name: 'Nasdaq', pct: nasPct  },
    { name: 'S&P',    pct: spPct   },
  ];

  const color = fgColor(fgScore);
  const sign  = (n: number) => n >= 0 ? '+' : '';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 10, margin: '16px 0 24px' }}>

      {/* ── Index Returns bar chart ─────────────────────────────────────── */}
      <div style={{ background: '#0D1117', borderRadius: 12, padding: '14px 10px 10px', border: '1px solid #1E293B' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: 1.5, marginBottom: 10 }}>
          INDEX RETURNS
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={indexData} layout="vertical" margin={{ top: 0, right: 44, bottom: 0, left: 44 }}>
            <XAxis
              type="number"
              domain={['dataMin - 0.4', 'dataMax + 0.4']}
              tickFormatter={(v: number) => `${sign(v)}${v.toFixed(1)}%`}
              tick={{ fontSize: 9, fill: '#475569', fontFamily: 'var(--mono)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="name"
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'var(--mono)', fontWeight: 700 }}
              width={40} axisLine={false} tickLine={false}
            />
            <ReferenceLine x={0} stroke="#1E293B" />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [`${Number(v) >= 0 ? '+' : ''}${Number(v).toFixed(2)}%`, '']}
              contentStyle={{ background: '#0D1117', border: '1px solid #1E293B', borderRadius: 6, fontSize: 10, fontFamily: 'var(--mono)' }}
              cursor={false}
            />
            <Bar dataKey="pct" radius={[0, 3, 3, 0]} maxBarSize={18}>
              {indexData.map((entry, i) => (
                <Cell key={i} fill={entry.pct >= 0 ? '#00D474' : '#C73E3A'} opacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Fear & Greed gauge ──────────────────────────────────────────── */}
      <div style={{ background: '#0D1117', borderRadius: 12, padding: '14px 8px 10px', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: 1.5, textAlign: 'center', marginBottom: 4 }}>
          FEAR & GREED
        </div>
        <FGGauge score={fgScore} color={color} />
        <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 900, color, lineHeight: 1, marginTop: 2 }}>
          {fgScore}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#475569', letterSpacing: 1, textTransform: 'uppercase' }}>
          {fgLabel}
        </div>
      </div>

    </div>
  );
}
