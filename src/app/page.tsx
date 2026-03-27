'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

const sections = [
  {
    ko: '미\n신',
    en: 'Beliefs',
    sub: '한국의 믿음과 금기',
    count: 20,
    bg: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1200&q=80',
    color: '#2C1810',
  },
  {
    ko: '음\n식',
    en: 'Food & Drink',
    sub: '한국의 맛과 멋',
    count: 30,
    bg: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1200&q=80',
    color: '#8B2500',
  },
  {
    ko: '문\n화',
    en: 'K-Culture',
    sub: 'K-Pop부터 한복까지',
    count: 20,
    bg: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=80',
    color: '#1A237E',
  },
  {
    ko: '여\n행',
    en: 'Travel',
    sub: '한국의 아름다운 곳',
    count: 25,
    bg: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80',
    color: '#1B5E20',
  },
];

const posts = [
  'Why Korean Buildings Skip the 4th Floor',
  'Korean BBQ: The Complete Guide',
  "Fan Death: Korea's Famous Urban Legend",
  'Soju Drinking Rules You Must Know',
  'Never Write Names in Red Ink',
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
    <div ref={ref} className={`transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>{children}</div>
  );
}

export default function Home() {
  return (
    <>
      {/* ═══ Hero — Full screen photo ═══ */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1553621042-f6e147245754?w=1400&q=80')` }} />
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative flex items-center gap-8 sm:gap-16 px-8">
          {/* Vertical Korean text — like the reference image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex flex-col items-center gap-1">
            {'한국의문화'.split('').map((ch, i) => (
              <span key={i} className="text-[clamp(20px,3vw,32px)] font-bold"
                style={{ fontFamily: serif, color: 'rgba(245,240,232,0.5)', lineHeight: 1.8 }}>{ch}</span>
            ))}
          </motion.div>

          {/* Main vertical title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center">
            {'한국을경험하다'.split('').map((ch, i) => (
              <span key={i} className="text-[clamp(40px,8vw,72px)] font-bold block"
                style={{ fontFamily: serif, color: '#F5F0E8', lineHeight: 1.4, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>{ch}</span>
            ))}
          </motion.div>

          {/* Right side — small info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex flex-col items-center gap-2">
            {'DHLMSTUDIO'.split('').map((ch, i) => (
              <span key={i} className="text-[10px] tracking-widest"
                style={{ fontFamily: 'var(--font-playfair), serif', color: 'rgba(197,152,26,0.6)', lineHeight: 2 }}>{ch}</span>
            ))}
          </motion.div>
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-[10px] tracking-[0.4em] mb-3 sm:hidden" style={{ color: 'rgba(245,240,232,0.4)' }}>DHLM STUDIO</p>
          <p className="text-[11px] tracking-widest animate-bounce" style={{ color: 'rgba(245,240,232,0.25)' }}>↓</p>
        </motion.div>
      </section>

      {/* ═══ Photo sections — each category ═══ */}
      {sections.map((sec, i) => (
        <section key={sec.en} className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden">
          {/* Photo background */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${sec.bg}')` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(${i % 2 === 0 ? '135deg' : '225deg'}, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)` }} />

          <FadeIn className="relative w-full">
            <div className={`mx-auto max-w-5xl px-8 sm:px-16 py-20 flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex items-start gap-6 sm:gap-10 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                {/* Vertical Korean */}
                <div className="flex flex-col items-center">
                  {sec.ko.split('\n').map((ch, j) => (
                    <span key={j} className="text-[clamp(48px,10vw,80px)] font-bold block"
                      style={{ fontFamily: serif, color: '#F5F0E8', lineHeight: 1.3, textShadow: '0 2px 30px rgba(0,0,0,0.4)' }}>{ch}</span>
                  ))}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center" style={{ maxWidth: '280px' }}>
                  <p className="text-[clamp(14px,2vw,20px)] font-bold tracking-[0.15em]"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: '#F5F0E8' }}>
                    {sec.en}
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'rgba(245,240,232,0.6)' }}>{sec.sub}</p>
                  <div className="w-8 h-[1px] my-4" style={{ background: '#C5981A' }} />
                  <p className="text-[10px] tracking-widest" style={{ color: 'rgba(197,152,26,0.6)' }}>
                    {sec.count} STORIES
                  </p>
                  <Link href="/blog"
                    className="inline-flex items-center gap-2 text-xs tracking-widest mt-4 transition-colors hover:text-[#C5981A]"
                    style={{ color: 'rgba(245,240,232,0.5)' }}>
                    EXPLORE →
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      ))}

      {/* ═══ Popular — dark, minimal ═══ */}
      <section className="bg-[#1A1A2E] py-24 sm:py-32 px-5">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="flex items-center gap-6 mb-16">
              <div className="flex flex-col items-center">
                {'인기'.split('').map((ch, i) => (
                  <span key={i} className="text-[clamp(36px,6vw,56px)] font-bold"
                    style={{ fontFamily: serif, color: '#C5981A', lineHeight: 1.3 }}>{ch}</span>
                ))}
              </div>
              <div>
                <p className="text-sm tracking-[0.2em]" style={{ fontFamily: 'var(--font-playfair), serif', color: 'rgba(245,240,232,0.4)' }}>
                  Most Popular
                </p>
                <div className="w-8 h-[1px] bg-[#C5981A] mt-3 opacity-30" />
              </div>
            </div>
          </FadeIn>

          {posts.map((title, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="group cursor-pointer py-5 border-b border-[rgba(245,240,232,0.05)]">
                <div className="flex items-baseline gap-5">
                  <span className="text-sm font-medium w-6 shrink-0"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: '#C5981A' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[clamp(15px,2vw,20px)] font-medium leading-relaxed tracking-wide group-hover:text-[#C5981A] transition-colors duration-500"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: '#F5F0E8' }}>
                    {title}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}

          <FadeIn delay={500}>
            <div className="text-center mt-14">
              <Link href="/blog" className="text-xs tracking-[0.25em] transition-colors hover:text-[#C5981A]"
                style={{ color: 'rgba(245,240,232,0.3)' }}>
                VIEW ALL 200+ ARTICLES →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ More — minimal ═══ */}
      <section className="bg-[#F5F0E8] py-20 px-5">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="w-6 h-[1px] bg-[#C73E3A] mx-auto mb-10 opacity-40" />
            <div className="flex justify-center gap-14 sm:gap-20">
              {[
                { ko: '복권', en: 'Lottery', href: '/lotto' },
                { ko: '도구', en: 'Tools', href: '/tools' },
                { ko: '운세', en: 'Fortune', href: '/lotto#fortune' },
              ].map((item) => (
                <Link key={item.en} href={item.href} className="text-center group">
                  <p className="text-lg sm:text-xl font-bold tracking-[0.2em] transition-colors group-hover:text-[#C73E3A]"
                    style={{ fontFamily: serif, color: '#2C1810' }}>{item.ko}</p>
                  <p className="text-[9px] tracking-[0.2em] mt-1.5"
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
