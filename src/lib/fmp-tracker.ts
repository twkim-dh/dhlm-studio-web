// FMP API call budget tracker.
//
// Daily free tier: 250 calls. Starter tier (from 4/20): 10,000 calls/day.
// This module increments a Redis counter on every FMP call and stops further
// calls when the daily budget is exhausted.
//
// Usage:
//   import { fmpCanCall, fmpTrackCall } from '@/lib/fmp-tracker';
//   if (!(await fmpCanCall())) return null;    // budget check before fetch
//   const res = await fetch(fmpUrl);
//   await fmpTrackCall();                       // record the call

import { getRedis } from '@/lib/redis';

// Daily budget — raise to 10000 after purchasing FMP Starter on 4/20.
const DAILY_BUDGET = Number(process.env.FMP_DAILY_BUDGET) || 250;

function todayKey(): string {
  const d = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  return `fmp:daily-calls:${d}`;
}

/**
 * Returns true if the daily FMP call budget has not been exhausted.
 * Returns true (allow) when Redis is unavailable — fail-open to avoid
 * blocking legitimate requests on a Redis cold start.
 */
export async function fmpCanCall(): Promise<boolean> {
  try {
    const redis = getRedis();
    const count = await redis.get(todayKey());
    if (count === null) return true; // no calls today yet
    return Number(count) < DAILY_BUDGET;
  } catch {
    return true; // Redis unavailable — allow call
  }
}

/**
 * Increments the daily FMP call counter.
 * Automatically sets a 25-hour TTL so the key is cleaned up after the
 * daily reset window regardless of when the first call was made.
 */
export async function fmpTrackCall(count = 1): Promise<void> {
  try {
    const redis = getRedis();
    const key = todayKey();
    const pipeline = redis.pipeline();
    pipeline.incrby(key, count);
    pipeline.expire(key, 25 * 60 * 60); // 25h TTL — survives across midnight
    await pipeline.exec();
  } catch {
    // Redis unavailable — tracking fails silently, calls still go through
  }
}

/**
 * Returns the current day's FMP call count. Useful for the /api/today-market
 * ?debug=cache endpoint to include budget state.
 */
export async function fmpCallsToday(): Promise<{ used: number; budget: number; remaining: number }> {
  const budget = DAILY_BUDGET;
  try {
    const redis = getRedis();
    const raw = await redis.get(todayKey());
    const used = raw ? Number(raw) : 0;
    return { used, budget, remaining: Math.max(0, budget - used) };
  } catch {
    return { used: 0, budget, remaining: budget };
  }
}
