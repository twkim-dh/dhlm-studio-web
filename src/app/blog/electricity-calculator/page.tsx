import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "전기요금 계산기 누진제 완벽 정리 | DHLM-STUDIO 블로그",
  description:
    "전기요금 누진제 구조와 계산 방법을 완벽하게 정리합니다. 월별 전기 사용량에 따른 예상 요금을 미리 계산하는 방법을 알아봅니다.",
  openGraph: {
    title: "전기요금 계산기 누진제 완벽 정리",
    description:
      "전기요금 누진제 구조와 계산 방법을 완벽하게 정리합니다.",
    url: "https://dhlm-studio.com/blog/electricity-calculator",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function ElectricityCalculatorPage() {
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
            전기요금 계산기 누진제 완벽 정리
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            전기요금 누진제란
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            전기요금 누진제는 전기 사용량이 많아질수록 단가가 높아지는 요금
            체계입니다. 에너지 절약을 유도하고 소규모 사용자에게 저렴한 전기를
            제공하기 위한 정책입니다. 한국전력(KEPCO)에서 적용하는 주택용
            전기요금은 구간별로 다른 단가가 적용됩니다. 적게 쓰면 kWh당 낮은
            단가가, 많이 쓰면 높은 단가가 적용되어, 사용량이 일정 구간을
            넘어서면 전기요금이 급격히 올라가는 특성이 있습니다. 특히 여름과
            겨울 냉난방 시즌에는 전기 사용량이 급증하여 예상보다 높은 요금이
            나올 수 있으므로 미리 계산해보는 것이 중요합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            누진제 구간과 요금
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            2026년 기준 주택용 전기요금 누진제는 3단계로 나뉩니다. 1구간은
            월 200kWh 이하로 가장 저렴한 단가가 적용됩니다. 2구간은
            201~400kWh로 1구간보다 높은 단가가 적용되며, 3구간은 400kWh
            초과분으로 가장 높은 단가가 적용됩니다. 기본요금도 구간별로
            다릅니다. 예를 들어 월 350kWh를 사용했다면, 처음 200kWh는 1구간
            단가로, 나머지 150kWh는 2구간 단가로 계산한 뒤 해당 구간의
            기본요금을 더합니다. 여기에 부가가치세(10%)와 전력산업기반기금
            (3.7%)이 추가됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            전기요금 절약 팁
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            누진제 구간을 넘기지 않는 것이 전기요금 절약의 핵심입니다. 에어컨
            사용 시 26도 이상으로 설정하고 선풍기와 병행하면 전력 소비를 크게
            줄일 수 있습니다. 대기전력 차단 멀티탭을 사용하면 사용하지 않는
            가전의 대기전력을 차단할 수 있습니다. LED 전구로 교체하면 백열등
            대비 80% 이상 전력을 절약합니다. 세탁기와 식기세척기는 모아서
            돌리는 것이 효율적이며, 냉장고 적정 온도(냉장 3~5도, 냉동 -18도)를
            유지하면 불필요한 전력 소비를 막을 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            전기요금 미리 계산하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            매달 전기요금 고지서를 받기 전에 미리 예상 요금을 확인하고 싶다면{" "}
            <a
              href="https://tools.dhlm-studio.com/electricity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 전기요금 계산기
            </a>
            를 활용해보세요. 월 사용량(kWh)만 입력하면 누진제 구간별 요금,
            부가세, 전력산업기반기금까지 포함한 총 요금을 바로 확인할 수
            있습니다. 에어컨이나 전기히터 사용 전에 예상 사용량으로 미리
            계산해보면 요금 폭탄을 예방할 수 있습니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/electricity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 전기요금 계산기
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
