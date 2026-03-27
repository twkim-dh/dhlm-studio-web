'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

const categories = [
  { ko: '미 신', en: 'Beliefs', count: 20, emoji: '🔮' },
  { ko: '음 식', en: 'Food & Drink', count: 30, emoji: '🍜' },
  { ko: '케 이 팝', en: 'K-Pop', count: 20, emoji: '🎵' },
  { ko: '여 행', en: 'Travel', count: 25, emoji: '🏙️' },
  { ko: '전 통', en: 'Traditions', count: 20, emoji: '🎉' },
  { ko: '일 상', en: 'Daily Life', count: 20, emoji: '🏠' },
];

const posts = [
  { title: 'Why Korean Buildings Skip the 4th Floor', views: '2.3K' },
  { title: 'Korean BBQ: The Complete Guide', views: '1.8K' },
  { title: "Fan Death: Korea's Famous Urban Legend", views: '1.5K' },
  { title: 'Soju Drinking Rules: 7 Things You Must Know', views: '1.2K' },
  { title: 'Why Koreans Never Write Names in Red Ink', views: '1.0K' },
];

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>{children}</div>
  );
}

export default function Home() {
  return (
    <>
      {/* ═══ 1. Hero — 한 국 ═══ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-[#1A1A2E] overflow-hidden">
        <div className="relative text-center px-5">
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(100px,22vw,180px)] font-bold tracking-[0.5em] leading-none"
            style={{ fontFamily: serif, color: '#C5981A' }}>
            한국
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-[clamp(16px,2.5vw,24px)] tracking-[0.2em] mt-8"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#F5F0E8' }}>
            Experience Korea
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="w-16 h-[1px] bg-[#C5981A] mx-auto my-8" />

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="text-[12px] tracking-[0.35em] uppercase"
            style={{ color: 'rgba(245,240,232,0.35)' }}>
            DHLM Studio
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-10 text-[11px] tracking-widest animate-bounce"
          style={{ color: 'rgba(245,240,232,0.2)' }}>
          ↓
        </motion.p>
      </section>

      {/* ═══ Thin line ═══ */}
      <div className="h-[1px] bg-[#C5981A]" />

      {/* ═══ 2. Discover — Image Grid ═══ */}
      <section className="bg-[#F5F0E8] py-24 sm:py-32 px-5 overflow-hidden">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="flex items-start gap-8 sm:gap-12 mb-16">
              {/* Vertical DISCOVER text */}
              <div className="hidden sm:flex flex-col items-center gap-1 pt-2">
                {'DISCOVER'.split('').map((ch, i) => (
                  <span key={i} className="text-[11px] tracking-widest font-medium"
                    style={{ color: '#C73E3A', writingMode: 'initial' }}>{ch}</span>
                ))}
              </div>

              <div>
                <p className="text-[10px] tracking-[0.4em] font-medium mb-3 sm:hidden" style={{ color: '#C73E3A' }}>DISCOVER</p>
                <h2 className="text-[clamp(36px,6vw,56px)] font-bold tracking-[0.15em] leading-tight"
                  style={{ fontFamily: serif, color: '#2C1810' }}>
                  한국을<br />발견하세요
                </h2>
                <p className="text-sm mt-4 tracking-wide" style={{ color: '#8D8478' }}>
                  200+ stories about Korean culture
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Image bento grid */}
          <FadeIn delay={200}>
            <div className="grid grid-cols-4 grid-rows-2 gap-3 sm:gap-4 mb-8" style={{ minHeight: '400px' }}>
              {/* Big left */}
              <Link href="/blog" className="col-span-2 row-span-2 relative rounded overflow-hidden group cursor-pointer bg-[#2C1810]">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                  <span className="text-4xl sm:text-5xl mb-3">{categories[0].emoji}</span>
                  <p className="text-[clamp(28px,4vw,40px)] font-bold tracking-[0.3em] text-[#F5F0E8]"
                    style={{ fontFamily: serif }}>{categories[0].ko}</p>
                  <p className="text-xs tracking-widest text-[#C5981A] mt-2">{categories[0].en}</p>
                  <p className="text-[10px] text-[rgba(245,240,232,0.4)] mt-3">{categories[0].count} stories</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-[#2C1810]/80 to-[#2C1810]/60 group-hover:opacity-90 transition-opacity" />
              </Link>

              {/* Top right */}
              <Link href="/blog" className="col-span-2 relative rounded overflow-hidden group cursor-pointer bg-[#8B2500]">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                  <span className="text-2xl sm:text-3xl mb-1">{categories[1].emoji}</span>
                  <p className="text-[clamp(18px,3vw,28px)] font-bold tracking-[0.3em] text-[#F5F0E8]"
                    style={{ fontFamily: serif }}>{categories[1].ko}</p>
                  <p className="text-[9px] tracking-widest text-[#C5981A] mt-1">{categories[1].en}</p>
                </div>
              </Link>

              {/* Bottom right — 2 small */}
              <Link href="/blog" className="relative rounded overflow-hidden group cursor-pointer bg-[#1A237E]">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 z-10">
                  <span className="text-xl mb-1">{categories[2].emoji}</span>
                  <p className="text-sm sm:text-base font-bold tracking-[0.2em] text-[#F5F0E8]"
                    style={{ fontFamily: serif }}>{categories[2].ko}</p>
                  <p className="text-[8px] tracking-widest text-[#C5981A] mt-0.5">{categories[2].en}</p>
                </div>
              </Link>
              <Link href="/blog" className="relative rounded overflow-hidden group cursor-pointer bg-[#1B5E20]">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 z-10">
                  <span className="text-xl mb-1">{categories[3].emoji}</span>
                  <p className="text-sm sm:text-base font-bold tracking-[0.2em] text-[#F5F0E8]"
                    style={{ fontFamily: serif }}>{categories[3].ko}</p>
                  <p className="text-[8px] tracking-widest text-[#C5981A] mt-0.5">{categories[3].en}</p>
                </div>
              </Link>
            </div>
          </FadeIn>

          {/* Remaining categories — text only */}
          <FadeIn delay={350}>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {categories.slice(4).map((cat) => (
                <Link key={cat.en} href="/blog" className="text-center group">
                  <p className="text-lg font-bold tracking-[0.2em] transition-colors group-hover:text-[#C73E3A]"
                    style={{ fontFamily: serif, color: '#2C1810' }}>{cat.ko}</p>
                  <p className="text-[9px] tracking-widest mt-0.5" style={{ color: '#8D8478' }}>{cat.en} · {cat.count}</p>
                </Link>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={450}>
            <div className="text-center mt-12">
              <Link href="/blog" className="inline-flex px-8 py-3 text-sm font-medium tracking-widest transition hover:opacity-80"
                style={{ background: '#C73E3A', color: '#F5F0E8', borderRadius: '2px' }}>
                VIEW ALL →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Thin line ═══ */}
      <div className="h-[1px] bg-[#C73E3A] opacity-30" />

      {/* ═══ 3. Popular ═══ */}
      <section className="bg-[#1A1A2E] py-24 sm:py-32 px-5">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <h2 className="text-[clamp(60px,12vw,100px)] font-bold tracking-[0.4em] text-center leading-none mb-4"
              style={{ fontFamily: serif, color: '#C5981A' }}>
              인기
            </h2>
            <div className="w-12 h-[1px] bg-[#C5981A] mx-auto mb-16" />
          </FadeIn>

          <div className="space-y-0">
            {posts.map((post, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="group cursor-pointer py-6 border-b border-[rgba(245,240,232,0.06)]">
                  <div className="flex items-baseline gap-6">
                    <span className="text-sm font-medium shrink-0 w-8"
                      style={{ fontFamily: 'var(--font-playfair), serif', color: '#C5981A' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[clamp(16px,2.2vw,22px)] font-medium leading-relaxed tracking-wide group-hover:text-[#C5981A] transition-colors duration-500"
                      style={{ fontFamily: 'var(--font-playfair), serif', color: '#F5F0E8' }}>
                      {post.title}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={600}>
            <div className="text-center mt-16">
              <Link href="/blog" className="text-sm tracking-[0.2em] transition-colors hover:text-[#C5981A]"
                style={{ color: 'rgba(245,240,232,0.4)' }}>
                VIEW ALL →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Thin line ═══ */}
      <div className="h-[1px] bg-[#C5981A] opacity-20" />

      {/* ═══ 4. More ═══ */}
      <section className="bg-[#F5F0E8] py-20 sm:py-24 px-5">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="w-8 h-[1px] bg-[#C73E3A] mx-auto mb-12" />
            <div className="flex justify-center gap-16 sm:gap-24">
              {[
                { ko: '복 권', en: 'Lottery', href: '/lotto' },
                { ko: '도 구', en: 'Tools', href: '/tools' },
                { ko: '운 세', en: 'Fortune', href: '/lotto#fortune' },
              ].map((item) => (
                <Link key={item.en} href={item.href} className="text-center group">
                  <p className="text-xl sm:text-2xl font-bold tracking-[0.3em] transition-colors group-hover:text-[#C73E3A]"
                    style={{ fontFamily: serif, color: '#2C1810' }}>{item.ko}</p>
                  <p className="text-[10px] tracking-[0.2em] mt-2"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: '#8D8478' }}>{item.en}</p>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
