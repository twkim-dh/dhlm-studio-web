'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Metadata } from 'next';
import LottoBall from '@/components/LottoBall';
import NumberSet from '@/components/NumberSet';
import { generateRandom, generateWithFixed, generateExcluding, generateOddEven, generateDream, dreamData } from '@/lib/lotto-generator';
import { initKakao, shareLotto } from '@/lib/lotto-kakao';
import { getLatestDraw, getRecentDraws, getNumberFrequency, getHotNumbers, getColdNumbers, getTotalDrawCount, allDraws } from '@/data/lotto/recent-draws';
import type { LottoDraw } from '@/data/lotto/recent-draws';

type TabId = 'fortune' | 'generate' | 'winning' | 'stats';

const tabs: { id: TabId; label: string; emoji: string }[] = [
  { id: 'fortune', label: '운세', emoji: '🔮' },
  { id: 'generate', label: '번호생성', emoji: '🎲' },
  { id: 'winning', label: '당첨', emoji: '🏆' },
  { id: 'stats', label: '통계', emoji: '📊' },
];

// Fortune score generator based on birthday + date
function getFortuneScore(birthday: string): { score: number; luckyNumbers: number[]; grade: string; message: string; weeklyTrend: number[] } {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = birthday.replace(/-/g, '') + dateStr;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const score = Math.abs(hash % 100) + 1;

  // Lucky numbers from hash
  const luckyNumbers: number[] = [];
  let h = Math.abs(hash);
  while (luckyNumbers.length < 3) {
    h = ((h * 1103515245 + 12345) & 0x7fffffff);
    const n = (h % 45) + 1;
    if (!luckyNumbers.includes(n)) luckyNumbers.push(n);
  }

  // Grade
  let grade: string;
  let message: string;
  if (score >= 90) { grade = '🌟 대박 운세'; message = '오늘은 로또 사는 날! 운이 폭발합니다!'; }
  else if (score >= 70) { grade = '🔥 상승 운세'; message = '좋은 기운이 가득합니다. 도전해보세요!'; }
  else if (score >= 50) { grade = '☀️ 평온 운세'; message = '안정적인 하루입니다. 꾸준히 도전!'; }
  else if (score >= 30) { grade = '🌤️ 보통 운세'; message = '평범한 하루, 작은 행운을 놓치지 마세요.'; }
  else { grade = '🌙 충전 운세'; message = '에너지를 모으는 날. 내일을 기대하세요!'; }

  // Weekly trend
  const weeklyTrend: number[] = [];
  for (let d = 0; d < 7; d++) {
    const daySeed = birthday.replace(/-/g, '') + `${today.getFullYear()}${today.getMonth()}${today.getDate() - today.getDay() + d}`;
    let dh = 0;
    for (let i = 0; i < daySeed.length; i++) {
      dh = ((dh << 5) - dh + daySeed.charCodeAt(i)) | 0;
    }
    weeklyTrend.push(Math.abs(dh % 100) + 1);
  }

  return { score, luckyNumbers: luckyNumbers.sort((a, b) => a - b), grade, message, weeklyTrend };
}

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

