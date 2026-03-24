'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberSet from '@/components/NumberSet';
import LottoBall from '@/components/LottoBall';
import {
  generateRandom,
  generateWithFixed,
  generateExcluding,
  generateOddEven,
  generateDream,
} from '@/lib/lotto-generator';
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

interface RecentDraw {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  prize1Amount: number;
}

function formatPrize(amount: number): string {
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

export default function Home() {
  const [mode, setMode] = useState<Mode>('random');
  const [setCount, setSetCount] = useState(1);
  const [results, setResults] = useState<number[][]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Mode-specific states
  const [dreamKeyword, setDreamKeyword] = useState('');
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [oddCount, setOddCount] = useState(3);

  // Recent draws
  const [recentDraws, setRecentDraws] = useState<RecentDraw[]>([]);

  // Share feedback
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    initKakao();
    fetchRecentDraws();
  }, []);

  const fetchRecentDraws = async () => {
    try {
      // Estimate latest round
      const latestRound = Math.floor(
        (Date.now() - new Date('2002-12-07').getTime()) / (7 * 86400000)
      ) + 1;

      const draws: RecentDraw[] = [];
      for (let i = 0; i < 5; i++) {
        const round = latestRound - i;
        try {
          const res = await fetch(`/api/lotto/${round}`);
          if (res.ok) {
            const data = await res.json();
            if (data.returnValue === 'success') {
              draws.push({
                round: data.round ?? data.drwNo,
                date: data.date ?? data.drwNoDate,
                numbers: data.numbers ?? [
                  data.drwtNo1, data.drwtNo2, data.drwtNo3,
                  data.drwtNo4, data.drwtNo5, data.drwtNo6,
                ],
                bonus: data.bonus ?? data.bnusNo,
                prize1Amount: data.prize1Amount ?? data.firstWinamnt ?? 0,
              });
            }
          }
        } catch {
          // skip failed round
        }
      }
      setRecentDraws(draws);
    } catch {
      // silently fail
    }
  };

  const handleGenerate = useCallback(() => {
    let generated: number[][] = [];

    switch (mode) {
      case 'random':
        generated = generateRandom(setCount);
        break;
      case 'dream':
        if (!dreamKeyword.trim()) {
          alert('꿈 키워드를 입력해주세요!');
          return;
        }
        generated = generateDream(dreamKeyword, setCount);
        break;
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
              꿈 키워드 입력
            </label>
            <input
              type="text"
              value={dreamKeyword}
              onChange={(e) => setDreamKeyword(e.target.value)}
              placeholder="예: 돼지, 물, 뱀, 꽃..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
            <p className="text-xs text-gray-400 mt-1">
              꿈에서 본 키워드를 입력하면 관련 번호를 생성합니다
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
              {results.map((set, i) => (
                <NumberSet
                  key={`${animationKey}-${i}`}
                  label={String.fromCharCode(65 + i)}
                  numbers={set}
                  animated={true}
                />
              ))}
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
      {recentDraws.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            최근 당첨번호
          </h3>
          <div className="space-y-3">
            {recentDraws.map((draw) => (
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
                {draw.prize1Amount > 0 && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    1등 {formatPrize(draw.prize1Amount)}
                  </p>
                )}
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
      )}

      {/* Link to draw results (fallback if no recent draws loaded) */}
      {recentDraws.length === 0 && (
        <div className="mt-6 text-center">
          <a
            href="/lotto/draw"
            className="text-sm text-gold font-medium hover:underline"
          >
            이번 회차 당첨번호 확인 &rarr;
          </a>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
