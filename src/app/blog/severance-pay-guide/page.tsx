import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "퇴직금 계산기 사용법과 주의사항 | DHLM-STUDIO 블로그",
  description:
    "퇴직금 계산기를 올바르게 사용하는 방법과 주의사항을 알아봅니다. 퇴직금 산정 시 자주 하는 실수와 정확한 계산을 위한 팁을 소개합니다.",
  openGraph: {
    title: "퇴직금 계산기 사용법과 주의사항",
    description:
      "퇴직금 계산기 사용법과 흔한 실수를 알아봅니다.",
    url: "https://dhlm-studio.com/blog/severance-pay-guide",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function SeverancePayGuidePage() {
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
            퇴직금 계산기 사용법과 주의사항
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            퇴직금 계산기 제대로 사용하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            퇴직금 계산기를 사용할 때 가장 중요한 것은 정확한 정보를 입력하는
            것입니다. 입사일과 퇴사일은 근로계약서에 기재된 날짜를 기준으로
            합니다. 수습 기간도 근속 기간에 포함되므로 빠뜨리지 마세요. 월
            기본급은 세전 금액을 입력해야 하며, 매월 고정적으로 받는 수당도
            포함시켜야 합니다. 상여금은 최근 1년간 받은 총액을 12로 나눠
            월할 환산하여 입력합니다. 이런 기본 정보만 정확히 입력하면
            계산기가 자동으로 평균임금과 예상 퇴직금을 산출해줍니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            퇴직금 계산 시 자주 하는 실수
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            가장 흔한 실수는 평균임금에 포함되어야 할 항목을 빠뜨리는
            것입니다. 직책수당, 자격수당, 기술수당 등 매월 고정 지급되는
            수당은 모두 포함되어야 합니다. 연장근로수당이나 야간근로수당도
            정기적으로 발생했다면 포함됩니다. 또 다른 실수는 퇴사일을
            잘못 입력하는 것입니다. 퇴직금 산정에서 퇴사일은 마지막 근무일의
            다음 날입니다. 예를 들어 3월 31일까지 근무했다면 퇴사일은 4월
            1일입니다. 이 차이로 평균임금 산정 기간이 달라질 수 있으니
            주의해야 합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            퇴직연금과 퇴직금의 차이
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            2012년부터 법정퇴직금 제도는 퇴직연금으로 전환이 권장되고
            있습니다. DB형(확정급여형)은 회사가 운용하며 퇴직 시 근속연수에
            따라 정해진 금액을 지급합니다. DC형(확정기여형)은 회사가 매년
            연봉의 1/12 이상을 근로자 개인 계좌에 적립하고, 근로자가 직접
            운용합니다. DC형의 경우 운용 수익에 따라 퇴직금이 달라질 수
            있습니다. IRP(개인형퇴직연금)로 이전하면 세액공제 혜택도 받을 수
            있으니 참고하세요.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            퇴직금 세금과 실수령액
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            퇴직금에도 퇴직소득세가 부과됩니다. 퇴직소득세는 근속연수가 길수록
            공제액이 커져 세 부담이 줄어드는 구조입니다. 퇴직금을 일시에
            수령하면 퇴직소득세를 납부하고, IRP 계좌로 이체하면 과세가
            이연됩니다. 퇴직 시점에 세후 실수령액을 정확히 파악하려면
            퇴직소득세까지 반영한 계산이 필요합니다. 정확한 계산은 DHLM 퇴직금
            계산기를 활용하면 편리합니다.
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
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/retirement-calculator"
                className="text-[#31A575] font-medium hover:underline"
              >
                퇴직금 계산 방법 이것만 알면 OK
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
