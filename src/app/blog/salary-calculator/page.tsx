import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026년 연봉 실수령액 계산법 | DHLM-STUDIO 블로그",
  description:
    "2026년 기준 연봉 실수령액을 계산하는 방법을 알아봅니다. 4대 보험료, 소득세, 지방소득세 공제 항목별 계산법을 상세히 설명합니다.",
  openGraph: {
    title: "2026년 연봉 실수령액 계산법",
    description:
      "2026년 기준 연봉에서 실제 받는 월급을 계산하는 방법을 설명합니다.",
    url: "https://dhlm-studio.com/blog/salary-calculator",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function SalaryCalculatorPage() {
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
            2026년 연봉 실수령액 계산법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            연봉과 실수령액의 차이
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            취업이나 이직 시 가장 먼저 확인하는 것이 연봉입니다. 하지만
            실제로 통장에 들어오는 금액은 연봉과 상당한 차이가 있습니다. 연봉에서
            국민연금, 건강보험, 장기요양보험, 고용보험 등 4대 보험료와 소득세,
            지방소득세가 공제되기 때문입니다. 2026년 기준으로 연봉 3,000만 원이면
            월 실수령액은 약 220만 원, 연봉 5,000만 원이면 약 345만 원, 연봉
            7,000만 원이면 약 465만 원 정도입니다. 연봉이 높아질수록 소득세
            구간이 올라가기 때문에 공제 비율이 커지는 점도 알아두어야 합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            4대 보험료 계산 방법
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            4대 보험료는 월 급여를 기준으로 계산됩니다. 2026년 기준 국민연금은
            월 급여의 4.5%(회사 4.5% 별도), 건강보험은 약 3.545%, 장기요양보험은
            건강보험의 12.95%, 고용보험은 약 0.9%입니다. 예를 들어 월 급여
            300만 원이라면, 국민연금 약 135,000원, 건강보험 약 106,350원,
            장기요양보험 약 13,772원, 고용보험 약 27,000원으로 총 약 282,122원이
            4대 보험료로 공제됩니다. 이 금액은 매년 요율이 변경되므로 최신
            정보를 확인하는 것이 중요합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            소득세와 지방소득세
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            소득세는 누진세 구조로, 과세표준 구간에 따라 세율이 달라집니다.
            1,400만 원 이하는 6%, 1,400만~5,000만 원은 15%, 5,000만~8,800만 원은
            24%가 적용됩니다. 지방소득세는 소득세의 10%입니다. 부양가족 수에 따라
            공제 금액이 달라지므로, 정확한 실수령액을 알기 위해서는 개인 상황을
            반영한 계산이 필요합니다. 복잡한 계산이 어려우시다면{" "}
            <a
              href="https://tools.dhlm-studio.com/salary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 연봉 계산기
            </a>
            를 활용하면 연봉만 입력해도 실수령액을 바로 확인할 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            연봉 협상 시 알아둘 점
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            연봉 협상 시에는 반드시 실수령액 기준으로 비교해야 합니다. 연봉
            500만 원 인상이 실수령액으로는 월 30만 원 정도의 차이밖에 나지 않을
            수 있기 때문입니다. 또한 비과세 항목(식대 20만 원, 교통비 등)이
            포함된 경우에는 같은 연봉이라도 실수령액이 달라질 수 있습니다.
            이직이나 연봉 협상 전에 미리 실수령액을 계산해보고, 현재 급여와
            비교하는 습관을 들이면 더 현명한 결정을 내릴 수 있습니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            관련 서비스
          </h3>
          <ul className="space-y-3">
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
            <li>
              <a
                href="https://tools.dhlm-studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 무료 온라인 계산기 모음
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
                href="/blog/vat-calculator-guide"
                className="text-[#31A575] font-medium hover:underline"
              >
                부가세 계산 방법 간단 정리
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
