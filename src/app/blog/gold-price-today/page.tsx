import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "오늘 금 시세 확인하는 법 | DHLM-STUDIO 블로그",
  description:
    "금 시세를 실시간으로 확인하는 방법과 금 투자의 기초 지식을 알아봅니다. 국제 금 시세, 국내 금 시세, 금 투자 방법을 정리합니다.",
  openGraph: {
    title: "오늘 금 시세 확인하는 법",
    description:
      "금 시세 확인 방법과 금 투자 기초 지식을 정리합니다.",
    url: "https://dhlm-studio.com/blog/gold-price-today",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function GoldPriceTodayPage() {
  return (
    <article className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10">
          <Link
            href="/blog"
            className="text-sm font-medium text-[#31A575] hover:underline"
          >
            &larr; 블로그로 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            오늘 금 시세 확인하는 법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            금 시세가 중요한 이유
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            금은 수천 년간 가치 저장 수단으로 사용되어 온 대표적인 안전자산
            입니다. 주식 시장이 불안하거나 인플레이션이 심할 때 금 가격은
            오르는 경향이 있어, 포트폴리오 분산 투자에 필수적인 자산으로
            꼽힙니다. 또한 결혼 예물이나 선물용으로 금을 구매하는 경우에도
            시세를 확인하는 것이 중요합니다. 금 시세는 국제 시세와 환율에 따라
            매일 변동하므로, 매수/매도 타이밍을 잡기 위해서는 실시간 시세
            확인이 필수입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            국제 금 시세와 국내 금 시세
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            국제 금 시세는 뉴욕상품거래소(COMEX)에서 결정되며, 트로이온스(oz)
            단위로 미국 달러로 표시됩니다. 1트로이온스는 약 31.1g입니다. 국내
            금 시세는 한국거래소(KRX) 금시장이나 귀금속 매장에서 확인할 수
            있으며, g(그램)이나 돈(3.75g) 단위로 원화 가격으로 표시됩니다.
            국내 금 시세는 국제 시세에 원/달러 환율을 반영한 것이므로, 국제
            금값이 같아도 환율에 따라 국내 가격이 달라질 수 있습니다. KRX 금
            시장에서 거래하면 매매차익에 대해 비과세 혜택이 있어 투자 시
            유리합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            금 투자 방법 4가지
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            첫째, 실물 금(골드바, 금화)을 직접 구매하는 방법입니다. 한국조폐공사
            쇼핑몰이나 은행에서 구입할 수 있으나, 부가세 10%가 붙는 단점이
            있습니다. 둘째, KRX 금시장에서 금 통장처럼 거래하는 방법으로, 1g
            단위로 매매가 가능하고 부가세가 없습니다. 셋째, 금 ETF에 투자하는
            방법으로, 주식처럼 편리하게 거래할 수 있습니다. 넷째, 금 펀드에
            가입하는 방법으로, 전문가가 운용하므로 초보 투자자에게 적합합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            금 시세 확인 도구
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            오늘의 금 시세를 빠르게 확인하려면{" "}
            <a
              href="https://tools.dhlm-studio.com/gold"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 금 시세 확인
            </a>
            을 활용해보세요. 국제 금 시세와 국내 환산 가격을 한눈에 확인할 수
            있으며, 최근 추이 그래프도 함께 제공됩니다. 금 매수/매도를 고려
            중이라면 시세 알림 기능을 활용하여 원하는 가격에 도달했을 때
            알림을 받아보실 수도 있습니다. 금 투자는 장기적 관점에서 접근하는
            것이 좋으며, 전체 자산의 5~10% 정도를 배분하는 것이 일반적인
            권장 비율입니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/gold"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 금 시세 확인
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/online-tools-free"
                className="text-[#31A575] font-medium hover:underline"
              >
                무료 온라인 계산기 모음 80개
              </Link>
            </li>
            <li>
              <Link
                href="/blog/loan-interest"
                className="text-[#31A575] font-medium hover:underline"
              >
                대출 이자 계산하는 법 완벽 정리
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <Link
            href="/blog"
            className="text-sm font-medium text-[#31A575] hover:underline"
          >
            &larr; 블로그로 돌아가기
          </Link>
        </div>
      </div>
    </article>
  );
}
