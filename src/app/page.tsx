'use client';

import Link from 'next/link';
import { monthlyEvents, getMonthName, getMonthNameKr } from '@/data/monthly-events';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

const categories = [
  { ko: '미신', en: 'Beliefs & Superstitions', count: 20 },
  { ko: '음식', en: 'Food & Drink', count: 30 },
  { ko: '문화', en: 'K-Culture & Entertainment', count: 20 },
  { ko: '여행', en: 'Travel & Places', count: 25 },
];

const moreCategories = ['Language', 'Work Culture', 'Traditions', 'Tech', 'Lifestyle', 'vs World'];

const posts = [
  'Why Korean Buildings Skip the 4th Floor',
  'Korean BBQ: The Complete Guide',
  "Fan Death: Korea's Famous Urban Legend",
  'Soju Drinking Rules You Must Know',
  'Never Write Names in Red Ink',
];

// Next month data
const nextMonth = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
const monthData = monthlyEvents[nextMonth];

export default function Home() {
  return (
    <>
      {/* ── Hero — Left: Title / Right: Next Month Events ── */}
      <section className="px-6" style={{ paddingTop: '120px', paddingBottom: '120px', background: '#FFFFFF' }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-start">
            {/* Left — Calligraphy-style title */}
            <div>
              <p className="text-[11px] tracking-[0.4em] mb-12" style={{ color: '#BCBCBC' }}>
                DHLM STUDIO
              </p>
              <h1 className="text-[clamp(36px,5vw,56px)] font-normal leading-[1.7]"
                style={{ fontFamily: 'var(--font-noto-serif-kr), serif', color: '#1A1A1A', letterSpacing: '0.08em' }}>
                한국의 문화를<br />세계와 연결합니다
              </h1>
              <p className="text-[15px] mt-8 italic leading-relaxed" style={{ fontFamily: 'var(--font-playfair), serif', color: '#B0B0B0' }}>
                Connecting Korean Culture<br />to the World
              </p>
            </div>

            {/* Right — Next Month Events */}
            <div>
              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-[13px] tracking-[0.15em]" style={{ fontFamily: 'var(--font-playfair), serif', color: '#6B7280' }}>
                  Coming in {getMonthName(nextMonth)}
                </p>
                <p className="text-[13px]" style={{ fontFamily: serif, color: '#9CA3AF' }}>
                  {getMonthNameKr(nextMonth)}
                </p>
              </div>
              <div className="space-y-4">
                {monthData.events.map((ev) => (
                  <div key={ev.name} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-base mt-0.5">{ev.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{ev.name}</p>
                        <p className="text-[12px]" style={{ fontFamily: serif, color: '#9CA3AF' }}>{ev.nameKr} · {ev.period}</p>
                        <p className="text-[13px] mt-1 leading-relaxed" style={{ color: '#6B7280' }}>{ev.desc}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <a href={ev.url} target="_blank" rel="noopener noreferrer"
                            className="text-[11px] transition-colors duration-200 hover:text-[#C73E3A]" style={{ color: '#9CA3AF' }}>
                            Learn more →
                          </a>
                          <button onClick={() => {
                            const text = `${ev.emoji} ${ev.name} (${ev.nameKr})\n${ev.period}\n${ev.desc}\n\nhttps://dhlm-studio.com`;
                            if (navigator.share) { navigator.share({ title: ev.name, text }).catch(() => {}); }
                            else { navigator.clipboard.writeText(text); }
                          }} className="text-[11px] transition-colors duration-200 hover:text-[#C73E3A]" style={{ color: '#9CA3AF' }}>
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16" style={{ width: '40%', height: '1px', background: '#E5E7EB' }} />
        </div>
      </section>

      {/* ── Discover Korea ── */}
      <section style={{ background: '#FAFAFA', borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '100px', paddingBottom: '100px' }}>
          <p className="text-[11px] tracking-[0.25em] mb-12" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
            Discover Korea
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {categories.map((cat) => (
              <Link key={cat.en} href="/blog"
                className="block border bg-white transition-colors duration-200 hover:border-[#C73E3A]"
                style={{ borderColor: '#E5E7EB', borderRadius: '4px', padding: '40px' }}>
                <p className="text-[clamp(24px,3vw,28px)] font-bold" style={{ fontFamily: serif, color: '#1A1A1A' }}>
                  {cat.ko}
                </p>
                <p className="text-sm mt-2" style={{ color: '#6B7280' }}>{cat.en}</p>
                <p className="text-[13px] mt-6" style={{ color: '#9CA3AF' }}>{cat.count} stories</p>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
            {moreCategories.map((cat) => (
              <Link key={cat} href="/blog"
                className="text-[13px] transition-colors duration-200 hover:text-[#C73E3A]"
                style={{ color: '#6B7280' }}>
                {cat}
              </Link>
            ))}
          </div>

          <Link href="/blog" className="text-sm transition-colors duration-200 hover:opacity-70" style={{ color: '#C73E3A' }}>
            View all 200+ articles →
          </Link>
        </div>
      </section>

      {/* ── Seasonal Food (compact) ── */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '60px', paddingBottom: '60px' }}>
          <p className="text-[13px] tracking-[0.15em] mb-6" style={{ fontFamily: 'var(--font-playfair), serif', color: '#9CA3AF' }}>
            Seasonal Food · {getMonthNameKr(nextMonth)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {monthData.foods.map((food) => (
              <div key={food.name} className="border" style={{ borderColor: '#E5E7EB', borderRadius: '4px', padding: '20px', background: '#FAFAFA' }}>
                <span className="text-xl">{food.emoji}</span>
                <p className="text-sm font-medium mt-1.5" style={{ color: '#1A1A1A' }}>{food.name}</p>
                <p className="text-[12px]" style={{ fontFamily: serif, color: '#9CA3AF' }}>{food.nameKr}</p>
                <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: '#6B7280' }}>{food.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular ── */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '100px', paddingBottom: '100px' }}>
          <p className="text-[11px] tracking-[0.25em] mb-12" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
            Most Read
          </p>

          <div>
            {posts.map((title, i) => (
              <div key={i} className="group cursor-pointer" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ padding: '28px 0' }}>
                  <p className="text-[13px] mb-2" style={{ color: '#C73E3A' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="text-[clamp(17px,2.5vw,20px)] font-medium leading-relaxed transition-colors duration-200 group-hover:text-[#C73E3A]"
                    style={{ fontFamily: serif, color: '#1A1A1A' }}>
                    {title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/blog" className="text-sm transition-colors duration-200 hover:opacity-70" style={{ color: '#C73E3A' }}>
              View all articles →
            </Link>
          </div>
        </div>
      </section>

      {/* ── More ── */}
      <section style={{ background: '#111111' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '100px', paddingBottom: '100px' }}>
          <p className="text-[11px] tracking-[0.25em] mb-12" style={{ fontFamily: 'var(--font-playfair), serif', color: '#555' }}>
            Also from DHLM Studio
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-12">
            {[
              { ko: '복권', en: 'World Lottery', desc: '25+ lotteries', href: '/lotto' },
              { ko: '도구', en: 'Free Tools', desc: '80+ calculators', href: '/tools' },
              { ko: '운세', en: 'Fortune', desc: 'Daily luck', href: '/lotto#fortune' },
            ].map((item) => (
              <Link key={item.en} href={item.href} className="group">
                <p className="text-2xl font-bold transition-colors duration-200 group-hover:text-[#C73E3A]"
                  style={{ fontFamily: serif, color: '#FFFFFF' }}>
                  {item.ko}
                </p>
                <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{item.en}</p>
                <p className="text-[13px] mt-0.5" style={{ color: '#6B7280' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
