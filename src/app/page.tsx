'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { trendingData, type TrendingItem } from '@/data/trending';

/* ═══════════════════════════════════════
   Korean Design Tokens
   ═══════════════════════════════════════ */
const K = {
  red: '#C73E3A',
  blue: '#4A90D9',
  gold: '#D4A853',
  cream: '#FFF8F0',
  ink: '#1A1A2E',
  card: '#2D2D4E',
  text: '#F0E6D3',
  muted: '#6B6B80',
  serif: 'var(--font-playfair), var(--font-noto-serif-kr), serif',
};

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */
const popularTools = [
  { emoji: '🍀', title: '로또 번호 뽑기', desc: '행운의 번호 생성', href: '/lotto' },
  { emoji: '🔮', title: '타로 운세', desc: '카드로 미래 읽기', href: '/lotto#fortune' },
  { emoji: '💕', title: '궁합 테스트', desc: '생년월일 궁합 확인', href: '/lotto#fortune' },
  { emoji: '⌨️', title: '타자 속도', desc: '내 타이핑 실력은?', href: '/tools/life/typing-speed' },
  { emoji: '💰', title: '연봉 계산기', desc: '실수령액 바로 확인', href: '/tools/calc/salary' },
  { emoji: '📱', title: 'QR코드', desc: '무료 QR 생성', href: '/tools/image/qr' },
];

const discoverCategories = [
  { emoji: '🔮', label: 'Beliefs', count: 20, color: '#7C3AED' },
  { emoji: '🍜', label: 'Food', count: 30, color: '#F97316' },
  { emoji: '🎵', label: 'K-Pop', count: 20, color: '#EC4899' },
  { emoji: '🏙️', label: 'Travel', count: 25, color: '#3B82F6' },
  { emoji: '🏠', label: 'Life', count: 20, color: '#10B981' },
  { emoji: '🎉', label: 'Traditions', count: 20, color: '#DC2626' },
  { emoji: '🗣️', label: 'Language', count: 15, color: '#EAB308' },
  { emoji: '💼', label: 'Business', count: 15, color: '#1E40AF' },
  { emoji: '📱', label: 'Tech', count: 15, color: '#06B6D4' },
  { emoji: '🤔', label: 'vs World', count: 20, color: '#6B7280' },
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
   Utilities
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
  return Math.floor(10000 + (Date.now() - new Date('2026-03-01').getTime()) / 3600000 * 15);
}

