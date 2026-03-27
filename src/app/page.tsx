'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════
   Palace Tokens
   ═══════════════════════════════════════ */
const P = {
  roof: '#2C1810', red: '#8B2500', green: '#1B5E20', blue: '#1A237E',
  gold: '#C5981A', wall: '#F5F0E8', stone: '#D5CEC3', night: '#0B0D17',
  text: '#2D2D2D', muted: '#8D8478', light: '#F5F0E8',
  serif: 'var(--font-playfair), var(--font-noto-serif-kr), serif',
};

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */
const bigCategories = [
  { emoji: '🔮', title: 'Beliefs &\nSuperstitions', sub: '"Why Koreans fear the number 4, and more"', count: 20 },
  { emoji: '🍜', title: 'Food &\nDrink Culture', sub: '"BBQ rules, soju etiquette, street food guide"', count: 30 },
  { emoji: '🎵', title: 'K-Pop &\nEntertainment', sub: '"Trainee life, fan culture, hallyu wave"', count: 20 },
];

const smallCategories = [
  { emoji: '🏙️', label: 'Travel', count: 25 },
  { emoji: '🗣️', label: 'Language', count: 15 },
  { emoji: '💼', label: 'Work Culture', count: 15 },
  { emoji: '📱', label: 'Tech & Innovation', count: 15 },
  { emoji: '🤔', label: 'Korea vs World', count: 20 },
  { emoji: '🎉', label: 'Traditions', count: 20 },
  { emoji: '🏠', label: 'Daily Life', count: 20 },
];

const popularPosts = [
  { title: 'Why Korean Buildings Skip the 4th Floor', views: '2.3K', cat: 'Beliefs' },
  { title: 'Korean BBQ: The Complete Guide', views: '1.8K', cat: 'Food' },
  { title: "Fan Death: Korea's Famous Urban Legend", views: '1.5K', cat: 'Beliefs' },
  { title: 'Soju Drinking Rules: 7 Things You Must Know', views: '1.2K', cat: 'Food' },
  { title: 'Why Koreans Never Write Names in Red Ink', views: '1.0K', cat: 'Beliefs' },
];

/* ═══════════════════════════════════════
   Components
   ═══════════════════════════════════════ */

/* Grand roofline — full width */
const GrandRoof = () => (
  <svg viewBox="0 0 1440 80" className="absolute top-0 left-0 w-full h-12 sm:h-16 md:h-20" preserveAspectRatio="none">
    <path d="M0,80 C120,20 240,60 360,25 C480,-5 600,50 720,15 C840,-10 960,45 1080,10 C1200,-5 1320,50 1440,20 L1440,0 L0,0Z"
      fill={P.roof} />
    <path d="M0,72 C120,25 240,55 360,28 C480,0 600,48 720,20 C840,-5 960,42 1080,15 C1200,0 1320,48 1440,22"
      fill="none" stroke={P.red} strokeWidth="3" />
    <path d="M0,66 C120,30 240,52 360,32 C480,8 600,45 720,24 C840,2 960,40 1080,18"
      fill="none" stroke={P.green} strokeWidth="2" opacity="0.7" />
    <circle cx="360" cy="22" r="4" fill={P.gold} />
    <circle cx="720" cy="12" r="4" fill={P.gold} />
    <circle cx="1080" cy="14" r="4" fill={P.gold} />
  </svg>
);

/* Korean Jamo background — centered, giant */
const JamoBg = ({ letter, color = P.gold }: { letter: string; color?: string }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
    <span className="text-[300px] sm:text-[450px] md:text-[550px] font-black"
      style={{ fontFamily: 'var(--font-noto-serif-kr), serif', color, opacity: 0.025, lineHeight: 1 }}>
      {letter}
    </span>
  </div>
);

/* Scroll fade-in with slow, grand timing */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* Section divider — dancheong transition */
const Dancheong = () => (
  <div className="h-[4px]" style={{
    background: `linear-gradient(90deg, transparent 2%, ${P.red} 15%, ${P.green} 35%, ${P.gold} 50%, ${P.blue} 65%, ${P.red} 85%, transparent 98%)`
  }} />
);

