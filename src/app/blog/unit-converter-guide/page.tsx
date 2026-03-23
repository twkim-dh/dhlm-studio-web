import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "단위 변환기 - 길이 무게 면적 한번에 | DHLM-STUDIO 블로그",
  description:
    "길이, 무게, 면적, 온도 등 다양한 단위를 한번에 변환하는 방법을 알아봅니다. 일상에서 자주 쓰는 단위 변환 공식과 무료 도구를 소개합니다.",
  openGraph: {
    title: "단위 변환기 - 길이 무게 면적 한번에",
    description:
      "다양한 단위를 한번에 변환하는 방법과 무료 도구를 소개합니다.",
    url: "https://dhlm-studio.com/blog/unit-converter-guide",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function UnitConverterGuidePage() {
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
            단위 변환기 - 길이 무게 면적 한번에
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            단위 변환이 필요한 순간들
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            해외 직구를 하면서 인치를 센티미터로 변환해야 할 때, 부동산을 볼 때
            평수를 제곱미터로 환산해야 할 때, 요리 레시피의 온스를 그램으로
            바꿔야 할 때, 여행 중 마일을 킬로미터로 변환해야 할 때 등 일상에서
            단위 변환이 필요한 순간은 의외로 많습니다. 특히 한국에서는 평(坪),
            근(斤) 같은 전통 단위와 미터법이 혼용되고, 미국 제품은 인치, 파운드,
            화씨 등 야드파운드법을 사용하기 때문에 변환이 더 자주 필요합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            자주 쓰는 단위 변환 공식
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            길이: 1인치 = 2.54cm, 1피트 = 30.48cm, 1마일 = 1.609km입니다.
            무게: 1파운드 = 453.6g, 1온스 = 28.35g, 1근 = 600g입니다. 면적:
            1평 = 3.306m2, 1에이커 = 4,047m2, 1정보 = 9,917m2입니다. 온도:
            섭씨를 화씨로 바꾸려면 섭씨 x 1.8 + 32, 화씨를 섭씨로 바꾸려면
            (화씨 - 32) / 1.8입니다. 부피: 1갤런 = 3.785L, 1온스(액량) =
            29.57mL입니다. 이런 공식들을 외우기 어렵다면 온라인 단위 변환기를
            활용하는 것이 가장 편리합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            한국 특유의 단위 변환
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            한국에서는 부동산 거래 시 여전히 &lsquo;평&rsquo; 단위를 많이
            사용합니다. 법적으로는 제곱미터(m2)가 표준이지만, 일상에서는
            &ldquo;30평 아파트&rdquo;처럼 평수로 표현하는 경우가 대부분입니다.
            1평은 약 3.306m2이므로, 전용면적 84m2는 약 25.4평이 됩니다. 또한
            고기나 과일을 살 때 쓰는 &lsquo;근&rsquo;은 600g이며, 한 되는
            약 1.8L입니다. 이런 전통 단위를 미터법으로 빠르게 변환할 수 있는
            도구가 있으면 매우 유용합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            온라인 단위 변환기 활용
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            매번 공식을 찾아보는 대신 온라인 단위 변환기를 즐겨찾기 해두면
            필요할 때 바로 사용할 수 있습니다. DHLM-STUDIO의 온라인 도구
            모음에서도 길이, 무게, 면적, 온도, 부피 등 다양한 단위 변환 기능을
            제공하고 있습니다. 값을 입력하면 실시간으로 여러 단위의 환산 결과를
            동시에 보여주어, 여러 단위를 한 번에 비교할 수 있어 편리합니다.
            해외 직구, 부동산, 요리, 여행 등 다양한 상황에서 활용해보세요.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 무료 온라인 도구 모음
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/online-tools-free"
                className="text-[#31A575] font-medium hover:underline"
              >
                무료 온라인 계산기 모음 80개
              </Link>
            </li>
            <li>
              <Link
                href="/blog/bmi-guide"
                className="text-[#31A575] font-medium hover:underline"
              >
                BMI 계산기로 내 체형 확인하기
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
