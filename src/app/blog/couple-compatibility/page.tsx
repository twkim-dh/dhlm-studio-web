import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "커플 궁합 테스트 추천 TOP 5 | DHLM-STUDIO 블로그",
  description:
    "연인과 함께하면 재미있는 커플 궁합 테스트 TOP 5를 소개합니다. 취향 싱크로율 테스트부터 MBTI 궁합까지 다양한 테스트를 알아보세요.",
  openGraph: {
    title: "커플 궁합 테스트 추천 TOP 5",
    description:
      "연인과 함께하면 재미있는 커플 궁합 테스트 TOP 5를 소개합니다.",
    url: "https://dhlm-studio.com/blog/couple-compatibility",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function CoupleCompatibilityPage() {
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
            커플 궁합 테스트 추천 TOP 5
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            커플 궁합 테스트가 인기 있는 이유
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            연인 사이에서 궁합 테스트는 단순한 놀이 이상의 의미를 가집니다.
            서로의 취향과 가치관을 재미있게 확인할 수 있고, 테스트 결과를
            바탕으로 자연스러운 대화가 이어지기 때문입니다. 특히 사귀기 시작한
            초반에는 서로에 대해 알아가는 과정 자체가 설렘이 되고, 오래된
            커플에게는 &ldquo;아직도 모르는 점이 있었네&rdquo;라는 새로운
            발견의 기회가 됩니다. SNS에서 궁합 테스트 결과를 공유하는 것도
            하나의 소통 방식으로 자리 잡았습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            추천 궁합 테스트 TOP 5
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            첫 번째로 추천하는 것은{" "}
            <a
              href="https://ttok.dhlm-studio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              똑(Ttok) 취향 싱크로율 테스트
            </a>
            입니다. 음식, 여행, 여가 등 다양한 주제의 취향 질문에 각자 답하면
            두 사람의 싱크로율이 퍼센트로 표시됩니다. 두 번째는 MBTI 궁합
            테스트로, 각자의 성격 유형을 기반으로 관계의 강점과 주의점을
            알려줍니다. 세 번째는 사랑의 5가지 언어 테스트로, 상대방이 사랑을
            느끼는 방식(스킨십, 칭찬, 선물, 봉사, 시간)을 파악할 수 있습니다.
            네 번째는 가치관 테스트로, 결혼관, 금전관, 양육관 등 깊은 주제에
            대한 생각을 비교합니다. 다섯 번째는 연애 성향 테스트로, 연애할 때
            각자의 행동 패턴과 애정 표현 스타일을 분석합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            테스트 결과 활용법
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            궁합 테스트 결과가 좋다고 해서 완벽한 관계가 보장되는 것은 아니고,
            결과가 좋지 않다고 해서 걱정할 필요도 없습니다. 중요한 것은 결과를
            통해 서로의 차이를 인식하고 이해하는 것입니다. &ldquo;이런 부분에서
            우리가 다르구나&rdquo;를 확인하면, 갈등이 생겼을 때 상대방의
            관점에서 생각해볼 수 있는 여유가 생깁니다. 결과를 스크린샷 찍어두고
            나중에 다시 이야기 나누는 것도 좋은 방법입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            커플이 함께하면 좋은 활동
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            궁합 테스트 외에도 커플이 함께하면 좋은 온라인 활동이 많습니다.
            밸런스 게임으로 가벼운 논쟁을 즐기거나, 버킷리스트를 함께
            만들어보거나, 서로에 대한 퀴즈를 만들어 맞춰보는 것도 재미있습니다.
            특히 장거리 연애 중이라면 온라인으로 함께할 수 있는 활동이 더욱
            소중합니다. 똑(Ttok) 같은 서비스는 링크만 공유하면 각자의 위치에서
            참여할 수 있어 장거리 커플에게도 안성맞춤입니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
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
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/couple-compatibility-test"
                className="text-[#31A575] font-medium hover:underline"
              >
                연인 취향 테스트로 알아보는 우리의 궁합
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
                href="/blog/balance-game-ideas"
                className="text-[#31A575] font-medium hover:underline"
              >
                친구와 함께하면 재밌는 밸런스 게임 모음
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
