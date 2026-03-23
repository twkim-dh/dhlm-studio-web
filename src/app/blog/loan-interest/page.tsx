import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "대출 이자 계산하는 법 완벽 정리 | DHLM-STUDIO 블로그",
  description:
    "대출 이자 계산 방법을 완벽하게 정리합니다. 원리금균등상환, 원금균등상환, 만기일시상환의 차이와 각각의 이자 계산법을 알아봅니다.",
  openGraph: {
    title: "대출 이자 계산하는 법 완벽 정리",
    description:
      "대출 상환 방식별 이자 계산법과 차이점을 알아봅니다.",
    url: "https://dhlm-studio.com/blog/loan-interest",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function LoanInterestPage() {
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
            대출 이자 계산하는 법 완벽 정리
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            대출 상환 방식의 종류
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            대출을 받을 때 가장 중요한 것 중 하나가 상환 방식을 이해하는
            것입니다. 크게 세 가지 방식이 있습니다. 첫째, 원리금균등상환은
            매월 동일한 금액(원금 + 이자)을 상환하는 방식으로, 매달 부담이
            일정하여 가계 예산 계획에 유리합니다. 둘째, 원금균등상환은 매월
            동일한 원금에 남은 잔액에 대한 이자를 더해 상환하는 방식으로, 초반
            상환 부담은 크지만 총 이자가 적습니다. 셋째, 만기일시상환은 대출
            기간 동안 이자만 납부하다가 만기에 원금을 한 번에 갚는 방식으로,
            단기 자금 운용에 적합합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            원리금균등상환 이자 계산
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            원리금균등상환의 월 상환액은 복잡한 공식으로 계산됩니다. 대출금 x
            월 이자율 x (1 + 월 이자율)의 n제곱 / ((1 + 월 이자율)의 n제곱 -
            1)이 기본 공식입니다. 여기서 n은 총 상환 개월 수입니다. 예를 들어
            1억 원을 연 4%로 30년 상환한다면, 월 이자율은 0.333%, 총 360개월이
            되어 월 상환액은 약 477,415원입니다. 30년간 총 상환액은 약 1억
            7,187만 원으로, 이자 총액이 약 7,187만 원에 달합니다. 이처럼 대출
            기간이 길면 총 이자 부담이 크게 늘어나므로 신중한 선택이 필요합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            어떤 상환 방식이 유리한가
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            총 이자 부담만 놓고 보면 원금균등상환이 가장 적고, 그다음이
            원리금균등상환, 만기일시상환 순입니다. 하지만 초반 상환 여력이
            부족하다면 원리금균등상환이 현실적으로 더 나은 선택일 수 있습니다.
            중요한 것은 자신의 월 소득 대비 상환 비율(DSR)을 고려하여 무리 없는
            상환 계획을 세우는 것입니다. 일반적으로 월 소득의 30%를 넘지 않는
            선에서 상환액을 설정하는 것이 권장됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            대출 이자 계산기 활용
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            직접 계산하기 어려운 대출 이자는{" "}
            <a
              href="https://tools.dhlm-studio.com/loan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 대출 이자 계산기
            </a>
            를 활용하면 편리합니다. 대출 금액, 이자율, 상환 기간, 상환 방식만
            입력하면 월 상환액과 총 이자를 한눈에 비교할 수 있습니다. 여러
            조건으로 시뮬레이션해보면 자신에게 가장 유리한 대출 조건을 찾는 데
            큰 도움이 됩니다. 대출을 받기 전에 반드시 계산기로 미리 확인해보세요.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/loan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 대출 이자 계산기
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
                href="/blog/retirement-calculator"
                className="text-[#31A575] font-medium hover:underline"
              >
                퇴직금 계산 방법 이것만 알면 OK
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
