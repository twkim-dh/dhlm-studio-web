'use client';

import Link from 'next/link';
import { monthlyEvents, getMonthName, getMonthNameKr } from '@/data/monthly-events';
import { koreaMonthly } from '@/data/korea-interests';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

const categories = [
  { ko: '미신', en: 'Beliefs & Superstitions', count: 20 },
  { ko: '음식', en: 'Food & Drink', count: 30 },
  { ko: '문화', en: 'K-Culture & Entertainment', count: 20 },
  { ko: '여행', en: 'Travel & Places', count: 25 },
];

const moreCategories = ['Language', 'Work Culture', 'Traditions', 'Tech', 'Lifestyle', 'vs World'];

const posts = [
  { title: 'Why Korean Buildings Skip the 4th Floor', slug: 'number-four' },
  { title: 'Korean BBQ: The Complete Guide', slug: 'korean-bbq-guide' },
  { title: "Fan Death: Korea's Famous Urban Legend", slug: 'fan-death' },
  { title: 'Soju Drinking Rules You Must Know', slug: 'soju-drinking-rules' },
  { title: 'Never Write Names in Red Ink', slug: 'red-ink-death' },
];

// Next month data
const nextMonth = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
const monthData = monthlyEvents[nextMonth];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="px-6" style={{ paddingTop: '120px', paddingBottom: '120px', background: '#FFFFFF' }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <p className="text-[11px] tracking-[0.4em] mb-12" style={{ color: '#BCBCBC' }}>
            DHLM STUDIO
          </p>
          <h1 className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.5]"
            style={{ fontFamily: 'var(--font-noto-serif-kr), serif', color: '#1A1A1A', letterSpacing: '0.05em' }}>
            한국의 문화를<br />세계와 연결합니다
          </h1>
          <p className="text-lg mt-6 italic" style={{ fontFamily: 'var(--font-playfair), serif', color: '#6B7280' }}>
            Connecting Korean Culture to the World
          </p>
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
              <Link key={cat.en} href="/korea"
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
              <Link key={cat} href="/korea"
                className="text-[13px] transition-colors duration-200 hover:text-[#C73E3A]"
                style={{ color: '#6B7280' }}>
                {cat}
              </Link>
            ))}
          </div>

          <Link href="/korea" className="text-sm transition-colors duration-200 hover:opacity-70" style={{ color: '#C73E3A' }}>
            View all 200+ articles →
          </Link>
        </div>
      </section>

      {/* ── Coming Next Month ── */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Events */}
            <div>
              <div className="flex items-baseline gap-3 mb-8">
                <p className="text-[11px] tracking-[0.25em]" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
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
                          <Link href={ev.url}
                            className="text-[11px] transition-colors duration-200 hover:text-[#C73E3A]" style={{ color: '#9CA3AF' }}>
                            Learn more →
                          </Link>
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

            {/* Seasonal Food */}
            <div>
              <p className="text-[11px] tracking-[0.25em] mb-8" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
                Seasonal Food · {getMonthNameKr(nextMonth)}
              </p>
              <div className="space-y-4">
                {monthData.foods.map((food) => (
                  <div key={food.name} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-base mt-0.5">{food.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{food.name}</p>
                        <p className="text-[12px]" style={{ fontFamily: serif, color: '#9CA3AF' }}>{food.nameKr}</p>
                        <p className="text-[13px] mt-1 leading-relaxed" style={{ color: '#6B7280' }}>{food.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── K-Pop & K-Drama ── */}
      <section style={{ background: '#FAFAFA', borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-[11px] tracking-[0.25em] mb-8" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
                K-Pop · {koreaMonthly.updatedAt}
              </p>
              <p className="text-[12px] tracking-[0.1em] mb-4" style={{ color: '#9CA3AF' }}>Comebacks</p>
              <div className="space-y-3 mb-8">
                {koreaMonthly.kpop.comebacks.map((cb) => (
                  <div key={cb.artist} style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
                    <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{cb.artist}</p>
                    <p className="text-[12px]" style={{ color: '#9CA3AF' }}>{cb.title} · {cb.date}</p>
                  </div>
                ))}
              </div>
              <p className="text-[12px] tracking-[0.1em] mb-4" style={{ color: '#9CA3AF' }}>Concerts in Korea</p>
              <div className="space-y-3">
                {koreaMonthly.kpop.concerts.map((c) => (
                  <div key={c.artist} style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
                    <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{c.artist}</p>
                    <p className="text-[12px]" style={{ color: '#9CA3AF' }}>{c.venue} · {c.dates}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.25em] mb-8" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
                K-Drama & Trending
              </p>
              <p className="text-[12px] tracking-[0.1em] mb-4" style={{ color: '#9CA3AF' }}>Hot Dramas</p>
              <div className="space-y-3 mb-8">
                {koreaMonthly.drama.map((d) => (
                  <div key={d.name} style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
                    <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{d.name}</p>
                    <p className="text-[12px]" style={{ color: '#9CA3AF' }}>{d.platform} · {d.genre}</p>
                  </div>
                ))}
              </div>
              <p className="text-[12px] tracking-[0.1em] mb-4" style={{ color: '#9CA3AF' }}>Korean Slang</p>
              <div className="space-y-3">
                {koreaMonthly.trending.slang.map((s) => (
                  <div key={s.word} style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-medium" style={{ fontFamily: serif, color: '#1A1A1A' }}>{s.word}</p>
                      <p className="text-[11px]" style={{ color: '#BCBCBC' }}>{s.romanized}</p>
                    </div>
                    <p className="text-[12px] mt-0.5" style={{ color: '#6B7280' }}>{s.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── K-Beauty & Shopping ── */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-[11px] tracking-[0.25em] mb-8" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
                K-Beauty Best Sellers
              </p>
              <div className="space-y-3">
                {koreaMonthly.beauty.oliveyoungTop.map((p, i) => (
                  <div key={p.name} className="flex items-start gap-4" style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
                    <span className="text-[12px] mt-0.5 shrink-0" style={{ color: '#C73E3A' }}>{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{p.name}</p>
                      <p className="text-[12px]" style={{ color: '#9CA3AF' }}>{p.brand} · {p.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.25em] mb-8" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
                Pop-up Stores in Seoul
              </p>
              <div className="space-y-3">
                {koreaMonthly.beauty.popups.map((p) => (
                  <div key={p.brand} style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
                    <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{p.brand}</p>
                    <p className="text-[12px]" style={{ color: '#9CA3AF' }}>{p.location} · Until {p.until}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Most Read ── */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '100px', paddingBottom: '100px' }}>
          <p className="text-[11px] tracking-[0.25em] mb-12" style={{ fontFamily: 'var(--font-playfair), serif', color: '#BCBCBC' }}>
            Most Read
          </p>
          <div>
            {posts.map((post, i) => (
              <Link key={post.slug} href={`/korea/${post.slug}`}
                className="block group" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ padding: '28px 0' }}>
                  <p className="text-[13px] mb-2" style={{ color: '#C73E3A' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="text-[clamp(17px,2.5vw,20px)] font-medium leading-relaxed transition-colors duration-200 group-hover:text-[#C73E3A]"
                    style={{ fontFamily: serif, color: '#1A1A1A' }}>
                    {post.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/korea" className="text-sm transition-colors duration-200 hover:opacity-70" style={{ color: '#C73E3A' }}>
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
