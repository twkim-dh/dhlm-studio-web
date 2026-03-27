import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "블로그 | DHLM-STUDIO",
  description:
    "DHLM-STUDIO 블로그 - 로또 번호 생성, 연봉 계산기, 무료 온라인 도구, 커플 테스트 등 일상에 유용한 정보와 팁을 나눕니다.",
  openGraph: {
    title: "블로그 | DHLM-STUDIO",
    description:
      "일상에 유용한 정보와 무료 온라인 도구 활용법을 나눕니다.",
    url: "https://dhlm-studio.com/blog",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "website",
  },
};

const posts = [
  {
    slug: "coupang-seller-fee",
    title: "쿠팡 판매 수수료 계산 가이드",
    excerpt:
      "쿠팡 마켓플레이스 판매 수수료 구조와 순수익 계산 방법을 카테고리별로 정리합니다.",
    date: "2026-03-23",
  },
  {
    slug: "electricity-calculator",
    title: "전기요금 계산기 누진제 완벽 정리",
    excerpt:
      "전기요금 누진제 구간과 계산 방법을 완벽하게 정리합니다. 월별 예상 요금을 미리 확인해보세요.",
    date: "2026-03-23",
  },
  {
    slug: "typing-speed-test",
    title: "타자 속도 테스트 온라인 무료",
    excerpt:
      "온라인 무료 타자 속도 테스트로 자신의 타이핑 속도를 측정하고, 속도 향상 팁을 알아봅니다.",
    date: "2026-03-23",
  },
  {
    slug: "password-generator",
    title: "안전한 비밀번호 만드는 법",
    excerpt:
      "강력한 비밀번호의 조건과 무료 비밀번호 생성기를 활용한 안전한 비밀번호 관리법을 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "json-formatter-online",
    title: "JSON 포맷터 온라인 무료 사용법",
    excerpt:
      "JSON 데이터를 보기 좋게 정리하는 온라인 포맷터 사용법과 개발 활용 팁을 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "youtube-thumbnail-download",
    title: "유튜브 썸네일 다운로드 방법",
    excerpt:
      "유튜브 영상의 썸네일 이미지를 고화질로 다운로드하는 방법과 무료 도구를 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "image-compress-free",
    title: "이미지 용량 줄이기 무료 방법",
    excerpt:
      "화질 손실 없이 이미지 파일 용량을 줄이는 무료 방법과 온라인 압축 도구를 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "qr-code-free",
    title: "무료 QR코드 생성기 사용법",
    excerpt:
      "무료 QR코드 생성기로 URL, 텍스트, 명함 등의 QR코드를 만드는 방법과 활용 사례를 알아봅니다.",
    date: "2026-03-23",
  },
  {
    slug: "unit-converter-guide",
    title: "단위 변환기 - 길이 무게 면적 한번에",
    excerpt:
      "길이, 무게, 면적, 온도 등 다양한 단위를 한번에 변환하는 방법과 자주 쓰는 변환 공식을 정리합니다.",
    date: "2026-03-23",
  },
  {
    slug: "gold-price-today",
    title: "오늘 금 시세 확인하는 법",
    excerpt:
      "금 시세를 실시간으로 확인하는 방법과 금 투자의 기초 지식, 투자 방법 4가지를 정리합니다.",
    date: "2026-03-23",
  },
  {
    slug: "severance-pay-guide",
    title: "퇴직금 계산기 사용법과 주의사항",
    excerpt:
      "퇴직금 계산기를 올바르게 사용하는 방법과 퇴직금 산정 시 자주 하는 실수를 알아봅니다.",
    date: "2026-03-23",
  },
  {
    slug: "vat-calculator-guide",
    title: "부가세 계산 방법 간단 정리",
    excerpt:
      "부가가치세(VAT) 계산 공식과 부가세 포함/별도 금액 환산법을 간단하게 정리합니다.",
    date: "2026-03-23",
  },
  {
    slug: "online-tools-free",
    title: "무료 온라인 계산기 모음 80개",
    excerpt:
      "연봉, BMI, 대출, 부가세, 퇴직금 등 무료로 사용할 수 있는 온라인 계산기 80종을 한눈에 정리합니다.",
    date: "2026-03-23",
  },
  {
    slug: "couple-compatibility",
    title: "커플 궁합 테스트 추천 TOP 5",
    excerpt:
      "연인과 함께하면 재미있는 커플 궁합 테스트 TOP 5를 소개합니다. 취향 싱크로율 테스트부터 가치관 테스트까지.",
    date: "2026-03-23",
  },
  {
    slug: "menu-decision",
    title: "오늘 저녁 뭐 먹지? 고민 해결법",
    excerpt:
      "매일 반복되는 저녁 메뉴 고민을 해결하는 실용적인 4가지 방법과 함께 고르기 서비스를 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "friend-quiz",
    title: "친구가 나를 얼마나 아는지 테스트",
    excerpt:
      "친구가 나를 얼마나 잘 아는지 확인하는 테스트 만드는 법과 재미있는 퀴즈 작성 팁을 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "party-games",
    title: "모임 필수 게임 사다리타기 룰렛 가이드",
    excerpt:
      "모임에서 활용할 수 있는 사다리타기, 룰렛 돌리기 게임 가이드와 온라인 무료 도구를 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "bmi-guide",
    title: "BMI 계산기로 내 체형 확인하기",
    excerpt:
      "BMI(체질량지수) 계산 방법과 한국인 기준 체형 분류, 건강한 체중 관리 팁을 알아봅니다.",
    date: "2026-03-23",
  },
  {
    slug: "loan-interest",
    title: "대출 이자 계산하는 법 완벽 정리",
    excerpt:
      "원리금균등상환, 원금균등상환, 만기일시상환의 차이와 각각의 이자 계산법을 완벽하게 정리합니다.",
    date: "2026-03-23",
  },
  {
    slug: "retirement-calculator",
    title: "퇴직금 계산 방법 이것만 알면 OK",
    excerpt:
      "퇴직금 계산 공식, 평균임금 산정 방법, 포함 항목까지 이것만 읽으면 내 퇴직금을 정확히 계산할 수 있습니다.",
    date: "2026-03-23",
  },
  {
    slug: "salary-calculator",
    title: "2026년 연봉 실수령액 계산법",
    excerpt:
      "2026년 기준 연봉에서 4대 보험과 세금을 공제한 실수령액을 계산하는 방법을 상세히 설명합니다.",
    date: "2026-03-23",
  },
  {
    slug: "lotto-winning-tips",
    title: "로또 당첨 확률 높이는 5가지 방법",
    excerpt:
      "로또 당첨 확률을 조금이라도 높이는 현실적인 5가지 전략과 번호 조합 팁을 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "lotto-statistics",
    title: "로또 당첨 번호 통계 분석 방법",
    excerpt:
      "로또 당첨 번호의 출현 빈도, 번호 합계, 구간 분포 등 실전 통계 분석 방법을 알아봅니다.",
    date: "2026-03-23",
  },
  {
    slug: "lotto-dream-number",
    title: "꿈 해몽 로또 번호 의미 총정리",
    excerpt:
      "돼지꿈, 뱀꿈, 물고기꿈 등 대표적인 꿈 해몽과 관련 로또 번호를 총정리합니다.",
    date: "2026-03-23",
  },
  {
    slug: "lotto-number-generator",
    title: "무료 로또 번호 생성기 추천 - 2026년",
    excerpt:
      "2026년 최신 무료 로또 번호 생성기 추천과 사용 방법, 번호 선택 전략을 소개합니다.",
    date: "2026-03-23",
  },
  {
    slug: "how-to-choose-menu",
    title: "매일 저녁 메뉴 고르기가 힘든 이유와 해결법",
    excerpt:
      "결정 피로란 무엇인지, 커플과 가족 사이 메뉴 갈등의 원인은 무엇인지, 그리고 함께 고르기 도구를 활용해 저녁 메뉴 스트레스를 줄이는 방법을 알아봅니다.",
    date: "2026-03-21",
  },
  {
    slug: "couple-compatibility-test",
    title: "연인 취향 테스트로 알아보는 우리의 궁합",
    excerpt:
      "취향 싱크로율이 관계에서 왜 중요한지, 똑(Ttok) 서비스를 통해 연인과의 궁합을 재밌게 확인하는 방법을 소개합니다.",
    date: "2026-03-21",
  },
  {
    slug: "food-matching-guide",
    title: "음식 취향으로 보는 성격 유형 가이드",
    excerpt:
      "짜장면 vs 짬뽕 논쟁부터 매운 음식 선호도까지, 음식 취향에 숨겨진 성격 유형을 분석해봅니다.",
    date: "2026-03-21",
  },
  {
    slug: "balance-game-ideas",
    title: "친구와 함께하면 재밌는 밸런스 게임 모음",
    excerpt:
      "MZ세대에서 유행하는 밸런스 게임 주제 10가지와 활용 팁을 소개합니다. 모임에서 바로 써먹을 수 있는 아이디어 모음입니다.",
    date: "2026-03-21",
  },
  {
    slug: "daily-decision-tips",
    title: "일상 속 작은 결정을 쉽게 만드는 5가지 방법",
    excerpt:
      "결정 피로를 줄이고 일상의 선택을 가볍게 만드는 실용적인 팁 5가지를 소개합니다.",
    date: "2026-03-21",
  },
];

