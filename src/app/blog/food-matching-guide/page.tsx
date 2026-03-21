import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "음식 취향으로 보는 성격 유형 가이드 | DHLM-STUDIO 블로그",
  description:
    "짜장면 vs 짬뽕 논쟁부터 매운 음식 선호도까지, 음식 취향에 숨겨진 성격 유형을 분석합니다.",
  openGraph: {
    title: "음식 취향으로 보는 성격 유형 가이드",
    description:
      "음식 선호와 성격의 관계를 재미있게 분석해봅니다.",
    url: "https://dhlm-studio.com/blog/food-matching-guide",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function FoodMatchingGuidePage() {
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
            음식 취향으로 보는 성격 유형 가이드
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
            짜장면 vs 짬뽕으로 보는 성격
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            한국인이라면 중국집에서 한 번쯤은 경험해 본 고민, 바로
            짜장면과 짬뽕 사이의 선택입니다. 단순한 음식 선호처럼
            보이지만, 이 선택에는 우리의 성격 특성이 반영되어 있다는
            흥미로운 분석이 있습니다. 짜장면을 선호하는 사람은 일반적으로
            안정적이고 일관된 것을 좋아하는 성향이 있다고 합니다. 익숙한
            맛에서 안정감을 느끼고, 변화보다는 검증된 선택을 선호하는
            편이죠. 반면 짬뽕을 선호하는 사람은 자극적인 경험을 즐기고,
            새로운 도전에 열린 성향이 있다고 분석됩니다. 매운맛의
            불확실성을 즐기는 모험가적 기질이 반영된 것입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            매운 음식 선호도와 성격
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            매운 음식을 즐기는 사람들에 대한 연구는 꽤 활발하게 이루어져
            왔습니다. 펜실베이니아 주립대학교의 연구에 따르면, 매운
            음식을 즐기는 사람들은 감각 추구(Sensation Seeking) 성향이
            높은 경우가 많다고 합니다. 이들은 일상에서 새로운 자극을
            찾고, 스릴 있는 활동을 즐기며, 반복적인 일상에 쉽게 지루함을
            느끼는 경향이 있습니다. 또한 매운 음식 애호가들은 외향적인
            성격 특성을 보이는 경우가 많으며, 사교적인 모임에서 활발하게
            참여하는 편입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            음식 선호와 성격의 다양한 관계
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            단맛을 좋아하는 사람은 친화력이 높고 타인에게 친절한 성향이
            있다는 연구가 있습니다. 실제로 &lsquo;달콤한 사람&rsquo;이라는
            표현이 존재하는 것처럼, 단맛 선호와 사회적 따뜻함 사이에는
            흥미로운 상관관계가 발견됩니다. 쓴맛을 즐기는 사람, 예를 들어
            블랙커피나 다크 초콜릿을 선호하는 사람은 독립적이고 직설적인
            성향이 강한 것으로 나타났습니다. 신맛을 좋아하는 사람은
            호기심이 많고 창의적인 성향이 있으며, 감칠맛을 중시하는
            사람은 세밀하고 분석적인 성격 특성을 보인다고 합니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            물론 음식 취향과 성격의 관계는 절대적인 것이 아니라 경향성에
            가깝습니다. 하지만 이런 분석을 통해 자신과 주변 사람들의
            성향을 재미있게 이해해 볼 수 있습니다. 친구나 연인과 서로의
            음식 취향을 비교하며 대화를 나누면, 평소 몰랐던 상대방의
            성격 특성을 발견하는 즐거움도 있을 것입니다. DHLM-STUDIO의
            똑(Ttok) 서비스를 통해 음식 취향을 포함한 다양한 분야에서
            서로의 싱크로율을 확인해 보세요.
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
