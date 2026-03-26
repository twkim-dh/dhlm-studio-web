'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottoBall from '@/components/LottoBall';
import NumberSet from '@/components/NumberSet';
import { generateRandom, generateWithFixed, generateExcluding, generateOddEven, generateDream, dreamData } from '@/lib/lotto-generator';
import { initKakao, shareLotto } from '@/lib/lotto-kakao';
import { getLatestDraw, getRecentDraws, getNumberFrequency, getHotNumbers, getColdNumbers, getTotalDrawCount, allDraws } from '@/data/lotto/recent-draws';
import type { LottoDraw } from '@/data/lotto/recent-draws';

/* ═══════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════ */
type TabId = 'fortune' | 'generate' | 'winning' | 'stats';
type FortuneSubTab = 'daily' | 'tarot' | 'compat' | 'name';

const mainTabs: { id: TabId; label: string; emoji: string }[] = [
  { id: 'fortune', label: '운세', emoji: '🔮' },
  { id: 'generate', label: '번호생성', emoji: '🎲' },
  { id: 'winning', label: '당첨', emoji: '🏆' },
  { id: 'stats', label: '통계', emoji: '📊' },
];

const fortuneSubTabs: { id: FortuneSubTab; label: string; emoji: string }[] = [
  { id: 'daily', label: '운세', emoji: '⭐' },
  { id: 'tarot', label: '타로', emoji: '🔮' },
  { id: 'compat', label: '궁합', emoji: '💕' },
  { id: 'name', label: '이름', emoji: '📛' },
];

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

/* ═══════════════════════════════════════
   Tarot Card Data (22 Major Arcana)
   ═══════════════════════════════════════ */
const tarotCards: { id: number; name: string; emoji: string; meaning: string }[] = [
  { id: 0, name: '바보', emoji: '🃏', meaning: '새로운 시작, 모험' },
  { id: 1, name: '마법사', emoji: '🧙', meaning: '창조력, 의지' },
  { id: 2, name: '여사제', emoji: '🌙', meaning: '직감, 지혜' },
  { id: 3, name: '여황제', emoji: '👑', meaning: '풍요, 모성' },
  { id: 4, name: '황제', emoji: '🏰', meaning: '안정, 권위' },
  { id: 5, name: '교황', emoji: '📿', meaning: '신뢰, 전통' },
  { id: 6, name: '연인', emoji: '💑', meaning: '사랑, 선택' },
  { id: 7, name: '전차', emoji: '🏇', meaning: '승리, 전진' },
  { id: 8, name: '힘', emoji: '🦁', meaning: '용기, 인내' },
  { id: 9, name: '은둔자', emoji: '🏔️', meaning: '성찰, 깨달음' },
  { id: 10, name: '운명의 수레바퀴', emoji: '🎡', meaning: '변화, 행운' },
  { id: 11, name: '정의', emoji: '⚖️', meaning: '공정, 균형' },
  { id: 12, name: '매달린 사람', emoji: '🙃', meaning: '희생, 새 관점' },
  { id: 13, name: '죽음', emoji: '🌅', meaning: '변환, 끝과 시작' },
  { id: 14, name: '절제', emoji: '🏺', meaning: '조화, 인내' },
  { id: 15, name: '악마', emoji: '😈', meaning: '유혹, 집착 해방' },
  { id: 16, name: '탑', emoji: '⚡', meaning: '급변, 해방' },
  { id: 17, name: '별', emoji: '⭐', meaning: '희망, 영감' },
  { id: 18, name: '달', emoji: '🌕', meaning: '불안 극복, 직감' },
  { id: 19, name: '태양', emoji: '☀️', meaning: '성공, 기쁨' },
  { id: 20, name: '심판', emoji: '📯', meaning: '부활, 각성' },
  { id: 21, name: '세계', emoji: '🌍', meaning: '완성, 성취' },
];

