'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { trendingData, type TrendingItem } from '@/data/trending';

/* ═══════════════════════════════════════
   Palace Design Tokens
   ═══════════════════════════════════════ */
const P = {
  red: '#8B2500',
  green: '#1B5E20',
  gold: '#C5981A',
  blue: '#1A237E',
  wall: '#F5F0E8',
  stone: '#D5CEC3',
  night: '#0D1117',
  nightCard: '#1A1F2E',
  nightBorder: '#2A2F3E',
  text: '#2D2D2D',
  muted: '#8D8478',
  lightText: '#F5F0E8',
  serif: 'var(--font-playfair), var(--font-noto-serif-kr), serif',
};

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */
const popularTools = [
  { emoji: '🍀', title: '로또 번호', desc: '행운의 번호 생성', href: '/lotto' },
  { emoji: '🔮', title: '타로 운세', desc: '카드로 미래 읽기', href: '/lotto#fortune' },
  { emoji: '💕', title: '궁합 테스트', desc: '궁합 점수 확인', href: '/lotto#fortune' },
  { emoji: '⌨️', title: '타자 속도', desc: '타이핑 실력 측정', href: '/tools/life/typing-speed' },
  { emoji: '💰', title: '연봉 계산기', desc: '실수령액 확인', href: '/tools/calc/salary' },
  { emoji: '📱', title: 'QR코드', desc: '무료 QR 생성', href: '/tools/image/qr' },
];

const discoverCategories = [
  { emoji: '🔮', label: 'Beliefs', count: 20, pattern: 'k-cloud' },
  { emoji: '🍜', label: 'Food', count: 30, pattern: 'k-wave' },
  { emoji: '🎵', label: 'K-Pop', count: 20, pattern: 'k-star' },
  { emoji: '🏙️', label: 'Travel', count: 25, pattern: 'k-mountain' },
  { emoji: '🏠', label: 'Life', count: 20, pattern: '' },
  { emoji: '🎉', label: 'Traditions', count: 20, pattern: 'k-flower' },
  { emoji: '🗣️', label: 'Language', count: 15, pattern: '' },
  { emoji: '💼', label: 'Business', count: 15, pattern: '' },
  { emoji: '📱', label: 'Tech', count: 15, pattern: '' },
  { emoji: '🤔', label: 'vs World', count: 20, pattern: '' },
];

const discoverPosts = [
  { title: 'Why Korean Buildings Skip the 4th Floor', views: '2.3K', emoji: '🔮' },
  { title: 'Korean BBQ: The Complete Guide', views: '1.8K', emoji: '🍜' },
  { title: 'Fan Death: Korea\'s Famous Urban Legend', views: '1.5K', emoji: '🔮' },
];

type CatId = 'all' | 'finance' | 'life' | 'dev' | 'doc' | 'image' | 'gen' | 'mfg' | 'compare';
const categories: { id: CatId; label: string; emoji: string }[] = [
  { id: 'all', label: '전체', emoji: '🔧' },
  { id: 'finance', label: '금융', emoji: '💰' },
  { id: 'life', label: '생활', emoji: '🏠' },
  { id: 'dev', label: '개발', emoji: '💻' },
  { id: 'doc', label: '텍스트', emoji: '📝' },
  { id: 'image', label: '이미지', emoji: '🖼️' },
  { id: 'gen', label: '생성기', emoji: '🎲' },
  { id: 'mfg', label: '제조', emoji: '🏭' },
  { id: 'compare', label: '비교', emoji: '📊' },
];

