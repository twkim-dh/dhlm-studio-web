import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "일상 속 작은 결정을 쉽게 만드는 5가지 방법 | DHLM-STUDIO 블로그",
  description:
    "결정 피로를 줄이고 일상의 선택을 가볍게 만드는 실용적인 팁 5가지를 소개합니다.",
  openGraph: {
    title: "일상 속 작은 결정을 쉽게 만드는 5가지 방법",
    description:
      "결정 피로를 줄이고 일상의 선택을 가볍게 만드는 5가지 실용 팁.",
    url: "https://dhlm-studio.com/blog/daily-decision-tips",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function DailyDecisionTipsPage() {
  return (
    <article className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="text-sm font-medium text-[#31A575] hover:underline"
          >
            &larr; 블로그로 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            일상 속 작은 결정을 쉽게 만드는 5가지 방법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-21</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            매일 수만 개의 결정을 내리는 현대인에게 &lsquo;결정
            피로&rsquo;는 피할 수 없는 현실입니다. 큰 결정은 신중해야
            하지만, 사소한 일상의 선택까지 에너지를 쏟으면 정작 중요한
            판단을 내릴 때 지쳐버리게 됩니다. 일상 속 작은 결정들을 더
            쉽고 가볍게 만드는 5가지 실용적인 방법을 소개합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            1. 선택지를 미리 줄여두기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            결정이 어려운 가장 큰 이유는 선택지가 너무 많기 때문입니다.
            매일 입을 옷을 고르기 힘들다면 주중 옷을 미리 정해두고,
            점심 메뉴가 고민이라면 자주 가는 식당 5곳을 리스트로
            만들어 두세요. 스티브 잡스가 매일 같은 옷을 입었던 것도
            사소한 결정에 에너지를 낭비하지 않기 위한 전략이었습니다.
            선택의 범위를 좁히면 결정 속도가 빨라지고, 결과에 대한
            만족도도 오히려 높아집니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            2. 2분 규칙 적용하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            사소한 결정에는 &lsquo;2분 규칙&rsquo;을 적용해 보세요. 2분
            안에 결정할 수 없는 사소한 문제라면, 어떤 선택을 하든
            결과의 차이가 크지 않다는 뜻입니다. 카페에서 아메리카노와
            라떼 사이에서 고민하고 있다면, 2분 안에 결정하겠다고 마음을
            정하세요. 타이머를 설정하는 것도 좋은 방법입니다. 이 습관이
            들면 불필요한 고민 시간이 줄어들고, 그 에너지를 더 중요한
            일에 쓸 수 있게 됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            3. 루틴으로 자동화하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            반복되는 결정은 루틴으로 만들어 자동화하세요. 예를 들어
            &ldquo;월요일은 한식, 화요일은 양식, 수요일은 중식&rdquo;처럼
            요일별 메뉴 테마를 정해두면 매일 고민할 필요가 없습니다.
            운동도 &ldquo;매주 월, 수, 금 아침 7시&rdquo;로 고정하면
            &ldquo;오늘 운동할까 말까&rdquo;라는 결정 자체가 사라집니다.
            루틴은 의지력이 아닌 시스템으로 움직이게 해주기 때문에,
            결정 피로를 근본적으로 줄여줍니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            4. 함께 고르기 도구 활용하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            혼자만의 결정이 아니라 다른 사람과 함께 정해야 하는 상황은
            더 복잡합니다. 이럴 때는 함께 고르기 도구를 활용하면
            효과적입니다. DHLM-STUDIO에서 준비 중인 &ldquo;오늘
            뭐먹?&rdquo; 서비스처럼, 각자 원하는 메뉴를 독립적으로
            선택한 뒤 겹치는 항목을 찾아내는 방식은 직접적인 의견
            충돌을 피하면서도 모두가 만족하는 결과를 이끌어냅니다.
            결정을 게임처럼 만들면 스트레스가 줄어들고, 선택 과정
            자체가 즐거워집니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            5. 완벽한 선택은 없다고 인정하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            결정을 어렵게 만드는 근본적인 원인은 &lsquo;최선의
            선택&rsquo;을 하고 싶은 욕구입니다. 하지만 일상의 사소한
            결정에서 완벽한 선택이란 존재하지 않습니다. 심리학에서는
            이를 &lsquo;만족자(Satisficer)&rsquo; 전략이라고 부르는데,
            충분히 좋은 선택을 빠르게 내리는 사람이 모든 옵션을 비교하는
            &lsquo;극대화자(Maximizer)&rsquo;보다 오히려 행복도가 높다는
            연구 결과가 있습니다. 오늘 저녁 메뉴가 최선이 아니어도
            괜찮습니다. 충분히 맛있으면 그것으로 충분합니다. 이 마인드셋
            하나만으로도 일상의 결정이 한결 가벼워질 것입니다.
          </p>
        </div>

        {/* Related Services */}
        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            관련 서비스
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://ttok.dhlm-studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                똑(Ttok) - 취향 싱크로율 테스트
              </a>
            </li>
            <li>
              <span className="text-gray-500 font-medium">
                오늘 뭐먹? - 함께 메뉴 고르기{" "}
                <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 ml-1">
                  Coming Soon
                </span>
              </span>
            </li>
          </ul>
        </div>

        {/* Back link */}
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