export default function LottoPage() {
  const [activeTab, setActiveTab] = useState<TabId>('fortune');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as TabId;
    if (['fortune', 'generate', 'winning', 'stats'].includes(hash)) {
      setActiveTab(hash);
    }
    initKakao();
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `#${tab}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">DHLM 로또 🎱</h1>
        <p className="text-gray-500 text-sm mt-1">행운의 번호를 만나보세요</p>
      </div>

      {/* Tab Navigation - sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-4 px-4 pb-0">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="block text-lg">{tab.emoji}</span>
              <span className="block text-xs mt-0.5">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'fortune' && <FortuneTab />}
        {activeTab === 'generate' && <GenerateTab />}
        {activeTab === 'winning' && <WinningTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 mt-8 pb-4">
        번호 생성만 제공하며 구매 대행은 하지 않습니다.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   🔮 Fortune Tab
   ═══════════════════════════════════════ */
function FortuneTab() {
  const [birthday, setBirthday] = useState('');
  const [fortune, setFortune] = useState<ReturnType<typeof getFortuneScore> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lotto-birthday');
    if (saved) {
      setBirthday(saved);
      setFortune(getFortuneScore(saved));
    }
  }, []);

  const handleCheck = () => {
    if (!birthday) return;
    localStorage.setItem('lotto-birthday', birthday);
    setFortune(getFortuneScore(birthday));
  };

  const todayIdx = new Date().getDay();

  return (
    <div className="space-y-6">
      {/* Birthday input */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5">
        <h2 className="font-bold text-lg mb-3">오늘의 로또 운세</h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="생년월일"
          />
          <button
            onClick={handleCheck}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-95 transition"
          >
            확인
          </button>
        </div>
      </div>

      {fortune && (
        <>
          {/* Score */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500 mb-2">{fortune.grade}</p>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={fortune.score >= 70 ? '#4f46e5' : fortune.score >= 40 ? '#f59e0b' : '#9ca3af'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${fortune.score * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{fortune.score}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{fortune.message}</p>
          </div>

          {/* Lucky Numbers */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-3">오늘의 행운 번호</h3>
            <div className="flex justify-center gap-3">
              {fortune.luckyNumbers.map((n) => (
                <LottoBall key={n} number={n} size="lg" animated />
              ))}
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-3">이번 주 운세 추이</h3>
            <div className="flex items-end gap-1.5 h-24">
              {fortune.weeklyTrend.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400">{val}</span>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      i === todayIdx ? 'bg-indigo-500' : 'bg-gray-200'
                    }`}
                    style={{ height: `${val * 0.8}%` }}
                  />
                  <span className={`text-[10px] ${i === todayIdx ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>
                    {dayNames[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Share */}
          <button
            onClick={async () => {
              const text = `DHLM 로또 운세\n점수: ${fortune.score}점 ${fortune.grade}\n행운번호: ${fortune.luckyNumbers.join(', ')}\n\nhttps://dhlm-studio.com/lotto#fortune`;
              if (navigator.share) {
                try { await navigator.share({ title: 'DHLM 로또 운세', text }); } catch {}
              } else {
                await navigator.clipboard.writeText(text);
                alert('복사되었습니다!');
              }
            }}
            className="w-full py-3 bg-yellow-400 text-gray-900 rounded-xl font-medium hover:bg-yellow-500 active:scale-[0.98] transition"
          >
            운세 공유하기
          </button>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   🎲 Generate Tab
   ═══════════════════════════════════════ */
type GenMode = 'random' | 'dream' | 'fixed' | 'exclude' | 'oddeven';