interface ToolItem { name: string; emoji: string; href: string; cat: CatId }
const tools: ToolItem[] = [
  { name: '연봉 실수령', emoji: '💵', href: '/tools/calc/salary', cat: 'finance' },
  { name: '퇴직금', emoji: '🏦', href: '/tools/calc/severance', cat: 'finance' },
  { name: '대출 이자', emoji: '🏠', href: '/tools/calc/loan', cat: 'finance' },
  { name: '부가세', emoji: '🧾', href: '/tools/calc/vat', cat: 'finance' },
  { name: '적금 이자', emoji: '💰', href: '/tools/calc/deposit', cat: 'finance' },
  { name: '마진 계산', emoji: '📈', href: '/tools/calc/margin', cat: 'finance' },
  { name: '유튜브 수익', emoji: '▶️', href: '/tools/calc/youtube', cat: 'finance' },
  { name: '퍼센트', emoji: '％', href: '/tools/calc/percent', cat: 'finance' },
  { name: '환율 변환', emoji: '💱', href: '/tools/calc/exchange', cat: 'finance' },
  { name: '시급 변환', emoji: '⏰', href: '/tools/calc/time', cat: 'finance' },
  { name: '금 시세', emoji: '🥇', href: '/tools/calc/gold', cat: 'finance' },
  { name: '시급 계산', emoji: '💸', href: '/tools/calc/hourly-wage', cat: 'finance' },
  { name: '대출 비교', emoji: '🔄', href: '/tools/calc/loan-compare', cat: 'finance' },
  { name: '전세vs월세', emoji: '🏢', href: '/tools/calc/rent-vs-buy', cat: 'finance' },
  { name: 'ROI 계산', emoji: '📊', href: '/tools/calc/roi', cat: 'finance' },
  { name: '쿠팡 수수료', emoji: '🛒', href: '/tools/calc/coupang-fee', cat: 'finance' },
  { name: 'BMI', emoji: '⚖️', href: '/tools/life/bmi', cat: 'life' },
  { name: '나이 계산', emoji: '🎂', href: '/tools/life/age', cat: 'life' },
  { name: '날짜 계산', emoji: '📅', href: '/tools/life/date', cat: 'life' },
  { name: '단위 변환', emoji: '📐', href: '/tools/life/unit-converter', cat: 'life' },
  { name: '스톱워치', emoji: '⏱️', href: '/tools/life/stopwatch', cat: 'life' },
  { name: '칼로리', emoji: '🔥', href: '/tools/life/calorie', cat: 'life' },
  { name: '더치페이', emoji: '🍽️', href: '/tools/life/tip-calculator', cat: 'life' },
  { name: '카운트다운', emoji: '⏳', href: '/tools/life/countdown', cat: 'life' },
  { name: '전기요금', emoji: '💡', href: '/tools/life/electricity', cat: 'life' },
  { name: '타자 속도', emoji: '⌨️', href: '/tools/life/typing-speed', cat: 'life' },
  { name: 'JSON', emoji: '{ }', href: '/tools/dev/json', cat: 'dev' },
  { name: 'Base64', emoji: '🔐', href: '/tools/dev/base64', cat: 'dev' },
  { name: 'JWT', emoji: '🔑', href: '/tools/dev/jwt', cat: 'dev' },
  { name: 'Cron', emoji: '🕐', href: '/tools/dev/cron', cat: 'dev' },
  { name: 'SQL', emoji: '🗃️', href: '/tools/dev/sql', cat: 'dev' },
  { name: '색상 변환', emoji: '🎨', href: '/tools/dev/color-picker', cat: 'dev' },
  { name: 'Lorem', emoji: '📄', href: '/tools/dev/lorem-ipsum', cat: 'dev' },
  { name: 'URL 인코더', emoji: '🔗', href: '/tools/dev/url-encoder', cat: 'dev' },
  { name: '정규식', emoji: '🔍', href: '/tools/dev/regex-tester', cat: 'dev' },
  { name: '내 IP', emoji: '🌐', href: '/tools/dev/ip-check', cat: 'dev' },
  { name: '화면 크기', emoji: '🖥️', href: '/tools/dev/screen-size', cat: 'dev' },
  { name: 'Markdown', emoji: '📝', href: '/tools/dev/markdown-preview', cat: 'dev' },
  { name: '폰트 미리보기', emoji: '🔤', href: '/tools/dev/font-preview', cat: 'dev' },
  { name: 'Timestamp', emoji: '🕰️', href: '/tools/dev/timestamp', cat: 'dev' },
  { name: '서브넷', emoji: '📡', href: '/tools/dev/subnet', cat: 'dev' },
  { name: 'chmod', emoji: '🔒', href: '/tools/dev/chmod', cat: 'dev' },
  { name: '진법 변환', emoji: '🔢', href: '/tools/dev/binary-converter', cat: 'dev' },
  { name: 'HTML Entity', emoji: '&lt;', href: '/tools/dev/html-entity', cat: 'dev' },
  { name: '퇴사 문자', emoji: '👋', href: '/tools/msg/resign-letter', cat: 'doc' },
  { name: '거절 메시지', emoji: '🚫', href: '/tools/msg/reject-message', cat: 'doc' },
  { name: '축의금 문구', emoji: '💐', href: '/tools/msg/congratulation', cat: 'doc' },
  { name: '연차 사유', emoji: '🏖️', href: '/tools/msg/annual-leave', cat: 'doc' },
  { name: '지각 변명', emoji: '🏃', href: '/tools/msg/late-excuse', cat: 'doc' },
  { name: '한줄 요약', emoji: '📋', href: '/tools/msg/text-summary', cat: 'doc' },
  { name: '글자수 세기', emoji: '🔢', href: '/tools/msg/character-count', cat: 'doc' },
  { name: '텍스트 변환', emoji: '🔄', href: '/tools/msg/text-transform', cat: 'doc' },
  { name: '이미지 압축', emoji: '🗜️', href: '/tools/image/image-compress', cat: 'image' },
  { name: '이미지 변환', emoji: '🔄', href: '/tools/image/image-convert', cat: 'image' },
  { name: '이미지 리사이즈', emoji: '📏', href: '/tools/image/image-resize', cat: 'image' },
  { name: 'YT 썸네일', emoji: '🎬', href: '/tools/image/youtube-thumbnail', cat: 'image' },
  { name: 'QR코드', emoji: '📱', href: '/tools/image/qr', cat: 'image' },
  { name: '닉네임', emoji: '🏷️', href: '/tools/gen/nickname-gen', cat: 'gen' },
  { name: '회사명', emoji: '🏢', href: '/tools/gen/company-name-gen', cat: 'gen' },
  { name: '팀명', emoji: '👥', href: '/tools/gen/team-name-gen', cat: 'gen' },
  { name: '랜덤 뽑기', emoji: '🎰', href: '/tools/gen/random-picker', cat: 'gen' },
  { name: '비밀번호', emoji: '🔐', href: '/tools/gen/password-gen', cat: 'gen' },
  { name: '해시태그', emoji: '#️⃣', href: '/tools/gen/hashtag-gen', cat: 'gen' },
  { name: '이모지 검색', emoji: '😀', href: '/tools/gen/emoji-search', cat: 'gen' },
  { name: '랜덤 숫자', emoji: '🎲', href: '/tools/gen/random-number', cat: 'gen' },
  { name: '모스 부호', emoji: '📻', href: '/tools/gen/morse-code', cat: 'gen' },
  { name: '단중 계산', emoji: '⚙️', href: '/tools/mfg/unit-weight', cat: 'mfg' },
  { name: 'Cpk', emoji: '📉', href: '/tools/mfg/cpk', cat: 'mfg' },
  { name: 'UPH', emoji: '🏭', href: '/tools/mfg/uph', cat: 'mfg' },
  { name: '불량률', emoji: '❌', href: '/tools/mfg/defect', cat: 'mfg' },
  { name: 'OEE', emoji: '📊', href: '/tools/mfg/oee', cat: 'mfg' },
  { name: '적금 이율', emoji: '🏦', href: '/tools/compare/deposit-compare', cat: 'compare' },
  { name: '신용카드', emoji: '💳', href: '/tools/compare/card-compare', cat: 'compare' },
  { name: '통신사 요금', emoji: '📱', href: '/tools/compare/phone-compare', cat: 'compare' },
];

