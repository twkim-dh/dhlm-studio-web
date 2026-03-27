// World Lottery data & generator — uses crypto.getRandomValues()

export interface LotteryDef {
  id: string;
  name: string;
  country: string;
  flag: string;
  mainNumbers: { min: number; max: number; count: number };
  bonusNumbers: { min: number; max: number; count: number; name: string } | null;
  drawDays: string[];
  color: string;
  seoTitle: string;
  seoDesc: string;
  ageRestriction: string;
}

export interface GeneratedResult {
  main: number[];
  bonus: number[] | null;
  bonusName: string | null;
}

function cryptoPick(min: number, max: number, count: number): number[] {
  const range = max - min + 1;
  const result: number[] = [];
  while (result.length < count) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const n = (arr[0] % range) + min;
    if (!result.includes(n)) result.push(n);
  }
  return result.sort((a, b) => a - b);
}

export function generateLottery(lottery: LotteryDef, sets: number = 1): GeneratedResult[] {
  const results: GeneratedResult[] = [];
  for (let i = 0; i < sets; i++) {
    const main = cryptoPick(lottery.mainNumbers.min, lottery.mainNumbers.max, lottery.mainNumbers.count);
    let bonus: number[] | null = null;
    if (lottery.bonusNumbers) {
      bonus = cryptoPick(lottery.bonusNumbers.min, lottery.bonusNumbers.max, lottery.bonusNumbers.count);
    }
    results.push({ main, bonus, bonusName: lottery.bonusNumbers?.name || null });
  }
  return results;
}

