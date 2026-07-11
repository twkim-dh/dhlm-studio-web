'use client';
/**
 * BeafRadarChart — renders a Recharts RadarChart for axis scores.
 * Accepts normalized scores (0–100 per axis) extracted from report body.
 * Used in /reports/[slug]/page.tsx for deep-dive reports.
 */
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

export interface BeafAxisScore {
  axis:  string;   // short label: "GROWTH", "PROFIT", "MOAT", "VALUE", "RISK", "MOM"
  score: number;   // normalized 0–100 (raw / max * 100)
  raw:   number;   // actual score
  max:   number;   // max possible for this axis
}

interface Props {
  scores:    BeafAxisScore[];
  totalScore: number;
  grade:     string;
}

function gradeColor(score: number): string {
  if (score >= 80) return '#00D474';
  if (score >= 65) return '#2D2F8F';
  if (score >= 50) return '#D4A843';
  return '#C73E3A';
}

// Abbreviate long axis names to fit on radar
const AXIS_LABEL: Record<string, string> = {
  GROWTH:        'GROWTH',
  PROFITABILITY: 'PROFIT',
  MOAT:          'MOAT',
  VALUATION:     'VALUE',
  RISK:          'RISK',
  MOMENTUM:      'MOM',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d: BeafAxisScore = payload[0]?.payload;
  return (
    <div style={{ background: '#FAFAF8', border: '1px solid #E8E8E4', borderRadius: 6, padding: '6px 10px', fontSize: 10, fontFamily: 'var(--mono)' }}>
      <div style={{ color: '#5B6470' }}>{d.axis}</div>
      <div style={{ color: '#16161A', fontWeight: 700 }}>{d.raw} / {d.max}</div>
    </div>
  );
};

export default function BeafRadarChart({ scores, totalScore, grade }: Props) {
  const color = gradeColor(totalScore);

  const chartData = scores.map(s => ({
    ...s,
    axis: AXIS_LABEL[s.axis] ?? s.axis,
    fullMark: 100,
  }));

  return (
    <div style={{ background: '#FAFAF8', borderRadius: 14, padding: '16px', border: '1px solid #E8E8E4', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#8A929C', letterSpacing: 1.5 }}>
          ANALYSIS FRAMEWORK
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{totalScore}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#8A929C' }}>/100</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color, marginLeft: 4 }}>({grade})</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
        {/* Radar chart */}
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart data={chartData} margin={{ top: 6, right: 16, bottom: 6, left: 16 }}>
            <PolarGrid stroke="#1E293B" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 9, fill: '#8A929C', fontFamily: 'var(--mono)', fontWeight: 700 }}
            />
            <PolarRadiusAxis domain={[0, 100]} angle={90} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Radar name="BEAF" dataKey="score" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2} dot={false} />
          </RadarChart>
        </ResponsiveContainer>

        {/* Score list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 90 }}>
          {scores.map(s => {
            const pct = Math.round(s.score);
            return (
              <div key={s.axis} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#8A929C', letterSpacing: 0.5 }}>
                    {AXIS_LABEL[s.axis] ?? s.axis}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#16161A' }}>
                    {s.raw}/{s.max}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div style={{ height: 3, background: '#FFFFFF', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
