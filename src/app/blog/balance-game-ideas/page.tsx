import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "친구와 함께하면 재밌는 밸런스 게임 모음 | DHLM-STUDIO 블로그",
  description:
    "MZ세대에서 유행하는 밸런스 게임 주제 10가지와 모임에서 활용하는 팁을 소개합니다.",
  openGraph: {
    title: "친구와 함께하면 재밌는 밸런스 게임 모음",
    description:
      "인기 밸런스 게임 주제 10가지와 MZ세대 트렌드, 활용 팁을 소개합니다.",
    url: "https://dhlm-studio.com/blog/balance-game-ideas",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function BalanceGameIdeasPage() {
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
            친구와 함께하면 재밌는 밸런스 게임 모음
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
            밸런스 게임이란?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            밸런스 게임은 두 가지 선택지 중 하나를 반드시 골라야 하는
            간단한 게임입니다. 정답이 없고, 각자의 가치관과 성향에 따라
            답이 달라지기 때문에 자연스럽게 대화가 이어지는 것이
            장점입니다. 특히 MZ세대 사이에서 큰 인기를 끌며 소셜
            미디어, 유튜브, 예능 프로그램에서도 자주 등장하는 콘텐츠가
            되었습니다. 처음 만난 사람과의 어색한 분위기를 깨는 아이스
            브레이커로도 효과적이고, 오래 알고 지낸 친구와도 몰랐던
            면을 발견하는 재미가 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            인기 밸런스 게임 주제 10가지
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
            <li className="leading-relaxed">
              <strong>과거로 돌아가기 vs 미래로 가기</strong> - 시간
              여행이 가능하다면 어디로 갈 것인지, 후회를 바로잡고 싶은
              사람과 미래를 미리 보고 싶은 사람으로 나뉩니다.
            </li>
            <li className="leading-relaxed">
              <strong>투명인간 능력 vs 하늘을 나는 능력</strong> - 자유에
              대한 가치관이 드러나는 질문으로, 활발한 토론이 이어집니다.
            </li>
            <li className="leading-relaxed">
              <strong>여름만 있는 나라 vs 겨울만 있는 나라</strong> -
              계절 선호도와 라이프스타일이 드러나는 클래식한 질문입니다.
            </li>
            <li className="leading-relaxed">
              <strong>짜장면만 먹기 vs 짬뽕만 먹기</strong> - 한국인의
              영원한 고민을 밸런스 게임으로 만든 것으로, 진지한 논쟁으로
              번지기도 합니다.
            </li>
            <li className="leading-relaxed">
              <strong>돈 많은 직장 vs 재미있는 직장</strong> - 직업
              가치관이 드러나며 세대별로 답변 차이가 흥미로운
              주제입니다.
            </li>
            <li className="leading-relaxed">
              <strong>1년간 스마트폰 없이 살기 vs 1년간 친구 없이
              살기</strong> - 디지털 세대에게 특히 고민이 되는
              질문입니다.
            </li>
            <li className="leading-relaxed">
              <strong>과거의 실수를 고칠 수 있는 능력 vs 미래를 미리
              볼 수 있는 능력</strong> - 성격의 낙관적, 비관적 성향이
              반영됩니다.
            </li>
            <li className="leading-relaxed">
              <strong>요리를 완벽하게 잘하기 vs 노래를 완벽하게
              잘하기</strong> - 실용적 가치와 예술적 가치 사이의
              선택입니다.
            </li>
            <li className="leading-relaxed">
              <strong>아침형 인간으로 바뀌기 vs 저녁형 인간 유지</strong>
              - 라이프스타일에 대한 태도를 보여주는 질문입니다.
            </li>
            <li className="leading-relaxed">
              <strong>모든 언어를 할 줄 아는 능력 vs 모든 악기를
              연주하는 능력</strong> - 소통과 표현 중 무엇을 더
              중요시하는지 알 수 있습니다.
            </li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            밸런스 게임 활용 팁
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            밸런스 게임을 더 재미있게 즐기려면 몇 가지 팁이 있습니다.
            첫째, 선택한 이유를 꼭 물어보세요. 같은 답을 골라도 이유가
            다르면 더 흥미로운 대화가 됩니다. 둘째, 너무 무거운 주제는
            피하고 가벼운 것부터 시작하세요. 분위기가 무르익으면 점차
            깊이 있는 주제로 넘어가는 것이 좋습니다. 셋째, 정답이
            없다는 점을 강조하세요. 상대방의 선택을 비판하지 않고
            존중하는 것이 게임을 오래 즐기는 비결입니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            DHLM-STUDIO의 똑(Ttok) 서비스에서도 이런 밸런스 게임 형식의
            질문들을 활용하여 서로의 취향 싱크로율을 측정합니다. 단순히
            재미로 끝나는 것이 아니라, 결과를 데이터로 정리해
            보여주기 때문에 더 의미 있는 경험이 됩니다.
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
