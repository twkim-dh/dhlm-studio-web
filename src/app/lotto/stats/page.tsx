'use client';

import { useState, useEffect, useMemo } from 'react';
import LottoBall from '@/components/LottoBall';

interface DrawData {
  round: number;
  numbers: number[];
  bonus: number;
}

export default function StatsPage() {
  const [tab, setTab] = useState<'freq' | 'hot' | 'pairs'>('freq');
  const [draws, setDraws] = useState<DrawData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const latestRound =
        Math.floor(
          (Date.now() - new Date('2002-12-07').getTime()) / (7 * 86400000)
        ) + 1;

      const fetched: DrawData[] = [];
      for (let i = 0; i < 20; i++) {
        const round = latestRound - i;
        try {
          const res = await fetch(`/api/lotto/${round}`);
          if (res.ok) {
            const data = await res.json();
            if (data.returnValue === 'success') {
              fetched.push({
                round: data.round ?? data.drwNo,
                numbers: data.numbers ?? [
                  data.drwtNo1,
                  data.drwtNo2,
                  data.drwtNo3,
                  data.drwtNo4,
                  data.drwtNo5,
                  data.drwtNo6,
                ],
                bonus: data.bonus ?? data.bnusNo,
              });
            }
          }
        } catch {
          // skip
        }
      }
      setDraws(fetched);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  // Calculate frequency of all 45 numbers
  const frequency = useMemo(() => {
    const freq: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) freq[i] = 0;
    draws.forEach((draw) => {
      draw.numbers.forEach((n) => freq[n]++);
    });
    return freq;
  }, [draws]);

  const maxFreq = useMemo(
    () => Math.max(...Object.values(frequency), 1),
    [frequency]
  );

  // Most frequent / least frequent
  const sortedByFreq = useMemo(() => {
    return Object.entries(frequency)
      .map(([num, count]) => ({ num: parseInt(num), count }))
      .sort((a, b) => b.count - a.count);
  }, [frequency]);

  const mostFrequent = sortedByFreq.slice(0, 6);
  const leastFrequent = sortedByFreq.slice(-6).reverse();

  // Hot/cold numbers (recent 10 draws)
  const { hot, cold } = useMemo(() => {
    const recentFreq: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) recentFreq[i] = 0;
    draws.slice(0, 10).forEach((draw) => {
      draw.numbers.forEach((n) => recentFreq[n]++);
    });
    const sorted = Object.entries(recentFreq)
      .map(([num, count]) => ({ num: parseInt(num), count }))
      .sort((a, b) => b.count - a.count);
    return {
      hot: sorted.slice(0, 6),
      cold: sorted.filter((n) => n.count === 0).slice(0, 10),
    };
  }, [draws]);

  // Odd/even ratio across draws
  const oddEvenRatio = useMemo(() => {
    if (draws.length === 0) return { odd: 0, even: 0, total: 0 };
    let oddTotal = 0;
    let evenTotal = 0;
    draws.forEach((draw) => {
      draw.numbers.forEach((n) => {
        if (n % 2 === 1) oddTotal++;
        else evenTotal++;
      });
    });
    return { odd: oddTotal, even: evenTotal, total: oddTotal + evenTotal };
  }, [draws]);

  // Consecutive pairs
  const pairs = useMemo(() => {
    const pairCount: Record<string, number> = {};
    draws.forEach((draw) => {
      const nums = [...draw.numbers].sort((a, b) => a - b);
      for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i + 1] - nums[i] === 1) {
          const key = `${nums[i]}-${nums[i + 1]}`;
          pairCount[key] = (pairCount[key] || 0) + 1;
        }
      }
    });
    return Object.entries(pairCount)
      .map(([pair, count]) => ({ pair, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [draws]);

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <h1 className="text-xl font-black text-center text-gold mb-6">
          번호 통계
        </h1>
        <div className="text-center py-12 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-2" />
          데이터 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-black text-center text-gold mb-6">
        번호 통계
      </h1>

      {draws.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">
          통계 데이터를 불러올 수 없습니다.
        </p>
      )}

      {draws.length > 0 && (
        <>
          <p className="text-xs text-gray-400 text-center mb-4">
            최근 {draws.length}회차 기준 (실제 당첨 데이터)
          </p>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-200 mb-6">
            {[
              { key: 'freq' as const, label: '출현빈도' },
              { key: 'hot' as const, label: 'Hot/Cold' },
              { key: 'pairs' as const, label: '연속번호' },
            ].map((t) => (
              <button
                key={t.key}
                className={`flex-1 py-2 text-sm ${
                  tab === t.key ? 'tab-active' : 'tab-inactive'
                }`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Frequency Tab */}
          {tab === 'freq' && (
            <div>
              {/* Most / Least */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-500 mb-2">
                    최다 출현
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {mostFrequent.map((n) => (
                      <div key={n.num} className="text-center">
                        <LottoBall number={n.num} size="sm" />
                        <span className="text-[10px] text-gray-400 block">
                          {n.count}회
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-500 mb-2">
                    최소 출현
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {leastFrequent.map((n) => (
                      <div key={n.num} className="text-center">
                        <LottoBall number={n.num} size="sm" />
                        <span className="text-[10px] text-gray-400 block">
                          {n.count}회
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Odd/Even ratio */}
              <div className="mb-6 bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-600 mb-2">
                  홀짝 비율
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
                      {oddEvenRatio.total > 0 && (
                        <>
                          <div
                            className="bg-blue-500 h-full"
                            style={{
                              width: `${(oddEvenRatio.odd / oddEvenRatio.total) * 100}%`,
                            }}
                          />
                          <div
                            className="bg-pink-400 h-full"
                            style={{
                              width: `${(oddEvenRatio.even / oddEvenRatio.total) * 100}%`,
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    홀 {oddEvenRatio.odd} : 짝 {oddEvenRatio.even}
                  </span>
                </div>
              </div>

              {/* Full Chart - div-based bars */}
              <div className="space-y-1">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <LottoBall number={num} size="sm" />
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            maxFreq > 0
                              ? (frequency[num] / maxFreq) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">
                      {frequency[num]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hot/Cold Tab */}
          {tab === 'hot' && (
            <div>
              <p className="text-xs text-gray-400 mb-4">
                최근 10회차 기준 (실제 데이터)
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-1">
                  🔥 Hot 번호
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {hot.map((n) => (
                    <div
                      key={n.num}
                      className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full"
                    >
                      <LottoBall number={n.num} size="sm" />
                      <span className="text-xs font-bold text-red-500">
                        {n.count}회
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-blue-500 mb-3 flex items-center gap-1">
                  🧊 Cold 번호
                </h3>
                {cold.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {cold.map((n) => (
                      <div
                        key={n.num}
                        className="bg-blue-50 px-3 py-1.5 rounded-full"
                      >
                        <LottoBall number={n.num} size="sm" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    모든 번호가 최근 10회 내에 출현했습니다
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Consecutive Pairs Tab */}
          {tab === 'pairs' && (
            <div>
              <p className="text-xs text-gray-400 mb-4">
                최근 {draws.length}회차에서 나란히 나온 연속 번호 쌍
              </p>

              {pairs.length > 0 ? (
                <div className="space-y-2">
                  {pairs.map((p, i) => {
                    const [a, b] = p.pair.split('-').map(Number);
                    return (
                      <div
                        key={p.pair}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                      >
                        <span className="text-sm font-bold text-gray-300 w-5">
                          {i + 1}
                        </span>
                        <div className="flex gap-1">
                          <LottoBall number={a} size="sm" />
                          <LottoBall number={b} size="sm" />
                        </div>
                        <span className="text-xs text-gold font-bold ml-auto">
                          {p.count}회
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-400 text-sm py-8">
                  연속 번호 쌍이 없습니다
                </p>
              )}
            </div>
          )}
        </>
      )}

      <div className="h-8" />
    </div>
  );
}