/* ═══════════════════════════════════════
   Utility Functions
   ═══════════════════════════════════════ */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getFortuneScore(birthday: string) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = birthday.replace(/-/g, '') + dateStr;
  const hash = hashString(seed);
  const score = (hash % 100) + 1;

  const luckyNumbers: number[] = [];
  let h = hash;
  while (luckyNumbers.length < 3) {
    h = ((h * 1103515245 + 12345) & 0x7fffffff);
    const n = (h % 45) + 1;
    if (!luckyNumbers.includes(n)) luckyNumbers.push(n);
  }

  let grade: string, message: string;
  if (score >= 90) { grade = '🌟 대박 운세'; message = '오늘은 로또 사는 날! 운이 폭발합니다!'; }
  else if (score >= 70) { grade = '🔥 상승 운세'; message = '좋은 기운이 가득합니다. 도전해보세요!'; }
  else if (score >= 50) { grade = '☀️ 평온 운세'; message = '안정적인 하루입니다. 꾸준히 도전!'; }
  else if (score >= 30) { grade = '🌤️ 보통 운세'; message = '평범한 하루, 작은 행운을 놓치지 마세요.'; }
  else { grade = '🌙 충전 운세'; message = '에너지를 모으는 날. 내일을 기대하세요!'; }

  const weeklyTrend: number[] = [];
  for (let d = 0; d < 7; d++) {
    const daySeed = birthday.replace(/-/g, '') + `${today.getFullYear()}${today.getMonth()}${today.getDate() - today.getDay() + d}`;
    weeklyTrend.push((hashString(daySeed) % 100) + 1);
  }

  return { score, luckyNumbers: luckyNumbers.sort((a, b) => a - b), grade, message, weeklyTrend };
}

// Korean consonant stroke counts
const JAMO_STROKES: Record<string, number> = {
  'ㄱ': 2, 'ㄲ': 4, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 6, 'ㄹ': 5, 'ㅁ': 4, 'ㅂ': 4, 'ㅃ': 8,
  'ㅅ': 2, 'ㅆ': 4, 'ㅇ': 1, 'ㅈ': 3, 'ㅉ': 6, 'ㅊ': 4, 'ㅋ': 3, 'ㅌ': 4, 'ㅍ': 4, 'ㅎ': 3,
};
const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGSUNG_STROKES = [2,3,3,2,4,4,3,2,3,3,3,3,3,3,3,2,4,4,3,3,1]; // ㅏ~ㅣ
const JONGSUNG = ['','ㄱ','ㄲ','ㄱㅅ','ㄴ','ㄴㅈ','ㄴㅎ','ㄷ','ㄹ','ㄹㄱ','ㄹㅁ','ㄹㅂ','ㄹㅅ','ㄹㅌ','ㄹㅍ','ㄹㅎ','ㅁ','ㅂ','ㅂㅅ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JONGSUNG_STROKES = [0,2,4,4,2,5,5,3,5,7,9,9,7,9,9,8,4,4,6,2,4,1,3,4,3,4,4,3];

function getNameStrokes(name: string): number {
  let total = 0;
  for (const ch of name) {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const offset = code - 0xAC00;
      const cho = Math.floor(offset / (21 * 28));
      const jung = Math.floor((offset % (21 * 28)) / 28);
      const jong = offset % 28;
      total += (JAMO_STROKES[CHOSUNG[cho]] || 2) + JUNGSUNG_STROKES[jung] + JONGSUNG_STROKES[jong];
    }
  }
  return total;
}

function getCompatScore(b1: string, b2: string, type: 'love' | 'friend' | 'work') {
  const sorted = [b1, b2].sort().join('');
  const seed = sorted + type;
  return (hashString(seed) % 100) + 1;
}