const blogPosts = [
  { slug: 'lotto-winning-tips', title: '로또 당첨 확률 높이는 5가지 방법', date: '2026-03-25' },
  { slug: 'salary-calculator', title: '2026년 연봉 실수령액 계산법', date: '2026-03-24' },
  { slug: 'typing-speed-test', title: '타자 속도 테스트 온라인 무료', date: '2026-03-23' },
];

/* ═══════════════════════════════════════
   Components
   ═══════════════════════════════════════ */

/* 처마 SVG */
const Roofline = ({ flip = false }: { flip?: boolean }) => (
  <svg viewBox="0 0 1200 35" className={`w-full h-5 sm:h-7 ${flip ? 'rotate-180' : ''}`} preserveAspectRatio="none">
    <path d="M0,35 Q75,5 150,25 Q225,5 300,25 Q375,5 450,25 Q525,5 600,25 Q675,5 750,25 Q825,5 900,25 Q975,5 1050,25 Q1125,5 1200,25 L1200,35 Z"
      fill={flip ? P.night : P.wall} />
    <path d="M0,35 Q75,8 150,28 Q225,8 300,28 Q375,8 450,28 Q525,8 600,28 Q675,8 750,28 Q825,8 900,28 Q975,8 1050,28 Q1125,8 1200,28"
      fill="none" stroke={P.red} strokeWidth="2" />
    <path d="M0,32 Q75,12 150,30 Q225,12 300,30 Q375,12 450,30 Q525,12 600,30 Q675,12 750,30 Q825,12 900,30 Q975,12 1050,30 Q1125,12 1200,30"
      fill="none" stroke={P.green} strokeWidth="1" opacity="0.6" />
  </svg>
);

