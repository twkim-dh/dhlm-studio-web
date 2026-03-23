import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BMI 계산기로 내 체형 확인하기 | DHLM-STUDIO 블로그",
  description:
    "BMI(체질량지수) 계산 방법과 한국인 기준 체형 분류를 알아봅니다. BMI 계산기 사용법과 건강한 체중 관리 팁을 소개합니다.",
  openGraph: {
    title: "BMI 계산기로 내 체형 확인하기",
    description:
      "BMI 계산 방법과 한국인 기준 체형 분류를 알아봅니다.",
    url: "https://dhlm-studio.com/blog/bmi-guide",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function BmiGuidePage() {
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
            BMI 계산기로 내 체형 확인하기
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            BMI란 무엇인가
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            BMI(Body Mass Index, 체질량지수)는 체중과 신장의 관계를 수치화하여
            비만도를 판정하는 지표입니다. 계산 공식은 체중(kg)을 신장(m)의
            제곱으로 나누는 것으로, 예를 들어 키 170cm에 체중 70kg인 사람의
            BMI는 70 / (1.7 x 1.7) = 24.2가 됩니다. BMI는 세계보건기구(WHO)와
            대한비만학회에서 비만도를 평가하는 기본 도구로 사용하고 있으며,
            건강검진에서도 필수적으로 측정됩니다. 다만 BMI는 체지방과 근육을
            구분하지 못하므로, 근육량이 많은 운동선수의 경우 BMI가 높게 나와도
            비만이 아닐 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            한국인 기준 BMI 분류
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            대한비만학회에서 정한 한국인 BMI 기준은 WHO 기준과 약간 다릅니다.
            아시아인은 같은 BMI에서도 서양인보다 체지방률이 높고 내장지방이
            많아 더 엄격한 기준을 적용합니다. 저체중은 BMI 18.5 미만, 정상은
            18.5~22.9, 과체중(비만 전단계)은 23~24.9, 1단계 비만은 25~29.9,
            2단계 비만은 30~34.9, 3단계 비만(고도비만)은 35 이상입니다. 정상
            범위의 BMI를 유지하는 것이 심혈관 질환, 당뇨병 등 만성 질환의
            예방에 도움이 됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            BMI의 한계와 보완 지표
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            BMI만으로 건강 상태를 완벽하게 판단하기는 어렵습니다. 앞서 언급한
            것처럼 체지방과 근육을 구분하지 못하며, 나이, 성별, 체형에 따른
            차이도 반영하지 못합니다. 이를 보완하기 위해 허리둘레, 체지방률,
            허리-엉덩이 비율(WHR) 등의 지표를 함께 확인하는 것이 좋습니다.
            특히 허리둘레는 내장지방을 간접적으로 측정할 수 있어, 남성 90cm,
            여성 85cm 이상이면 복부비만으로 판정합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            BMI 계산기로 간편하게 확인
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            자신의 BMI를 빠르게 확인하고 싶다면{" "}
            <a
              href="https://tools.dhlm-studio.com/bmi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM BMI 계산기
            </a>
            를 사용해보세요. 키와 체중만 입력하면 BMI 수치와 함께 한국인 기준
            비만도 분류를 바로 확인할 수 있습니다. 정기적으로 BMI를 체크하면서
            건강한 체중을 유지하는 습관을 들여보세요. 급격한 다이어트보다는
            꾸준한 운동과 균형 잡힌 식단이 장기적인 건강 관리의 핵심입니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/bmi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM BMI 계산기
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
                href="/blog/unit-converter-guide"
                className="text-[#31A575] font-medium hover:underline"
              >
                단위 변환기 - 길이 무게 면적 한번에
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
