import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "친구가 나를 얼마나 아는지 테스트 | DHLM-STUDIO 블로그",
  description:
    "친구가 나를 얼마나 잘 아는지 확인하는 테스트를 소개합니다. 나에 대한 퀴즈를 만들고 링크를 공유해서 친밀도를 확인해보세요.",
  openGraph: {
    title: "친구가 나를 얼마나 아는지 테스트",
    description:
      "친구와의 친밀도를 재미있게 확인하는 방법을 소개합니다.",
    url: "https://dhlm-studio.com/blog/friend-quiz",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function FriendQuizPage() {
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
            친구가 나를 얼마나 아는지 테스트
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            친밀도 테스트가 인기 있는 이유
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            SNS에서 자주 보이는 &ldquo;나를 맞춰봐&rdquo; 테스트는 MZ세대
            사이에서 꾸준히 인기를 끌고 있습니다. 나에 대한 퀴즈를 만들어
            친구들에게 공유하고, 몇 문제나 맞추는지 확인하는 단순한 구조이지만
            그 안에 많은 재미 요소가 담겨 있습니다. 내가 좋아하는 음식, 취미,
            성격, 습관 등을 문제로 만들면 친구가 나를 정말 잘 알고 있는지
            확인할 수 있고, 예상치 못한 오답에서 웃음이 터지기도 합니다.
            카카오톡이나 인스타그램 스토리로 결과를 공유하면 자연스럽게
            대화가 이어지는 효과도 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            재미있는 퀴즈 만드는 팁
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            좋은 친밀도 테스트를 만들려면 몇 가지 요령이 있습니다. 먼저
            너무 쉬운 질문과 어려운 질문을 적절히 섞어야 합니다.
            &ldquo;내가 좋아하는 색은?&rdquo;처럼 친한 친구라면 당연히 아는
            질문과 &ldquo;내가 초등학교 때 별명은?&rdquo;처럼 아주 친한
            사이만 아는 질문을 함께 넣으면 재미가 배가 됩니다. 보기도 너무
            뻔하게 만들지 말고, 그럴듯한 오답을 섞어야 고민하는 재미가
            있습니다. 8~10문제 정도가 적당하며, 너무 길면 참여율이 떨어집니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            온라인 테스트 만들기 서비스
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            직접 퀴즈를 코딩할 필요 없이, 온라인 서비스를 활용하면 몇 분 만에
            나만의 테스트를 만들 수 있습니다.{" "}
            <a
              href="https://guessme.dhlm-studio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 맞춰봐(GuessMe)
            </a>
            에서는 질문과 보기를 입력하고 정답을 설정하면 공유용 링크가
            자동으로 생성됩니다. 친구가 링크를 열어 퀴즈를 풀면 점수와 결과가
            바로 표시되어, 별도의 채점 없이도 누가 나를 가장 잘 아는지 순위를
            확인할 수 있습니다. 회원가입 없이 바로 사용할 수 있어 접근성이
            높습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            테스트 결과 활용하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            테스트 결과는 단순히 점수로 끝나는 것이 아니라, 관계를 더 깊게
            만드는 대화의 시작점이 됩니다. &ldquo;이것도 몰랐어?&rdquo;라는
            가벼운 놀림부터 &ldquo;이걸 어떻게 알았어!&rdquo;라는 감동까지,
            결과를 보면서 자연스럽게 서로에 대해 더 많은 이야기를 나누게
            됩니다. 커플끼리 해도 재미있고, 오랜 친구 그룹에서 해도 새로운
            사실을 발견하는 즐거움이 있습니다. 생일 파티, 단체 모임,
            소개팅에서도 아이스브레이킹으로 활용해보세요.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://guessme.dhlm-studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                맞춰봐(GuessMe) - 친밀도 테스트 만들기
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/couple-compatibility"
                className="text-[#31A575] font-medium hover:underline"
              >
                커플 궁합 테스트 추천 TOP 5
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