function GenerateTab() {
  const [mode, setMode] = useState<GenMode>('random');
  const [setCount, setSetCount] = useState(1);
  const [results, setResults] = useState<number[][]>([]);
  const [dreamKeyword, setDreamKeyword] = useState('');
  const [fixedNums, setFixedNums] = useState<number[]>([]);
  const [excludeNums, setExcludeNums] = useState<number[]>([]);
  const [oddCount, setOddCount] = useState(3);
  const [shareMsg, setShareMsg] = useState('');

  const modes: { id: GenMode; label: string; desc: string }[] = [
    { id: 'random', label: '🎲 랜덤', desc: '완전 랜덤 번호' },
    { id: 'dream', label: '🌙 꿈해몽', desc: '꿈 키워드로 번호 생성' },
    { id: 'fixed', label: '📌 고정수', desc: '포함할 번호 지정' },
    { id: 'exclude', label: '🚫 제외수', desc: '제외할 번호 지정' },
    { id: 'oddeven', label: '⚖️ 홀짝', desc: '홀짝 비율 조정' },
  ];

  const generate = () => {
    let nums: number[][] = [];
    switch (mode) {
      case 'random': nums = generateRandom(setCount); break;
      case 'dream': nums = generateDream(dreamKeyword || '행운', setCount); break;
      case 'fixed': nums = generateWithFixed(fixedNums.slice(0, 5), setCount); break;
      case 'exclude': nums = generateExcluding(excludeNums, setCount); break;
      case 'oddeven': nums = generateOddEven(oddCount, setCount); break;
    }
    setResults(nums);
    setShareMsg('');
  };

  const toggleNumber = (n: number, list: number[], setter: (v: number[]) => void) => {
    setter(list.includes(n) ? list.filter((x) => x !== n) : [...list, n]);
  };

  const handleShare = async () => {
    const ok = await shareLotto(results);
    setShareMsg(ok ? '복사되었습니다!' : '공유 실패');
    if (ok) setTimeout(() => setShareMsg(''), 2000);
  };

  const handleCopy = async () => {
    const text = results.map((set, i) => `${String.fromCharCode(65 + i)}: ${set.join(', ')}`).join('\n');
    await navigator.clipboard.writeText(text);
    setShareMsg('번호가 복사되었습니다!');
    setTimeout(() => setShareMsg(''), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Mode Selection */}
      <div className="grid grid-cols-5 gap-1.5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setResults([]); }}
            className={`py-2 px-1 rounded-xl text-center text-xs font-medium transition ${
              mode === m.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="block text-base">{m.label.split(' ')[0]}</span>
            <span className="block mt-0.5 text-[10px]">{m.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Mode-specific inputs */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-xs text-gray-500 mb-3">{modes.find((m) => m.id === mode)?.desc}</p>

        {mode === 'dream' && (
          <div className="space-y-3">
            <input
              type="text"
              value={dreamKeyword}
              onChange={(e) => setDreamKeyword(e.target.value)}
              placeholder="꿈에 나온 키워드 (예: 돼지, 돈, 용)"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex flex-wrap gap-1.5">
              {dreamData.slice(0, 20).map((d) => (
                <button
                  key={d.keyword}
                  onClick={() => setDreamKeyword((prev) => prev ? `${prev} ${d.keyword}` : d.keyword)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs hover:bg-blue-50 transition"
                >
                  {d.emoji} {d.keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {(mode === 'fixed' || mode === 'exclude') && (
          <div>
            <p className="text-xs text-gray-500 mb-2">
              {mode === 'fixed' ? '포함할 번호를 선택하세요 (최대 5개)' : '제외할 번호를 선택하세요'}
            </p>
            <div className="grid grid-cols-9 gap-1">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
                const list = mode === 'fixed' ? fixedNums : excludeNums;
                const setter = mode === 'fixed' ? setFixedNums : setExcludeNums;
                const selected = list.includes(n);
                const disabled = mode === 'fixed' && !selected && fixedNums.length >= 5;
                return (
                  <button
                    key={n}
                    onClick={() => !disabled && toggleNumber(n, list, setter)}
                    disabled={disabled}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition ${
                      selected
                        ? 'bg-blue-600 text-white'
                        : disabled
                        ? 'bg-gray-100 text-gray-300'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'oddeven' && (
          <div>
            <p className="text-xs text-gray-500 mb-2">홀수 개수: {oddCount}개 / 짝수: {6 - oddCount}개</p>
            <input
              type="range"
              min={0}
              max={6}
              value={oddCount}
              onChange={(e) => setOddCount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>짝수 6</span>
              <span>균형</span>
              <span>홀수 6</span>
            </div>
          </div>
        )}
      </div>

      {/* Set count + Generate */}
      <div className="flex gap-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3">
          <span className="text-xs text-gray-500">세트</span>
          {[1, 3, 5].map((n) => (
            <button
              key={n}
              onClick={() => setSetCount(n)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                setCount === n ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition"
        >
          번호 생성
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2">
          {results.map((set, i) => (
            <NumberSet
              key={i}
              label={String.fromCharCode(65 + i)}
              numbers={set}
              animated
            />
          ))}

          {/* Action buttons */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
            >
              📋 번호 복사
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 bg-yellow-400 text-gray-900 rounded-xl text-sm font-medium hover:bg-yellow-500 transition"
            >
              공유하기
            </button>
          </div>

          {shareMsg && (
            <p className="text-center text-xs text-green-600 mt-2">{shareMsg}</p>
          )}

          {/* Purchase link */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium">이 번호로 구매하기</p>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-medium hover:bg-gray-50 transition"
              >
                📋 번호 복사
              </button>
              <a
                href="https://m.dhlottery.co.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-medium text-center hover:bg-green-700 transition"
              >
                🛒 동행복권 바로가기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   🏆 Winning Tab
   ═══════════════════════════════════════ */
function WinningTab() {
  const latest = getLatestDraw();
  const recent = getRecentDraws(10);
  const [selectedRound, setSelectedRound] = useState(latest.round);
  const [viewDraw, setViewDraw] = useState<LottoDraw>(latest);
  const [checkNums, setCheckNums] = useState<number[]>([]);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const handleRoundChange = useCallback((round: number) => {
    setSelectedRound(round);
    const draw = allDraws.find((d) => d.round === round);
    if (draw) setViewDraw(draw);
  }, []);

  const toggleCheckNum = (n: number) => {
    setCheckNums((prev) =>
      prev.includes(n)
        ? prev.filter((x) => x !== n)
        : prev.length < 6 ? [...prev, n] : prev
    );
    setCheckResult(null);
  };

  const checkWinning = () => {
    if (checkNums.length !== 6) return;
    const matched = checkNums.filter((n) => viewDraw.numbers.includes(n));
    const bonusMatch = checkNums.includes(viewDraw.bonus);

    if (matched.length === 6) setCheckResult('🎉 1등! 6개 번호 모두 일치!');
    else if (matched.length === 5 && bonusMatch) setCheckResult('🎊 2등! 5개 + 보너스 일치!');
    else if (matched.length === 5) setCheckResult('🥉 3등! 5개 일치!');
    else if (matched.length === 4) setCheckResult('4등! 4개 일치');
    else if (matched.length === 3) setCheckResult('5등! 3개 일치');
    else setCheckResult(`${matched.length}개 일치 — 아쉽지만 다음 기회에!`);
  };

  return (
    <div className="space-y-5">
      {/* Latest Draw */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">{viewDraw.round}회 당첨번호</h2>
          <span className="text-xs text-gray-500">{viewDraw.date}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {viewDraw.numbers.map((n, i) => (
            <LottoBall key={i} number={n} size="lg" animated delay={i} />
          ))}
          <LottoBall number={viewDraw.bonus} size="lg" bonus animated delay={6} />
        </div>
        {viewDraw.prize1 && (
          <p className="text-center text-xs text-gray-500 mt-3">1등 당첨금: {viewDraw.prize1}</p>
        )}
      </div>

      {/* Round selector */}
      <div className="flex gap-2">
        <button
          onClick={() => handleRoundChange(Math.max(1, selectedRound - 1))}
          className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 transition"
        >
          ◀
        </button>
        <input
          type="number"
          value={selectedRound}
          onChange={(e) => handleRoundChange(Number(e.target.value))}
          min={1}
          max={latest.round}
          className="flex-1 text-center px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <button
          onClick={() => handleRoundChange(Math.min(latest.round, selectedRound + 1))}
          className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 transition"
        >
          ▶
        </button>
      </div>

      {/* Recent history */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">최근 당첨번호</h3>
        <div className="space-y-2">
          {recent.slice(0, 5).map((draw) => (
            <button
              key={draw.round}
              onClick={() => handleRoundChange(draw.round)}
              className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl text-xs transition ${
                draw.round === selectedRound ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'
              }`}
            >
              <span className="font-bold w-14 text-left">{draw.round}회</span>
              <div className="flex gap-1 flex-1 flex-wrap">
                {draw.numbers.map((n, i) => (
                  <LottoBall key={i} number={n} size="sm" />
                ))}
                <LottoBall number={draw.bonus} size="sm" bonus />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Check my numbers */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">내 번호 당첨 확인</h3>
        <p className="text-xs text-gray-500 mb-2">6개 번호를 선택하세요</p>
        <div className="grid grid-cols-9 gap-1 mb-3">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
            const selected = checkNums.includes(n);
            const disabled = !selected && checkNums.length >= 6;
            return (
              <button
                key={n}
                onClick={() => !disabled && toggleCheckNum(n)}
                disabled={disabled}
                className={`w-8 h-8 rounded-full text-xs font-medium transition ${
                  selected
                    ? 'bg-amber-500 text-white'
                    : disabled
                    ? 'bg-gray-100 text-gray-300'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setCheckNums([]); setCheckResult(null); }}
            className="px-4 py-2.5 bg-gray-100 rounded-xl text-xs font-medium hover:bg-gray-200 transition"
          >
            초기화
          </button>
          <button
            onClick={checkWinning}
            disabled={checkNums.length !== 6}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              checkNums.length === 6
                ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            당첨 확인 ({checkNums.length}/6)
          </button>
        </div>
        {checkResult && (
          <div className={`mt-3 p-3 rounded-xl text-center text-sm font-medium ${
            checkResult.includes('1등') || checkResult.includes('2등')
              ? 'bg-yellow-100 text-yellow-800'
              : checkResult.includes('등')
              ? 'bg-blue-50 text-blue-700'
              : 'bg-gray-50 text-gray-600'
          }`}>
            {checkResult}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   📊 Stats Tab
   ═══════════════════════════════════════ */
function StatsTab() {
  const [freq, setFreq] = useState<Record<number, number>>({});
  const [hotNums, setHotNums] = useState<number[]>([]);
  const [coldNums, setColdNums] = useState<number[]>([]);
  const [totalDraws, setTotalDraws] = useState(0);

  useEffect(() => {
    setFreq(getNumberFrequency());
    setHotNums(getHotNumbers(20));
    setColdNums(getColdNumbers(20));
    setTotalDraws(getTotalDrawCount());
  }, []);

  const maxFreq = Math.max(...Object.values(freq), 1);

  // Odd/Even ratio from all draws
  const oddEvenStats = (() => {
    let oddTotal = 0;
    let evenTotal = 0;
    for (const draw of allDraws) {
      for (const n of draw.numbers) {
        if (n % 2 === 1) oddTotal++;
        else evenTotal++;
      }
    }
    const total = oddTotal + evenTotal;
    return { oddTotal, evenTotal, oddPct: Math.round((oddTotal / total) * 100), evenPct: Math.round((evenTotal / total) * 100) };
  })();

  // Range distribution
  const rangeStats = (() => {
    const ranges = [
      { label: '1~10', min: 1, max: 10, count: 0 },
      { label: '11~20', min: 11, max: 20, count: 0 },
      { label: '21~30', min: 21, max: 30, count: 0 },
      { label: '31~40', min: 31, max: 40, count: 0 },
      { label: '41~45', min: 41, max: 45, count: 0 },
    ];
    for (const draw of allDraws) {
      for (const n of draw.numbers) {
        const r = ranges.find((r) => n >= r.min && n <= r.max);
        if (r) r.count++;
      }
    }
    const maxCount = Math.max(...ranges.map((r) => r.count));
    return { ranges, maxCount };
  })();

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 text-center">전체 {totalDraws}회차 기준 통계</p>

      {/* Hot numbers */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-1">🔥 핫넘버</h3>
        <p className="text-xs text-gray-400 mb-3">최근 20회 중 3회 이상 출현</p>
        <div className="flex flex-wrap gap-1.5">
          {hotNums.length > 0 ? hotNums.map((n) => (
            <LottoBall key={n} number={n} size="sm" />
          )) : <span className="text-xs text-gray-400">해당 번호 없음</span>}
        </div>
      </div>

      {/* Cold numbers */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-1">❄️ 콜드넘버</h3>
        <p className="text-xs text-gray-400 mb-3">최근 20회 중 미출현</p>
        <div className="flex flex-wrap gap-1.5">
          {coldNums.length > 0 ? coldNums.map((n) => (
            <LottoBall key={n} number={n} size="sm" />
          )) : <span className="text-xs text-gray-400">해당 번호 없음</span>}
        </div>
      </div>

      {/* Frequency chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">번호별 출현 횟수</h3>
        <div className="grid grid-cols-9 gap-1">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
            const count = freq[n] || 0;
            const pct = (count / maxFreq) * 100;
            return (
              <div key={n} className="text-center">
                <div className="h-12 flex items-end justify-center mb-0.5">
                  <div
                    className="w-full max-w-[20px] rounded-t bg-blue-400"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  />
                </div>
                <span className="text-[9px] text-gray-500">{n}</span>
                <span className="block text-[8px] text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Odd/Even ratio */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">홀짝 비율</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex h-6 rounded-full overflow-hidden">
              <div className="bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${oddEvenStats.oddPct}%` }}>
                홀 {oddEvenStats.oddPct}%
              </div>
              <div className="bg-pink-400 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${oddEvenStats.evenPct}%` }}>
                짝 {oddEvenStats.evenPct}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Range distribution */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">구간별 분포</h3>
        <div className="space-y-2">
          {rangeStats.ranges.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{r.label}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full"
                  style={{ width: `${(r.count / rangeStats.maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-12 text-right">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
