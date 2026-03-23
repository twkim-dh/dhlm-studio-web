import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "모임 필수 게임 사다리타기 룰렛 가이드 | DHLM-STUDIO 블로그",
  description:
    "모임에서 활용할 수 있는 사다리타기, 룰렛 돌리기 게임 가이드입니다. 온라인 무료 도구를 활용한 재미있는 모임 진행법을 소개합니다.",
  openGraph: {
    title: "모임 필수 게임 사다리타기 룰렛 가이드",
    description:
      "사다리타기, 룰렛 돌리기를 활용한 재미있는 모임 진행법을 소개합니다.",
    url: "https://dhlm-studio.com/blog/party-games",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function PartyGamesPage() {
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
            모임 필수 게임 사다리타기 룰렛 가이드
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            모임에서 게임이 필요한 이유
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            친구 모임, 회식, MT, 워크숍 등 사람이 모이는 자리에서 간단한
            게임은 분위기를 띄우는 최고의 방법입니다. 특히 처음 만나는 사람이
            있거나 어색한 분위기를 깨야 할 때, 사다리타기나 룰렛 같은 랜덤
            게임은 누구나 쉽게 참여할 수 있어 아이스브레이킹에 효과적입니다.
            종이에 사다리를 그려서 하던 시절과 달리, 이제는 스마트폰으로 바로
            실행할 수 있는 온라인 도구들이 많이 나와 있어 준비 시간도
            절약됩니다. 결과의 공정성도 보장되기 때문에 벌칙자 선정이나 역할
            배분 등 다양한 상황에서 유용하게 활용됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            사다리타기 활용법
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            사다리타기는 참가자 이름과 결과를 설정한 뒤, 각자 하나의 줄을
            선택하면 랜덤으로 연결된 결과가 나오는 게임입니다. 벌칙자 선정,
            술래 정하기, 선물 교환 매칭, 팀 나누기 등 다양한 용도로 활용할 수
            있습니다. 예를 들어 회식에서 누가 계산할지를 정할 때, 참가자
            이름을 위에 넣고 결과에 &lsquo;당첨&rsquo;과 &lsquo;안전&rsquo;을
            배치하면 공정하게 결정할 수 있습니다. 온라인 사다리타기 도구를
            사용하면 참가자 수 제한 없이 바로 만들 수 있어 편리합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            룰렛 돌리기 활용법
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            룰렛은 항목을 원형 판에 배치하고 돌려서 멈추는 곳의 항목이
            선택되는 방식입니다. 메뉴 정하기, 벌칙 정하기, 발표 순서 정하기
            등에 활용됩니다. 사다리타기와 달리 항목별 비중을 조절할 수 있어,
            특정 결과가 나올 확률을 높이거나 낮출 수도 있습니다. 시각적으로
            화려한 회전 애니메이션이 있어 참가자들의 흥미를 유발하기 좋습니다.{" "}
            <a
              href="https://spin.dhlm-studio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 룰렛 돌리기
            </a>
            에서는 항목을 자유롭게 추가하고 바로 돌릴 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            모임 게임 활용 꿀팁
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            게임을 더 재미있게 활용하려면 몇 가지 팁이 있습니다. 첫째, 벌칙을
            너무 과하게 설정하지 마세요. 모두가 웃을 수 있는 가벼운 벌칙이
            좋습니다. 둘째, 한 가지 게임만 반복하기보다 사다리타기, 룰렛,
            랜덤 뽑기 등을 번갈아 사용하면 지루하지 않습니다. 셋째, 결과를
            화면에 크게 보여주면 현장감이 높아집니다. 스마트폰을 TV에 미러링하면
            더 좋습니다. 다음 모임에서 온라인 게임 도구를 활용해보세요.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://spin.dhlm-studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 룰렛 돌리기 / 사다리타기
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/balance-game-ideas"
                className="text-[#31A575] font-medium hover:underline"
              >
                친구와 함께하면 재밌는 밸런스 게임 모음
              </Link>
            </li>
            <li>
              <Link
                href="/blog/friend-quiz"
                className="text-[#31A575] font-medium hover:underline"
              >
                친구가 나를 얼마나 아는지 테스트
              </Link>
            </li>
            <li>
              <Link
                href="/blog/menu-decision"
                className="text-[#31A575] font-medium hover:underline"
              >
                오늘 저녁 뭐 먹지? 고민 해결법
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
