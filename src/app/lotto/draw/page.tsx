'use client';

import { useState } from 'react';
import LottoBall from '@/components/LottoBall';
import { motion } from 'framer-motion';
import { recentDraws, getDrawByRound } from '@/data/lotto/recent-draws';
import type { LottoDraw } from '@/data/lotto/recent-draws';

export default function DrawPage() {
  const [roundInput, setRoundInput] = useState('');
  const [error, setError] = useState('');
  const [searchResult, setSearchResult] = useState<LottoDraw | null>(null);

  const handleSearch = () => {
    const round = parseInt(roundInput, 10);
    if (!round || round < 1) return;

    setError('');
    setSearchResult(null);

    const found = getDrawByRound(round);
    if (found) {
      setSearchResult(found);
    } else {
      setError('해당 회차 정보를 찾을 수 없습니다. (최근 20회차만 조회 가능)');
    }
  };

  const renderDraw = (draw: LottoDraw, animated = false) => (
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

      <div className="flex justify-between items-center text-sm">
        <span className="text-xs text-gray-400">1등 당첨금</span>
        <span className="font-bold text-gold">
          {draw.prize1}
        </span>
      </div>
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

      {/* Recent Draws List */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-3">
          최근 당첨번호
        </h3>
        <div className="space-y-3">
          {recentDraws.map((draw) => renderDraw(draw))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
