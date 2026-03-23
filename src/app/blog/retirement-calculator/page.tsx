import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "퇴직금 계산 방법 이것만 알면 OK | DHLM-STUDIO 블로그",
  description:
    "퇴직금 계산 방법을 쉽게 알아봅니다. 근속 기간, 평균임금 산정, 퇴직금 계산 공식까지 이것만 읽으면 내 퇴직금을 정확히 계산할 수 있습니다.",
  openGraph: {
    title: "퇴직금 계산 방법 이것만 알면 OK",
    description:
      "퇴직금 계산 공식과 평균임금 산정 방법을 쉽게 설명합니다.",
    url: "https://dhlm-studio.com/blog/retirement-calculator",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function RetirementCalculatorPage() {
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
            퇴직금 계산 방법 이것만 알면 OK
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            퇴직금이란 무엇인가
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            퇴직금은 1년 이상 근무한 근로자가 퇴직할 때 받는 금액입니다.
            근로기준법에 따라 사용자는 계속근로기간 1년에 대해 30일분 이상의
            평균임금을 퇴직금으로 지급해야 합니다. 정규직뿐 아니라 계약직,
            아르바이트도 1년 이상 근무하고 주 15시간 이상 일했다면 퇴직금을
            받을 수 있습니다. 퇴직금은 퇴직 후 14일 이내에 지급되어야 하며,
            이를 위반할 경우 지연이자가 발생합니다. 퇴직연금제도(DB형, DC형)를
            운영하는 회사의 경우에는 퇴직금 산정 방식이 다를 수 있으므로 회사의
            퇴직연금 유형을 먼저 확인하는 것이 좋습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            퇴직금 계산 공식
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            퇴직금의 기본 공식은 다음과 같습니다. 퇴직금 = 1일 평균임금 x 30일
            x (총 근속일수 / 365일). 여기서 핵심은 &lsquo;평균임금&rsquo;의
            산정입니다. 평균임금은 퇴직 전 3개월간 지급된 임금 총액을 그 기간의
            총 일수로 나눈 금액입니다. 임금 총액에는 기본급, 고정 수당, 연장근로
            수당 등이 포함되며, 상여금은 매월 균등 분할하여 포함합니다. 예를 들어
            월 급여 300만 원에 분기 상여금 100만 원을 받는 경우, 3개월 임금
            총액은 300만 x 3 + 100만 / 3 x 3 = 1,000만 원이 되고, 1일
            평균임금은 약 109,890원이 됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            퇴직금에 포함되는 항목
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            퇴직금 산정 시 어떤 항목이 포함되는지가 중요합니다. 기본급, 직책수당,
            자격수당 등 매월 고정적으로 지급되는 금액은 모두 포함됩니다.
            연장근로수당, 야간근로수당, 휴일근로수당도 포함됩니다. 상여금은
            지급 규정에 의해 정기적으로 지급되는 경우 포함됩니다. 반면 경조사비,
            체력단련비 같은 복리후생적 금품이나 출장비 등 실비변상적 금품은
            제외됩니다. 식대의 경우 전 직원에게 일률적으로 지급되면 포함되지만,
            실비 정산 방식이면 제외될 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            퇴직금 계산기 활용하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            복잡한 계산이 번거로우시다면{" "}
            <a
              href="https://tools.dhlm-studio.com/severance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 퇴직금 계산기
            </a>
            를 활용해보세요. 입사일, 퇴사일, 월 급여, 상여금 등 기본 정보만
            입력하면 예상 퇴직금을 바로 확인할 수 있습니다. 퇴직 전에 미리
            계산해보면 향후 자금 계획을 세우는 데 큰 도움이 됩니다. 퇴직금은
            퇴직소득세가 별도로 부과되므로, 세후 실수령액도 함께 확인하시기
            바랍니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/severance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 퇴직금 계산기
              </a>
            </li>
            <li>
              <a
                href="https://tools.dhlm-studio.com/salary"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 연봉 실수령액 계산기
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
                href="/blog/severance-pay-guide"
                className="text-[#31A575] font-medium hover:underline"
              >
                퇴직금 계산기 사용법과 주의사항
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