/* Roofline transition — between sections */
const RoofTransition = ({ from, to }: { from: string; to: string }) => (
  <div style={{ background: to }}>
    <svg viewBox="0 0 1440 50" className="w-full h-6 sm:h-10" preserveAspectRatio="none">
      <path d="M0,0 C180,50 360,10 540,40 C720,10 900,50 1080,15 C1260,45 1350,5 1440,30 L1440,0 Z" fill={from} />
      <path d="M0,5 C180,48 360,15 540,38 C720,12 900,48 1080,18"
        fill="none" stroke={P.red} strokeWidth="1.5" opacity="0.5" />
    </svg>
  </div>
);

/* ═══════════════════════════════════════
   Page
   ═══════════════════════════════════════ */
export default function Home() {
  return (
    <>
      {/* ══════════════════════════════════
          ① 광화문 — Hero (100vh)
          ══════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: P.night }}>
        <GrandRoof />
        <JamoBg letter="ㅎ" color={P.gold} />

        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(197,152,26,0.06) 0%, transparent 70%)` }} />

        <div className="relative text-center px-5 py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1.2 }}
            className="text-[10px] sm:text-xs tracking-[0.6em] mb-10" style={{ color: P.gold }}>
            DHLM STUDIO
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: P.serif, color: P.gold, lineHeight: 1.2 }}
            className="text-[clamp(42px,8vw,88px)] font-bold tracking-[0.08em]">
            Experience Korea
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'var(--font-noto-serif-kr), serif', color: P.light }}
            className="text-[clamp(20px,4vw,40px)] mt-4 tracking-wide">
            한국을 경험하세요
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-16">
            <Link href="#discover"
              className="inline-flex px-10 py-3.5 rounded text-sm font-medium tracking-widest transition hover:opacity-90 active:scale-95"
              style={{ background: P.red, color: P.light }}>
              ENTER →
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
            className="mt-20 text-xs tracking-widest animate-bounce" style={{ color: '#4A4A5A' }}>
            ↓ SCROLL TO ENTER
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════
          Transition: Night → Wall
          ══════════════════════════════════ */}
      <RoofTransition from={P.night} to={P.wall} />
      <Dancheong />

      {/* ══════════════════════════════════
          ② 흥례문 — Discover Korea (100vh)
          ══════════════════════════════════ */}
      <section id="discover" className="relative min-h-[100dvh] flex items-center overflow-hidden palace-wall">
        <JamoBg letter="ㄱ" color={P.red} />

        {/* Pillar lines */}
        <div className="absolute top-[15%] bottom-[15%] left-3 sm:left-8 w-[3px] rounded-full" style={{ background: P.red, opacity: 0.12 }} />
        <div className="absolute top-[15%] bottom-[15%] right-3 sm:right-8 w-[3px] rounded-full" style={{ background: P.red, opacity: 0.12 }} />

        <div className="relative mx-auto max-w-3xl w-full px-8 sm:px-16 py-20">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.5em] font-medium mb-3" style={{ color: P.gold }}>DISCOVER</p>
              <h2 className="text-[clamp(32px,5vw,56px)] font-bold" style={{ fontFamily: P.serif, color: P.text }}>
                Discover Korea
              </h2>
              <p className="text-base sm:text-lg mt-3" style={{ color: P.muted }}>한국을 발견하세요</p>
              <div className="w-16 h-[3px] mx-auto mt-6" style={{ background: P.red }} />
            </div>
          </FadeIn>

          {/* Big featured card */}
          <FadeIn delay={150}>
            <div className="palace-card p-8 sm:p-10 mb-5 cursor-pointer group">
              <span className="text-5xl block mb-4">{bigCategories[0].emoji}</span>
              <h3 className="text-2xl sm:text-3xl font-bold leading-snug whitespace-pre-line" style={{ fontFamily: P.serif, color: P.text }}>
                {bigCategories[0].title}
              </h3>
              <p className="text-sm mt-3 italic" style={{ color: P.muted }}>{bigCategories[0].sub}</p>
              <p className="text-sm font-medium mt-5" style={{ color: P.red }}>{bigCategories[0].count} stories →</p>
            </div>
          </FadeIn>

          {/* Two medium cards */}
          <FadeIn delay={300}>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {bigCategories.slice(1).map((cat) => (
                <div key={cat.title} className="palace-card p-6 cursor-pointer group">
                  <span className="text-3xl block mb-3">{cat.emoji}</span>
                  <h3 className="text-lg font-bold leading-snug whitespace-pre-line" style={{ fontFamily: P.serif, color: P.text }}>
                    {cat.title}
                  </h3>
                  <p className="text-xs mt-2 italic" style={{ color: P.muted }}>{cat.sub}</p>
                  <p className="text-xs font-medium mt-3" style={{ color: P.red }}>{cat.count} stories →</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Small category row */}
          <FadeIn delay={450}>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {smallCategories.map((cat) => (
                <div key={cat.label} className="shrink-0 palace-card px-4 py-3 cursor-pointer flex items-center gap-2.5">
                  <span className="text-xl">{cat.emoji}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: P.text }}>{cat.label}</p>
                    <p className="text-[10px]" style={{ color: P.muted }}>{cat.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={550}>
            <div className="text-center mt-12">
              <Link href="/blog"
                className="inline-flex px-8 py-3 rounded text-sm font-medium tracking-wide text-white transition hover:opacity-90"
                style={{ background: P.red }}>
                View All 200+ Articles →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          Transition: Wall → Stone
          ══════════════════════════════════ */}
      <RoofTransition from={P.wall} to={P.stone} />
      <Dancheong />

      {/* ══════════════════════════════════
          ③ 근정전 마당 — Popular (100vh)
          ══════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden stone-floor">
        <JamoBg letter="ㅇ" color={P.red} />

        <div className="relative mx-auto max-w-2xl w-full px-5 sm:px-8 py-20">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.5em] font-medium mb-3" style={{ color: P.gold }}>TRENDING</p>
              <h2 className="text-[clamp(28px,5vw,48px)] font-bold" style={{ fontFamily: P.serif, color: P.text }}>
                Most Popular
              </h2>
              <p className="text-base mt-2" style={{ color: P.muted }}>인기 이야기</p>
            </div>
          </FadeIn>

          <div className="space-y-6">
            {popularPosts.map((post, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div className="group cursor-pointer">
                  <div className="flex items-baseline gap-5">
                    <span className="text-[clamp(36px,6vw,64px)] font-black shrink-0"
                      style={{ fontFamily: P.serif, color: i < 3 ? P.gold : '#C5C0B5', lineHeight: 1 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[clamp(16px,2.5vw,24px)] font-bold leading-snug group-hover:text-[#8B2500] transition-colors"
                        style={{ fontFamily: P.serif, color: P.text }}>
                        {post.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs" style={{ color: P.muted }}>{post.cat}</span>
                        <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, #8B2500, #C5981A, #1B5E20, transparent)' }} />
                        <span className="text-xs shrink-0" style={{ color: P.muted }}>👁 {post.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={700}>
            <div className="text-center mt-16">
              <Link href="/blog"
                className="inline-flex px-8 py-3 rounded text-sm font-medium tracking-wide text-white transition hover:opacity-90"
                style={{ background: P.red }}>
                View All 200+ Articles →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          Transition: Stone → Night
          ══════════════════════════════════ */}
      <RoofTransition from={P.stone} to={P.night} />
      <Dancheong />

      {/* ══════════════════════════════════
          ④ 근정전 내부 — More
          ══════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-5 overflow-hidden" style={{ background: P.night }}>
        <JamoBg letter="ㄷ" color={P.gold} />

        <div className="relative mx-auto max-w-2xl">
          <FadeIn>
            <p className="text-center text-xs tracking-[0.4em] mb-10" style={{ color: '#5A5A6A' }}>
              MORE FROM DHLM STUDIO
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: '🎱', title: 'World Lottery', desc: '10+ lotteries worldwide', href: '/lotto' },
                { emoji: '🧮', title: 'Free Tools', desc: '75+ calculators & utilities', href: '/tools' },
                { emoji: '🔮', title: 'Fortune & Tarot', desc: 'Daily fortune reading', href: '/lotto#fortune' },
              ].map((item) => (
                <Link key={item.title} href={item.href}
                  className="gold-card p-8 text-center group">
                  <span className="text-4xl block mb-3">{item.emoji}</span>
                  <p className="font-bold text-base" style={{ color: P.light }}>{item.title}</p>
                  <p className="text-xs mt-2" style={{ color: '#5A5A6A' }}>{item.desc}</p>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