/* 한글 자음 배경 */
const JamoBg = ({ letter, color = P.red, pos = 'right' }: { letter: string; color?: string; pos?: 'left' | 'right' }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    <span className={`absolute text-[280px] sm:text-[380px] font-black leading-none ${pos === 'right' ? '-right-8 -top-8' : '-left-8 -bottom-8'}`}
      style={{ fontFamily: 'var(--font-noto-serif-kr), serif', color, opacity: 0.03 }}>
      {letter}
    </span>
  </div>
);

/* 스크롤 fade-in */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* 카운터 애니메이션 */
function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / 1500, 1); setCount(Math.floor(p * target)); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step); obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* Fortune util */
function hashStr(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.abs(h); }
function getFortune(bd: string) {
  const t = new Date(); const hash = hashStr(bd.replace(/-/g, '') + `${t.getFullYear()}${t.getMonth()}${t.getDate()}`);
  const score = (hash % 100) + 1; const nums: number[] = []; let h = hash;
  while (nums.length < 3) { h = ((h * 1103515245 + 12345) & 0x7fffffff); const n = (h % 45) + 1; if (!nums.includes(n)) nums.push(n); }
  const grade = score >= 90 ? '대박' : score >= 70 ? '상승' : score >= 50 ? '평온' : score >= 30 ? '보통' : '충전';
  return { score, nums: nums.sort((a, b) => a - b), grade };
}
function getVisitorCount() { return Math.floor(10000 + (Date.now() - new Date('2026-03-01').getTime()) / 3600000 * 15); }

/* ═══════════════════════════════════════
   Page
   ═══════════════════════════════════════ */
