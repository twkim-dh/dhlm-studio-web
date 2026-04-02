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

export interface ComboAnalysis {
  oddEven: { pattern: string; count: number; pct: number }[];
  highLow: { pattern: string; count: number; pct: number }[];
  sumRanges: { pattern: string; count: number; pct: number }[];
  consecutive: { has: number; pct: number };
}

/* ═══ Core Number Analysis ═══ */
export function analyzeNumbers(
  draws: DrawRecord[], maxNumber: number, limit: number = draws.length
): { hot: NumberStat[]; cold: NumberStat[]; overdue: NumberStat[] } {
  const subset = draws.slice(0, limit);
  const freq: Record<number, number> = {};
  const lastSeen: Record<number, number> = {};
  for (let n = 1; n <= maxNumber; n++) { freq[n] = 0; lastSeen[n] = -1; }

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
      number: n, count: freq[n] || 0,
      percentage: total > 0 ? ((freq[n] || 0) / total) * 100 : 0,
      lastSeen: lastSeen[n] === -1 ? total : lastSeen[n],
    });
  }

  return {
    hot: [...stats].sort((a, b) => b.count - a.count).slice(0, 15),
    cold: [...stats].sort((a, b) => a.count - b.count).slice(0, 15),
    overdue: [...stats].sort((a, b) => b.lastSeen - a.lastSeen).slice(0, 15),
  };
}

/* ═══ Special Ball Analysis ═══ */
export function analyzeSpecialBall(
  draws: DrawRecord[], maxNumber: number, limit: number = draws.length
): NumberStat[] {
  const subset = draws.slice(0, limit);
  const freq: Record<number, number> = {};
  const lastSeen: Record<number, number> = {};
  for (let n = 1; n <= maxNumber; n++) { freq[n] = 0; lastSeen[n] = -1; }

  subset.forEach((d, i) => {
    freq[d.special] = (freq[d.special] || 0) + 1;
    if (lastSeen[d.special] === -1) lastSeen[d.special] = i;
  });

  const total = subset.length;
  const stats: NumberStat[] = [];
  for (let n = 1; n <= maxNumber; n++) {
    stats.push({
      number: n, count: freq[n] || 0,
      percentage: total > 0 ? ((freq[n] || 0) / total) * 100 : 0,
      lastSeen: lastSeen[n] === -1 ? total : lastSeen[n],
    });
  }
  return [...stats].sort((a, b) => b.count - a.count);
}

/* ═══ Full Frequency Map (for heatmap) ═══ */
export function getFullFrequency(
  draws: DrawRecord[], maxNumber: number, limit: number = draws.length
): { number: number; count: number; pct: number }[] {
  const subset = draws.slice(0, limit);
  const freq: Record<number, number> = {};
  for (let n = 1; n <= maxNumber; n++) freq[n] = 0;
  subset.forEach(d => d.numbers.forEach(n => { freq[n] = (freq[n] || 0) + 1; }));
  const total = subset.length;
  return Array.from({ length: maxNumber }, (_, i) => ({
    number: i + 1, count: freq[i + 1] || 0,
    pct: total > 0 ? ((freq[i + 1] || 0) / total) * 100 : 0,
  }));
}

/* ═══ Combination Analysis ═══ */
export function analyzeCombo(
  draws: DrawRecord[], maxNumber: number, limit: number = draws.length
): ComboAnalysis {
  const subset = draws.slice(0, limit);
  const total = subset.length || 1;
  const mid = Math.ceil(maxNumber / 2);

  // Odd/Even patterns
  const oeCount: Record<string, number> = {};
  // High/Low patterns
  const hlCount: Record<string, number> = {};
  // Sum ranges
  const sumCount: Record<string, number> = {};
  let consecutiveCount = 0;

  subset.forEach(d => {
    const odds = d.numbers.filter(n => n % 2 === 1).length;
    const evens = 5 - odds;
    const oe = `${odds}O/${evens}E`;
    oeCount[oe] = (oeCount[oe] || 0) + 1;

    const highs = d.numbers.filter(n => n > mid).length;
    const lows = 5 - highs;
    const hl = `${lows}L/${highs}H`;
    hlCount[hl] = (hlCount[hl] || 0) + 1;

    const sum = d.numbers.reduce((a, b) => a + b, 0);
    const bucket = `${Math.floor(sum / 30) * 30}-${Math.floor(sum / 30) * 30 + 29}`;
    sumCount[bucket] = (sumCount[bucket] || 0) + 1;

    // Check for consecutive numbers
    const sorted = [...d.numbers].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] - sorted[i] === 1) { consecutiveCount++; break; }
    }
  });

  const toArr = (obj: Record<string, number>) =>
    Object.entries(obj).map(([pattern, count]) => ({ pattern, count, pct: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count);

  return {
    oddEven: toArr(oeCount),
    highLow: toArr(hlCount),
    sumRanges: toArr(sumCount).slice(0, 8),
    consecutive: { has: consecutiveCount, pct: (consecutiveCount / total) * 100 },
  };
}

/* ═══ Number Detail (for individual number pages) ═══ */
export function analyzeNumber(
  draws: DrawRecord[], targetNumber: number
): { count: number; pct: number; lastDate: string; drawsAgo: number; companions: { number: number; count: number }[] } {
  let count = 0;
  let lastDate = '';
  let drawsAgo = draws.length;
  const companionCount: Record<number, number> = {};

  draws.forEach((d, i) => {
    if (d.numbers.includes(targetNumber)) {
      count++;
      if (!lastDate) { lastDate = d.date; drawsAgo = i; }
      d.numbers.forEach(n => {
        if (n !== targetNumber) companionCount[n] = (companionCount[n] || 0) + 1;
      });
    }
  });

  const companions = Object.entries(companionCount)
    .map(([n, c]) => ({ number: Number(n), count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { count, pct: (count / draws.length) * 100, lastDate, drawsAgo, companions };
}
