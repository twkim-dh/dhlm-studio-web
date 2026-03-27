import type { Metadata } from 'next';
import Link from 'next/link';
import { allDraws } from '@/data/lotto/recent-draws';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

export const metadata: Metadata = {
  title: '로또 당첨번호 전체 회차 — 역대 당첨번호 조회',
  description: '로또 6/45 전체 회차 당첨번호, 당첨금, 번호 분석. 매주 토요일 자동 업데이트.',
};

function getBallColor(n: number): string {
  if (n <= 10) return '#8B2500';
  if (n <= 20) return '#1A237E';
  if (n <= 30) return '#1B5E20';
  if (n <= 40) return '#C5981A';
  return '#2C1810';
}

export default function LottoBlogIndex() {
  const recent = [...allDraws].reverse().slice(0, 50);

  return (
    <div style={{ background: '#FFFFFF' }}>
      <div className="px-6" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <p className="text-[11px] tracking-[0.4em] mb-8" style={{ color: '#BCBCBC' }}>DHLM STUDIO</p>
          <h1 className="text-[clamp(24px,4vw,36px)] font-bold leading-[1.4]"
            style={{ fontFamily: serif, color: '#1A1A1A' }}>
            로또 당첨번호
          </h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
            전체 {allDraws.length}회차 · 매주 토요일 업데이트
          </p>
        </div>
      </div>

      <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingBottom: '80px' }}>
        <div className="space-y-0">
          {recent.map((draw) => (
            <Link key={draw.round} href={`/blog/lotto/${draw.round}`}
              className="block group" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <div className="flex items-center gap-4 py-4">
                <div className="shrink-0 w-16">
                  <p className="text-sm font-bold" style={{ color: '#C73E3A' }}>{draw.round}회</p>
                  <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{draw.date}</p>
                </div>
                <div className="flex gap-1 flex-wrap flex-1">
                  {draw.numbers.map((n) => (
                    <span key={n} className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: getBallColor(n) }}>{n}</span>
                  ))}
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ background: '#C73E3A' }}>+{draw.bonus}</span>
                </div>
                <p className="text-[12px] shrink-0 hidden sm:block" style={{ color: '#9CA3AF' }}>
                  {draw.prize1 || ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