function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1500, 1);
          setCount(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(step);
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

/* Korean cloud pattern SVG (subtle) */
const CloudPattern = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 60c0-8 6-15 14-16 2-10 11-17 21-17s19 7 21 17c8 1 14 8 14 16s-6 15-14 16c-2 10-11 17-21 17s-19-7-21-17c-8-1-14-8-14-16z' fill='%23D4A853' fill-opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: '120px 120px',
    }}
  />
);

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
      {/* ════ Hero ════ */}
      <section className="relative overflow-hidden bg-[#1A1A2E] text-[#F0E6D3] min-h-[100dvh] flex items-center">
        <CloudPattern />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#C73E3A]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#D4A853]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-lg w-full px-5 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="text-3xl">🇰🇷</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold leading-tight mt-4"
            style={{ fontFamily: K.serif }}>
            Discover Korea Through<br />
            <span className="text-[#D4A853]">Tools, Culture & Fun</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-[#8080A0] text-sm mt-3 mb-8">
            한국의 도구, 문화, 재미를 한곳에서 경험하세요
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="space-y-3">
            <p className="text-xs text-[#8080A0] mb-1">생년월일을 입력하면 오늘의 운세를 확인할 수 있어요</p>
            <div className="flex gap-2 items-center justify-center">
              <input type="text" inputMode="numeric" placeholder="1990" maxLength={4} value={year}
                onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setYear(v); if (v.length === 4) monthRef.current?.focus(); }}
                className="w-[90px] px-2 py-3 bg-[#2D2D4E] border border-[#3D3D5E] rounded-lg text-[#F0E6D3] text-center text-lg focus:outline-none focus:border-[#D4A853] transition" />
              <span className="text-[#4A4A5E]">/</span>
              <input ref={monthRef} type="text" inputMode="numeric" placeholder="03" maxLength={2} value={month}
                onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 2); setMonth(v); if (v.length === 2) dayRef.current?.focus(); }}
                className="w-[60px] px-2 py-3 bg-[#2D2D4E] border border-[#3D3D5E] rounded-lg text-[#F0E6D3] text-center text-lg focus:outline-none focus:border-[#D4A853] transition" />
              <span className="text-[#4A4A5E]">/</span>
              <input ref={dayRef} type="text" inputMode="numeric" placeholder="15" maxLength={2} value={day}
                onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                onKeyDown={(e) => { if (e.key === 'Enter') handleFortune(); }}
                className="w-[60px] px-2 py-3 bg-[#2D2D4E] border border-[#3D3D5E] rounded-lg text-[#F0E6D3] text-center text-lg focus:outline-none focus:border-[#D4A853] transition" />
            </div>
            <button onClick={handleFortune} disabled={!birthday}
              className={`w-full py-3 rounded-lg font-bold text-base transition active:scale-[0.98] ${
                birthday ? 'bg-[#C73E3A] hover:bg-[#A33230] text-white shadow-lg shadow-[#C73E3A]/20' : 'bg-[#2D2D4E] text-[#4A4A5E] cursor-not-allowed'
              }`}>
              🔮 오늘의 운세 확인
            </button>
          </motion.div>

          {fortune && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-[#2D2D4E] border border-[#3D3D5E] rounded-xl p-5 text-center">
              <p className="text-4xl font-black" style={{ color: K.gold, fontFamily: K.serif }}>{fortune.score}점</p>
              <p className="text-[#8080A0] text-sm mt-1 mb-4">
                {fortune.grade === '대박' && '🌟 운이 폭발하는 날!'}
                {fortune.grade === '상승' && '🔥 좋은 기운이 가득!'}
                {fortune.grade === '평온' && '☀️ 안정적인 하루'}
                {fortune.grade === '보통' && '🌤️ 작은 행운을 놓치지 마세요'}
                {fortune.grade === '충전' && '🌙 에너지를 모으는 날'}
              </p>
              <p className="text-[10px] text-[#6B6B80] mb-2">행운의 숫자</p>
              <div className="flex justify-center gap-3">
                {fortune.nums.map((n) => (
                  <span key={n} className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-[#1A1A2E]"
                    style={{ background: `linear-gradient(135deg, ${K.gold}, #B8903A)` }}>{n}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Link href="/lotto#fortune" className="flex-1 py-2 bg-[#C73E3A]/20 border border-[#C73E3A]/30 text-[#E8A0A0] rounded-lg text-xs font-medium hover:bg-[#C73E3A]/30 transition">
                  자세히 보기 →
                </Link>
                <button onClick={async () => {
                  const text = `오늘의 운세 ${fortune.score}점! 행운번호: ${fortune.nums.join(', ')}\nhttps://dhlm-studio.com`;
                  if (navigator.share) { try { await navigator.share({ title: '오늘의 운세', text }); } catch {} }
                  else { await navigator.clipboard.writeText(text); alert('복사되었습니다!'); }
                }} className="flex-1 py-2 bg-[#D4A853]/20 border border-[#D4A853]/30 text-[#D4A853] rounded-lg text-xs font-medium hover:bg-[#D4A853]/30 transition">
                  공유하기
                </button>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-12 text-[#4A4A5E] text-xs animate-bounce">
            ↓
          </motion.div>
        </div>
      </section>

      {/* ════ Discover Korea ════ */}
      <section className="relative bg-[#FFF8F0] py-16 px-5 overflow-hidden">
        <CloudPattern />
        <div className="relative mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <span className="text-2xl">🇰🇷</span>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mt-2" style={{ fontFamily: K.serif }}>Discover Korea</h2>
            <p className="text-sm text-[#6B6B80] mt-1">한국의 흥미로운 이야기</p>
            <div className="w-10 h-[3px] bg-[#C73E3A] mx-auto mt-3" />
          </div>

          {/* Category scroll */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6">
            {discoverCategories.map((cat) => (
              <div key={cat.label} className="shrink-0 w-20 text-center bg-white border border-[#E8E0D0] rounded-xl p-3 hover:border-[#C73E3A] hover:shadow-md transition cursor-pointer group">
                <span className="text-2xl block">{cat.emoji}</span>
                <p className="text-[10px] font-bold text-[#2D2D2D] mt-1">{cat.label}</p>
                <p className="text-[9px] text-[#6B6B80]">{cat.count} posts</p>
              </div>
            ))}
          </div>

          {/* Popular posts */}
          <div className="space-y-2">
            {discoverPosts.map((post, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-[#E8E0D0] rounded-xl px-4 py-3 hover:border-[#C73E3A]/50 transition cursor-pointer">
                <span className="text-xl">{post.emoji}</span>
                <p className="flex-1 text-sm font-medium text-[#2D2D2D]">{post.title}</p>
                <span className="text-xs text-[#6B6B80]">👁 {post.views}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/blog" className="inline-flex items-center gap-1 px-5 py-2.5 bg-[#C73E3A] text-white rounded-lg text-sm font-medium hover:bg-[#A33230] transition">
              전체 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ════ Korean Divider ════ */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C73E3A] to-transparent" />

      {/* ════ Trending ════ */}
      <TrendingDashboard />

      {/* ════ Korean Divider ════ */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4A853] to-transparent" />

      {/* ════ Popular Tools ════ */}
      <section className="bg-[#1A1A2E] text-[#F0E6D3] py-16 px-5">
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-2">
            <p className="text-[#D4A853] text-xs font-bold tracking-widest mb-1">POPULAR</p>
            <h2 className="text-xl font-bold" style={{ fontFamily: K.serif }}>인기 도구</h2>
          </div>
          <p className="text-center text-sm text-[#6B6B80] mb-6">
            오늘 <span className="text-[#D4A853] font-bold"><AnimatedCount target={visitorCount} /></span>명이 사용했어요
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularTools.map((s) => (
              <Link key={s.title} href={s.href}
                className="group bg-[#2D2D4E] border border-[#3D3D5E] rounded-xl p-4 hover:border-[#D4A853]/50 hover:shadow-lg hover:shadow-[#D4A853]/5 transition-all">
                <span className="text-2xl block mb-2">{s.emoji}</span>
                <p className="font-bold text-sm">{s.title}</p>
                <p className="text-[#6B6B80] text-xs mt-0.5">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════ Tools Grid ════ */}
      <section className="bg-[#1A1A2E] text-[#F0E6D3] py-16 px-5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold" style={{ fontFamily: K.serif }}>🧮 무료 도구 모음</h2>
            <p className="text-[#6B6B80] text-xs mt-1">{tools.length}개 도구 무료 사용</p>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-hide">
            {categories.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  activeCat === c.id ? 'bg-[#C73E3A] text-white' : 'bg-[#2D2D4E] text-[#6B6B80] hover:bg-[#3D3D5E]'
                }`}>{c.emoji} {c.label}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {filteredTools.map((t) => (
              <Link key={t.href} href={t.href}
                className="bg-[#2D2D4E] border border-[#3D3D5E] rounded-xl p-3 text-center hover:border-[#D4A853]/40 transition group">
                <span className="text-xl block mb-1">{t.emoji}</span>
                <p className="text-[11px] text-[#A0A0B0] font-medium leading-tight">{t.name}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/tools" className="inline-flex items-center gap-1 px-5 py-2.5 bg-[#2D2D4E] border border-[#3D3D5E] rounded-lg text-sm text-[#A0A0B0] hover:border-[#D4A853]/50 hover:text-[#F0E6D3] transition">
              전체 도구 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ════ Blog ════ */}
      <section className="bg-[#FFF8F0] py-16 px-5">
        <div className="relative mx-auto max-w-lg">
          <CloudPattern />
          <div className="relative">
            <h2 className="text-xl font-bold text-[#2D2D2D] text-center mb-6" style={{ fontFamily: K.serif }}>📝 최근 블로그</h2>
            <div className="space-y-2">
              {blogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="block bg-white border border-[#E8E0D0] rounded-xl px-4 py-3.5 hover:border-[#C73E3A]/50 hover:shadow-md transition group">
                  <p className="text-sm font-medium text-[#2D2D2D] group-hover:text-[#C73E3A] transition">{post.title}</p>
                  <p className="text-xs text-[#6B6B80] mt-1">{post.date}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link href="/blog" className="text-sm text-[#C73E3A] hover:text-[#A33230] font-medium transition">
                블로그 전체 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════
   Trending Dashboard
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

const trendingCategories: { key: keyof typeof trendingData; emoji: string; label: string }[] = [
  { key: 'music', emoji: '🎵', label: 'Music' },
  { key: 'youtube', emoji: '📺', label: 'YouTube' },
  { key: 'movies', emoji: '🎬', label: 'Movies & TV' },
  { key: 'games', emoji: '🎮', label: 'Games' },
  { key: 'apps', emoji: '📱', label: 'Apps' },
  { key: 'search', emoji: '🔍', label: 'Search Trends' },
];

function ChangeIcon({ change }: { change: TrendingItem['change'] }) {
  if (change === 'up') return <span className="text-[#C73E3A] text-xs font-bold">▲</span>;
  if (change === 'down') return <span className="text-[#4A90D9] text-xs font-bold">▼</span>;
  if (change === 'new') return <span className="text-[#D4A853] text-[10px] font-bold">NEW</span>;
  return <span className="text-[#4A4A5E] text-xs">─</span>;
}

function getItemUrl(catKey: string, item: TrendingItem): string {
  if (item.url) return item.url;
  const q = encodeURIComponent(`${item.title}${item.subtitle ? ' ' + item.subtitle : ''}`);
  switch (catKey) {
    case 'music': return `https://www.youtube.com/results?search_query=${q}`;
    case 'youtube': return `https://www.youtube.com/results?search_query=${q}`;
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
    <section className="bg-[#1A1A2E] text-[#F0E6D3] py-16 px-5">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-6">
          <p className="text-[#D4A853] text-xs font-bold tracking-widest mb-1">UPDATED DAILY</p>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), var(--font-noto-serif-kr), serif' }}>
            What&apos;s Trending Now 🔥
          </h2>
          <p className="text-[#6B6B80] text-xs mt-1">Updated: {trendingData.updatedAt}</p>
        </div>

        <div className="flex gap-1.5 justify-center mb-8 flex-wrap">
          {regions.map((r) => (
            <button key={r.id} onClick={() => setRegion(r.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                region === r.id ? 'bg-[#C73E3A] text-white' : 'bg-[#2D2D4E] text-[#6B6B80] hover:bg-[#3D3D5E]'
              }`}>
              {r.flag} {r.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {trendingCategories.map((cat) => {
            if (cat.key === 'updatedAt') return null;
            const catData = trendingData[cat.key as keyof Omit<typeof trendingData, 'updatedAt'>];
            if (!catData) return null;
            const items = catData[region] || [];
            return (
              <div key={cat.key} className="bg-[#2D2D4E] border border-[#3D3D5E] rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#3D3D5E] flex items-center justify-between">
                  <h3 className="font-bold text-sm">{cat.emoji} {cat.label}</h3>
                  <button onClick={async () => {
                    const text = `${cat.emoji} ${cat.label} Top 3\n${items.slice(0, 3).map(i => `${i.rank}. ${i.title}`).join('\n')}\n\nhttps://dhlm-studio.com`;
                    if (navigator.share) { try { await navigator.share({ title: `Trending ${cat.label}`, text }); } catch {} }
                    else { await navigator.clipboard.writeText(text); }
                  }} className="text-[10px] text-[#6B6B80] hover:text-[#D4A853] transition">Share ↗</button>
                </div>
                <div className="divide-y divide-[#3D3D5E]/50">
                  {items.slice(0, 3).map((item) => (
                    <a key={item.rank} href={getItemUrl(cat.key, item)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#3D3D5E]/50 transition">
                      <span className="text-lg font-black text-[#4A4A5E] w-6 text-right shrink-0">{item.rank}</span>
                      <ChangeIcon change={item.change} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        {item.subtitle && <p className="text-xs text-[#6B6B80] truncate">{item.subtitle}</p>}
                      </div>
                      {item.metric && (
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-[#D4A853]">{item.metric}</p>
                          {item.metricLabel && <p className="text-[9px] text-[#4A4A5E]">{item.metricLabel}</p>}
                        </div>
                      )}
                      <span className="text-[#4A4A5E] text-xs shrink-0">↗</span>
                    </a>
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
