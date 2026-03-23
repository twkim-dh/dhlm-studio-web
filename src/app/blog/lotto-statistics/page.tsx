import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "로또 당첨 번호 통계 분석 방법 | DHLM-STUDIO 블로그",
  description:
    "로또 당첨 번호의 통계를 분석하는 방법을 알아봅니다. 출현 빈도, 연속 번호 패턴, 홀짝 비율 등 실전에서 활용 가능한 통계 분석법을 소개합니다.",
  openGraph: {
    title: "로또 당첨 번호 통계 분석 방법",
    description:
      "로또 당첨 번호의 통계를 분석하는 실전 방법을 소개합니다.",
    url: "https://dhlm-studio.com/blog/lotto-statistics",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function LottoStatisticsPage() {
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
            로또 당첨 번호 통계 분석 방법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            로또 통계 분석이 필요한 이유
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            로또 6/45는 매주 추첨되며, 2002년 첫 회차부터 지금까지 1,000회 이상의
            당첨 데이터가 축적되어 있습니다. 이 방대한 데이터를 분석하면 번호별
            출현 빈도, 구간별 분포, 연속 번호 출현 패턴 등 흥미로운 통계적 경향을
            발견할 수 있습니다. 물론 로또는 매 회차 독립적인 확률 사건이므로 과거
            통계가 미래 당첨을 예측해주지는 않습니다. 그러나 통계를 참고하면 번호
            조합을 만들 때 더 체계적이고 재미있는 접근이 가능합니다. 많은 로또
            애호가들이 통계 분석을 하나의 취미이자 전략으로 활용하고 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            출현 빈도 분석
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            가장 기본적인 통계 분석은 각 번호의 출현 빈도를 확인하는 것입니다.
            1부터 45까지의 번호 중 어떤 번호가 가장 많이 나왔고, 어떤 번호가
            가장 적게 나왔는지를 파악합니다. 역대 데이터를 보면 번호 간 출현
            빈도의 차이가 존재하지만, 장기적으로는 평균에 수렴하는 경향이
            있습니다. 최근 50회차나 100회차 같은 구간을 설정하여 단기 트렌드를
            파악하는 것도 유용한 방법입니다. 특정 기간에 유독 자주 나오는
            &lsquo;핫넘버&rsquo;와 오래 등장하지 않는 &lsquo;콜드넘버&rsquo;를
            구분하여 조합에 반영해볼 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            번호 합계와 구간 분석
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            당첨 번호 6개의 합계도 중요한 분석 지표입니다. 역대 당첨 번호의
            합계를 조사하면, 100에서 180 사이에 가장 많이 분포하는 것을 확인할
            수 있습니다. 평균 합계는 약 130 전후로, 극단적으로 낮거나 높은 합계의
            조합은 상대적으로 드물게 당첨됩니다. 또한 1~15, 16~30, 31~45의 세
            구간에서 골고루 번호가 분포되는 조합이 자주 당첨되는 경향이 있습니다.
            한 구간에서만 번호를 편중해서 고르면 당첨 확률이 낮아질 수 있으므로,
            균형 잡힌 분포를 고려하는 것이 좋습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            통계 분석 도구 활용하기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            직접 엑셀이나 스프레드시트로 통계를 내는 방법도 있지만, 온라인
            분석 도구를 사용하면 훨씬 편리합니다. 동행복권 공식 사이트에서
            역대 당첨 번호를 다운로드할 수 있으며, 다양한 로또 분석 사이트에서
            출현 빈도, 번호 합계, 끝수 분석 등을 시각적으로 확인할 수 있습니다.
            DHLM-STUDIO의 로또 번호 생성기에서도 통계 기반 번호 추천 기능을
            활용할 수 있으니 참고해보세요. 중요한 것은 통계를 맹신하지 않으면서도,
            번호 선택의 재미있는 근거로 활용하는 균형 잡힌 태도입니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            관련 서비스
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://lotto.dhlm-studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 로또 번호 생성기 - 통계 기반 번호 추천
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/lotto-number-generator"
                className="text-[#31A575] font-medium hover:underline"
              >
                무료 로또 번호 생성기 추천 - 2026년
              </Link>
            </li>
            <li>
              <Link
                href="/blog/lotto-dream-number"
                className="text-[#31A575] font-medium hover:underline"
              >
                꿈 해몽 로또 번호 의미 총정리
              </Link>
            </li>
            <li>
              <Link
                href="/blog/lotto-winning-tips"
                className="text-[#31A575] font-medium hover:underline"
              >
                로또 당첨 확률 높이는 5가지 방법
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
