'use client';

import Link from 'next/link';

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

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="px-6" style={{ paddingTop: '140px', paddingBottom: '140px' }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <p className="text-sm tracking-[0.3em] mb-10" style={{ color: '#6B7280' }}>
            DHLM STUDIO
          </p>
          <h1 className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.5]" style={{ fontFamily: serif, color: '#1A1A1A', letterSpacing: '0.05em' }}>
            한국의 문화를<br />세계와 연결합니다
          </h1>
          <p className="text-lg mt-6 italic" style={{ fontFamily: 'var(--font-playfair), serif', color: '#6B7280' }}>
            Connecting Korean Culture to the World
          </p>
          <div className="mt-16 mx-0" style={{ width: '40%', height: '1px', background: '#E5E7EB' }} />
        </div>
      </section>

      {/* ── Discover Korea ── */}
      <section style={{ background: '#FAFAFA', borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '100px', paddingBottom: '100px' }}>
          <p className="text-sm tracking-[0.2em] mb-12" style={{ fontFamily: 'var(--font-playfair), serif', color: '#6B7280' }}>
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

      {/* ── Popular ── */}
      <section style={{ borderTop: '1px solid #E5E7EB' }}>
        <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingTop: '100px', paddingBottom: '100px' }}>
          <p className="text-sm tracking-[0.2em] mb-12" style={{ fontFamily: 'var(--font-playfair), serif', color: '#6B7280' }}>
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
          <p className="text-sm tracking-[0.2em] mb-12" style={{ fontFamily: 'var(--font-playfair), serif', color: '#6B7280' }}>
            Also from DHLM Studio
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-12">
            {[
              { ko: '복권', en: 'World Lottery', desc: '10+ lotteries', href: '/lotto' },
              { ko: '도구', en: 'Free Tools', desc: '80+ calculators', href: '/tools' },
              { ko: '운세', en: 'Fortune', desc: 'Daily luck', href: '/lotto#fortune' },
            ].map((item) => (
              <Link key={item.en} href={item.href} className="group">
                <p className="text-2xl font-bold transition-colors duration-200 group-hover:text-[#C73E3A]"
                  style={{ fontFamily: serif, color: '#FFFFFF' }}>
                  {item.ko}
                </p>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{item.en}</p>
                <p className="text-[13px] mt-0.5" style={{ color: '#4B5563' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
