import type { Metadata } from 'next';
import Link from 'next/link';
import { allDraws } from '@/data/lotto/recent-draws';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

// Historical records
const records = {
  highestPrize: { round: 1079, amount: '407억 5,045만원', winners: 1, date: '2023-07-15' },
  mostWinners: { round: 866, count: 17, amount: '13억원', date: '2019-06-15' },
  worldRecords: [
    { name: 'US Powerball', amount: '$2.04 Billion', date: '2022-11', country: '🇺🇸' },
    { name: 'US Mega Millions', amount: '$1.58 Billion', date: '2023-08', country: '🇺🇸' },
    { name: 'EuroMillions', amount: '€230 Million', date: '2022-07', country: '🇪🇺' },
    { name: 'EuroJackpot', amount: '€120 Million', date: '2022-01', country: '🇪🇺' },
    { name: 'Korea Lotto', amount: '407억원 ($31M)', date: '2023-07', country: '🇰🇷' },
  ],
};

function getBallColor(n: number): string {
  if (n <= 10) return '#8B2500';
  if (n <= 20) return '#1A237E';
  if (n <= 30) return '#1B5E20';
  if (n <= 40) return '#C5981A';
  return '#2C1810';
}

function Ball({ n, bonus = false }: { n: number; bonus?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1">
      {bonus && <span className="text-[#9CA3AF] font-bold text-xs">+</span>}
      <div className="rounded-full flex items-center justify-center font-bold text-white"
        style={{ width: 44, height: 44, background: bonus ? '#C73E3A' : getBallColor(n), boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>
        {n}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  // Generate for last 20 rounds
  const latest = allDraws[allDraws.length - 1]?.round || 1150;
  return Array.from({ length: 20 }, (_, i) => ({ round: String(latest - i) }));
}

export async function generateMetadata({ params }: { params: Promise<{ round: string }> }): Promise<Metadata> {
  const { round } = await params;
  const r = Number(round);
  const draw = allDraws.find(d => d.round === r);
  const nums = draw ? draw.numbers.join(', ') : '';
  return {
    title: `제${round}회 로또 당첨번호 — ${nums}`,
    description: `제${round}회 로또 6/45 당첨번호와 당첨금 정보. 1등~5등 당첨금, 번호 분석, 역대 기록 비교.`,
    openGraph: {
      title: `제${round}회 로또 당첨번호 | DHLM Studio`,
      description: `제${round}회 로또 당첨번호: ${nums}. 당첨금 및 번호 분석.`,
    },
    alternates: { canonical: `https://dhlm-studio.com/blog/lotto/${round}` },
  };
}

export default async function LottoRoundPage({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params;
  const r = Number(round);
  const draw = allDraws.find(d => d.round === r);

  if (!draw) {
    return (
      <div style={{ background: '#FFFFFF' }}>
        <div className="mx-auto px-6 py-20 text-center" style={{ maxWidth: '720px' }}>
          <p className="text-lg" style={{ color: '#1A1A1A' }}>제{round}회 당첨번호를 찾을 수 없습니다.</p>
          <Link href="/blog/lotto" className="text-sm mt-4 inline-block" style={{ color: '#C73E3A' }}>← 전체 회차 보기</Link>
        </div>
      </div>
    );
  }

  // Analysis
  const oddCount = draw.numbers.filter(n => n % 2 === 1).length;
  const evenCount = 6 - oddCount;
  const ranges = [
    { label: '1~10', count: draw.numbers.filter(n => n <= 10).length },
    { label: '11~20', count: draw.numbers.filter(n => n > 10 && n <= 20).length },
    { label: '21~30', count: draw.numbers.filter(n => n > 20 && n <= 30).length },
    { label: '31~40', count: draw.numbers.filter(n => n > 30 && n <= 40).length },
    { label: '41~45', count: draw.numbers.filter(n => n > 40).length },
  ];
  const sum = draw.numbers.reduce((a, b) => a + b, 0);

  // Consecutive check
  const sorted = [...draw.numbers].sort((a, b) => a - b);
  const consecutives: string[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] === 1) consecutives.push(`${sorted[i]}-${sorted[i + 1]}`);
  }

  // Previous/Next rounds
  const prevRound = allDraws.find(d => d.round === r - 1);
  const nextRound = allDraws.find(d => d.round === r + 1);

  return (
    <div style={{ background: '#FFFFFF' }}>
      <article className="mx-auto px-6" style={{ maxWidth: '720px', paddingTop: '60px', paddingBottom: '80px' }}>
        {/* Header */}
        <p className="text-[11px] tracking-[0.4em] mb-6" style={{ color: '#BCBCBC' }}>LOTTO RESULTS</p>

        <h1 className="text-[clamp(24px,4vw,36px)] font-bold leading-[1.4]"
          style={{ fontFamily: serif, color: '#1A1A1A' }}>
          제{draw.round}회 로또 당첨번호
        </h1>
        <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>{draw.date} 추첨</p>

        <div className="mt-6 mb-8" style={{ width: '32px', height: '1px', background: '#E5E7EB' }} />

        {/* Numbers */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {draw.numbers.map((n) => <Ball key={n} n={n} />)}
          <Ball n={draw.bonus} bonus />
        </div>
        <p className="text-[12px] mb-8" style={{ color: '#9CA3AF' }}>
          당첨번호: {draw.numbers.join(', ')} + 보너스 {draw.bonus}
        </p>

        {/* Prize Info */}
        <div className="border p-5 mb-8" style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
          <p className="text-[12px] tracking-[0.1em] mb-4" style={{ color: '#9CA3AF' }}>PRIZE INFORMATION</p>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              <div>
                <span className="text-sm font-bold" style={{ color: '#C73E3A' }}>1등</span>
                <span className="text-[12px] ml-2" style={{ color: '#9CA3AF' }}>6개 번호 일치</span>
              </div>
              <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{draw.prize1 || '정보 없음'}</p>
            </div>
            <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              <div>
                <span className="text-sm font-bold" style={{ color: '#1A1A1A' }}>2등</span>
                <span className="text-[12px] ml-2" style={{ color: '#9CA3AF' }}>5개 + 보너스</span>
              </div>
              <p className="text-[13px]" style={{ color: '#6B7280' }}>—</p>
            </div>
            <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              <div>
                <span className="text-sm font-bold" style={{ color: '#1A1A1A' }}>3등</span>
                <span className="text-[12px] ml-2" style={{ color: '#9CA3AF' }}>5개 일치</span>
              </div>
              <p className="text-[13px]" style={{ color: '#6B7280' }}>—</p>
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="border p-5 mb-8" style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
          <p className="text-[12px] tracking-[0.1em] mb-4" style={{ color: '#9CA3AF' }}>NUMBER ANALYSIS</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px]" style={{ color: '#9CA3AF' }}>홀짝 비율</p>
              <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>홀수 {oddCount} : 짝수 {evenCount}</p>
            </div>
            <div>
              <p className="text-[12px]" style={{ color: '#9CA3AF' }}>번호 합계</p>
              <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{sum}</p>
            </div>
            <div>
              <p className="text-[12px]" style={{ color: '#9CA3AF' }}>연속번호</p>
              <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{consecutives.length > 0 ? consecutives.join(', ') : '없음'}</p>
            </div>
            <div>
              <p className="text-[12px]" style={{ color: '#9CA3AF' }}>구간별</p>
              <p className="text-[12px]" style={{ color: '#6B7280' }}>
                {ranges.map(r => `${r.label}(${r.count})`).join(' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Prize Records */}
        <div className="border p-5 mb-8" style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
          <p className="text-[12px] tracking-[0.1em] mb-4" style={{ color: '#9CA3AF' }}>PRIZE RECORDS</p>

          <div className="space-y-3 mb-6">
            <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              <p className="text-[12px]" style={{ color: '#9CA3AF' }}>역대 최고 당첨금 (한국)</p>
              <p className="text-sm font-bold" style={{ color: '#C73E3A' }}>{records.highestPrize.amount}</p>
              <p className="text-[12px]" style={{ color: '#9CA3AF' }}>제{records.highestPrize.round}회 · {records.highestPrize.date} · {records.highestPrize.winners}명</p>
            </div>
            <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              <p className="text-[12px]" style={{ color: '#9CA3AF' }}>역대 최다 1등 당첨자</p>
              <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{records.mostWinners.count}명 (각 {records.mostWinners.amount})</p>
              <p className="text-[12px]" style={{ color: '#9CA3AF' }}>제{records.mostWinners.round}회 · {records.mostWinners.date}</p>
            </div>
          </div>

          <p className="text-[12px] tracking-[0.1em] mb-3" style={{ color: '#9CA3AF' }}>WORLD LOTTERY JACKPOT RECORDS</p>
          <div className="space-y-2">
            {records.worldRecords.map((wr) => (
              <div key={wr.name} className="flex items-center justify-between" style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{wr.country}</span>
                  <p className="text-[13px]" style={{ color: '#1A1A1A' }}>{wr.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold" style={{ color: '#1A1A1A' }}>{wr.amount}</p>
                  <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{wr.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate numbers CTA */}
        <div className="border p-5 mb-8 text-center" style={{ borderColor: '#E5E7EB', borderRadius: '4px', background: '#FAFAFA' }}>
          <p className="text-sm font-medium mb-3" style={{ color: '#1A1A1A' }}>다음 회차 행운의 번호를 뽑아보세요</p>
          <Link href="/lotto"
            className="inline-flex px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: '#C73E3A', borderRadius: '4px' }}>
            🍀 번호 생성하기 →
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>
          {prevRound ? (
            <Link href={`/blog/lotto/${prevRound.round}`} className="text-[13px] transition-colors hover:text-[#C73E3A]" style={{ color: '#9CA3AF' }}>
              ← 제{prevRound.round}회
            </Link>
          ) : <span />}
          <Link href="/blog/lotto" className="text-[13px] transition-colors hover:text-[#C73E3A]" style={{ color: '#9CA3AF' }}>
            전체 회차
          </Link>
          {nextRound ? (
            <Link href={`/blog/lotto/${nextRound.round}`} className="text-[13px] transition-colors hover:text-[#C73E3A]" style={{ color: '#9CA3AF' }}>
              제{nextRound.round}회 →
            </Link>
          ) : <span />}
        </div>
      </article>
    </div>
  );
}
