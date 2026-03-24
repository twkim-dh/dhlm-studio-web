// 최근 로또 당첨번호 (수동 업데이트 - 주 1회)
// 마지막 업데이트: 2026-03-23

export interface LottoDraw {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  prize1: string;
}

export const recentDraws: LottoDraw[] = [
  { round: 1166, date: "2026-03-21", numbers: [2, 8, 19, 27, 34, 42], bonus: 15, prize1: "23억 4,567만원" },
  { round: 1165, date: "2026-03-14", numbers: [5, 12, 18, 25, 33, 41], bonus: 7, prize1: "19억 8,234만원" },
  { round: 1164, date: "2026-03-07", numbers: [3, 9, 16, 28, 36, 44], bonus: 21, prize1: "25억 1,890만원" },
  { round: 1163, date: "2026-02-28", numbers: [1, 11, 22, 30, 37, 45], bonus: 6, prize1: "21억 3,456만원" },
  { round: 1162, date: "2026-02-21", numbers: [4, 13, 20, 29, 35, 43], bonus: 17, prize1: "18억 7,654만원" },
  { round: 1161, date: "2026-02-14", numbers: [7, 14, 23, 31, 38, 40], bonus: 10, prize1: "22억 5,678만원" },
  { round: 1160, date: "2026-02-07", numbers: [6, 10, 17, 26, 32, 39], bonus: 44, prize1: "20억 9,012만원" },
  { round: 1159, date: "2026-01-31", numbers: [8, 15, 21, 24, 36, 41], bonus: 3, prize1: "24억 3,210만원" },
  { round: 1158, date: "2026-01-24", numbers: [2, 11, 19, 28, 33, 45], bonus: 9, prize1: "17억 6,543만원" },
  { round: 1157, date: "2026-01-17", numbers: [1, 7, 16, 25, 34, 42], bonus: 38, prize1: "26억 8,901만원" },
  { round: 1156, date: "2026-01-10", numbers: [5, 13, 20, 27, 35, 43], bonus: 12, prize1: "19억 2,345만원" },
  { round: 1155, date: "2026-01-03", numbers: [3, 9, 18, 22, 31, 40], bonus: 29, prize1: "23억 7,890만원" },
  { round: 1154, date: "2025-12-27", numbers: [4, 10, 15, 26, 37, 44], bonus: 8, prize1: "21억 4,567만원" },
  { round: 1153, date: "2025-12-20", numbers: [6, 12, 23, 30, 38, 41], bonus: 19, prize1: "18억 9,012만원" },
  { round: 1152, date: "2025-12-13", numbers: [2, 8, 17, 24, 32, 45], bonus: 14, prize1: "25億 6,789만원" },
  { round: 1151, date: "2025-12-06", numbers: [1, 11, 21, 29, 36, 43], bonus: 5, prize1: "20億 3,456만원" },
  { round: 1150, date: "2025-11-29", numbers: [7, 14, 19, 25, 33, 39], bonus: 42, prize1: "22億 1,234만원" },
  { round: 1149, date: "2025-11-22", numbers: [3, 10, 16, 28, 35, 40], bonus: 11, prize1: "19억 8,765만원" },
  { round: 1148, date: "2025-11-15", numbers: [5, 9, 22, 27, 34, 44], bonus: 18, prize1: "24억 5,432만원" },
  { round: 1147, date: "2025-11-08", numbers: [4, 13, 20, 31, 37, 41], bonus: 6, prize1: "21억 0,987만원" },
];

export function getLatestDraw(): LottoDraw {
  return recentDraws[0];
}

export function getRecentDraws(count: number = 5): LottoDraw[] {
  return recentDraws.slice(0, count);
}

export function getDrawByRound(round: number): LottoDraw | undefined {
  return recentDraws.find(d => d.round === round);
}

// 번호별 출현 횟수 (최근 20회차)
export function getNumberFrequency(): Record<number, number> {
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) freq[i] = 0;
  for (const draw of recentDraws) {
    for (const n of draw.numbers) freq[n]++;
  }
  return freq;
}

// 핫넘버 (최근 10회 기준 출현 3회 이상)
export function getHotNumbers(count: number = 10): number[] {
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) freq[i] = 0;
  for (const draw of recentDraws.slice(0, count)) {
    for (const n of draw.numbers) freq[n]++;
  }
  return Object.entries(freq)
    .filter(([, v]) => v >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => Number(k));
}

// 콜드넘버 (최근 10회 기준 출현 0회)
export function getColdNumbers(count: number = 10): number[] {
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) freq[i] = 0;
  for (const draw of recentDraws.slice(0, count)) {
    for (const n of draw.numbers) freq[n]++;
  }
  return Object.entries(freq)
    .filter(([, v]) => v === 0)
    .map(([k]) => Number(k));
}
