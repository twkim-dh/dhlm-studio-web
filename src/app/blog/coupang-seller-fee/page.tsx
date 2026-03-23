import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "쿠팡 판매 수수료 계산 가이드 | DHLM-STUDIO 블로그",
  description:
    "쿠팡 마켓플레이스 판매 수수료 구조와 계산 방법을 알아봅니다. 카테고리별 수수료율, 로켓배송 수수료, 순수익 계산법을 정리합니다.",
  openGraph: {
    title: "쿠팡 판매 수수료 계산 가이드",
    description:
      "쿠팡 판매 수수료 구조와 순수익 계산 방법을 정리합니다.",
    url: "https://dhlm-studio.com/blog/coupang-seller-fee",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function CoupangSellerFeePage() {
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
            쿠팡 판매 수수료 계산 가이드
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            쿠팡 판매 수수료 구조
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            쿠팡에서 상품을 판매할 때는 판매 수수료, 배송비, 기타 서비스
            이용료가 발생합니다. 판매 수수료는 상품 카테고리에 따라 다르며,
            보통 판매가(부가세 포함)의 일정 비율로 책정됩니다. 식품류는 약
            10~13%, 의류/패션은 약 10~15%, 가전/전자제품은 약 5~8%,
            생활용품은 약 10~12% 정도입니다. 카테고리와 세부 품목에 따라
            수수료율이 세분화되어 있으므로, 판매하려는 상품의 정확한 수수료율은
            쿠팡 셀러 센터에서 확인하는 것이 좋습니다. 수수료는 정산 시
            판매 대금에서 자동으로 차감됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            로켓배송과 일반배송 수수료 차이
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            쿠팡의 물류 서비스인 로켓그로스(구 로켓배송 위탁판매)를 이용하면
            쿠팡 물류센터에 상품을 입고시키고, 포장과 배송을 쿠팡이 대행합니다.
            이 경우 물류 서비스 이용료가 추가로 발생합니다. 상품 크기와 무게에
            따라 이용료가 달라지며, 소형 상품 기준 건당 약 2,000~3,000원
            정도입니다. 반면 자체배송(일반배송)의 경우 물류 수수료는 없지만,
            택배비를 직접 부담해야 합니다. 로켓배송 마크가 붙으면 노출과
            전환율이 높아지는 장점이 있어, 수수료와 매출 증가 효과를
            종합적으로 비교해야 합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            순수익 계산 방법
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            쿠팡 판매의 실제 순수익은 판매가에서 상품 원가, 판매 수수료, 배송비,
            포장비, 광고비를 모두 차감해야 합니다. 예를 들어 판매가 30,000원,
            원가 15,000원, 수수료율 10%인 상품의 경우, 수수료 3,000원, 택배비
            3,000원, 포장비 500원을 빼면 순수익은 약 8,500원이 됩니다. 여기서
            광고비(CPC)까지 고려하면 실제 마진은 더 줄어들 수 있습니다.
            마진율을 정확히 파악하지 않고 판매를 시작하면 적자가 날 수 있으므로,
            판매 전에 반드시 수수료 계산을 해보아야 합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            수수료 계산기 활용하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            복잡한 수수료 계산을 쉽게 하려면{" "}
            <a
              href="https://tools.dhlm-studio.com/coupang-fee"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 쿠팡 수수료 계산기
            </a>
            를 활용해보세요. 판매가, 원가, 카테고리를 입력하면 예상 수수료와
            순수익을 바로 계산할 수 있습니다. 여러 가격대로 시뮬레이션하여
            최적의 판매가를 설정하는 데 도움이 됩니다. 쿠팡 외에 스마트스토어,
            11번가 등 다른 마켓플레이스의 수수료와 비교해보는 것도 좋습니다.
            어떤 플랫폼에서 판매하든 수수료 구조를 정확히 이해하는 것이
            수익성 있는 온라인 사업의 첫걸음입니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/coupang-fee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 쿠팡 수수료 계산기
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/vat-calculator-guide"
                className="text-[#31A575] font-medium hover:underline"
              >
                부가세 계산 방법 간단 정리
              </Link>
            </li>
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
                href="/blog/salary-calculator"
                className="text-[#31A575] font-medium hover:underline"
              >
                2026년 연봉 실수령액 계산법
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
