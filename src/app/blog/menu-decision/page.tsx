import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "오늘 저녁 뭐 먹지? 고민 해결법 | DHLM-STUDIO 블로그",
  description:
    "매일 반복되는 저녁 메뉴 고민을 해결하는 방법을 알아봅니다. 랜덤 메뉴 추천부터 함께 고르기 서비스까지 실용적인 해결법을 소개합니다.",
  openGraph: {
    title: "오늘 저녁 뭐 먹지? 고민 해결법",
    description:
      "매일 반복되는 저녁 메뉴 고민을 해결하는 실용적인 방법을 소개합니다.",
    url: "https://dhlm-studio.com/blog/menu-decision",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function MenuDecisionPage() {
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
            오늘 저녁 뭐 먹지? 고민 해결법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            메뉴 선택이 이렇게 어려운 이유
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            하루 중 가장 많이 듣는 질문이 &ldquo;오늘 뭐 먹지?&rdquo;가
            아닐까요. 점심과 저녁, 하루에 최소 두 번은 이 고민을 하게 됩니다.
            심리학에서는 이를 &lsquo;결정 피로&rsquo;라고 부르는데, 하루 종일
            수많은 결정을 내리다 보면 저녁 무렵에는 사소한 선택조차 어려워지는
            현상입니다. 특히 혼자가 아닌 둘 이상이 함께 먹을 때는 각자의 취향,
            예산, 건강 상태, 최근 먹은 메뉴 등 고려 사항이 급격히 늘어나면서
            &ldquo;아무거나&rdquo;라는 답이 나오게 됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            실용적인 메뉴 결정 방법 4가지
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            첫째, 주간 식단표를 만들어두면 매일의 고민을 크게 줄일 수 있습니다.
            일요일에 월~금 메뉴를 미리 정해두면 장보기도 효율적이 됩니다. 둘째,
            카테고리 소거법을 사용해보세요. 한식, 중식, 일식, 양식 중 오늘 먹기
            싫은 것부터 제거하면 자연스럽게 범위가 좁혀집니다. 셋째, 랜덤
            메뉴 추천 도구를 활용하면 고민 시간을 0으로 줄일 수 있습니다.
            룰렛이나 랜덤 뽑기로 메뉴를 정하면 의외로 만족도가 높습니다. 넷째,
            함께 먹는 사람과 각자 먹고 싶은 메뉴를 3개씩 적어서 겹치는 메뉴를
            선택하는 &lsquo;교집합 방식&rsquo;도 효과적입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            함께 메뉴 고르기 서비스 활용
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            교집합 방식을 온라인으로 구현한 서비스가 바로{" "}
            <a
              href="https://mwomuk.dhlm-studio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              오늘 뭐먹(MwoMuk)
            </a>
            입니다. 링크 하나를 카카오톡으로 공유하면 각자 스마트폰에서 먹고
            싶은 메뉴를 고르고, 서로의 선택이 겹치는 메뉴가 자동으로
            추천됩니다. 별도의 앱 설치 없이 모바일 웹에서 바로 사용할 수 있어
            편리합니다. 매일 반복되는 &ldquo;뭐 먹지?&rdquo; 고민을 게임처럼
            재미있게 해결할 수 있으니 한번 시도해보세요.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            메뉴 고민 줄이는 생활 습관
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            장기적으로 메뉴 고민을 줄이려면 자주 가는 맛집 리스트를 만들어두는
            것이 좋습니다. 카카오맵이나 네이버 지도에 즐겨찾기 해두면 필요할
            때 바로 꺼내볼 수 있습니다. 또한 새로운 음식에 도전하는 날을
            정해두면(예: 금요일은 새로운 메뉴 도전의 날) 식사가 더 즐거워집니다.
            배달 앱에 최근 주문 내역이 기록되므로, 최소 일주일은 겹치지 않게
            주문하는 것도 하나의 규칙이 될 수 있습니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://mwomuk.dhlm-studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                오늘 뭐먹(MwoMuk) - 함께 메뉴 고르기
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/how-to-choose-menu"
                className="text-[#31A575] font-medium hover:underline"
              >
                매일 저녁 메뉴 고르기가 힘든 이유와 해결법
              </Link>
            </li>
            <li>
              <Link
                href="/blog/food-matching-guide"
                className="text-[#31A575] font-medium hover:underline"
              >
                음식 취향으로 보는 성격 유형 가이드
              </Link>
            </li>
            <li>
              <Link
                href="/blog/party-games"
                className="text-[#31A575] font-medium hover:underline"
              >
                모임 필수 게임 사다리타기 룰렛 가이드
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
