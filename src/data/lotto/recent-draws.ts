// 로또 당첨번호 전체 데이터
// 내일 동행복권 API 재연결 시도 예정
// 현재: all-draws.json (1~1150회차) 사용

import allDrawsData from "./all-draws.json";

export interface LottoDraw {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  prize1: string;
}

export const allDraws: LottoDraw[] = allDrawsData as LottoDraw[];
export const recentDraws: LottoDraw[] = [...allDraws].reverse();

export function getLatestDraw(): LottoDraw {
  return recentDraws[0];
}

export function getRecentDraws(count: number = 5): LottoDraw[] {
  return recentDraws.slice(0, count);
}

export function getDrawByRound(round: number): LottoDraw | undefined {
  return allDraws.find((d) => d.round === round);
}

export function getNumberFrequency(): Record<number, number> {
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) freq[i] = 0;
  for (const draw of allDraws) {
    for (const n of draw.numbers) freq[n]++;
  }
  return freq;
}

export function getHotNumbers(count: number = 10): number[] {
  const recent = recentDraws.slice(0, count);
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) freq[i] = 0;
  for (const draw of recent) {
    for (const n of draw.numbers) freq[n]++;
  }
  return Object.entries(freq)
    .filter(([, v]) => v >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => Number(k));
}

export function getColdNumbers(count: number = 10): number[] {
  const recent = recentDraws.slice(0, count);
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) freq[i] = 0;
  for (const draw of recent) {
    for (const n of draw.numbers) freq[n]++;
  }
  return Object.entries(freq)
    .filter(([, v]) => v === 0)
    .map(([k]) => Number(k));
}

export function getTotalDrawCount(): number {
  return allDraws.length;
}
