import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "부가세 계산 방법 간단 정리 | DHLM-STUDIO 블로그",
  description:
    "부가가치세(VAT) 계산 방법을 간단하게 정리합니다. 공급가액에서 부가세를 구하는 법, 부가세 포함/별도 금액 환산법을 알아봅니다.",
  openGraph: {
    title: "부가세 계산 방법 간단 정리",
    description:
      "부가가치세 계산 방법을 간단하고 정확하게 정리합니다.",
    url: "https://dhlm-studio.com/blog/vat-calculator-guide",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function VatCalculatorGuidePage() {
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
            부가세 계산 방법 간단 정리
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            부가가치세란 무엇인가
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            부가가치세(VAT, Value Added Tax)는 상품이나 서비스의 거래 과정에서
            발생하는 부가가치에 대해 부과되는 세금입니다. 한국에서는 세율 10%가
            적용되며, 거의 모든 재화와 용역에 부과됩니다. 소비자가 최종적으로
            부담하지만, 실제 납부는 사업자가 대행합니다. 사업자는 매출세액에서
            매입세액을 뺀 금액을 세무서에 납부합니다. 자영업자, 프리랜서,
            법인 사업자 모두 부가세 계산은 필수적인 업무입니다. 특히 세금계산서
            발행 시 공급가액과 부가세를 정확히 기재해야 하므로, 계산 방법을
            정확히 알아두는 것이 중요합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            부가세 계산 공식
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            부가세 계산의 기본 공식은 매우 간단합니다. 공급가액(부가세 별도
            금액)을 알고 있을 때, 부가세 = 공급가액 x 10%입니다. 예를 들어
            공급가액이 100만 원이면 부가세는 10만 원, 합계(부가세 포함가)는
            110만 원이 됩니다. 반대로 부가세 포함 금액에서 공급가액을 구하려면,
            공급가액 = 부가세 포함가 / 1.1로 계산합니다. 110만 원의 공급가액은
            100만 원, 부가세는 10만 원이 되는 것이죠. 이 두 가지 방향의 계산을
            확실히 익혀두면 견적서, 세금계산서 작성 시 헷갈리지 않습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            부가세 신고와 납부
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            일반과세자는 1년에 2회(1월, 7월) 부가세를 확정 신고합니다. 4월과
            10월에는 예정 신고가 있어 분기별로 세금을 정산합니다. 간이과세자는
            1월에 1회 신고합니다. 매출세액에서 매입세액을 차감한 금액이
            납부세액이며, 매입세액이 더 크면 환급받을 수 있습니다. 사업 초기에
            설비 투자가 많은 경우 환급 사례가 자주 발생합니다. 정확한 매입/매출
            장부 관리가 부가세 절세의 핵심입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            부가세 계산기 활용하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            매번 계산기를 두드리거나 엑셀을 열지 않아도{" "}
            <a
              href="https://tools.dhlm-studio.com/vat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 부가세 계산기
            </a>
            를 사용하면 금액만 입력해서 바로 공급가액, 부가세, 합계를 확인할 수
            있습니다. 부가세 포함 금액을 입력해도, 별도 금액을 입력해도 양방향
            계산이 가능합니다. 사업자가 아니더라도 물건 가격에서 세금 비중을
            확인하고 싶을 때 유용하게 활용할 수 있습니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/vat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 부가세 계산기
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/salary-calculator"
                className="text-[#31A575] font-medium hover:underline"
              >
                2026년 연봉 실수령액 계산법
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
                href="/blog/coupang-seller-fee"
                className="text-[#31A575] font-medium hover:underline"
              >
                쿠팡 판매 수수료 계산 가이드
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