export const worldLotteries: LotteryDef[] = [
  {
    id: 'korea-lotto',
    name: 'Lotto 6/45',
    country: '🇰🇷',
    flag: 'kr',
    mainNumbers: { min: 1, max: 45, count: 6 },
    bonusNumbers: null,
    drawDays: ['Saturday'],
    color: '#8B2500',
    seoTitle: 'Korea Lotto 6/45 Number Generator',
    seoDesc: 'Generate random Korea Lotto 6/45 numbers. Free lottery number picker with secure random generation.',
    ageRestriction: '만 18세 이상',
  },
  {
    id: 'us-powerball',
    name: 'Powerball',
    country: '🇺🇸',
    flag: 'us',
    mainNumbers: { min: 1, max: 69, count: 5 },
    bonusNumbers: { min: 1, max: 26, count: 1, name: 'Powerball' },
    drawDays: ['Monday', 'Wednesday', 'Saturday'],
    color: '#DC2626',
    seoTitle: 'Free Powerball Number Generator',
    seoDesc: 'Generate random Powerball numbers instantly. Pick 5 numbers (1-69) + 1 Powerball (1-26). Free & secure.',
    ageRestriction: '18+ (varies by state)',
  },
  {
    id: 'us-megamillions',
    name: 'Mega Millions',
    country: '🇺🇸',
    flag: 'us',
    mainNumbers: { min: 1, max: 70, count: 5 },
    bonusNumbers: { min: 1, max: 25, count: 1, name: 'Mega Ball' },
    drawDays: ['Tuesday', 'Friday'],
    color: '#F59E0B',
    seoTitle: 'Free Mega Millions Number Generator',
    seoDesc: 'Generate Mega Millions numbers. Pick 5 (1-70) + 1 Mega Ball (1-25). Cryptographically secure random.',
    ageRestriction: '18+ (varies by state)',
  },
  {
    id: 'euromillions',
    name: 'EuroMillions',
    country: '🇪🇺',
    flag: 'eu',
    mainNumbers: { min: 1, max: 50, count: 5 },
    bonusNumbers: { min: 1, max: 12, count: 2, name: 'Lucky Stars' },
    drawDays: ['Tuesday', 'Friday'],
    color: '#2563EB',
    seoTitle: 'Free EuroMillions Number Generator',
    seoDesc: 'Generate EuroMillions numbers. Pick 5 (1-50) + 2 Lucky Stars (1-12). Free random number picker.',
    ageRestriction: '18+',
  },
  {
    id: 'eurojackpot',
    name: 'EuroJackpot',
    country: '🇪🇺',
    flag: 'eu',
    mainNumbers: { min: 1, max: 50, count: 5 },
    bonusNumbers: { min: 1, max: 12, count: 2, name: 'Euro Numbers' },
    drawDays: ['Tuesday', 'Friday'],
    color: '#7C3AED',
    seoTitle: 'Free EuroJackpot Number Generator',
    seoDesc: 'Generate EuroJackpot numbers. Pick 5 (1-50) + 2 Euro Numbers (1-12). Free & secure.',
    ageRestriction: '18+',
  },
  {
    id: 'uk-lottery',
    name: 'UK National Lottery',
    country: '🇬🇧',
    flag: 'gb',
    mainNumbers: { min: 1, max: 59, count: 6 },
    bonusNumbers: null,
    drawDays: ['Wednesday', 'Saturday'],
    color: '#1D4ED8',
    seoTitle: 'Free UK Lottery Number Generator',
    seoDesc: 'Generate UK National Lottery numbers. Pick 6 numbers from 1-59. Free random number generator.',
    ageRestriction: '18+',
  },
  {
    id: 'japan-loto6',
    name: 'Loto 6',
    country: '🇯🇵',
    flag: 'jp',
    mainNumbers: { min: 1, max: 43, count: 6 },
    bonusNumbers: null,
    drawDays: ['Monday', 'Thursday'],
    color: '#DC2626',
    seoTitle: 'Free Japan Loto 6 Number Generator',
    seoDesc: 'Generate Japan Loto 6 numbers. Pick 6 from 1-43. Free lottery number picker.',
    ageRestriction: '20+',
  },
  {
    id: 'australia-powerball',
    name: 'Powerball AU',
    country: '🇦🇺',
    flag: 'au',
    mainNumbers: { min: 1, max: 35, count: 7 },
    bonusNumbers: { min: 1, max: 20, count: 1, name: 'Powerball' },
    drawDays: ['Thursday'],
    color: '#16A34A',
    seoTitle: 'Free Australia Powerball Number Generator',
    seoDesc: 'Generate Australian Powerball numbers. Pick 7 (1-35) + 1 Powerball (1-20). Free & secure.',
    ageRestriction: '18+',
  },
  {
    id: 'brazil-megasena',
    name: 'Mega Sena',
    country: '🇧🇷',
    flag: 'br',
    mainNumbers: { min: 1, max: 60, count: 6 },
    bonusNumbers: null,
    drawDays: ['Wednesday', 'Saturday'],
    color: '#16A34A',
    seoTitle: 'Free Mega Sena Number Generator',
    seoDesc: 'Generate Brazil Mega Sena numbers. Pick 6 from 1-60. Free lottery number generator.',
    ageRestriction: '18+',
  },
  {
    id: 'canada-lottomax',
    name: 'Lotto Max',
    country: '🇨🇦',
    flag: 'ca',
    mainNumbers: { min: 1, max: 50, count: 7 },
    bonusNumbers: null,
    drawDays: ['Tuesday', 'Friday'],
    color: '#DC2626',
    seoTitle: 'Free Canada Lotto Max Number Generator',
    seoDesc: 'Generate Lotto Max numbers. Pick 7 from 1-50. Free Canadian lottery number picker.',
    ageRestriction: '18+',
  },
];

export function getLotteryById(id: string): LotteryDef | undefined {
  return worldLotteries.find((l) => l.id === id);
}

export function getLotteryBySlug(slug: string): LotteryDef | undefined {
  const slugMap: Record<string, string> = {
    'powerball': 'us-powerball',
    'mega-millions': 'us-megamillions',
    'euromillions': 'euromillions',
    'eurojackpot': 'eurojackpot',
    'uk-lottery': 'uk-lottery',
    'japan-loto6': 'japan-loto6',
    'australia-powerball': 'australia-powerball',
    'mega-sena': 'brazil-megasena',
    'lotto-max': 'canada-lottomax',
  };
  return getLotteryById(slugMap[slug] || '');
}

export function formatShareText(lottery: LotteryDef, result: GeneratedResult): string {
  const mainStr = result.main.join(', ');
  const bonusStr = result.bonus ? ` + ${result.bonusName}: ${result.bonus.join(', ')}` : '';
  return `${lottery.country} ${lottery.name}: ${mainStr}${bonusStr}\n\nhttps://dhlm-studio.com/lotto?game=${lottery.id}`;
}
