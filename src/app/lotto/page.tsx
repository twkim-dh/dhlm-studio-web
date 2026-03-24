'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberSet from '@/components/NumberSet';
import LottoBall from '@/components/LottoBall';
import { getRecentDraws, getLatestDraw } from '@/data/lotto/recent-draws';
import {
  generateRandom,
  generateWithFixed,
  generateExcluding,
  generateOddEven,
  generateDream,
  generateDreamWithSource,
  dreamData,
} from '@/lib/lotto-generator';
import type { DreamEntry, DreamResult } from '@/lib/lotto-generator';
import { initKakao, shareLotto } from '@/lib/lotto-kakao';

type Mode = 'random' | 'dream' | 'fixed' | 'exclude' | 'oddeven';

const modes: { key: Mode; label: string }[] = [
  { key: 'random', label: '랜덤' },
  { key: 'dream', label: '꿈해몽' },
  { key: 'fixed', label: '고정수 포함' },
  { key: 'exclude', label: '제외수' },
  { key: 'oddeven', label: '홀짝비율' },
];

const oddEvenOptions = [
  { label: '홀3:짝3', odd: 3 },
  { label: '홀4:짝2', odd: 4 },
  { label: '홀2:짝4', odd: 2 },
];

// Static data - no API calls needed
const recentDrawsData = getRecentDraws(5);

