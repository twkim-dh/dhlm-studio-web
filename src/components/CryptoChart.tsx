'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface ChartPoint { ts: number; price: number }

interface Props {
  points: ChartPoint[];
  isUp: boolean;
  days: number;
}

function fmtPrice(n: number): string {
  if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

function fmtDate(ts: number, days: number): string {
  const d = new Date(ts);
  if (days <= 1) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CryptoChart({ points, isUp, days }: Props) {
  if (!points || points.length === 0) return null;

  const color = isUp ? '#00D474' : '#FF4545';
  const startPrice = points[0].price;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={points} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="cgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="ts"
          tickFormatter={(v) => fmtDate(v, days)}
          tick={{ fill: '#475569', fontSize: 9, fontFamily: 'var(--mono)' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={fmtPrice}
          tick={{ fill: '#475569', fontSize: 9, fontFamily: 'var(--mono)' }}
          axisLine={false}
          tickLine={false}
          width={60}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #1E293B', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: '#E2E8F0' }}
          labelFormatter={(v) => fmtDate(Number(v), days)}
          formatter={(v) => [fmtPrice(Number(v)), 'Price']}
        />
        <ReferenceLine y={startPrice} stroke="#1E293B" strokeDasharray="4 4" />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill="url(#cgGrad)"
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: '#0B0F19', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
