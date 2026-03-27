'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════
   Palace Tokens
   ═══════════════════════════════════════ */
const P = {
  red: '#8B2500', gold: '#C5981A', green: '#1B5E20', blue: '#1A237E',
  wall: '#F5F0E8', stone: '#D5CEC3', night: '#0D1117', text: '#2D2D2D',
  muted: '#8D8478', light: '#F5F0E8',
  serif: 'var(--font-playfair), var(--font-noto-serif-kr), serif',
};

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */
const heroCategories = [
  { emoji: '🔮', label: 'Beliefs & Superstitions', count: 20, desc: 'Why no 4th floor? Red ink = death?' },
  { emoji: '🍜', label: 'Food & Drink Culture', count: 30, desc: 'BBQ, soju rules, street food & more' },
  { emoji: '🎵', label: 'K-Pop & Entertainment', count: 20, desc: 'Trainee life, fan culture, hallyu wave' },
];

const moreCategories = [
  { emoji: '🏙️', label: 'Travel', count: 25 },
  { emoji: '🗣️', label: 'Language', count: 15 },
  { emoji: '💼', label: 'Work', count: 15 },
  { emoji: '📱', label: 'Tech', count: 15 },
  { emoji: '🤔', label: 'vs World', count: 20 },
  { emoji: '🎉', label: 'Traditions', count: 20 },
  { emoji: '🏠', label: 'Lifestyle', count: 20 },
];

const popularPosts = [
  { title: 'Why Korean Buildings Skip the 4th Floor', views: '2.3K', emoji: '🔮', cat: 'Beliefs' },
  { title: 'Korean BBQ: The Complete Guide for Beginners', views: '1.8K', emoji: '🍜', cat: 'Food' },
  { title: 'Fan Death: Korea\'s Most Famous Urban Legend', views: '1.5K', emoji: '🔮', cat: 'Beliefs' },
  { title: 'Soju Drinking Rules: 7 Things You Must Know', views: '1.2K', emoji: '🍜', cat: 'Food' },
  { title: 'Why Koreans Never Write Names in Red Ink', views: '1.1K', emoji: '🔮', cat: 'Beliefs' },
];

/* ═══════════════════════════════════════
   Components
   ═══════════════════════════════════════ */
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

const JamoBg = ({ letter, color = P.red, pos = 'right' }: { letter: string; color?: string; pos?: 'left' | 'right' }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    <span className={`absolute text-[280px] sm:text-[380px] font-black leading-none ${pos === 'right' ? '-right-8 -top-8' : '-left-8 -bottom-8'}`}
      style={{ fontFamily: 'var(--font-noto-serif-kr), serif', color, opacity: 0.03 }}>
      {letter}
    </span>
  </div>
);

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
      style={{ transitionDelay: `${delay}ms` }}>{children}</div>
  );
}

/* ═══════════════════════════════════════
   Page
   ═══════════════════════════════════════ */