export default function Home() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [fortune, setFortune] = useState<ReturnType<typeof getFortune> | null>(null);
  const [activeCat, setActiveCat] = useState<CatId>('all');
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const birthday = year.length === 4 && month.length >= 1 && day.length >= 1
    ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : '';
  const handleFortune = () => { if (birthday) setFortune(getFortune(birthday)); };
  const filteredTools = activeCat === 'all' ? tools : tools.filter((t) => t.cat === activeCat);

  return (
    <>
      {/* ══════ ① 광화문 — Hero ══════ */}
      <section className="relative overflow-hidden min-h-[100dvh] flex items-center"
        style={{ background: `linear-gradient(180deg, #E8EAF6 0%, #D5CEC3 100%)` }}>
        <JamoBg letter="ㅎ" color={P.gold} pos="right" />
        <div className="absolute bottom-0 left-0 right-0"><Roofline /></div>

        <div className="relative mx-auto max-w-lg w-full px-5 py-16 text-center">
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[10px] tracking-[0.5em] font-medium mb-6" style={{ color: P.gold }}>
            DHLM STUDIO
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-3xl sm:text-4xl font-bold leading-snug" style={{ fontFamily: P.serif, color: P.text }}>
            한국의 문화와 도구를<br />세계와 연결합니다
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="text-sm mt-3 italic" style={{ fontFamily: P.serif, color: P.muted }}>
            Gateway to Korean Culture & Digital Tools
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex justify-center gap-3 mt-8 mb-10">
            <Link href="/lotto#fortune" className="px-5 py-2.5 rounded text-sm font-medium text-white transition active:scale-95"
              style={{ background: P.red }}>
              🔮 운세 보기
            </Link>
            <Link href="/lotto" className="px-5 py-2.5 rounded text-sm font-medium transition active:scale-95"
              style={{ border: `2px solid ${P.gold}`, color: P.gold }}>
              🍀 로또 뽑기
            </Link>
          </motion.div>

          {/* Fortune input */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            className="bg-white/60 backdrop-blur rounded-xl p-5 border" style={{ borderColor: '#E0D8CC' }}>
            <p className="text-xs mb-3" style={{ color: P.muted }}>생년월일을 입력하면 오늘의 운세를 바로 확인!</p>
            <div className="flex gap-2 items-center justify-center mb-3">
              <input type="text" inputMode="numeric" placeholder="1990" maxLength={4} value={year}
                onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setYear(v); if (v.length === 4) monthRef.current?.focus(); }}
                className="w-[80px] px-2 py-2.5 bg-white border border-[#D5CEC3] rounded text-center text-base focus:outline-none focus:border-[#C5981A] transition" />
              <span className="text-[#B5AFA5]">/</span>
              <input ref={monthRef} type="text" inputMode="numeric" placeholder="03" maxLength={2} value={month}
                onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 2); setMonth(v); if (v.length === 2) dayRef.current?.focus(); }}
                className="w-[56px] px-2 py-2.5 bg-white border border-[#D5CEC3] rounded text-center text-base focus:outline-none focus:border-[#C5981A] transition" />
              <span className="text-[#B5AFA5]">/</span>
              <input ref={dayRef} type="text" inputMode="numeric" placeholder="15" maxLength={2} value={day}
                onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                onKeyDown={(e) => { if (e.key === 'Enter') handleFortune(); }}
                className="w-[56px] px-2 py-2.5 bg-white border border-[#D5CEC3] rounded text-center text-base focus:outline-none focus:border-[#C5981A] transition" />
            </div>
            <button onClick={handleFortune} disabled={!birthday}
              className={`w-full py-2.5 rounded font-bold text-sm transition active:scale-[0.98] ${birthday ? 'text-white' : 'bg-[#D5CEC3] text-[#A5A09A] cursor-not-allowed'}`}
              style={birthday ? { background: P.red } : {}}>
              오늘의 운세 확인
            </button>

            {fortune && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-4 pt-4 border-t border-[#E0D8CC] text-center">
                <p className="text-3xl font-black" style={{ color: P.gold, fontFamily: P.serif }}>{fortune.score}점</p>
                <p className="text-xs mt-1" style={{ color: P.muted }}>
                  {fortune.grade === '대박' && '🌟 운이 폭발하는 날!'}{fortune.grade === '상승' && '🔥 좋은 기운 가득!'}{fortune.grade === '평온' && '☀️ 안정적인 하루'}{fortune.grade === '보통' && '🌤️ 작은 행운을 찾으세요'}{fortune.grade === '충전' && '🌙 에너지 충전의 날'}
                </p>
                <div className="flex justify-center gap-2 mt-3">
                  {fortune.nums.map((n) => (
                    <span key={n} className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${P.gold}, #A07A10)` }}>{n}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="mt-10 text-xs animate-bounce" style={{ color: P.muted }}>
            ↓ 스크롤하여 입장하세요
          </motion.p>
        </div>
      </section>

      {/* ══════ ② 흥례문 — Discover Korea ══════ */}
      <section className="relative py-16 px-5 overflow-hidden palace-wall">
        <JamoBg letter="ㄱ" color={P.red} pos="left" />
        <div className="relative mx-auto max-w-2xl">
          <FadeIn>
            <div className="pillar-frame text-center mb-8">
              <h2 className="text-2xl font-bold" style={{ fontFamily: P.serif, color: P.text }}>🇰🇷 Discover Korea</h2>
              <p className="text-sm mt-1" style={{ color: P.muted }}>한국을 발견하세요</p>
              <div className="w-10 h-[3px] mx-auto mt-3" style={{ background: P.red }} />
            </div>
          </FadeIn>

          {/* Bento grid */}
          <FadeIn delay={100}>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="col-span-2 row-span-2 palace-card p-5 cursor-pointer group relative overflow-hidden">
                <span className="text-4xl block mb-2">{discoverCategories[0].emoji}</span>
                <p className="text-lg font-bold" style={{ fontFamily: P.serif, color: P.text }}>{discoverCategories[0].label}</p>
                <p className="text-xs mt-1" style={{ color: P.muted }}>{discoverCategories[0].count} stories</p>
                <p className="text-[10px] font-medium mt-2" style={{ color: P.red }}>Explore →</p>
              </div>
              {discoverCategories.slice(1, 3).map((c) => (
                <div key={c.label} className="palace-card p-3 text-center cursor-pointer">
                  <span className="text-2xl block">{c.emoji}</span>
                  <p className="text-[10px] font-bold mt-1" style={{ color: P.text }}>{c.label}</p>
                  <p className="text-[9px]" style={{ color: P.muted }}>{c.count}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {discoverCategories.slice(3, 5).map((c) => (
                <div key={c.label} className="palace-card p-3 text-center cursor-pointer">
                  <span className="text-2xl block">{c.emoji}</span>
                  <p className="text-[10px] font-bold mt-1" style={{ color: P.text }}>{c.label}</p>
                  <p className="text-[9px]" style={{ color: P.muted }}>{c.count}</p>
                </div>
              ))}
              <div className="row-span-2 palace-card p-4 cursor-pointer">
                <span className="text-3xl block mb-1">{discoverCategories[5].emoji}</span>
                <p className="text-sm font-bold" style={{ fontFamily: P.serif, color: P.text }}>{discoverCategories[5].label}</p>
                <p className="text-[9px] mt-1" style={{ color: P.muted }}>{discoverCategories[5].count} stories</p>
              </div>
              {discoverCategories.slice(6, 8).map((c) => (
                <div key={c.label} className="palace-card p-3 text-center cursor-pointer">
                  <span className="text-2xl block">{c.emoji}</span>
                  <p className="text-[10px] font-bold mt-1" style={{ color: P.text }}>{c.label}</p>
                  <p className="text-[9px]" style={{ color: P.muted }}>{c.count}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {discoverCategories.slice(8).map((c) => (
                <div key={c.label} className="palace-card p-2.5 text-center cursor-pointer">
                  <span className="text-xl block">{c.emoji}</span>
                  <p className="text-[9px] font-bold mt-0.5" style={{ color: P.text }}>{c.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-[10px] font-medium tracking-widest mb-2" style={{ color: P.muted }}>POPULAR READS</p>
            <div className="space-y-2">
              {discoverPosts.map((post, i) => (
                <div key={i} className="palace-card flex items-center gap-3 px-4 py-3 cursor-pointer">
                  <span className="text-xl">{post.emoji}</span>
                  <p className="flex-1 text-sm font-medium" style={{ color: P.text }}>{post.title}</p>
                  <span className="text-xs" style={{ color: P.muted }}>👁 {post.views}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/blog" className="inline-flex px-5 py-2.5 rounded text-sm font-medium text-white transition"
                style={{ background: P.red }}>전체 보기 →</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 처마 전환 ══════ */}
      <div style={{ background: P.night }}><Roofline flip /></div>
      <div className="dancheong-line" />

      {/* ══════ ③ 근정전 마당 — Trending ══════ */}
      <TrendingDashboard />

      {/* ══════ 전환 ══════ */}
      <div className="dancheong-line" />

      {/* ══════ ④ 근정전 내부 — Popular Tools ══════ */}
      <section className="relative py-16 px-5 overflow-hidden" style={{ background: P.night }}>
        <JamoBg letter="ㄷ" color={P.gold} pos="right" />
        <div className="relative mx-auto max-w-lg">
          <FadeIn>
            <div className="text-center mb-2">
              <p className="text-[10px] font-medium tracking-widest mb-1" style={{ color: P.gold }}>POPULAR</p>
              <h2 className="text-xl font-bold" style={{ fontFamily: P.serif, color: P.lightText }}>✨ 인기 도구</h2>
            </div>
            <p className="text-center text-sm mb-6" style={{ color: P.muted }}>
              오늘 <span className="font-bold" style={{ color: P.gold }}><AnimatedCount target={getVisitorCount()} /></span>명이 사용했어요
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {popularTools.map((t) => (
                <Link key={t.title} href={t.href} className="gold-card p-4 group">
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform inline-block">{t.emoji}</span>
                  <p className="font-bold text-sm" style={{ color: P.lightText }}>{t.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#5A5A5A' }}>{t.desc}</p>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ ⑤ 도구 모음 ══════ */}
      <section className="relative py-16 px-5 overflow-hidden" style={{ background: P.night }}>
        <div className="relative mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold" style={{ fontFamily: P.serif, color: P.lightText }}>🧮 무료 도구 모음</h2>
              <p className="text-xs mt-1" style={{ color: '#5A5A5A' }}>{tools.length}개 도구 무료 사용</p>
            </div>
          </FadeIn>
          <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-hide">
            {categories.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  activeCat === c.id ? 'text-white' : 'text-[#6A6A6A] hover:text-[#9A9A9A]'
                }`} style={activeCat === c.id ? { background: P.red } : { background: '#1A1F2E' }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {filteredTools.map((t) => (
              <Link key={t.href} href={t.href} className="gold-card p-3 text-center group">
                <span className="text-xl block mb-1 group-hover:scale-110 transition-transform inline-block">{t.emoji}</span>
                <p className="text-[11px] font-medium leading-tight" style={{ color: '#9A9A9A' }}>{t.name}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/tools" className="inline-flex px-5 py-2.5 rounded text-sm font-medium transition"
              style={{ background: '#1A1F2E', border: '1px solid #2A2F3E', color: '#9A9A9A' }}>
              전체 도구 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ 처마 전환 ══════ */}
      <Roofline />
      <div className="dancheong-line" />

      {/* ══════ ⑥ 후원 — Blog ══════ */}
      <section className="relative py-16 px-5 palace-wall overflow-hidden">
        <div className="relative mx-auto max-w-lg">
          <FadeIn>
            <h2 className="text-xl font-bold text-center mb-6" style={{ fontFamily: P.serif, color: P.text }}>
              📝 최근 이야기
            </h2>
            <div className="space-y-2">
              {blogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block palace-card px-4 py-3.5 group">
                  <p className="text-sm font-medium group-hover:text-[#8B2500] transition" style={{ color: P.text }}>{post.title}</p>
                  <p className="text-xs mt-1" style={{ color: P.muted }}>{post.date}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link href="/blog" className="text-sm font-medium transition" style={{ color: P.red }}>
                블로그 전체 보기 →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════
   Trending Dashboard (근정전 마당)
   ═══════════════════════════════════════ */
type RegionId = 'global' | 'kr' | 'us' | 'jp' | 'vn' | 'uk';
const regions: { id: RegionId; flag: string; label: string }[] = [
  { id: 'kr', flag: '🇰🇷', label: 'KR' },
  { id: 'global', flag: '🌍', label: 'Global' },
  { id: 'us', flag: '🇺🇸', label: 'US' },
  { id: 'jp', flag: '🇯🇵', label: 'JP' },
  { id: 'vn', flag: '🇻🇳', label: 'VN' },
  { id: 'uk', flag: '🇬🇧', label: 'UK' },
];
const trendCats: { key: keyof typeof trendingData; emoji: string; label: string }[] = [
  { key: 'music', emoji: '🎵', label: 'Music' },
  { key: 'youtube', emoji: '📺', label: 'YouTube' },
  { key: 'movies', emoji: '🎬', label: 'Movies & TV' },
  { key: 'games', emoji: '🎮', label: 'Games' },
  { key: 'apps', emoji: '📱', label: 'Apps' },
  { key: 'search', emoji: '🔍', label: 'Search' },
];

function ChangeIcon({ change }: { change: TrendingItem['change'] }) {
  if (change === 'up') return <span className="text-xs font-bold" style={{ color: P.red }}>▲</span>;
  if (change === 'down') return <span className="text-xs font-bold" style={{ color: P.blue }}>▼</span>;
  if (change === 'new') return <span className="text-[10px] font-bold" style={{ color: P.gold }}>NEW</span>;
  return <span className="text-xs text-[#AAA]">─</span>;
}

function getItemUrl(catKey: string, item: TrendingItem): string {
  if (item.url) return item.url;
  const q = encodeURIComponent(`${item.title}${item.subtitle ? ' ' + item.subtitle : ''}`);
  switch (catKey) {
    case 'music': case 'youtube': return `https://www.youtube.com/results?search_query=${q}`;
    case 'movies': return `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' trailer')}`;
    case 'games': return `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title)}`;
    case 'apps': return `https://www.google.com/search?q=${encodeURIComponent(item.title + ' app')}`;
    case 'search': return `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;
    default: return `https://www.google.com/search?q=${q}`;
  }
}

function TrendingDashboard() {
  const [region, setRegion] = useState<RegionId>('kr');

  return (
    <section className="relative py-16 px-5 overflow-hidden stone-floor">
      <JamoBg letter="ㅌ" color={P.blue} pos="left" />
      <div className="relative mx-auto max-w-2xl">
        <FadeIn>
          <div className="text-center mb-6">
            <p className="text-[10px] font-medium tracking-widest mb-1" style={{ color: P.gold }}>UPDATED DAILY</p>
            <h2 className="text-2xl font-bold" style={{ fontFamily: P.serif, color: P.text }}>
              What&apos;s Trending Now 🔥
            </h2>
            <p className="text-xs mt-1" style={{ color: P.muted }}>Updated: {trendingData.updatedAt}</p>
          </div>
        </FadeIn>

        <div className="flex gap-1.5 justify-center mb-8 flex-wrap">
          {regions.map((r) => (
            <button key={r.id} onClick={() => setRegion(r.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                region === r.id ? 'text-white' : 'bg-white/70 hover:bg-white'
              }`} style={region === r.id ? { background: P.red, color: 'white' } : { color: P.text }}>
              {r.flag} {r.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {trendCats.map((cat) => {
            if (cat.key === 'updatedAt') return null;
            const catData = trendingData[cat.key as keyof Omit<typeof trendingData, 'updatedAt'>];
            if (!catData) return null;
            const items = catData[region] || [];
            return (
              <FadeIn key={cat.key}>
                <div className="palace-card overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#E0D8CC] flex items-center justify-between">
                    <h3 className="font-bold text-sm" style={{ color: P.text }}>{cat.emoji} {cat.label}</h3>
                    <button onClick={async () => {
                      const text = `${cat.emoji} ${cat.label} Top 3\n${items.slice(0, 3).map(i => `${i.rank}. ${i.title}`).join('\n')}\n\nhttps://dhlm-studio.com`;
                      if (navigator.share) { try { await navigator.share({ title: `Trending ${cat.label}`, text }); } catch {} }
                      else { await navigator.clipboard.writeText(text); }
                    }} className="text-[10px] transition" style={{ color: P.muted }}>Share ↗</button>
                  </div>
                  <div className="divide-y divide-[#E8E0D0]">
                    {items.slice(0, 3).map((item) => (
                      <a key={item.rank} href={getItemUrl(cat.key, item)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0EBE0] transition">
                        <span className="text-lg font-black w-6 text-right shrink-0" style={{ color: '#C5C0B5' }}>{item.rank}</span>
                        <ChangeIcon change={item.change} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: P.text }}>{item.title}</p>
                          {item.subtitle && <p className="text-xs truncate" style={{ color: P.muted }}>{item.subtitle}</p>}
                        </div>
                        {item.metric && (
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold" style={{ color: P.gold }}>{item.metric}</p>
                            {item.metricLabel && <p className="text-[9px]" style={{ color: '#B5AFA5' }}>{item.metricLabel}</p>}
                          </div>
                        )}
                        <span className="text-xs shrink-0" style={{ color: '#C5C0B5' }}>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
