export interface LotteryDraw {
  game: 'powerball' | 'megamillions';
  date: string;
  numbers: number[];
  specialBall: number;
  multiplier: number;
  jackpot: number;
  jackpotWon: boolean;
}

export const POWERBALL_DRAWS: LotteryDraw[] = [
  { game: 'powerball', date: '2026-03-29', numbers: [7, 21, 55, 56, 64], specialBall: 26, multiplier: 4, jackpot: 427000000, jackpotWon: false },
  { game: 'powerball', date: '2026-03-26', numbers: [3, 18, 33, 44, 62], specialBall: 11, multiplier: 2, jackpot: 395000000, jackpotWon: false },
  { game: 'powerball', date: '2026-03-22', numbers: [12, 25, 38, 51, 69], specialBall: 8, multiplier: 3, jackpot: 368000000, jackpotWon: false },
  { game: 'powerball', date: '2026-03-19', numbers: [5, 14, 29, 47, 63], specialBall: 19, multiplier: 5, jackpot: 342000000, jackpotWon: false },
  { game: 'powerball', date: '2026-03-15', numbers: [9, 22, 41, 53, 67], specialBall: 3, multiplier: 2, jackpot: 315000000, jackpotWon: false },
  { game: 'powerball', date: '2026-03-12', numbers: [1, 16, 35, 49, 58], specialBall: 22, multiplier: 3, jackpot: 290000000, jackpotWon: false },
  { game: 'powerball', date: '2026-03-08', numbers: [11, 27, 36, 50, 66], specialBall: 15, multiplier: 4, jackpot: 265000000, jackpotWon: false },
  { game: 'powerball', date: '2026-03-05', numbers: [4, 19, 32, 45, 61], specialBall: 7, multiplier: 2, jackpot: 240000000, jackpotWon: false },
  { game: 'powerball', date: '2026-03-01', numbers: [8, 23, 39, 54, 68], specialBall: 12, multiplier: 3, jackpot: 215000000, jackpotWon: false },
  { game: 'powerball', date: '2026-02-26', numbers: [6, 17, 30, 43, 59], specialBall: 20, multiplier: 2, jackpot: 190000000, jackpotWon: false },
];

export const MEGAMILLIONS_DRAWS: LotteryDraw[] = [
  { game: 'megamillions', date: '2026-03-28', numbers: [4, 13, 52, 53, 69], specialBall: 10, multiplier: 3, jackpot: 312000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-03-25', numbers: [8, 22, 37, 48, 65], specialBall: 17, multiplier: 2, jackpot: 285000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-03-21', numbers: [15, 28, 41, 56, 70], specialBall: 5, multiplier: 4, jackpot: 260000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-03-18', numbers: [2, 19, 34, 47, 63], specialBall: 22, multiplier: 2, jackpot: 238000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-03-14', numbers: [11, 25, 39, 51, 67], specialBall: 8, multiplier: 3, jackpot: 215000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-03-11', numbers: [6, 20, 33, 45, 61], specialBall: 14, multiplier: 2, jackpot: 192000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-03-07', numbers: [3, 17, 30, 44, 58], specialBall: 21, multiplier: 5, jackpot: 170000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-03-04', numbers: [9, 24, 38, 55, 66], specialBall: 3, multiplier: 2, jackpot: 150000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-02-28', numbers: [14, 27, 42, 50, 64], specialBall: 19, multiplier: 3, jackpot: 132000000, jackpotWon: false },
  { game: 'megamillions', date: '2026-02-25', numbers: [7, 21, 35, 49, 62], specialBall: 11, multiplier: 2, jackpot: 115000000, jackpotWon: false },
];

export const JACKPOT_INFO = {
  powerball: { current: 427000000, nextDraw: '2026-04-02', nextDay: 'Wednesday' },
  megamillions: { current: 312000000, nextDraw: '2026-04-01', nextDay: 'Tuesday' },
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