export default function Home() {
  return (
    <>
      {/* ══════ ① 히어로 — 광화문 ══════ */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center"
        style={{ background: 'linear-gradient(180deg, #E8EAF6 0%, #D5CEC3 100%)' }}>
        <JamoBg letter="ㅎ" color={P.gold} pos="right" />
        <div className="absolute bottom-0 left-0 right-0"><Roofline /></div>

        <div className="relative mx-auto max-w-2xl w-full px-5 py-20 text-center">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[10px] tracking-[0.5em] font-medium mb-8" style={{ color: P.gold }}>
            DHLM STUDIO
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-4xl sm:text-5xl font-bold leading-snug" style={{ fontFamily: P.serif, color: P.text }}>
            Experience Korea
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="text-base sm:text-lg mt-4" style={{ color: P.muted }}>
            한국을 경험하세요
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-10">
            <Link href="#discover"
              className="inline-flex px-8 py-3 rounded text-sm font-medium text-white tracking-wide transition active:scale-95 hover:opacity-90"
              style={{ background: P.red }}>
              Explore Korea →
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-16 text-xs animate-bounce" style={{ color: P.muted }}>
            ↓
          </motion.p>
        </div>
      </section>

      {/* ══════ ② Discover Korea ══════ */}
      <section id="discover" className="relative py-20 px-5 overflow-hidden palace-wall">
        <JamoBg letter="ㄱ" color={P.red} pos="left" />

        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-[10px] tracking-[0.4em] font-medium mb-2" style={{ color: P.gold }}>DISCOVER</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: P.serif, color: P.text }}>
                🇰🇷 Discover Korea
              </h2>
              <p className="text-sm mt-2" style={{ color: P.muted }}>200+ stories about Korean culture, food, language & more</p>
              <div className="w-12 h-[3px] mx-auto mt-4" style={{ background: P.red }} />
            </div>
          </FadeIn>

          {/* Big 3 cards */}
          <FadeIn delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {heroCategories.map((cat) => (
                <div key={cat.label}
                  className="palace-card p-6 cursor-pointer group relative overflow-hidden">
                  <span className="text-4xl block mb-3">{cat.emoji}</span>
                  <h3 className="text-lg font-bold leading-tight" style={{ fontFamily: P.serif, color: P.text }}>
                    {cat.label}
                  </h3>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: P.muted }}>{cat.desc}</p>
                  <p className="text-[10px] font-medium mt-3" style={{ color: P.red }}>
                    {cat.count} stories →
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* More categories — horizontal scroll */}
          <FadeIn delay={200}>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
              {moreCategories.map((cat) => (
                <div key={cat.label}
                  className="shrink-0 palace-card px-4 py-3 cursor-pointer flex items-center gap-2 min-w-[140px]">
                  <span className="text-xl">{cat.emoji}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: P.text }}>{cat.label}</p>
                    <p className="text-[10px]" style={{ color: P.muted }}>{cat.count} stories</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="text-center">
              <Link href="/blog"
                className="inline-flex px-6 py-2.5 rounded text-sm font-medium text-white transition hover:opacity-90"
                style={{ background: P.red }}>
                View All 200+ Articles →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 처마 전환 ══════ */}
      <div style={{ background: P.night }}><Roofline flip /></div>
      <div className="dancheong-line" />

      {/* ══════ ③ Most Popular ══════ */}
      <section className="relative py-16 px-5 overflow-hidden" style={{ background: P.night }}>
        <JamoBg letter="ㅁ" color={P.gold} pos="right" />

        <div className="relative mx-auto max-w-2xl">
          <FadeIn>
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[0.4em] font-medium mb-2" style={{ color: P.gold }}>TRENDING</p>
              <h2 className="text-2xl font-bold" style={{ fontFamily: P.serif, color: P.light }}>
                Most Popular
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="space-y-2">
              {popularPosts.map((post, i) => (
                <div key={i}
                  className="gold-card flex items-center gap-4 px-5 py-4 cursor-pointer group">
                  <span className="text-2xl font-black shrink-0" style={{ color: i < 3 ? P.gold : '#3A3A4A', fontFamily: P.serif }}>
                    {i + 1}
                  </span>
                  <span className="text-xl shrink-0">{post.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: P.light }}>{post.title}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#5A5A6A' }}>{post.cat}</p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: '#5A5A6A' }}>👁 {post.views}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 전환 ══════ */}
      <div className="dancheong-line" />
      <Roofline />

      {/* ══════ ④ Quick Access ══════ */}
      <section className="relative py-16 px-5 overflow-hidden palace-wall">
        <div className="relative mx-auto max-w-2xl">
          <FadeIn>
            <p className="text-center text-xs tracking-[0.3em] font-medium mb-6" style={{ color: P.muted }}>
              MORE FROM DHLM STUDIO
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/lotto" className="palace-card p-5 text-center group">
                <span className="text-3xl block mb-2">🎱</span>
                <p className="font-bold text-sm" style={{ color: P.text }}>World Lottery</p>
                <p className="text-xs mt-1" style={{ color: P.muted }}>10+ lotteries worldwide</p>
              </Link>
              <Link href="/tools" className="palace-card p-5 text-center group">
                <span className="text-3xl block mb-2">🧮</span>
                <p className="font-bold text-sm" style={{ color: P.text }}>Free Tools</p>
                <p className="text-xs mt-1" style={{ color: P.muted }}>75+ calculators & utilities</p>
              </Link>
              <Link href="/lotto#fortune" className="palace-card p-5 text-center group">
                <span className="text-3xl block mb-2">🔮</span>
                <p className="font-bold text-sm" style={{ color: P.text }}>Fortune & Tarot</p>
                <p className="text-xs mt-1" style={{ color: P.muted }}>Daily fortune & card reading</p>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