/* ═══════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════ */
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
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">DHLM 로또 🎱</h1>
        <p className="text-gray-500 text-sm mt-1">행운의 번호를 만나보세요</p>
      </div>

      {/* Main Tab Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-4 px-4">
        <div className="flex">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
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

      <div className="mt-4">
        {activeTab === 'fortune' && <FortuneTab />}
        {activeTab === 'generate' && <GenerateTab />}
        {activeTab === 'winning' && <WinningTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8 pb-4">
        번호 생성만 제공하며 구매 대행은 하지 않습니다.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   🔮 Fortune Tab (with sub-tabs)
   ═══════════════════════════════════════ */
function FortuneTab() {
  const [subTab, setSubTab] = useState<FortuneSubTab>('daily');

  return (
    <div>
      {/* Sub-tab navigation */}
      <div className="flex gap-1.5 mb-5">
        {fortuneSubTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
              subTab === t.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {subTab === 'daily' && <DailyFortuneSection />}
      {subTab === 'tarot' && <TarotSection />}
      {subTab === 'compat' && <CompatSection />}
      {subTab === 'name' && <NameFortuneSection />}
    </div>
  );
}

/* ─── Daily Fortune ─── */
function DailyFortuneSection() {
  const [birthday, setBirthday] = useState('');
  const [fortune, setFortune] = useState<ReturnType<typeof getFortuneScore> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lotto-birthday');
    if (saved) { setBirthday(saved); setFortune(getFortuneScore(saved)); }
  }, []);

  const handleCheck = () => {
    if (!birthday) return;
    localStorage.setItem('lotto-birthday', birthday);
    setFortune(getFortuneScore(birthday));
  };

  const todayIdx = new Date().getDay();

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5">
        <h2 className="font-bold text-lg mb-3">오늘의 로또 운세</h2>
        <div className="flex gap-2">
          <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          <button onClick={handleCheck}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-95 transition">
            확인
          </button>
        </div>
      </div>

      {fortune && (
        <>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500 mb-2">{fortune.grade}</p>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke={fortune.score >= 70 ? '#4f46e5' : fortune.score >= 40 ? '#f59e0b' : '#9ca3af'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${fortune.score * 2.64} 264`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{fortune.score}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{fortune.message}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-3">오늘의 행운 번호</h3>
            <div className="flex justify-center gap-3">
              {fortune.luckyNumbers.map((n) => <LottoBall key={n} number={n} size="lg" animated />)}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-3">이번 주 운세 추이</h3>
            <div className="flex items-end gap-1.5 h-24">
              {fortune.weeklyTrend.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400">{val}</span>
                  <div className={`w-full rounded-t-md ${i === todayIdx ? 'bg-indigo-500' : 'bg-gray-200'}`}
                    style={{ height: `${val * 0.8}%` }} />
                  <span className={`text-[10px] ${i === todayIdx ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>{dayNames[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={async () => {
            const text = `DHLM 로또 운세\n점수: ${fortune.score}점 ${fortune.grade}\n행운번호: ${fortune.luckyNumbers.join(', ')}\n\nhttps://dhlm-studio.com/lotto#fortune`;
            if (navigator.share) { try { await navigator.share({ title: 'DHLM 로또 운세', text }); } catch {} }
            else { await navigator.clipboard.writeText(text); alert('복사되었습니다!'); }
          }} className="w-full py-3 bg-yellow-400 text-gray-900 rounded-xl font-medium hover:bg-yellow-500 active:scale-[0.98] transition">
            운세 공유하기
          </button>
        </>
      )}
    </div>
  );
}

