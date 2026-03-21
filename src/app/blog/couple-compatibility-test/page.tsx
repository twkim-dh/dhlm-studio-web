import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "연인 취향 테스트로 알아보는 우리의 궁합 | DHLM-STUDIO 블로그",
  description:
    "취향 싱크로율이 관계에서 중요한 이유와 똑(Ttok) 서비스를 통해 연인 궁합을 확인하는 방법을 소개합니다.",
  openGraph: {
    title: "연인 취향 테스트로 알아보는 우리의 궁합",
    description:
      "취향 싱크로율이 관계에서 중요한 이유와 똑(Ttok)으로 궁합을 확인하는 방법.",
    url: "https://dhlm-studio.com/blog/couple-compatibility-test",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function CoupleCompatibilityTestPage() {
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
            연인 취향 테스트로 알아보는 우리의 궁합
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
            취향 싱크로율이 관계에서 중요한 이유
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            연인 관계에서 성격이 맞는 것도 중요하지만, 일상적인 취향이
            얼마나 맞는지가 장기적인 관계 만족도에 더 큰 영향을 미친다는
            연구 결과가 있습니다. 주말에 어떤 활동을 할지, 어떤 영화를
            볼지, 식당에서 어떤 메뉴를 시킬지 같은 사소한 취향의 일치는
            매일 반복되는 선택에서 마찰을 줄여줍니다. 취향이 비슷한
            커플은 데이트 계획을 세울 때 갈등이 적고, 서로의 선물을 고를
            때도 만족도가 높은 편입니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            반대로 취향 차이가 크다고 해서 관계가 나쁜 것은 아닙니다.
            오히려 서로 다른 점을 인식하고 존중하는 과정에서 관계가 더
            깊어질 수 있습니다. 중요한 것은 서로의 취향을 알고 있느냐의
            여부입니다. 상대방이 어떤 음식을 좋아하는지, 어떤 여행
            스타일을 선호하는지, 어떤 상황에서 스트레스를 받는지 파악하고
            있다면, 갈등 상황에서도 더 세심하게 배려할 수 있게 됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            똑(Ttok) 서비스 소개
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            똑(Ttok)은 DHLM-STUDIO에서 개발한 취향 싱크로율 테스트
            서비스입니다. 한 사람이 다양한 주제에 대한 질문에 답변하고,
            카카오톡으로 링크를 공유하면 상대방도 같은 질문에 답변합니다.
            두 사람의 답변을 비교해 취향이 얼마나 일치하는지를 퍼센트로
            보여주는 재미있는 서비스입니다. 음식 취향, 데이트 스타일,
            라이프스타일, 가치관 등 다양한 카테고리의 질문을 통해
            표면적인 취향부터 깊은 가치관까지 폭넓게 확인할 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            테스트 방법 안내
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            사용 방법은 매우 간단합니다. 먼저 똑(Ttok) 웹사이트에
            접속하여 질문에 솔직하게 답변합니다. 답변이 완료되면 고유한
            결과 링크가 생성되는데, 이 링크를 카카오톡이나 메시지로
            상대방에게 공유합니다. 상대방이 같은 질문에 답변을 완료하면,
            두 사람의 취향 싱크로율이 자동으로 계산되어 결과 페이지에
            표시됩니다. 어떤 부분에서 취향이 같고, 어떤 부분에서
            다른지를 항목별로 확인할 수 있어서 대화의 소재로도
            활용하기 좋습니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            별도의 회원가입이나 앱 설치가 필요 없고, 모바일 브라우저에서
            바로 이용할 수 있습니다. 연인뿐만 아니라 친구, 가족과도
            함께 해볼 수 있으니, 가까운 사람과의 취향 궁합이 궁금하다면
            한번 시도해 보시는 것을 추천드립니다. 서로를 더 잘 이해하는
            첫걸음이 될 수 있습니다.
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
