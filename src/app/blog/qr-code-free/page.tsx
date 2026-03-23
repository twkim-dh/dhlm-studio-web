import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "무료 QR코드 생성기 사용법 | DHLM-STUDIO 블로그",
  description:
    "무료 QR코드 생성기로 URL, 텍스트, 명함 등의 QR코드를 만드는 방법을 알아봅니다. QR코드 활용 사례와 만들기 팁을 소개합니다.",
  openGraph: {
    title: "무료 QR코드 생성기 사용법",
    description:
      "무료 QR코드 생성기 사용법과 활용 사례를 소개합니다.",
    url: "https://dhlm-studio.com/blog/qr-code-free",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function QrCodeFreePage() {
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
            무료 QR코드 생성기 사용법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            QR코드란 무엇인가
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            QR코드(Quick Response Code)는 2차원 매트릭스 바코드로, 스마트폰
            카메라로 스캔하면 URL, 텍스트, 연락처 등의 정보를 즉시 읽을 수
            있습니다. 기존 1차원 바코드에 비해 훨씬 많은 정보를 담을 수 있으며,
            일부가 손상되어도 읽을 수 있는 오류 복원 기능이 있습니다. 코로나
            이후 출입 관리, 전자 메뉴판, 모바일 결제 등에 널리 사용되면서 이제는
            일상에서 빼놓을 수 없는 기술이 되었습니다. 개인도 명함, 블로그,
            SNS 링크 등을 QR코드로 만들어 활용할 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            QR코드 만드는 방법
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            QR코드를 만드는 과정은 매우 간단합니다.{" "}
            <a
              href="https://tools.dhlm-studio.com/qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM QR코드 생성기
            </a>
            에 접속한 뒤, 변환하고 싶은 내용(URL, 텍스트, 전화번호, Wi-Fi
            정보 등)을 입력하면 QR코드가 자동 생성됩니다. 생성된 QR코드는
            PNG 또는 SVG 형식으로 다운로드할 수 있어 인쇄물, 웹사이트,
            프레젠테이션 등에 바로 활용할 수 있습니다. 회원가입이나 비용 없이
            무제한으로 생성 가능합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            QR코드 활용 사례
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            소규모 사업자라면 매장 테이블에 메뉴판 QR코드를 놓아 종이 메뉴판
            인쇄 비용을 줄일 수 있습니다. 네이버 스마트스토어나 쿠팡 판매자는
            제품 포장에 리뷰 작성 페이지 QR코드를 넣어 리뷰를 유도할 수
            있습니다. 행사나 세미나에서는 설문조사 링크를 QR코드로 공유하면
            참가자 응답률이 높아집니다. 명함에 QR코드를 넣으면 연락처를
            일일이 입력할 필요 없이 스캔 한 번으로 저장할 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            QR코드 생성 시 주의사항
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            QR코드를 만들 때 몇 가지 주의할 점이 있습니다. 첫째, URL은 가능한
            짧게 만드세요. 긴 URL은 QR코드가 복잡해져 인식률이 떨어질 수
            있습니다. URL 단축 서비스를 활용하는 것도 좋습니다. 둘째, 인쇄 시
            최소 2cm x 2cm 이상의 크기를 유지해야 스캔이 원활합니다. 셋째,
            QR코드 주변에 충분한 여백(quiet zone)을 확보해야 합니다. 넷째,
            생성 후 반드시 실제 스마트폰으로 스캔 테스트를 해보세요.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 무료 QR코드 생성기
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
                href="/blog/image-compress-free"
                className="text-[#31A575] font-medium hover:underline"
              >
                이미지 용량 줄이기 무료 방법
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
