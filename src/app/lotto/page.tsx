'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottoBall from '@/components/LottoBall';
import NumberSet from '@/components/NumberSet';
import { generateRandom, generateWithFixed, generateExcluding, generateOddEven, generateDream, dreamData } from '@/lib/lotto-generator';
import { initKakao, shareLotto } from '@/lib/lotto-kakao';
import { worldLotteries, getLotteryById, generateLottery, formatShareText, idToSlug, type GeneratedResult } from '@/lib/world-lottery';
import Link from 'next/link';
import { getLatestDraw, getRecentDraws, getNumberFrequency, getHotNumbers, getColdNumbers, getTotalDrawCount, allDraws } from '@/data/lotto/recent-draws';
import type { LottoDraw } from '@/data/lotto/recent-draws';

/* ═══════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════ */
type TabId = 'home' | 'fortune' | 'generate' | 'world' | 'winning' | 'stats';
type FortuneSubTab = 'daily' | 'tarot' | 'compat' | 'name';

const mainTabs: { id: TabId; label: string; emoji: string }[] = [
  { id: 'home', label: '홈', emoji: '🏠' },
  { id: 'generate', label: '생성', emoji: '🎲' },
  { id: 'fortune', label: '운세', emoji: '🔮' },
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
  const [activeTab, setActiveTab] = useState<TabId>('home');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as TabId;
    if (['home', 'fortune', 'generate', 'world', 'winning', 'stats'].includes(hash)) {
      setActiveTab(hash);
    }
    initKakao();
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `#${tab}`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF' }}>
      {/* Header */}
      <div className="py-8 text-center">
        <p className="text-[10px] tracking-[0.4em] mb-1" style={{ color: '#C73E3A' }}>DHLM STUDIO</p>
        <h1 className="text-2xl font-bold tracking-[0.15em]"
          style={{ fontFamily: 'var(--font-noto-serif-kr), serif', color: '#1A1A1A' }}>
          행운의 번호
        </h1>
        <p className="text-xs mt-1 tracking-wide" style={{ color: '#6B7280' }}>World Lottery Generator</p>
        <div className="w-8 h-[2px] mx-auto mt-3" style={{ background: '#C73E3A' }} />
      </div>

      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Tab Navigation */}
        <div className="sticky top-[48px] z-10 -mx-4 px-4 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <div className="flex border-b" style={{ borderColor: '#E5E7EB' }}>
            {mainTabs.map((tab) => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                className="flex-1 py-2.5 text-center text-sm font-medium transition-colors relative"
                style={{ color: activeTab === tab.id ? '#8B2500' : '#8D8478' }}>
                <span className="block text-base">{tab.emoji}</span>
                <span className="block text-[10px] mt-0.5">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-3 right-3 h-[2px]" style={{ background: '#C73E3A' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {activeTab === 'home' && <LottoHome onNavigate={handleTabChange} />}
          {activeTab === 'fortune' && <FortuneTab />}
          {activeTab === 'generate' && <GenerateTab />}
          {activeTab === 'world' && <WorldTab />}
          {activeTab === 'winning' && <WinningTab />}
          {activeTab === 'stats' && <StatsTab />}
        </div>

        <p className="text-center text-[10px] mt-8 pb-4" style={{ color: '#B5AFA5' }}>
          번호 생성만 제공하며 구매 대행은 하지 않습니다.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   🏠 Lotto Home — Country Selection
   ═══════════════════════════════════════ */
function LottoHome({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  return (
    <div className="space-y-5">
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNavigate('generate')}
          className="bg-white border rounded p-4 text-center transition-all hover:border-[#C73E3A]"
          style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
          <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>🇰🇷 번호 생성</p>
          <p className="text-[10px]" style={{ color: '#6B7280' }}>Korea Lotto 6/45</p>
        </button>
        <button onClick={() => onNavigate('fortune')}
          className="bg-white border rounded p-4 text-center transition-all hover:border-[#C73E3A]"
          style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
          <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>🔮 운세 · 타로</p>
          <p className="text-[10px]" style={{ color: '#6B7280' }}>Fortune & Tarot</p>
        </button>
      </div>

      {/* All lotteries */}
      <div>
        <p className="text-xs font-medium tracking-widest mb-3" style={{ color: '#C73E3A' }}>
          WORLD LOTTERIES · {worldLotteries.length}
        </p>
        <div className="space-y-1.5">
          {worldLotteries.map((l) => {
            const slug = idToSlug[l.id];
            const isKorea = l.id === 'korea-lotto';
            const desc = `${l.mainNumbers.count} (${l.mainNumbers.min}-${l.mainNumbers.max})${l.bonusNumbers ? ` + ${l.bonusNumbers.name}` : ''}`;

            if (isKorea) {
              return (
                <button key={l.id} onClick={() => onNavigate('generate')}
                  className="w-full flex items-center gap-3 bg-white border rounded px-4 py-3 transition-all hover:border-[#C73E3A] text-left"
                  style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
                  <span className="text-lg shrink-0">{l.country}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{l.name}</p>
                    <p className="text-[10px]" style={{ color: '#6B7280' }}>{desc}</p>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: '#C73E3A' }}>→</span>
                </button>
              );
            }

            return (
              <Link key={l.id} href={slug ? `/lotto/${slug}` : '/lotto'}
                className="flex items-center gap-3 bg-white border rounded px-4 py-3 transition-all hover:border-[#C73E3A]"
                style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
                <span className="text-lg shrink-0">{l.country}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{l.name}</p>
                  <p className="text-[10px]" style={{ color: '#6B7280' }}>{desc}</p>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: '#C73E3A' }}>→</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* More */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNavigate('winning')}
          className="bg-white border rounded p-3 text-center transition-all hover:border-[#C73E3A]"
          style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
          <span className="text-lg">🏆</span>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#1A1A1A' }}>당첨 확인</p>
        </button>
        <button onClick={() => onNavigate('stats')}
          className="bg-white border rounded p-3 text-center transition-all hover:border-[#C73E3A]"
          style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
          <span className="text-lg">📊</span>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#1A1A1A' }}>통계</p>
        </button>
      </div>
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
                ? 'bg-[#8B2500] text-white '
                : 'bg-[#E8E2D8] text-[#8D8478] hover:bg-[#E0D8CC]'
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
      <div className="bg-gradient-to-br from-[#F0EBE0] to-[#E8E2D8] rounded-lg p-5">
        <h2 className="font-bold text-lg mb-3">오늘의 로또 운세</h2>
        <div className="flex gap-2">
          <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-[#D5CEC3] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2500]" />
          <button onClick={handleCheck}
            className="px-5 py-2.5 bg-[#8B2500] text-white rounded-xl text-sm font-medium hover:bg-[#6B1D00] active:scale-95 transition">
            확인
          </button>
        </div>
      </div>

      {fortune && (
        <>
          <div className="bg-white border border-[#D5CEC3] rounded-lg p-5 text-center ">
            <p className="text-sm text-[#A5A09A] mb-2">{fortune.grade}</p>
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
            <p className="text-sm text-[#8D8478]">{fortune.message}</p>
          </div>

          <div className="bg-white border border-[#D5CEC3] rounded-lg p-5 ">
            <h3 className="font-bold text-sm mb-3">오늘의 행운 번호</h3>
            <div className="flex justify-center gap-3">
              {fortune.luckyNumbers.map((n) => <LottoBall key={n} number={n} size="lg" animated />)}
            </div>
          </div>

          <div className="bg-white border border-[#D5CEC3] rounded-lg p-5 ">
            <h3 className="font-bold text-sm mb-3">이번 주 운세 추이</h3>
            <div className="flex items-end gap-1.5 h-24">
              {fortune.weeklyTrend.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#B5AFA5]">{val}</span>
                  <div className={`w-full rounded-t-md ${i === todayIdx ? 'bg-[#C5981A]' : 'bg-[#E8E2D8]'}`}
                    style={{ height: `${val * 0.8}%` }} />
                  <span className={`text-[10px] ${i === todayIdx ? 'text-[#8B2500] font-bold' : 'text-[#B5AFA5]'}`}>{dayNames[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={async () => {
            const text = `DHLM 로또 운세\n점수: ${fortune.score}점 ${fortune.grade}\n행운번호: ${fortune.luckyNumbers.join(', ')}\n\nhttps://dhlm-studio.com/lotto#fortune`;
            if (navigator.share) { try { await navigator.share({ title: 'DHLM 로또 운세', text }); } catch {} }
            else { await navigator.clipboard.writeText(text); alert('복사되었습니다!'); }
          }} className="w-full py-3 bg-yellow-400 text-[#2C1810] rounded-xl font-medium hover:bg-yellow-500 active:scale-[0.98] transition">
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
      generateInterpretation(newSelected);
    }
  };

  const generateInterpretation = (cardIdxs: number[]) => {
    setLoading(true);
    const cards = cardIdxs.map((i) => shuffled[i]);

    const pastMessages: Record<string, string> = {
      '바보': '과거에 새로운 도전을 시작했던 경험이 지금의 당신을 만들었습니다.',
      '마법사': '과거의 창의적인 선택들이 좋은 토대가 되었습니다.',
      '여사제': '직감을 따랐던 과거의 결정이 옳았습니다.',
      '여황제': '풍요롭고 따뜻했던 시간이 당신의 마음을 키웠습니다.',
      '황제': '과거에 세운 안정적인 기반이 지금 빛을 발합니다.',
      '교황': '신뢰할 수 있는 관계들이 과거부터 쌓여왔습니다.',
      '연인': '과거의 중요한 선택이 지금의 인연으로 이어졌습니다.',
      '전차': '과거의 도전과 승리가 당신에게 자신감을 주었습니다.',
      '힘': '어려움을 이겨낸 과거의 경험이 내면의 힘이 되었습니다.',
      '은둔자': '조용히 성찰했던 시간이 깊은 지혜를 선물했습니다.',
      '운명의 수레바퀴': '과거의 변화가 새로운 기회의 문을 열어주었습니다.',
      '정의': '공정하게 행동했던 과거가 좋은 결과로 돌아옵니다.',
      '매달린 사람': '과거의 희생과 인내가 새로운 시각을 열어주었습니다.',
      '죽음': '과거의 끝이 새로운 시작의 씨앗이 되었습니다.',
      '절제': '균형을 찾으려 했던 노력이 결실을 맺고 있습니다.',
      '악마': '과거의 집착에서 벗어나면서 자유를 찾기 시작했습니다.',
      '탑': '갑작스러운 과거의 변화가 오히려 해방을 가져다주었습니다.',
      '별': '과거에 품었던 희망이 서서히 현실이 되고 있습니다.',
      '달': '불안했던 과거를 극복하면서 직감이 더 강해졌습니다.',
      '태양': '밝고 행복했던 과거의 기억이 지금도 힘이 됩니다.',
      '심판': '과거의 경험을 돌아보며 새로운 각성을 얻었습니다.',
      '세계': '과거에 완성한 것들이 탄탄한 기반이 되었습니다.',
    };
    const presentMessages: Record<string, string> = {
      '바보': '지금은 두려움 없이 새로운 것에 도전할 때입니다.',
      '마법사': '현재 당신에게는 원하는 것을 만들어낼 힘이 있습니다.',
      '여사제': '지금은 직감을 믿고 내면의 목소리에 귀 기울일 때입니다.',
      '여황제': '현재 풍요로운 에너지가 당신을 감싸고 있습니다.',
      '황제': '지금 당신은 상황을 잘 통제하고 있습니다. 자신감을 가지세요.',
      '교황': '현재 주변의 조언을 귀담아들으면 좋은 결과가 있습니다.',
      '연인': '지금 중요한 선택의 기로에 서 있습니다. 마음의 소리를 따르세요.',
      '전차': '현재 강한 추진력으로 목표를 향해 나아가고 있습니다.',
      '힘': '지금 필요한 것은 부드러운 용기와 인내심입니다.',
      '은둔자': '현재 잠시 멈추고 자신을 돌아볼 시간이 필요합니다.',
      '운명의 수레바퀴': '지금 변화의 바람이 불고 있습니다. 흐름에 맡기세요.',
      '정의': '현재 균형 잡힌 판단이 중요한 시기입니다.',
      '매달린 사람': '지금은 다른 관점에서 상황을 바라볼 때입니다.',
      '죽음': '현재 무언가를 내려놓으면 새로운 것이 시작됩니다.',
      '절제': '지금은 조급해하지 말고 조화를 찾을 때입니다.',
      '악마': '현재의 유혹이나 집착에서 벗어날 용기가 필요합니다.',
      '탑': '지금 예상치 못한 변화가 오히려 기회가 될 수 있습니다.',
      '별': '현재 희망의 빛이 비치고 있습니다. 믿음을 가지세요.',
      '달': '지금은 불확실하지만 직감을 따르면 길이 보입니다.',
      '태양': '현재 밝은 에너지가 가득합니다. 자신감을 가지세요!',
      '심판': '지금이 각성과 변화의 순간입니다.',
      '세계': '현재 목표 달성에 매우 가까이 와 있습니다.',
    };
    const futureMessages: Record<string, string> = {
      '바보': '앞으로 신선하고 설레는 새 출발이 기다리고 있습니다.',
      '마법사': '미래에 당신의 능력이 빛을 발할 기회가 옵니다.',
      '여사제': '앞으로 숨겨진 진실이 드러나며 지혜를 얻게 됩니다.',
      '여황제': '미래에 풍요롭고 행복한 시간이 찾아옵니다.',
      '황제': '앞으로 안정적이고 튼튼한 기반을 다지게 됩니다.',
      '교황': '미래에 좋은 멘토나 가르침을 만나게 됩니다.',
      '연인': '앞으로 의미 있는 인연이나 선택이 찾아옵니다.',
      '전차': '미래에 큰 성취와 승리를 경험하게 됩니다.',
      '힘': '앞으로 어떤 어려움도 이겨낼 내면의 힘을 갖게 됩니다.',
      '은둔자': '미래에 깊은 깨달음과 성장의 시간이 옵니다.',
      '운명의 수레바퀴': '앞으로 행운의 바퀴가 당신 편으로 돌아갑니다.',
      '정의': '미래에 정당한 보상과 공정한 결과를 얻게 됩니다.',
      '매달린 사람': '앞으로 새로운 관점이 열리며 성장하게 됩니다.',
      '죽음': '미래에 큰 변화와 함께 새로운 시작이 찾아옵니다.',
      '절제': '앞으로 조화롭고 평화로운 시간이 기다립니다.',
      '악마': '미래에 속박에서 벗어나 진정한 자유를 찾게 됩니다.',
      '탑': '앞으로 큰 변화 후에 더 나은 것이 세워집니다.',
      '별': '미래에 꿈이 현실이 되는 순간이 찾아옵니다.',
      '달': '앞으로 불안이 걷히고 직감이 이끄는 대로 좋은 길이 열립니다.',
      '태양': '미래에 큰 기쁨과 성공이 기다리고 있습니다!',
      '심판': '앞으로 새로운 부활과 도약의 기회가 옵니다.',
      '세계': '미래에 완성과 성취의 기쁨을 맛보게 됩니다.',
    };

    const past = pastMessages[cards[0].name] || `${cards[0].name} 카드는 과거의 ${cards[0].meaning}을(를) 의미합니다.`;
    const present = presentMessages[cards[1].name] || `${cards[1].name} 카드는 현재의 ${cards[1].meaning}을(를) 의미합니다.`;
    const future = futureMessages[cards[2].name] || `${cards[2].name} 카드는 미래의 ${cards[2].meaning}을(를) 의미합니다.`;

    const text = `${past}\n\n${present}\n\n${future}\n\n전체적으로 좋은 흐름입니다. 자신을 믿고 한 걸음씩 나아가세요. 행운이 함께합니다! 🍀`;

    setTimeout(() => {
      setInterpretation(text);
      setPhase('result');
      setLoading(false);
    }, 1200);
  };

  const positionLabels = ['과거', '현재', '미래'];

  return (
    <div className="space-y-5">
      {phase === 'input' && (
        <div className="bg-gradient-to-br from-[#F0EBE0] to-[#E8E2D8] rounded-lg p-5">
          <h2 className="font-bold text-lg mb-1">타로 카드</h2>
          <p className="text-xs text-[#A5A09A] mb-4">카드 3장으로 과거/현재/미래를 읽어보세요</p>
          <button onClick={startReading}
            className="w-full py-3 bg-[#8B2500] text-white rounded-xl font-medium hover:bg-[#6B1D00] active:scale-[0.98] transition">
            카드 펼치기
          </button>
        </div>
      )}

      {phase === 'select' && (
        <div>
          <p className="text-center text-sm text-[#8D8478] mb-4">
            카드 3장을 선택하세요 <span className="text-[#8B2500] font-bold">({selected.length}/3)</span>
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
                        className="absolute inset-0 bg-gradient-to-br from-[#1A1D35] to-[#13162B] border-2 border-[#C5981A] rounded flex flex-col items-center justify-center p-1"
                      >
                        <span className="text-2xl">{card.emoji}</span>
                        <span className="text-[9px] font-medium text-[#2C1810] mt-1 leading-tight text-center">{card.name}</span>
                        {order >= 0 && (
                          <span className="absolute top-0.5 right-1 text-[8px] bg-[#8B2500] text-white rounded-full w-4 h-4 flex items-center justify-center">
                            {positionLabels[order][0]}
                          </span>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div key="back"
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute inset-0 rounded-xl border-2 flex items-center justify-center ${
                          selected.length >= 3 ? 'bg-[#E8E2D8] border-[#D5CEC3]' : 'bg-gradient-to-br from-[#8B2500] to-[#C5981A] border-[#C5981A] cursor-pointer'
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
              <p className="text-sm text-[#A5A09A] mt-2">AI가 카드를 해석하고 있어요...</p>
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
                <div key={card.id} className="bg-gradient-to-br from-[#F0EBE0] to-[#E8E2D8] border border-purple-200 rounded-xl p-3 text-center flex-1">
                  <p className="text-[10px] text-[#8B2500] font-bold mb-1">{positionLabels[i]}</p>
                  <span className="text-2xl block">{card.emoji}</span>
                  <p className="text-xs font-medium mt-1">{card.name}</p>
                  <p className="text-[10px] text-[#A5A09A]">{card.meaning}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-[#D5CEC3] rounded-lg p-5 ">
            <h3 className="font-bold text-sm mb-2">타로 해석</h3>
            <p className="text-sm text-[#2C1810] leading-relaxed whitespace-pre-wrap">{interpretation}</p>
          </div>

          <button onClick={() => { setPhase('input'); setConcern(''); }}
            className="w-full py-3 bg-[#8B2500] text-white rounded-xl font-medium hover:bg-[#6B1D00] active:scale-[0.98] transition">
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
    if (score >= 90) return { label: '환상의 짝꿍', color: 'text-[#8B2500]' };
    if (score >= 70) return { label: '찰떡궁합', color: 'text-[#8B2500]' };
    if (score >= 50) return { label: '괜찮은 사이', color: 'text-[#8B2500]' };
    if (score >= 30) return { label: '노력 필요', color: 'text-amber-600' };
    return { label: '극과 극', color: 'text-[#A5A09A]' };
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-[#F0EBE0] to-[#E8E2D8] rounded-lg p-5">
        <h2 className="font-bold text-lg mb-3">궁합 보기</h2>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-[#A5A09A] mb-1 block">내 생년월일</label>
            <input type="date" value={myBirth} onChange={(e) => setMyBirth(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D5CEC3] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2500]" />
          </div>
          <div>
            <label className="text-xs text-[#A5A09A] mb-1 block">상대 생년월일</label>
            <input type="date" value={partnerBirth} onChange={(e) => setPartnerBirth(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D5CEC3] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2500]" />
          </div>
          <button onClick={check}
            className="w-full py-3 bg-[#8B2500] text-white rounded-xl font-medium hover:bg-[#6B1D00] active:scale-[0.98] transition mt-1">
            궁합 확인
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-white border border-[#D5CEC3] rounded-lg p-5 text-center ">
            <p className={`text-sm font-bold mb-2 ${getGrade(result.total).color}`}>{getGrade(result.total).label}</p>
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#fce7f3" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#ec4899" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={`${result.total * 2.64} 264`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#8B2500]">{result.total}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {([
              { label: '연애', emoji: '❤️', score: result.love },
              { label: '우정', emoji: '🤝', score: result.friend },
              { label: '업무', emoji: '💼', score: result.work },
            ] as const).map((item) => (
              <div key={item.label} className="bg-white border border-[#D5CEC3] rounded-xl p-3 text-center ">
                <span className="text-lg block">{item.emoji}</span>
                <p className="text-[10px] text-[#A5A09A] mt-1">{item.label}</p>
                <p className="text-lg font-bold text-[#8B2500]">{item.score}%</p>
              </div>
            ))}
          </div>

          <button onClick={async () => {
            const text = `우리 궁합 ${result.total}%래! 💕\n연애 ${result.love}% / 우정 ${result.friend}% / 업무 ${result.work}%\n\nhttps://dhlm-studio.com/lotto#fortune`;
            if (navigator.share) { try { await navigator.share({ title: '궁합 결과', text }); } catch {} }
            else { await navigator.clipboard.writeText(text); alert('복사되었습니다!'); }
          }} className="w-full py-3 bg-yellow-400 text-[#2C1810] rounded-xl font-medium hover:bg-yellow-500 active:scale-[0.98] transition">
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
      <div className="bg-gradient-to-br from-[#F0EBE0] to-[#E8E2D8] rounded-lg p-5">
        <h2 className="font-bold text-lg mb-1">이름 운세</h2>
        <p className="text-xs text-[#A5A09A] mb-3">한글 이름의 획수로 운세를 확인하세요</p>
        <div className="flex gap-2">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="한글 이름 (예: 홍길동)"
            maxLength={5}
            className="flex-1 px-3 py-2.5 rounded-xl border border-[#D5CEC3] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2500]" />
          <button onClick={analyze}
            className="px-5 py-2.5 bg-[#8B2500] text-white rounded-xl text-sm font-medium hover:bg-[#6B1D00] active:scale-95 transition">
            확인
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-white border border-[#D5CEC3] rounded-lg p-5 text-center ">
            <p className="text-sm text-[#A5A09A] mb-1">총 획수: {result.strokes}획</p>
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
            <p className="text-sm text-[#8D8478]">{result.meaning}</p>
          </div>

          <div className="bg-white border border-[#D5CEC3] rounded-lg p-5 ">
            <h3 className="font-bold text-sm mb-3">이름 행운 번호</h3>
            <div className="flex justify-center gap-3">
              {result.luckyNums.map((n) => <LottoBall key={n} number={n} size="lg" animated />)}
            </div>
          </div>

          <button onClick={async () => {
            const text = `${name}님의 이름 운세\n점수: ${result.score}점 (${result.grade})\n총 ${result.strokes}획 — ${result.meaning}\n행운번호: ${result.luckyNums.join(', ')}\n\nhttps://dhlm-studio.com/lotto#fortune`;
            if (navigator.share) { try { await navigator.share({ title: '이름 운세', text }); } catch {} }
            else { await navigator.clipboard.writeText(text); alert('복사되었습니다!'); }
          }} className="w-full py-3 bg-yellow-400 text-[#2C1810] rounded-xl font-medium hover:bg-yellow-500 active:scale-[0.98] transition">
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
              mode === m.id ? 'bg-[#8B2500] text-white ' : 'bg-[#E8E2D8] text-[#8D8478] hover:bg-[#E0D8CC]'
            }`}>
            <span className="block text-base">{m.label.split(' ')[0]}</span>
            <span className="block mt-0.5 text-[10px]">{m.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      <div className="bg-[#F0EBE0] rounded-lg p-4">
        <p className="text-xs text-[#A5A09A] mb-3">{modes.find((m) => m.id === mode)?.desc}</p>

        {mode === 'dream' && (
          <div className="space-y-3">
            <input type="text" value={dreamKeyword} onChange={(e) => setDreamKeyword(e.target.value)}
              placeholder="꿈에 나온 키워드 (예: 돼지, 돈, 용)"
              className="w-full px-3 py-2.5 rounded-xl border border-[#D5CEC3] text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <div className="flex flex-wrap gap-1.5">
              {dreamData.slice(0, 20).map((d) => (
                <button key={d.keyword} onClick={() => setDreamKeyword((prev) => prev ? `${prev} ${d.keyword}` : d.keyword)}
                  className="px-2 py-1 bg-white border border-[#D5CEC3] rounded-lg text-xs hover:bg-blue-50 transition">
                  {d.emoji} {d.keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {(mode === 'fixed' || mode === 'exclude') && (
          <div>
            <p className="text-xs text-[#A5A09A] mb-2">
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
                      selected ? 'bg-[#8B2500] text-white' : disabled ? 'bg-[#E8E2D8] text-[#C5C0B5]' : 'bg-white border border-[#D5CEC3] text-[#2C1810] hover:bg-blue-50'
                    }`}>{n}</button>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'oddeven' && (
          <div>
            <p className="text-xs text-[#A5A09A] mb-2">홀수 개수: {oddCount}개 / 짝수: {6 - oddCount}개</p>
            <input type="range" min={0} max={6} value={oddCount} onChange={(e) => setOddCount(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-[#B5AFA5] mt-1">
              <span>짝수 6</span><span>균형</span><span>홀수 6</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-2 bg-[#F0EBE0] rounded-xl px-3">
          <span className="text-xs text-[#A5A09A]">세트</span>
          {[1, 3, 5].map((n) => (
            <button key={n} onClick={() => setSetCount(n)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${setCount === n ? 'bg-[#8B2500] text-white' : 'text-[#A5A09A] hover:bg-[#E0D8CC]'}`}>{n}</button>
          ))}
        </div>
        <button onClick={generate} className="flex-1 py-3 bg-[#8B2500] text-white rounded-xl font-bold text-sm hover:bg-[#6B1D00] active:scale-[0.98] transition">
          번호 생성
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white border border-[#D5CEC3] rounded-lg p-4  space-y-2">
          {results.map((set, i) => (
            <NumberSet key={i} label={String.fromCharCode(65 + i)} numbers={set} animated />
          ))}
          <div className="flex gap-2 mt-4 pt-3 border-t border-[#D5CEC3]">
            <button onClick={handleCopy} className="flex-1 py-2.5 bg-[#E8E2D8] rounded-xl text-sm font-medium hover:bg-[#E0D8CC] transition">
              📋 번호 복사
            </button>
            <button onClick={handleShare} className="flex-1 py-2.5 bg-yellow-400 text-[#2C1810] rounded-xl text-sm font-medium hover:bg-yellow-500 transition">
              공유하기
            </button>
          </div>
          {shareMsg && <p className="text-center text-xs text-green-600 mt-2">{shareMsg}</p>}
          <div className="mt-4 pt-3 border-t border-[#D5CEC3]">
            <p className="text-xs text-[#A5A09A] mb-2 font-medium">이 번호로 구매하기</p>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="flex-1 py-2.5 border border-[#D5CEC3] rounded-xl text-xs font-medium hover:bg-[#F0EBE0] transition">
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
      <div className="bg-gradient-to-br from-[#E8E2D8] to-[#F0EBE0] rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">{viewDraw.round}회 당첨번호</h2>
          <span className="text-xs text-[#A5A09A]">{viewDraw.date}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {viewDraw.numbers.map((n, i) => <LottoBall key={i} number={n} size="lg" animated delay={i} />)}
          <LottoBall number={viewDraw.bonus} size="lg" bonus animated delay={6} />
        </div>
        {viewDraw.prize1 && <p className="text-center text-xs text-[#A5A09A] mt-3">1등 당첨금: {viewDraw.prize1}</p>}
      </div>

      <div className="flex gap-2">
        <button onClick={() => handleRoundChange(Math.max(1, selectedRound - 1))}
          className="px-3 py-2 bg-[#E8E2D8] rounded-xl text-sm hover:bg-[#E0D8CC] transition">◀</button>
        <input type="number" value={selectedRound} onChange={(e) => handleRoundChange(Number(e.target.value))}
          min={1} max={latest.round}
          className="flex-1 text-center px-3 py-2 border border-[#D5CEC3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2500]" />
        <button onClick={() => handleRoundChange(Math.min(latest.round, selectedRound + 1))}
          className="px-3 py-2 bg-[#E8E2D8] rounded-xl text-sm hover:bg-[#E0D8CC] transition">▶</button>
      </div>

      <div className="bg-white border border-[#D5CEC3] rounded-lg p-4 ">
        <h3 className="font-bold text-sm mb-3">최근 당첨번호</h3>
        <div className="space-y-2">
          {recent.slice(0, 5).map((draw) => (
            <button key={draw.round} onClick={() => handleRoundChange(draw.round)}
              className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl text-xs transition ${
                draw.round === selectedRound ? 'bg-amber-50 border border-amber-200' : 'hover:bg-[#F0EBE0]'
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

      <div className="bg-white border border-[#D5CEC3] rounded-lg p-4 ">
        <h3 className="font-bold text-sm mb-3">내 번호 당첨 확인</h3>
        <p className="text-xs text-[#A5A09A] mb-2">6개 번호를 선택하세요</p>
        <div className="grid grid-cols-9 gap-1 mb-3">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
            const selected = checkNums.includes(n);
            const disabled = !selected && checkNums.length >= 6;
            return (
              <button key={n} onClick={() => !disabled && toggleCheckNum(n)} disabled={disabled}
                className={`w-8 h-8 rounded-full text-xs font-medium transition ${
                  selected ? 'bg-[#8B2500] text-white' : disabled ? 'bg-[#E8E2D8] text-[#C5C0B5]' : 'bg-white border border-[#D5CEC3] text-[#2C1810] hover:bg-amber-50'
                }`}>{n}</button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setCheckNums([]); setCheckResult(null); }}
            className="px-4 py-2.5 bg-[#E8E2D8] rounded-xl text-xs font-medium hover:bg-[#E0D8CC] transition">초기화</button>
          <button onClick={checkWinning} disabled={checkNums.length !== 6}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              checkNums.length === 6 ? 'bg-[#8B2500] text-white hover:bg-[#6B1D00] active:scale-[0.98]' : 'bg-[#E8E2D8] text-[#B5AFA5] cursor-not-allowed'
            }`}>당첨 확인 ({checkNums.length}/6)</button>
        </div>
        {checkResult && (
          <div className={`mt-3 p-3 rounded-xl text-center text-sm font-medium ${
            checkResult.includes('1등') || checkResult.includes('2등') ? 'bg-yellow-100 text-yellow-800'
              : checkResult.includes('등') ? 'bg-blue-50 text-blue-700' : 'bg-[#F0EBE0] text-[#8D8478]'
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
      <p className="text-xs text-[#A5A09A] text-center">전체 {totalDraws}회차 기준 통계</p>

      <div className="bg-white border border-[#D5CEC3] rounded-lg p-4 ">
        <h3 className="font-bold text-sm mb-1">🔥 핫넘버</h3>
        <p className="text-xs text-[#B5AFA5] mb-3">최근 20회 중 3회 이상 출현</p>
        <div className="flex flex-wrap gap-1.5">
          {hotNums.length > 0 ? hotNums.map((n) => <LottoBall key={n} number={n} size="sm" />) : <span className="text-xs text-[#B5AFA5]">해당 번호 없음</span>}
        </div>
      </div>

      <div className="bg-white border border-[#D5CEC3] rounded-lg p-4 ">
        <h3 className="font-bold text-sm mb-1">❄️ 콜드넘버</h3>
        <p className="text-xs text-[#B5AFA5] mb-3">최근 20회 중 미출현</p>
        <div className="flex flex-wrap gap-1.5">
          {coldNums.length > 0 ? coldNums.map((n) => <LottoBall key={n} number={n} size="sm" />) : <span className="text-xs text-[#B5AFA5]">해당 번호 없음</span>}
        </div>
      </div>

      <div className="bg-white border border-[#D5CEC3] rounded-lg p-4 ">
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
                <span className="text-[9px] text-[#A5A09A]">{n}</span>
                <span className="block text-[8px] text-[#B5AFA5]">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-[#D5CEC3] rounded-lg p-4 ">
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

      <div className="bg-white border border-[#D5CEC3] rounded-lg p-4 ">
        <h3 className="font-bold text-sm mb-3">구간별 분포</h3>
        <div className="space-y-2">
          {rangeStats.ranges.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="text-xs text-[#A5A09A] w-12">{r.label}</span>
              <div className="flex-1 h-5 bg-[#E8E2D8] rounded-full overflow-hidden">
                <div className="h-full bg-[#C5981A] rounded-full" style={{ width: `${(r.count / rangeStats.maxCount) * 100}%` }} />
              </div>
              <span className="text-xs text-[#B5AFA5] w-12 text-right">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   🌍 World Lottery Tab
   ═══════════════════════════════════════ */
function WorldTab() {
  const [selectedId, setSelectedId] = useState('us-powerball');
  const [sets, setSets] = useState(1);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [msg, setMsg] = useState('');

  const lottery = getLotteryById(selectedId)!;

  const generate = () => { setResults(generateLottery(lottery, sets)); setMsg(''); };

  const handleCopy = async () => {
    const text = results.map((r) => {
      const main = r.main.join(', ');
      const bonus = r.bonus ? ` + ${r.bonusName}: ${r.bonus.join(', ')}` : '';
      return `${main}${bonus}`;
    }).join('\n');
    await navigator.clipboard.writeText(text);
    setMsg('Copied!'); setTimeout(() => setMsg(''), 2000);
  };

  // Use idToSlug from world-lottery

  return (
    <div className="space-y-5">
      {/* Lottery selector */}
      <div className="grid grid-cols-5 gap-1.5">
        {worldLotteries.filter((l) => l.id !== 'korea-lotto').map((l) => (
          <button key={l.id} onClick={() => { setSelectedId(l.id); setResults([]); }}
            className={`py-2 px-1 rounded-xl text-center text-xs transition ${
              selectedId === l.id ? 'bg-[#8B2500] text-white ' : 'bg-[#E8E2D8] text-[#8D8478] hover:bg-[#E0D8CC]'
            }`}>
            <span className="text-base block">{l.country}</span>
            <span className="text-[9px] block mt-0.5 leading-tight">{l.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="bg-[#F0EBE0] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{lottery.country}</span>
          <div>
            <p className="font-bold">{lottery.name}</p>
            <p className="text-xs text-[#A5A09A]">
              {lottery.mainNumbers.count} from {lottery.mainNumbers.min}-{lottery.mainNumbers.max}
              {lottery.bonusNumbers && ` + ${lottery.bonusNumbers.count} ${lottery.bonusNumbers.name} (${lottery.bonusNumbers.min}-${lottery.bonusNumbers.max})`}
            </p>
            <p className="text-[10px] text-[#B5AFA5] mt-0.5">Draw: {lottery.drawDays.join(', ')} · {lottery.ageRestriction}</p>
          </div>
        </div>
      </div>

      {/* Generate */}
      <div className="flex gap-2">
        <div className="flex items-center gap-2 bg-[#F0EBE0] rounded-xl px-3">
          <span className="text-xs text-[#A5A09A]">Sets</span>
          {[1, 3, 5].map((n) => (
            <button key={n} onClick={() => setSets(n)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${sets === n ? 'bg-[#8B2500] text-white' : 'text-[#A5A09A] hover:bg-[#E0D8CC]'}`}>
              {n}
            </button>
          ))}
        </div>
        <button onClick={generate}
          className="flex-1 py-3 bg-[#8B2500] text-white rounded-xl font-bold text-sm hover:bg-[#6B1D00] active:scale-[0.98] transition">
          Generate
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white border border-[#D5CEC3] rounded-lg p-4  space-y-3">
          {results.map((r, i) => (
            <div key={i} className={`${i > 0 ? 'pt-3 border-t border-[#D5CEC3]' : ''}`}>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#B5AFA5] w-5">{String.fromCharCode(65 + i)}</span>
                {r.main.map((n) => (
                  <LottoBall key={`m${i}-${n}`} number={n} size="md" animated delay={r.main.indexOf(n)} />
                ))}
                {r.bonus && r.bonus.map((n) => (
                  <LottoBall key={`b${i}-${n}`} number={n} size="md" bonus animated delay={r.main.length} />
                ))}
              </div>
              {r.bonus && (
                <p className="text-[10px] text-[#B5AFA5] mt-1 ml-5">
                  {r.bonusName}: {r.bonus.join(', ')}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-3 border-t border-[#D5CEC3]">
            <button onClick={handleCopy} className="flex-1 py-2.5 bg-[#E8E2D8] rounded-xl text-sm font-medium hover:bg-[#E0D8CC] transition">
              📋 Copy
            </button>
            <button onClick={async () => {
              const text = results.map((r) => formatShareText(lottery, r)).join('\n\n');
              if (navigator.share) { try { await navigator.share({ title: `${lottery.name} Numbers`, text }); return; } catch {} }
              await navigator.clipboard.writeText(text);
              setMsg('Copied!'); setTimeout(() => setMsg(''), 2000);
            }} className="flex-1 py-2.5 bg-[#8B2500] text-white rounded-xl text-sm font-medium hover:bg-[#6B1D00] transition">
              Share
            </button>
          </div>
          {msg && <p className="text-center text-xs text-green-600">{msg}</p>}
        </div>
      )}

      {/* SEO links */}
      <div className="pt-4">
        <p className="text-xs text-[#B5AFA5] mb-2">Dedicated pages:</p>
        <div className="flex flex-wrap gap-1">
          {worldLotteries.filter((l) => idToSlug[l.id]).map((l) => (
            <Link key={l.id} href={`/lotto/${idToSlug[l.id]}`}
              className="px-2 py-1 bg-[#F0EBE0] rounded text-[10px] text-[#A5A09A] hover:bg-[#E8E2D8] transition">
              {l.country} {l.name}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-[#B5AFA5] leading-relaxed">
        Random number generator for entertainment only.<br />
        Not affiliated with any official lottery.
      </p>
    </div>
  );
}
