export interface DrawRecord {
  date: string;
  numbers: number[];
  special: number; // pb or mb
  multiplier?: number;
}

export interface NumberStat {
  number: number;
  count: number;
  percentage: number;
  lastSeen: number; // draws ago
}

export function analyzeNumbers(
  draws: DrawRecord[],
  maxNumber: number,
  limit: number = draws.length
): { hot: NumberStat[]; cold: NumberStat[]; overdue: NumberStat[] } {
  const subset = draws.slice(0, limit);
  const freq: Record<number, number> = {};
  const lastSeen: Record<number, number> = {};

  for (let n = 1; n <= maxNumber; n++) {
    freq[n] = 0;
    lastSeen[n] = -1;
  }

  subset.forEach((d, i) => {
    d.numbers.forEach(n => {
      freq[n] = (freq[n] || 0) + 1;
      if (lastSeen[n] === -1) lastSeen[n] = i;
    });
  });

  const total = subset.length;
  const stats: NumberStat[] = [];
  for (let n = 1; n <= maxNumber; n++) {
    stats.push({
      number: n,
      count: freq[n] || 0,
      percentage: total > 0 ? ((freq[n] || 0) / total) * 100 : 0,
      lastSeen: lastSeen[n] === -1 ? total : lastSeen[n],
    });
  }

  const hot = [...stats].sort((a, b) => b.count - a.count).slice(0, 10);
  const cold = [...stats].sort((a, b) => a.count - b.count).slice(0, 10);
  const overdue = [...stats].sort((a, b) => b.lastSeen - a.lastSeen).slice(0, 10);

  return { hot, cold, overdue };
}

export function analyzeSpecialBall(
  draws: DrawRecord[],
  maxNumber: number,
  limit: number = draws.length
): NumberStat[] {
  const subset = draws.slice(0, limit);
  const freq: Record<number, number> = {};
  const lastSeen: Record<number, number> = {};

  for (let n = 1; n <= maxNumber; n++) {
    freq[n] = 0;
    lastSeen[n] = -1;
  }

  subset.forEach((d, i) => {
    freq[d.special] = (freq[d.special] || 0) + 1;
    if (lastSeen[d.special] === -1) lastSeen[d.special] = i;
  });

  const total = subset.length;
  const stats: NumberStat[] = [];
  for (let n = 1; n <= maxNumber; n++) {
    stats.push({
      number: n,
      count: freq[n] || 0,
      percentage: total > 0 ? ((freq[n] || 0) / total) * 100 : 0,
      lastSeen: lastSeen[n] === -1 ? total : lastSeen[n],
    });
  }

  return [...stats].sort((a, b) => b.count - a.count);
}
