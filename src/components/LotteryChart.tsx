'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
} from 'recharts';

export interface LotteryDraw {
  game: 'powerball' | 'megamillions';
  date: string;
  numbers: number[];
  specialBall: number;
  multiplier: number;
  jackpot: number;
  jackpotWon: boolean;
}

interface FrequencyProps {
  draws: LotteryDraw[];
  maxNumber: number;   // 69 for Powerball, 70 for Mega Millions
  topN?: number;       // show only top N hottest numbers (default: 20)
  color?: string;
}

interface JackpotProps {
  draws: LotteryDraw[];
  color?: string;
}

// ─── Frequency / Hot Numbers Chart ───────────────────────────────────────────
export function LotteryFrequencyChart({ draws, maxNumber, topN = 20, color = '#EF4444' }: FrequencyProps) {
  // Count frequency of each number
  const freq: Record<number, number> = {};
  for (let i = 1; i <= maxNumber; i++) freq[i] = 0;
  for (const d of draws) {
    for (const n of d.numbers) {
      if (freq[n] !== undefined) freq[n]++;
    }
  }

  // Sort by frequency, take top N
  const data = Object.entries(freq)
    .map(([n, count]) => ({ number: Number(n), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)
    .sort((a, b) => a.number - b.number); // re-sort by number for display

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="20%">
        <XAxis
          dataKey="number"
          tick={{ fill: '#475569', fontSize: 9, fontFamily: 'var(--mono)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide domain={[0, maxCount]} />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #1E293B', borderRadius: 8, fontSize: 11, fontFamily: 'var(--mono)', color: '#E2E8F0' }}
          formatter={(v) => [Number(v), 'times drawn']}
          labelFormatter={(v) => `Number ${v}`}
          cursor={{ fill: '#1E293B40' }}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.number}
              fill={entry.count === maxCount ? color : `${color}80`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Jackpot History Chart ────────────────────────────────────────────────────
export function LotteryJackpotChart({ draws, color = '#EF4444' }: JackpotProps) {
  if (!draws || draws.length === 0) return null;

  // Sort chronologically, format for chart
  const data = [...draws]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      date: d.date.slice(5),  // "MM-DD"
      jackpot: Math.round(d.jackpot / 1e6), // millions
      won: d.jackpotWon,
    }));

  const fmtM = (v: number) => `$${v}M`;

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="jackpotGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#1E293B" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#475569', fontSize: 9, fontFamily: 'var(--mono)' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={fmtM}
          tick={{ fill: '#475569', fontSize: 9, fontFamily: 'var(--mono)' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #1E293B', borderRadius: 8, fontSize: 11, fontFamily: 'var(--mono)', color: '#E2E8F0' }}
          formatter={(v) => [`$${Number(v)}M`, 'Jackpot']}
          labelFormatter={(v) => `Date: ${v}`}
        />
        <Area
          type="monotone"
          dataKey="jackpot"
          stroke={color}
          strokeWidth={2}
          fill="url(#jackpotGrad)"
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (!payload.won) return <g key={`dot-${props.index}`} />;
            // Mark jackpot wins with a star dot
            return (
              <circle
                key={`dot-${props.index}`}
                cx={cx} cy={cy} r={5}
                fill={color} stroke="#0B0F19" strokeWidth={2}
              />
            );
          }}
          activeDot={{ r: 4, fill: color, stroke: '#0B0F19', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Combined component (default export) ──────────────────────────────────────
interface LotteryChartProps {
  draws: LotteryDraw[];
  game: 'powerball' | 'megamillions';
  showFrequency?: boolean;
  showJackpot?: boolean;
}

const COLORS = { powerball: '#EF4444', megamillions: '#3B82F6' };

export default function LotteryChart({ draws, game, showFrequency = true, showJackpot = true }: LotteryChartProps) {
  const color = COLORS[game];
  const maxNumber = game === 'powerball' ? 69 : 70;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showFrequency && (
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 8 }}>
            TOP 20 HOT NUMBERS ({draws.length} DRAWS)
          </div>
          <LotteryFrequencyChart draws={draws} maxNumber={maxNumber} topN={20} color={color} />
        </div>
      )}
      {showJackpot && (
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 8 }}>
            JACKPOT HISTORY (MILLIONS $)
          </div>
          <LotteryJackpotChart draws={draws} color={color} />
        </div>
      )}
    </div>
  );
}