/* ─── AI Tarot ─── */
function TarotSection() {
  const [concern, setConcern] = useState('');
  const [shuffled, setShuffled] = useState<typeof tarotCards>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<'input' | 'select' | 'result'>('input');

  const startReading = () => {
    const copy = [...tarotCards];
    for (let i = copy.length - 1; i > 0; i--) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const j = arr[0] % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy.slice(0, 10));
    setSelected([]);
    setFlipped(new Set());
    setInterpretation('');
    setError('');
    setPhase('select');
  };

  const selectCard = (idx: number) => {
    if (selected.length >= 3 || selected.includes(idx)) return;
    const newSelected = [...selected, idx];
    setSelected(newSelected);
    setFlipped((prev) => new Set([...prev, idx]));

    if (newSelected.length === 3) {
      fetchInterpretation(newSelected);
    }
  };

  const fetchInterpretation = async (cardIdxs: number[]) => {
    setLoading(true);
    setError('');
    const cards = cardIdxs.map((i) => `${shuffled[i].name} (${shuffled[i].meaning})`);
    try {
      const res = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards, concern: concern || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'AI 해석 실패');
      } else {
        setInterpretation(data.interpretation);
        setPhase('result');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const positionLabels = ['과거', '현재', '미래'];

  return (
    <div className="space-y-5">
      {phase === 'input' && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5">
          <h2 className="font-bold text-lg mb-1">AI 타로 카드</h2>
          <p className="text-xs text-gray-500 mb-4">카드 3장으로 과거/현재/미래를 읽어보세요 (하루 3회 무료)</p>
          <input type="text" value={concern} onChange={(e) => setConcern(e.target.value)}
            placeholder="고민을 입력하세요 (선택)"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 mb-3" />
          <button onClick={startReading}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 active:scale-[0.98] transition">
            카드 펼치기
          </button>
        </div>
      )}

      {phase === 'select' && (
        <div>
          <p className="text-center text-sm text-gray-600 mb-4">
            카드 3장을 선택하세요 <span className="text-purple-600 font-bold">({selected.length}/3)</span>
          </p>
          <div className="grid grid-cols-5 gap-2">
            {shuffled.map((card, idx) => {
              const isFlipped = flipped.has(idx);
              const isSelected = selected.includes(idx);
              const order = selected.indexOf(idx);
              return (
                <motion.button key={card.id}
                  onClick={() => selectCard(idx)}
                  disabled={isSelected || selected.length >= 3}
                  className="relative aspect-[2/3] rounded-xl overflow-hidden"
                  whileHover={!isSelected && selected.length < 3 ? { scale: 1.05 } : {}}
                  whileTap={!isSelected && selected.length < 3 ? { scale: 0.95 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {isFlipped ? (
                      <motion.div key="front"
                        initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-xl flex flex-col items-center justify-center p-1"
                      >
                        <span className="text-2xl">{card.emoji}</span>
                        <span className="text-[9px] font-medium text-purple-800 mt-1 leading-tight text-center">{card.name}</span>
                        {order >= 0 && (
                          <span className="absolute top-0.5 right-1 text-[8px] bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                            {positionLabels[order][0]}
                          </span>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div key="back"
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute inset-0 rounded-xl border-2 flex items-center justify-center ${
                          selected.length >= 3 ? 'bg-gray-100 border-gray-200' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 cursor-pointer'
                        }`}
                      >
                        <span className="text-2xl text-white/80">🂠</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {loading && (
            <div className="text-center py-6">
              <div className="inline-block w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500 mt-2">AI가 카드를 해석하고 있어요...</p>
            </div>
          )}
          {error && <p className="text-center text-sm text-red-500 mt-3">{error}</p>}
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            {selected.map((idx, i) => {
              const card = shuffled[idx];
              return (
                <div key={card.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3 text-center flex-1">
                  <p className="text-[10px] text-purple-600 font-bold mb-1">{positionLabels[i]}</p>
                  <span className="text-2xl block">{card.emoji}</span>
                  <p className="text-xs font-medium mt-1">{card.name}</p>
                  <p className="text-[10px] text-gray-500">{card.meaning}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-2">AI 해석</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{interpretation}</p>
          </div>

          <button onClick={() => { setPhase('input'); setConcern(''); }}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 active:scale-[0.98] transition">
            다시 뽑기
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Compatibility ─── */
function CompatSection() {
  const [myBirth, setMyBirth] = useState('');
  const [partnerBirth, setPartnerBirth] = useState('');
  const [result, setResult] = useState<{ love: number; friend: number; work: number; total: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lotto-birthday');
    if (saved) setMyBirth(saved);
  }, []);

  const check = () => {
    if (!myBirth || !partnerBirth) return;
    const love = getCompatScore(myBirth, partnerBirth, 'love');
    const friend = getCompatScore(myBirth, partnerBirth, 'friend');
    const work = getCompatScore(myBirth, partnerBirth, 'work');
    const total = Math.round((love + friend + work) / 3);
    setResult({ love, friend, work, total });
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { label: '환상의 짝꿍', color: 'text-pink-600' };
    if (score >= 70) return { label: '찰떡궁합', color: 'text-purple-600' };
    if (score >= 50) return { label: '괜찮은 사이', color: 'text-blue-600' };
    if (score >= 30) return { label: '노력 필요', color: 'text-amber-600' };
    return { label: '극과 극', color: 'text-gray-500' };
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5">
        <h2 className="font-bold text-lg mb-3">궁합 보기</h2>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">내 생년월일</label>
            <input type="date" value={myBirth} onChange={(e) => setMyBirth(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">상대 생년월일</label>
            <input type="date" value={partnerBirth} onChange={(e) => setPartnerBirth(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <button onClick={check}
            className="w-full py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 active:scale-[0.98] transition mt-1">
            궁합 확인
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
            <p className={`text-sm font-bold mb-2 ${getGrade(result.total).color}`}>{getGrade(result.total).label}</p>
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#fce7f3" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#ec4899" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={`${result.total * 2.64} 264`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-pink-600">{result.total}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {([
              { label: '연애', emoji: '❤️', score: result.love },
              { label: '우정', emoji: '🤝', score: result.friend },
              { label: '업무', emoji: '💼', score: result.work },
            ] as const).map((item) => (
              <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-lg block">{item.emoji}</span>
                <p className="text-[10px] text-gray-500 mt-1">{item.label}</p>
                <p className="text-lg font-bold text-pink-600">{item.score}%</p>
              </div>
            ))}
          </div>

          <button onClick={async () => {
            const text = `우리 궁합 ${result.total}%래! 💕\n연애 ${result.love}% / 우정 ${result.friend}% / 업무 ${result.work}%\n\nhttps://dhlm-studio.com/lotto#fortune`;
            if (navigator.share) { try { await navigator.share({ title: '궁합 결과', text }); } catch {} }
            else { await navigator.clipboard.writeText(text); alert('복사되었습니다!'); }
          }} className="w-full py-3 bg-yellow-400 text-gray-900 rounded-xl font-medium hover:bg-yellow-500 active:scale-[0.98] transition">
            궁합 공유하기
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Name Fortune ─── */
function NameFortuneSection() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<{ strokes: number; score: number; grade: string; meaning: string; luckyNums: number[] } | null>(null);

  const analyze = () => {
    if (!name || name.length < 2) return;
    const strokes = getNameStrokes(name);
    const hash = hashString(name + 'fortune');
    const score = Math.min(99, Math.max(1, (hash % 60) + 40 + (strokes % 10)));

    const meanings = [
      '리더십이 강하고 결단력이 뛰어난 이름',
      '창의력과 예술적 감각이 돋보이는 이름',
      '안정적이고 신뢰를 주는 이름',
      '활발하고 사교적인 에너지의 이름',
      '지혜롭고 깊이 있는 사고력의 이름',
      '따뜻하고 배려심이 깊은 이름',
      '도전적이고 진취적인 기운의 이름',
      '조화롭고 균형 잡힌 이름',
    ];
    const meaning = meanings[hash % meanings.length];

    let grade: string;
    if (score >= 90) grade = '최상의 이름';
    else if (score >= 75) grade = '매우 좋은 이름';
    else if (score >= 60) grade = '좋은 이름';
    else if (score >= 45) grade = '무난한 이름';
    else grade = '개성 있는 이름';

    const luckyNums: number[] = [];
    let h = hash;
    while (luckyNums.length < 3) {
      h = ((h * 1103515245 + 12345) & 0x7fffffff);
      const n = (h % 45) + 1;
      if (!luckyNums.includes(n)) luckyNums.push(n);
    }

    setResult({ strokes, score, grade, meaning, luckyNums: luckyNums.sort((a, b) => a - b) });
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5">
        <h2 className="font-bold text-lg mb-1">이름 운세</h2>
        <p className="text-xs text-gray-500 mb-3">한글 이름의 획수로 운세를 확인하세요</p>
        <div className="flex gap-2">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="한글 이름 (예: 홍길동)"
            maxLength={5}
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
          <button onClick={analyze}
            className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 active:scale-95 transition">
            확인
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500 mb-1">총 획수: {result.strokes}획</p>
            <p className="text-amber-600 font-bold text-sm mb-2">{result.grade}</p>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#fef3c7" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f59e0b" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={`${result.score * 2.64} 264`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{result.score}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{result.meaning}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-3">이름 행운 번호</h3>
            <div className="flex justify-center gap-3">
              {result.luckyNums.map((n) => <LottoBall key={n} number={n} size="lg" animated />)}
            </div>
          </div>

          <button onClick={async () => {
            const text = `${name}님의 이름 운세\n점수: ${result.score}점 (${result.grade})\n총 ${result.strokes}획 — ${result.meaning}\n행운번호: ${result.luckyNums.join(', ')}\n\nhttps://dhlm-studio.com/lotto#fortune`;
            if (navigator.share) { try { await navigator.share({ title: '이름 운세', text }); } catch {} }
            else { await navigator.clipboard.writeText(text); alert('복사되었습니다!'); }
          }} className="w-full py-3 bg-yellow-400 text-gray-900 rounded-xl font-medium hover:bg-yellow-500 active:scale-[0.98] transition">
            이름 운세 공유하기
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
      <div className="grid grid-cols-5 gap-1.5">
        {modes.map((m) => (
          <button key={m.id} onClick={() => { setMode(m.id); setResults([]); }}
            className={`py-2 px-1 rounded-xl text-center text-xs font-medium transition ${
              mode === m.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            <span className="block text-base">{m.label.split(' ')[0]}</span>
            <span className="block mt-0.5 text-[10px]">{m.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-xs text-gray-500 mb-3">{modes.find((m) => m.id === mode)?.desc}</p>

        {mode === 'dream' && (
          <div className="space-y-3">
            <input type="text" value={dreamKeyword} onChange={(e) => setDreamKeyword(e.target.value)}
              placeholder="꿈에 나온 키워드 (예: 돼지, 돈, 용)"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <div className="flex flex-wrap gap-1.5">
              {dreamData.slice(0, 20).map((d) => (
                <button key={d.keyword} onClick={() => setDreamKeyword((prev) => prev ? `${prev} ${d.keyword}` : d.keyword)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs hover:bg-blue-50 transition">
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
                  <button key={n} onClick={() => !disabled && toggleNumber(n, list, setter)} disabled={disabled}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition ${
                      selected ? 'bg-blue-600 text-white' : disabled ? 'bg-gray-100 text-gray-300' : 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50'
                    }`}>{n}</button>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'oddeven' && (
          <div>
            <p className="text-xs text-gray-500 mb-2">홀수 개수: {oddCount}개 / 짝수: {6 - oddCount}개</p>
            <input type="range" min={0} max={6} value={oddCount} onChange={(e) => setOddCount(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>짝수 6</span><span>균형</span><span>홀수 6</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3">
          <span className="text-xs text-gray-500">세트</span>
          {[1, 3, 5].map((n) => (
            <button key={n} onClick={() => setSetCount(n)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${setCount === n ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-200'}`}>{n}</button>
          ))}
        </div>
        <button onClick={generate} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition">
          번호 생성
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2">
          {results.map((set, i) => (
            <NumberSet key={i} label={String.fromCharCode(65 + i)} numbers={set} animated />
          ))}
          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button onClick={handleCopy} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
              📋 번호 복사
            </button>
            <button onClick={handleShare} className="flex-1 py-2.5 bg-yellow-400 text-gray-900 rounded-xl text-sm font-medium hover:bg-yellow-500 transition">
              공유하기
            </button>
          </div>
          {shareMsg && <p className="text-center text-xs text-green-600 mt-2">{shareMsg}</p>}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium">이 번호로 구매하기</p>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-medium hover:bg-gray-50 transition">
                📋 번호 복사
              </button>
              <a href="https://m.dhlottery.co.kr" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-medium text-center hover:bg-green-700 transition">
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
    setCheckNums((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : prev.length < 6 ? [...prev, n] : prev);
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
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">{viewDraw.round}회 당첨번호</h2>
          <span className="text-xs text-gray-500">{viewDraw.date}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {viewDraw.numbers.map((n, i) => <LottoBall key={i} number={n} size="lg" animated delay={i} />)}
          <LottoBall number={viewDraw.bonus} size="lg" bonus animated delay={6} />
        </div>
        {viewDraw.prize1 && <p className="text-center text-xs text-gray-500 mt-3">1등 당첨금: {viewDraw.prize1}</p>}
      </div>

      <div className="flex gap-2">
        <button onClick={() => handleRoundChange(Math.max(1, selectedRound - 1))}
          className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 transition">◀</button>
        <input type="number" value={selectedRound} onChange={(e) => handleRoundChange(Number(e.target.value))}
          min={1} max={latest.round}
          className="flex-1 text-center px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
        <button onClick={() => handleRoundChange(Math.min(latest.round, selectedRound + 1))}
          className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 transition">▶</button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">최근 당첨번호</h3>
        <div className="space-y-2">
          {recent.slice(0, 5).map((draw) => (
            <button key={draw.round} onClick={() => handleRoundChange(draw.round)}
              className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl text-xs transition ${
                draw.round === selectedRound ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'
              }`}>
              <span className="font-bold w-14 text-left">{draw.round}회</span>
              <div className="flex gap-1 flex-1 flex-wrap">
                {draw.numbers.map((n, i) => <LottoBall key={i} number={n} size="sm" />)}
                <LottoBall number={draw.bonus} size="sm" bonus />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">내 번호 당첨 확인</h3>
        <p className="text-xs text-gray-500 mb-2">6개 번호를 선택하세요</p>
        <div className="grid grid-cols-9 gap-1 mb-3">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
            const selected = checkNums.includes(n);
            const disabled = !selected && checkNums.length >= 6;
            return (
              <button key={n} onClick={() => !disabled && toggleCheckNum(n)} disabled={disabled}
                className={`w-8 h-8 rounded-full text-xs font-medium transition ${
                  selected ? 'bg-amber-500 text-white' : disabled ? 'bg-gray-100 text-gray-300' : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50'
                }`}>{n}</button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setCheckNums([]); setCheckResult(null); }}
            className="px-4 py-2.5 bg-gray-100 rounded-xl text-xs font-medium hover:bg-gray-200 transition">초기화</button>
          <button onClick={checkWinning} disabled={checkNums.length !== 6}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              checkNums.length === 6 ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>당첨 확인 ({checkNums.length}/6)</button>
        </div>
        {checkResult && (
          <div className={`mt-3 p-3 rounded-xl text-center text-sm font-medium ${
            checkResult.includes('1등') || checkResult.includes('2등') ? 'bg-yellow-100 text-yellow-800'
              : checkResult.includes('등') ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'
          }`}>{checkResult}</div>
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

  const oddEvenStats = (() => {
    let oddTotal = 0, evenTotal = 0;
    for (const draw of allDraws) {
      for (const n of draw.numbers) { if (n % 2 === 1) oddTotal++; else evenTotal++; }
    }
    const total = oddTotal + evenTotal;
    return { oddPct: Math.round((oddTotal / total) * 100), evenPct: Math.round((evenTotal / total) * 100) };
  })();

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

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-1">🔥 핫넘버</h3>
        <p className="text-xs text-gray-400 mb-3">최근 20회 중 3회 이상 출현</p>
        <div className="flex flex-wrap gap-1.5">
          {hotNums.length > 0 ? hotNums.map((n) => <LottoBall key={n} number={n} size="sm" />) : <span className="text-xs text-gray-400">해당 번호 없음</span>}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-1">❄️ 콜드넘버</h3>
        <p className="text-xs text-gray-400 mb-3">최근 20회 중 미출현</p>
        <div className="flex flex-wrap gap-1.5">
          {coldNums.length > 0 ? coldNums.map((n) => <LottoBall key={n} number={n} size="sm" />) : <span className="text-xs text-gray-400">해당 번호 없음</span>}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">번호별 출현 횟수</h3>
        <div className="grid grid-cols-9 gap-1">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
            const count = freq[n] || 0;
            const pct = (count / maxFreq) * 100;
            return (
              <div key={n} className="text-center">
                <div className="h-12 flex items-end justify-center mb-0.5">
                  <div className="w-full max-w-[20px] rounded-t bg-blue-400" style={{ height: `${Math.max(pct, 4)}%` }} />
                </div>
                <span className="text-[9px] text-gray-500">{n}</span>
                <span className="block text-[8px] text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">홀짝 비율</h3>
        <div className="flex h-6 rounded-full overflow-hidden">
          <div className="bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${oddEvenStats.oddPct}%` }}>
            홀 {oddEvenStats.oddPct}%
          </div>
          <div className="bg-pink-400 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${oddEvenStats.evenPct}%` }}>
            짝 {oddEvenStats.evenPct}%
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">구간별 분포</h3>
        <div className="space-y-2">
          {rangeStats.ranges.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{r.label}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(r.count / rangeStats.maxCount) * 100}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-12 text-right">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