export default function BlogPage() {
  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* Hero */}
      <div className="px-6" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <p className="text-[11px] tracking-[0.4em] mb-8" style={{ color: '#BCBCBC' }}>DHLM STUDIO</p>
          <h1 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.4]"
            style={{ fontFamily: "var(--font-noto-serif-kr), serif", color: '#1A1A1A' }}>
            블로그
          </h1>
          <p className="text-sm mt-3" style={{ color: '#6B7280' }}>
            로또 당첨번호, 도구 활용법, 생활 정보
          </p>
        </div>
      </div>

      <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingBottom: '80px' }}>
        {/* Lotto Results Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[11px] tracking-[0.25em]" style={{ color: '#BCBCBC' }}>LOTTO RESULTS</p>
            <Link href="/blog/lotto" className="text-[13px] transition-colors hover:text-[#C73E3A]" style={{ color: '#9CA3AF' }}>
              전체 회차 →
            </Link>
          </div>
          <Link href="/blog/lotto"
            className="block border p-6 transition-colors hover:border-[#C73E3A] group"
            style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
            <p className="text-lg font-bold group-hover:text-[#C73E3A] transition-colors"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif", color: '#1A1A1A' }}>
              🎱 로또 당첨번호 조회
            </p>
            <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
              매주 토요일 업데이트 · 역대 당첨번호 · 번호 분석 · 당첨금 기록
            </p>
          </Link>
        </div>

        {/* Tools & Life Section */}
        <div>
          <p className="text-[11px] tracking-[0.25em] mb-6" style={{ color: '#BCBCBC' }}>TOOLS & LIFE</p>
          <div className="space-y-0">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="block group" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ padding: '20px 0' }}>
                  <div className="flex items-center gap-3 mb-1">
                    <time className="text-[11px]" style={{ color: '#9CA3AF' }}>{post.date}</time>
                  </div>
                  <p className="text-[15px] font-medium transition-colors group-hover:text-[#C73E3A]"
                    style={{ fontFamily: "var(--font-noto-serif-kr), serif", color: '#1A1A1A' }}>
                    {post.title}
                  </p>
                  <p className="text-[13px] mt-1" style={{ color: '#6B7280' }}>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
