import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "매일 저녁 메뉴 고르기가 힘든 이유와 해결법 | DHLM-STUDIO 블로그",
  description:
    "결정 피로란 무엇인지, 커플과 가족 메뉴 갈등의 원인과 함께 고르기 도구를 활용한 해결법을 소개합니다.",
  openGraph: {
    title: "매일 저녁 메뉴 고르기가 힘든 이유와 해결법",
    description:
      "결정 피로와 메뉴 갈등의 원인, 그리고 함께 고르기 도구를 활용한 해결법을 소개합니다.",
    url: "https://dhlm-studio.com/blog/how-to-choose-menu",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function HowToChooseMenuPage() {
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
            매일 저녁 메뉴 고르기가 힘든 이유와 해결법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-21</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            결정 피로란 무엇인가
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            하루에 우리가 내리는 결정의 수는 평균 약 35,000개에 달한다고
            합니다. 아침에 눈을 떠서 알람을 끌지 말지부터 시작해, 어떤 옷을
            입을지, 출근길에 어떤 음악을 들을지, 점심에 무엇을 먹을지까지
            끊임없이 선택의 연속입니다. 이렇게 반복되는 의사결정은 뇌에
            피로를 축적시키는데, 이를 심리학에서는 &lsquo;결정
            피로(Decision Fatigue)&rsquo;라고 부릅니다. 결정 피로가 쌓이면
            판단력이 떨어지고, 사소한 선택조차 스트레스로 느껴지게 됩니다.
            특히 하루 중 가장 많은 결정 피로가 쌓이는 저녁 시간대에 &ldquo;오늘
            저녁 뭐 먹지?&rdquo;라는 질문은 생각보다 큰 부담으로 다가옵니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            커플과 가족 사이 메뉴 갈등의 원인
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            혼자 먹을 때는 그나마 간단합니다. 먹고 싶은 걸 먹으면 그만이니까요.
            하지만 연인이나 가족과 함께 식사할 때는 상황이 복잡해집니다.
            각자의 음식 취향, 그날의 컨디션, 최근에 먹었던 메뉴, 예산, 거리
            등 고려해야 할 변수가 급격히 늘어납니다. 한 사람이 한식을 원하고
            다른 사람이 양식을 원할 때, 서로 양보하다 보면 결국 아무도
            만족하지 못하는 선택을 하게 되는 경우가 많습니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            실제로 커플 사이에서 가장 흔한 일상적 갈등 주제 중 하나가 바로
            식사 메뉴 선택입니다. &ldquo;아무거나&rdquo;라는 대답이 얼마나 큰
            갈등을 유발하는지는 누구나 경험해 봤을 것입니다. 이는 단순히
            음식의 문제가 아니라, 상대방에게 결정을 떠넘기는 것에 대한
            부담감과 자신의 선호를 표현하기 어려운 심리가 복합적으로
            작용하기 때문입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            함께 고르기의 장점
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            이런 메뉴 갈등을 해결하는 가장 좋은 방법은 &lsquo;함께
            고르기&rsquo;입니다. 각자 먹고 싶은 메뉴를 독립적으로 선택한
            뒤, 겹치는 메뉴를 찾아내는 방식이죠. 이 방법의 핵심은 서로의
            선호를 동시에 반영하면서도, 직접적인 의견 충돌을 피할 수
            있다는 점입니다. 각자 솔직하게 원하는 메뉴를 고르기 때문에
            &ldquo;아무거나&rdquo;라는 애매한 대답이 사라지고, 결과에
            대해 서로 납득하기도 쉽습니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            DHLM-STUDIO에서 준비 중인 &ldquo;오늘 뭐먹?&rdquo; 서비스는 바로
            이 원리를 활용합니다. 링크 하나를 카카오톡으로 공유하면, 각자
            먹고 싶은 메뉴 3개를 고릅니다. 서로의 선택이 겹치면 그 메뉴가
            오늘의 저녁이 되는 것이죠. 별도의 앱 설치 없이 모바일 웹에서
            바로 사용할 수 있어 접근성이 높고, 게임처럼 재미있게 메뉴를
            정할 수 있습니다. 매일 반복되는 저녁 메뉴 고민을 가볍고 즐거운
            경험으로 바꿔보세요.
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
