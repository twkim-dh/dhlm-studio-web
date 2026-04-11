import pbHistory from '../../public/data/powerball-history.json';
import mmHistory from '../../public/data/megamillions-history.json';

export interface LotteryDraw {
  game: 'powerball' | 'megamillions';
  date: string;
  numbers: number[];
  specialBall: number;
  multiplier: number;
  jackpot: number;      // 0 when not available from data source
  jackpotWon: boolean;
}

type PBRaw = { date: string; numbers: number[]; pb: number; multiplier: number };
type MMRaw = { date: string; numbers: number[]; mb: number; multiplier: number };

export const POWERBALL_DRAWS: LotteryDraw[] = (pbHistory as PBRaw[]).slice(0, 20).map(d => ({
  game: 'powerball',
  date: d.date,
  numbers: d.numbers,
  specialBall: d.pb,
  multiplier: d.multiplier,
  jackpot: 0,
  jackpotWon: false,
}));

export const MEGAMILLIONS_DRAWS: LotteryDraw[] = (mmHistory as MMRaw[]).slice(0, 20).map(d => ({
  game: 'megamillions',
  date: d.date,
  numbers: d.numbers,
  specialBall: d.mb,
  multiplier: d.multiplier,
  jackpot: 0,
  jackpotWon: false,
}));

// Update these manually when jackpot amounts are known.
// Next draw dates auto-follow the draw schedule (Mon/Wed/Sat for PB, Tue/Fri for MM).
export const JACKPOT_INFO = {
  powerball: { current: 455000000, nextDraw: '2026-04-13', nextDay: 'Monday' },
  megamillions: { current: 331000000, nextDraw: '2026-04-14', nextDay: 'Tuesday' },
};

export function generatePowerball(): { numbers: number[]; powerball: number } {
  const nums = new Set<number>();
  while (nums.size < 5) { const a = new Uint32Array(1); crypto.getRandomValues(a); nums.add((a[0] % 69) + 1); }
  const pb = new Uint32Array(1); crypto.getRandomValues(pb);
  return { numbers: [...nums].sort((a, b) => a - b), powerball: (pb[0] % 26) + 1 };
}

export function generateMegaMillions(): { numbers: number[]; megaBall: number } {
  const nums = new Set<number>();
  while (nums.size < 5) { const a = new Uint32Array(1); crypto.getRandomValues(a); nums.add((a[0] % 70) + 1); }
  const mb = new Uint32Array(1); crypto.getRandomValues(mb);
  return { numbers: [...nums].sort((a, b) => a - b), megaBall: (mb[0] % 25) + 1 };
}
