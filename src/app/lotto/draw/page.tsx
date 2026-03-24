'use client';

import { useState, useEffect } from 'react';
import LottoBall from '@/components/LottoBall';
import { motion } from 'framer-motion';

interface DrawResult {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  prize1Amount: number;
  prize1Winners: number;
  totalSales: number;
  // backward compat
  returnValue?: string;
  drwNo?: number;
  drwNoDate?: string;
  drwtNo1?: number;
  drwtNo2?: number;
  drwtNo3?: number;
  drwtNo4?: number;
  drwtNo5?: number;
  drwtNo6?: number;
  bnusNo?: number;
  firstWinamnt?: number;
  firstPrzwnerCo?: number;
  totSellamnt?: number;
}

function normalizeDrawResult(data: DrawResult) {
  return {
    round: data.round ?? data.drwNo ?? 0,
    date: data.date ?? data.drwNoDate ?? '',
    numbers: data.numbers ?? [
      data.drwtNo1, data.drwtNo2, data.drwtNo3,
      data.drwtNo4, data.drwtNo5, data.drwtNo6,
    ].filter((n): n is number => typeof n === 'number'),
    bonus: data.bonus ?? data.bnusNo ?? 0,
    prize1Amount: data.prize1Amount ?? data.firstWinamnt ?? 0,
    prize1Winners: data.prize1Winners ?? data.firstPrzwnerCo ?? 0,
    totalSales: data.totalSales ?? data.totSellamnt ?? 0,
  };
}

function formatMoney(amount: number): string {
  if (amount >= 100000000) {
    const eok = Math.floor(amount / 100000000);
    const remain = Math.floor((amount % 100000000) / 10000);
    return remain > 0 ? `${eok}억 ${remain.toLocaleString()}만원` : `${eok}억원`;
  }
  if (amount >= 10000) {
    return `${Math.floor(amount / 10000).toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export default function DrawPage() {
  const [draws, setDraws] = useState<ReturnType<typeof normalizeDrawResult>[]>([]);
  const [loading, setLoading] = useState(true);
  const [roundInput, setRoundInput] = useState('');
  const [error, setError] = useState('');
  const [searchResult, setSearchResult] = useState<ReturnType<typeof normalizeDrawResult> | null>(null);

  useEffect(() => {
    fetchRecentDraws();
  }, []);

  const fetchRecentDraws = async () => {
    setLoading(true);
    try {
      const latestRound =
        Math.floor(
          (Date.now() - new Date('2002-12-07').getTime()) / (7 * 86400000)
        ) + 1;

      const fetched: ReturnType<typeof normalizeDrawResult>[] = [];
      for (let i = 0; i < 10; i++) {
        const round = latestRound - i;
        try {
          const res = await fetch(`/api/lotto/${round}`);
          if (res.ok) {
            const data = await res.json();
            if (data.returnValue === 'success') {
              fetched.push(normalizeDrawResult(data));
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

  const handleSearch = async () => {
    const round = parseInt(roundInput, 10);
    if (!round || round < 1) return;

    setError('');
    setSearchResult(null);
    try {
      const res = await fetch(`/api/lotto/${round}`);
      const data = await res.json();
      if (data.returnValue === 'success') {
        setSearchResult(normalizeDrawResult(data));
      } else {
        setError('해당 회차 정보를 찾을 수 없습니다.');
      }
    } catch {
      setError('데이터를 불러오는데 실패했습니다.');
    }
  };

  const renderDraw = (draw: ReturnType<typeof normalizeDrawResult>, animated = false) => (
    <div key={draw.round} className="bg-gray-50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gold font-black text-base">
          제 {draw.round}회
        </span>
        <span className="text-xs text-gray-400">{draw.date} 추첨</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {draw.numbers.map((num, i) => (
          <LottoBall
            key={i}
            number={num}
            size="md"
            animated={animated}
            delay={i}
          />
        ))}
        <LottoBall
          number={draw.bonus}
          size="md"
          bonus
          animated={animated}
          delay={6}
        />
      </div>

      {draw.prize1Amount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-xs text-gray-400">1등 당첨금</span>
          <span className="font-bold text-gold">
            {formatMoney(draw.prize1Amount)}
          </span>
          {draw.prize1Winners > 0 && (
            <span className="text-xs text-gray-400">
              {draw.prize1Winners}명
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-black text-center text-gold mb-6">
        당첨번호 조회
      </h1>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          type="number"
          value={roundInput}
          onChange={(e) => setRoundInput(e.target.value)}
          placeholder="회차 번호 입력"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-bold hover:bg-gold-dark transition-colors"
        >
          조회
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-4 text-red-500 text-sm mb-4">{error}</div>
      )}

      {/* Search Result */}
      {searchResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-sm font-bold text-gray-600 mb-2">조회 결과</h3>
          {renderDraw(searchResult, true)}
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-2" />
          불러오는 중...
        </div>
      )}

      {/* Recent Draws List */}
      {!loading && draws.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-600 mb-3">
            최근 당첨번호
          </h3>
          <div className="space-y-3">
            {draws.map((draw) => renderDraw(draw))}
          </div>
        </div>
      )}

      {!loading && draws.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">
          데이터를 불러올 수 없습니다.
        </p>
      )}

      <div className="h-8" />
    </div>
  );
}