export default function Home() {
  const [mode, setMode] = useState<Mode>('random');
  const [setCount, setSetCount] = useState(1);
  const [results, setResults] = useState<number[][]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [kakaoInitialized, setKakaoInitialized] = useState(false);

  // Mode-specific states
  const [dreamKeyword, setDreamKeyword] = useState('');
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [oddCount, setOddCount] = useState(3);

  // Dream-specific states
  const [dreamSearch, setDreamSearch] = useState('');
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);
  const [dreamResults, setDreamResults] = useState<DreamResult[]>([]);

  // Share feedback
  const [shareMsg, setShareMsg] = useState('');

  if (!kakaoInitialized) {
    if (typeof window !== 'undefined') {
      initKakao();
      setKakaoInitialized(true);
    }
  }

  const handleGenerate = useCallback(() => {
    let generated: number[][] = [];

    switch (mode) {
      case 'random':
        generated = generateRandom(setCount);
        break;
      case 'dream': {
        const keyword = selectedDream?.keyword || dreamKeyword.trim();
        if (!keyword) {
          alert('꿈 키워드를 입력하거나 선택해주세요!');
          return;
        }
        const dResults = generateDreamWithSource(keyword, setCount);
        setDreamResults(dResults);
        generated = dResults.map((r) => r.numbers);
        break;
      }
      case 'fixed':
        if (fixedNumbers.length === 0) {
          alert('고정할 번호를 선택해주세요!');
          return;
        }
        generated = generateWithFixed(fixedNumbers, setCount);
        break;
      case 'exclude':
        if (excludedNumbers.length === 0) {
          alert('제외할 번호를 선택해주세요!');
          return;
        }
        if (excludedNumbers.length > 39) {
          alert('제외 번호가 너무 많습니다!');
          return;
        }
        generated = generateExcluding(excludedNumbers, setCount);
        break;
      case 'oddeven':
        generated = generateOddEven(oddCount, setCount);
        break;
    }

    setResults(generated);
    setIsGenerated(true);
    setAnimationKey((k) => k + 1);
  }, [mode, setCount, dreamKeyword, fixedNumbers, excludedNumbers, oddCount]);

  const handleShare = async () => {
    const success = await shareLotto(results);
    if (success) {
      setShareMsg('복사 완료!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  const handleSaveImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 80 + results.length * 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DHLM 로또 번호', canvas.width / 2, 35);

    const ballColors: Record<string, string> = {
      yellow: '#FFC107',
      blue: '#2196F3',
      red: '#F44336',
      gray: '#9E9E9E',
      green: '#4CAF50',
    };

    const getColor = (n: number) => {
      if (n <= 10) return ballColors.yellow;
      if (n <= 20) return ballColors.blue;
      if (n <= 30) return ballColors.red;
      if (n <= 40) return ballColors.gray;
      return ballColors.green;
    };

    results.forEach((set, si) => {
      const y = 70 + si * 60;
      const label = String.fromCharCode(65 + si);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, 15, y + 5);

      set.forEach((num, ni) => {
        const cx = 55 + ni * 55;
        ctx.beginPath();
        ctx.arc(cx, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = getColor(num);
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(num), cx, y);
      });
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lotto-numbers.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const toggleNumber = (
    num: number,
    list: number[],
    setList: (nums: number[]) => void,
    max: number
  ) => {
    if (list.includes(num)) {
      setList(list.filter((n) => n !== num));
    } else if (list.length < max) {
      setList([...list, num]);
    }
  };

  const renderNumberGrid = (
    selected: number[],
    setSelected: (nums: number[]) => void,
    max: number
  ) => (
    <div className="grid grid-cols-9 gap-1.5 mt-3 mb-3">
      {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          className={`number-selector-ball ${
            selected.includes(num) ? 'selected' : ''
          }`}
          onClick={() => toggleNumber(num, selected, setSelected, max)}
        >
          {num}
        </button>
      ))}
    </div>
  );

  return (
    <div className="px-4 pt-6">
      {/* Logo */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-gold">DHLM 로또 🎱</h1>
        <p className="text-xs text-gray-400 mt-1">
          행운의 번호를 뽑아보세요
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex overflow-x-auto gap-0 border-b border-gray-200 mb-4 no-scrollbar">
        {modes.map((m) => (
          <button
            key={m.key}
            className={`px-3 py-2 text-sm whitespace-nowrap transition-all ${
              mode === m.key ? 'tab-active' : 'tab-inactive'
            }`}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Mode-specific inputs */}
      <div className="mb-4">
        {mode === 'dream' && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              꿈 키워드 검색
            </label>
            <input
              type="text"
              value={dreamSearch}
              onChange={(e) => {
                setDreamSearch(e.target.value);
                setSelectedDream(null);
                setDreamKeyword(e.target.value);
              }}
              placeholder="예: 돼지, 물, 뱀, 꽃..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />

            {/* Popular keyword buttons */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1.5">인기 키워드</p>
              <div className="flex flex-wrap gap-1.5">
                {dreamData.slice(0, 12).map((d) => (
                  <button
                    key={d.keyword}
                    onClick={() => {
                      setSelectedDream(d);
                      setDreamKeyword(d.keyword);
                      setDreamSearch(d.keyword);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedDream?.keyword === d.keyword
                        ? 'bg-gold text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d.emoji} {d.keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Search results */}
            {dreamSearch.trim() && !selectedDream && (
              <div className="mt-3 bg-gray-50 rounded-lg p-2 max-h-48 overflow-y-auto">
                {dreamData
                  .filter((d) => d.keyword.includes(dreamSearch.trim()))
                  .map((d) => (
                    <button
                      key={d.keyword}
                      onClick={() => {
                        setSelectedDream(d);
                        setDreamKeyword(d.keyword);
                        setDreamSearch(d.keyword);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white text-left transition-colors"
                    >
                      <span className="text-sm">
                        {d.emoji} {d.keyword}
                        <span className="text-xs text-gray-400 ml-1">
                          ({d.meaning})
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {d.numbers.join(', ')}
                      </span>
                    </button>
                  ))}
                {dreamData.filter((d) =>
                  d.keyword.includes(dreamSearch.trim())
                ).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    일치하는 키워드가 없습니다. 직접 입력한 키워드로 번호를 생성합니다.
                  </p>
                )}
              </div>
            )}

            {/* Selected dream info */}
            {selectedDream && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{selectedDream.emoji}</span>
                  <span className="font-bold text-gray-800">
                    {selectedDream.keyword}
                  </span>
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                    {selectedDream.meaning}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  관련 번호: {selectedDream.numbers.join(', ')}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              꿈에서 본 키워드를 선택하면 관련 번호 2~3개 + 랜덤 번호로 생성합니다
            </p>
          </div>
        )}

        {mode === 'fixed' && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              고정 번호 선택 (최대 3개)
            </label>
            {renderNumberGrid(fixedNumbers, setFixedNumbers, 3)}
            <p className="text-xs text-gray-400">
              선택: {fixedNumbers.sort((a, b) => a - b).join(', ') || '없음'}
            </p>
          </div>
        )}

        {mode === 'exclude' && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              제외할 번호 선택
            </label>
            {renderNumberGrid(excludedNumbers, setExcludedNumbers, 39)}
            <p className="text-xs text-gray-400">
              제외: {excludedNumbers.length}개 선택됨
            </p>
          </div>
        )}

        {mode === 'oddeven' && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              홀짝 비율 선택
            </label>
            <div className="flex gap-2">
              {oddEvenOptions.map((opt) => (
                <button
                  key={opt.odd}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    oddCount === opt.odd
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setOddCount(opt.odd)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Set Count */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium text-gray-700">세트 수:</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                setCount === n
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSetCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="generate-btn pulse-gold w-full py-4 rounded-2xl text-lg font-black tracking-wider"
      >
        번호 생성!
      </button>

      {/* Results */}
      <AnimatePresence mode="wait">
        {isGenerated && results.length > 0 && (
          <motion.div
            key={animationKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2">
                생성된 번호
              </h3>
              {mode === 'dream' && dreamResults.length > 0
                ? dreamResults.map((dr, i) => (
                    <div
                      key={`${animationKey}-${i}`}
                      className="number-set flex items-center gap-2 py-2"
                    >
                      <span className="text-sm font-bold text-gold w-6 shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {dr.numbers.map((num, ni) => {
                          const isDream = dr.dreamNumbers.includes(num);
                          return (
                            <motion.div
                              key={`${animationKey}-${i}-${num}-${ni}`}
                              initial={{ scale: 0, opacity: 0, rotate: -180 }}
                              animate={{ scale: 1, opacity: 1, rotate: 0 }}
                              transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                                delay: ni * 0.12,
                              }}
                            >
                              <div className="relative">
                                <LottoBall number={num} size="md" />
                                {isDream && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow">
                                    ★
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                : results.map((set, i) => (
                    <NumberSet
                      key={`${animationKey}-${i}`}
                      label={String.fromCharCode(65 + i)}
                      numbers={set}
                      animated={true}
                    />
                  ))}
              {mode === 'dream' && dreamResults.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  ★ 표시 = 꿈해몽 번호 / 나머지 = 랜덤 번호
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 bg-yellow-400 text-gray-900 rounded-xl text-sm font-bold hover:bg-yellow-500 transition-colors"
              >
                {shareMsg || '카카오톡 공유'}
              </button>
              <button
                onClick={handleSaveImage}
                className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-300 transition-colors"
              >
                이미지 저장
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Draws Section */}
      <div className="mt-6 bg-gray-50 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">
          최근 당첨번호
        </h3>
        <div className="space-y-3">
          {recentDrawsData.map((draw) => (
            <div key={draw.round} className="bg-white rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold">
                  {draw.round}회
                </span>
                <span className="text-xs text-gray-400">{draw.date}</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {draw.numbers.map((num, i) => (
                  <LottoBall key={i} number={num} size="sm" />
                ))}
                <LottoBall number={draw.bonus} size="sm" bonus />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                1등 {draw.prize1}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <a
            href="/lotto/draw"
            className="text-sm text-gold font-medium hover:underline"
          >
            전체 당첨번호 보기 &rarr;
          </a>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
