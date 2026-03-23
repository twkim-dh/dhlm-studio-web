import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "무료 온라인 계산기 모음 80개 | DHLM-STUDIO 블로그",
  description:
    "무료로 사용할 수 있는 온라인 계산기 80종을 한눈에 정리했습니다. 연봉, BMI, 대출, 부가세, 퇴직금 등 다양한 계산기를 소개합니다.",
  openGraph: {
    title: "무료 온라인 계산기 모음 80개",
    description:
      "무료 온라인 계산기 80종을 한눈에 정리했습니다.",
    url: "https://dhlm-studio.com/blog/online-tools-free",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function OnlineToolsFreePage() {
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
            무료 온라인 계산기 모음 80개
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            왜 온라인 계산기가 필요한가
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            일상에서 계산이 필요한 순간은 생각보다 많습니다. 이직 시 연봉
            실수령액이 궁금할 때, 대출 이자를 비교할 때, 해외 직구 시 관세를
            계산할 때, 다이어트를 위해 칼로리나 BMI를 확인할 때 등 다양한
            상황에서 계산기가 필요합니다. 스마트폰 기본 계산기로는 이런 복잡한
            계산을 하기 어렵고, 공식을 일일이 찾아서 직접 계산하는 것도
            번거롭습니다. 온라인 계산기는 필요한 값만 입력하면 즉시 결과를
            보여주므로 시간을 크게 절약할 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            금융 관련 계산기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            가장 자주 사용되는 분야가 금융 계산기입니다. 연봉 실수령액 계산기는
            4대 보험과 세금을 공제한 실제 월급을 알려줍니다. 대출 이자 계산기는
            원리금균등, 원금균등, 만기일시 상환 방식별 월 상환액과 총 이자를
            비교할 수 있습니다. 퇴직금 계산기는 근속 기간과 급여를 입력하면
            예상 퇴직금을 산출합니다. 부가세 계산기, 종합소득세 계산기, 양도소득세
            계산기 등 세금 관련 도구도 필수입니다.{" "}
            <a
              href="https://tools.dhlm-studio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 온라인 도구 모음
            </a>
            에서 이 모든 계산기를 무료로 사용할 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            생활 밀착형 계산기
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            건강 관련으로는 BMI 계산기, 기초대사량 계산기, 칼로리 계산기가
            있습니다. 단위 변환이 필요할 때는 길이, 무게, 면적, 온도 변환기가
            유용합니다. 전기요금 누진제 계산기는 월별 전기 사용량에 따른 예상
            요금을 알려주어 에너지 절약 계획을 세울 수 있습니다. 쇼핑 관련으로는
            할인율 계산기, 해외 직구 관세 계산기 등이 있으며, 부동산 관련으로는
            전월세 전환 계산기, 중개수수료 계산기 등이 활용됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            개발자 및 업무용 도구
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            개발자를 위한 도구로는 JSON 포맷터, Base64 인코더/디코더, 정규식
            테스터, 색상 코드 변환기 등이 있습니다. 디자이너에게는 px-rem
            변환기, 색상 팔레트 생성기가 유용합니다. 사무직에게는 날짜 계산기
            (D-day, 날짜 간 차이), 비율 계산기, 퍼센트 계산기 등이 자주
            사용됩니다. 이런 도구들을 즐겨찾기 해두면 필요할 때 바로 접근할 수
            있어 업무 효율이 크게 올라갑니다.
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
                href="/blog/salary-calculator"
                className="text-[#31A575] font-medium hover:underline"
              >
                2026년 연봉 실수령액 계산법
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
            <li>
              <Link
                href="/blog/vat-calculator-guide"
                className="text-[#31A575] font-medium hover:underline"
              >
                부가세 계산 방법 간단 정리
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
