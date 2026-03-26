'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { trendingData, type TrendingItem } from '@/data/trending';

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */
const popularServices = [
  { emoji: '🍀', title: '로또 번호 뽑기', desc: 'AI 번호 생성 + 운세', href: '/lotto', hoverEmoji: '🎱' },
  { emoji: '🔮', title: 'AI 타로', desc: '카드 3장으로 미래 읽기', href: '/lotto#fortune', hoverEmoji: '🃏' },
  { emoji: '💕', title: '궁합 테스트', desc: '생년월일로 궁합 확인', href: '/lotto#fortune', hoverEmoji: '❤️' },
  { emoji: '⌨️', title: '타자 속도 테스트', desc: '내 타자 실력은?', href: '/tools/life/typing-speed', hoverEmoji: '🔥' },
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
  // finance
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
  // life
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
  // dev
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
  // doc
  { name: '퇴사 문자', emoji: '👋', href: '/tools/msg/resign-letter', cat: 'doc' },
  { name: '거절 메시지', emoji: '🚫', href: '/tools/msg/reject-message', cat: 'doc' },
  { name: '축의금 문구', emoji: '💐', href: '/tools/msg/congratulation', cat: 'doc' },
  { name: '연차 사유', emoji: '🏖️', href: '/tools/msg/annual-leave', cat: 'doc' },
  { name: '지각 변명', emoji: '🏃', href: '/tools/msg/late-excuse', cat: 'doc' },
  { name: '한줄 요약', emoji: '📋', href: '/tools/msg/text-summary', cat: 'doc' },
  { name: '글자수 세기', emoji: '🔢', href: '/tools/msg/character-count', cat: 'doc' },
  { name: '텍스트 변환', emoji: '🔄', href: '/tools/msg/text-transform', cat: 'doc' },
  // image
  { name: '이미지 압축', emoji: '🗜️', href: '/tools/image/image-compress', cat: 'image' },
  { name: '이미지 변환', emoji: '🔄', href: '/tools/image/image-convert', cat: 'image' },
  { name: '이미지 리사이즈', emoji: '📏', href: '/tools/image/image-resize', cat: 'image' },
  { name: 'YT 썸네일', emoji: '🎬', href: '/tools/image/youtube-thumbnail', cat: 'image' },
  { name: 'QR코드', emoji: '📱', href: '/tools/image/qr', cat: 'image' },
  // gen
  { name: '닉네임', emoji: '🏷️', href: '/tools/gen/nickname-gen', cat: 'gen' },
  { name: '회사명', emoji: '🏢', href: '/tools/gen/company-name-gen', cat: 'gen' },
  { name: '팀명', emoji: '👥', href: '/tools/gen/team-name-gen', cat: 'gen' },
  { name: '랜덤 뽑기', emoji: '🎰', href: '/tools/gen/random-picker', cat: 'gen' },
  { name: '비밀번호', emoji: '🔐', href: '/tools/gen/password-gen', cat: 'gen' },
  { name: '해시태그', emoji: '#️⃣', href: '/tools/gen/hashtag-gen', cat: 'gen' },
  { name: '이모지 검색', emoji: '😀', href: '/tools/gen/emoji-search', cat: 'gen' },
  { name: '랜덤 숫자', emoji: '🎲', href: '/tools/gen/random-number', cat: 'gen' },
  { name: '모스 부호', emoji: '📻', href: '/tools/gen/morse-code', cat: 'gen' },
  // mfg
  { name: '단중 계산', emoji: '⚙️', href: '/tools/mfg/unit-weight', cat: 'mfg' },
  { name: 'Cpk', emoji: '📉', href: '/tools/mfg/cpk', cat: 'mfg' },
  { name: 'UPH', emoji: '🏭', href: '/tools/mfg/uph', cat: 'mfg' },
  { name: '불량률', emoji: '❌', href: '/tools/mfg/defect', cat: 'mfg' },
  { name: 'OEE', emoji: '📊', href: '/tools/mfg/oee', cat: 'mfg' },
  // compare
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
   Fortune Logic
   ═══════════════════════════════════════ */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getFortune(birthday: string) {
  const today = new Date();
  const seed = birthday.replace(/-/g, '') + `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const hash = hashStr(seed);
  const score = (hash % 100) + 1;
  const nums: number[] = [];
  let h = hash;
  while (nums.length < 3) {
    h = ((h * 1103515245 + 12345) & 0x7fffffff);
    const n = (h % 45) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  let grade: string;
  if (score >= 90) grade = '대박';
  else if (score >= 70) grade = '상승';
  else if (score >= 50) grade = '평온';
  else if (score >= 30) grade = '보통';
  else grade = '충전';
  return { score, nums: nums.sort((a, b) => a - b), grade };
}

function getVisitorCount() {
  const base = 10000;
  const hours = (Date.now() - new Date('2026-03-01').getTime()) / 3600000;
  return Math.floor(base + hours * 15);
}

/* ═══════════════════════════════════════
   Animated Counter
   ═══════════════════════════════════════ */
function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 1500;
        const step = (ts: number) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          setCount(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ═══════════════════════════════════════
   Page
   ═══════════════════════════════════════ */
export default function Home() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [fortune, setFortune] = useState<ReturnType<typeof getFortune> | null>(null);
  const [activeCat, setActiveCat] = useState<CatId>('all');
  const visitorCount = getVisitorCount();
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const birthday = year.length === 4 && month.length >= 1 && day.length >= 1
    ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : '';

  const handleFortune = () => {
    if (!birthday) return;
    setFortune(getFortune(birthday));
  };

  const filteredTools = activeCat === 'all' ? tools : tools.filter((t) => t.cat === activeCat);

  return (
    <>
      {/* ════════ Hero Section ════════ */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white min-h-[100dvh] flex items-center">
        {/* BG glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-lg w-full px-5 py-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-sm text-purple-300 font-medium tracking-wide mb-3"
          >
            DHLM STUDIO
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-black leading-tight mb-3"
          >
            오늘의 행운을<br />확인하세요
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-gray-400 text-sm mb-8"
          >
            생년월일만 입력하면 오늘의 운세와 행운 번호를 바로 확인!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <div className="flex gap-2 items-center justify-center">
              <input
                type="text" inputMode="numeric" placeholder="1990" maxLength={4}
                value={year}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setYear(v);
                  if (v.length === 4) monthRef.current?.focus();
                }}
                className="w-[90px] px-2 py-3.5 bg-[#1E293B] border border-gray-700 rounded-2xl text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <span className="text-gray-500 text-lg">/</span>
              <input
                ref={monthRef}
                type="text" inputMode="numeric" placeholder="03" maxLength={2}
                value={month}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setMonth(v);
                  if (v.length === 2) dayRef.current?.focus();
                }}
                className="w-[60px] px-2 py-3.5 bg-[#1E293B] border border-gray-700 rounded-2xl text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <span className="text-gray-500 text-lg">/</span>
              <input
                ref={dayRef}
                type="text" inputMode="numeric" placeholder="15" maxLength={2}
                value={day}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setDay(v);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleFortune(); }}
                className="w-[60px] px-2 py-3.5 bg-[#1E293B] border border-gray-700 rounded-2xl text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
            <button
              onClick={handleFortune}
              disabled={!birthday}
              className={`w-full py-3.5 rounded-2xl font-bold text-lg transition active:scale-[0.98] ${
                birthday
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              ✨ 오늘의 운세 확인
            </button>
          </motion.div>

          {/* Fortune Result */}
          {fortune && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-[#1E293B] border border-gray-700 rounded-2xl p-5 text-center"
            >
              <p className="text-5xl font-black mb-1" style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C42)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {fortune.score}점
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {fortune.grade === '대박' && '🌟 운이 폭발하는 날!'}
                {fortune.grade === '상승' && '🔥 좋은 기운이 가득!'}
                {fortune.grade === '평온' && '☀️ 안정적인 하루'}
                {fortune.grade === '보통' && '🌤️ 작은 행운을 놓치지 마세요'}
                {fortune.grade === '충전' && '🌙 에너지를 모으는 날'}
              </p>
              <p className="text-xs text-gray-500 mb-2">행운의 숫자</p>
              <div className="flex justify-center gap-3">
                {fortune.nums.map((n) => (
                  <span key={n} className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-gray-900">
                    {n}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Link href="/lotto#fortune" className="flex-1 py-2.5 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-medium hover:bg-purple-600/30 transition">
                  자세히 보기 →
                </Link>
                <button onClick={async () => {
                  const text = `오늘의 운세 ${fortune.score}점! 행운번호: ${fortune.nums.join(', ')}\nhttps://dhlm-studio.com`;
                  if (navigator.share) { try { await navigator.share({ title: '오늘의 운세', text }); } catch {} }
                  else { await navigator.clipboard.writeText(text); alert('복사되었습니다!'); }
                }} className="flex-1 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-medium hover:bg-amber-500/30 transition">
                  공유하기
                </button>
              </div>
            </motion.div>
          )}

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="mt-12 text-gray-600 text-xs animate-bounce"
          >
            ↓ 더 둘러보기
          </motion.div>
        </div>
      </section>

      {/* ════════ Trending Dashboard ════════ */}
      <TrendingDashboard />

      {/* ════════ Popular Section ════════ */}
      <section className="bg-[#0F172A] text-white py-16 px-5">
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-2">
            <p className="text-purple-400 text-xs font-medium tracking-widest mb-1">TRENDING NOW</p>
            <h2 className="text-xl font-bold">🔥 지금 인기 있는 도구</h2>
          </div>

          <p className="text-center text-sm text-gray-400 mb-6">
            오늘 <span className="text-amber-400 font-bold"><AnimatedCount target={visitorCount} /></span>명이 사용했어요
          </p>

          <div className="grid grid-cols-2 gap-3">
            {popularServices.map((s) => (
              <Link key={s.title} href={s.href}
                className="group bg-[#1E293B] border border-gray-700/50 rounded-2xl p-4 hover:border-purple-500/50 hover:bg-[#1E293B]/80 transition-all">
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform inline-block">
                  <span className="group-hover:hidden">{s.emoji}</span>
                  <span className="hidden group-hover:inline">{s.hoverEmoji}</span>
                </span>
                <p className="font-bold text-sm">{s.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Tools Section ════════ */}
      <section className="bg-[#0F172A] text-white py-16 px-5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">🧮 무료 도구 모음</h2>
            <p className="text-gray-500 text-xs mt-1">{tools.length}개 도구 무료 사용</p>
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-hide">
            {categories.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  activeCat === c.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1E293B] text-gray-400 hover:bg-[#2D3A4F]'
                }`}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {filteredTools.map((t) => (
              <Link key={t.href} href={t.href}
                className="bg-[#1E293B] border border-gray-700/30 rounded-xl p-3 text-center hover:border-purple-500/40 hover:bg-[#253047] transition group">
                <span className="text-xl block mb-1 group-hover:scale-110 transition-transform inline-block">{t.emoji}</span>
                <p className="text-[11px] text-gray-300 font-medium leading-tight">{t.name}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/tools" className="inline-flex items-center gap-1 px-5 py-2.5 bg-[#1E293B] border border-gray-700 rounded-xl text-sm text-gray-300 hover:border-purple-500/50 hover:text-white transition">
              전체 도구 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ Blog Section ════════ */}
      <section className="bg-[#0B1120] text-white py-16 px-5">
        <div className="mx-auto max-w-lg">
          <h2 className="text-xl font-bold text-center mb-6">📝 최근 블로그</h2>
          <div className="space-y-3">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="block bg-[#1E293B] border border-gray-700/30 rounded-xl px-4 py-3.5 hover:border-purple-500/40 transition group">
                <p className="text-sm font-medium text-gray-200 group-hover:text-white transition">{post.title}</p>
                <p className="text-xs text-gray-500 mt-1">{post.date}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link href="/blog" className="text-sm text-purple-400 hover:text-purple-300 transition">
              블로그 전체 보기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════
   Trending Dashboard Component
   ═══════════════════════════════════════ */
type RegionId = 'global' | 'kr' | 'us' | 'jp' | 'vn' | 'uk';

const regions: { id: RegionId; flag: string; label: string }[] = [
  { id: 'global', flag: '🌍', label: 'Global' },
  { id: 'kr', flag: '🇰🇷', label: 'KR' },
  { id: 'us', flag: '🇺🇸', label: 'US' },
  { id: 'jp', flag: '🇯🇵', label: 'JP' },
  { id: 'vn', flag: '🇻🇳', label: 'VN' },
  { id: 'uk', flag: '🇬🇧', label: 'UK' },
];

const trendingCategories: { key: keyof typeof trendingData; emoji: string; label: string }[] = [
  { key: 'music', emoji: '🎵', label: 'Music' },
  { key: 'youtube', emoji: '📺', label: 'YouTube' },
  { key: 'movies', emoji: '🎬', label: 'Movies & TV' },
  { key: 'games', emoji: '🎮', label: 'Games' },
  { key: 'apps', emoji: '📱', label: 'Apps' },
  { key: 'search', emoji: '🔍', label: 'Search Trends' },
];

function ChangeIcon({ change }: { change: TrendingItem['change'] }) {
  if (change === 'up') return <span className="text-red-400 text-xs font-bold">▲</span>;
  if (change === 'down') return <span className="text-blue-400 text-xs font-bold">▼</span>;
  if (change === 'new') return <span className="text-amber-400 text-[10px] font-bold">NEW</span>;
  return <span className="text-gray-600 text-xs">─</span>;
}

function TrendingDashboard() {
  const [region, setRegion] = useState<RegionId>('global');

  return (
    <section className="bg-[#0B1120] text-white py-16 px-5">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-amber-400 text-xs font-bold tracking-widest mb-1">UPDATED DAILY</p>
          <h2 className="text-2xl font-black">What&apos;s Trending Right Now 🔥</h2>
          <p className="text-gray-500 text-xs mt-1">Updated: {trendingData.updatedAt}</p>
        </div>

        {/* Region Selector */}
        <div className="flex gap-1.5 justify-center mb-8 flex-wrap">
          {regions.map((r) => (
            <button key={r.id} onClick={() => setRegion(r.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                region === r.id
                  ? 'bg-amber-500 text-gray-900'
                  : 'bg-[#1E293B] text-gray-400 hover:bg-[#2D3A4F]'
              }`}>
              {r.flag} {r.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {trendingCategories.map((cat) => {
            if (cat.key === 'updatedAt') return null;
            const catData = trendingData[cat.key as keyof Omit<typeof trendingData, 'updatedAt'>];
            if (!catData) return null;
            const items = catData[region] || [];
            return (
              <div key={cat.key} className="bg-[#1E293B] border border-gray-700/30 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700/30 flex items-center justify-between">
                  <h3 className="font-bold text-sm">{cat.emoji} {cat.label}</h3>
                  <button onClick={async () => {
                    const text = `${cat.emoji} ${cat.label} Top 5 (${regions.find(r => r.id === region)?.flag} ${region.toUpperCase()})\n${items.slice(0, 5).map(i => `${i.rank}. ${i.title}${i.subtitle ? ' - ' + i.subtitle : ''}`).join('\n')}\n\nhttps://dhlm-studio.com`;
                    if (navigator.share) { try { await navigator.share({ title: `Trending ${cat.label}`, text }); } catch {} }
                    else { await navigator.clipboard.writeText(text); }
                  }} className="text-[10px] text-gray-500 hover:text-gray-300 transition">Share ↗</button>
                </div>
                <div className="divide-y divide-gray-700/20">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.rank} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#253047] transition">
                      <span className="text-lg font-black text-gray-500 w-6 text-right shrink-0">{item.rank}</span>
                      <ChangeIcon change={item.change} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        {item.subtitle && <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>}
                      </div>
                      {item.metric && (
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-amber-400">{item.metric}</p>
                          {item.metricLabel && <p className="text-[9px] text-gray-600">{item.metricLabel}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
