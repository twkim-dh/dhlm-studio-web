import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이미지 용량 줄이기 무료 방법 | DHLM-STUDIO 블로그",
  description:
    "이미지 파일 용량을 무료로 줄이는 방법을 알아봅니다. 화질 손실 없이 이미지를 압축하는 기법과 무료 온라인 도구를 소개합니다.",
  openGraph: {
    title: "이미지 용량 줄이기 무료 방법",
    description:
      "화질 손실 없이 이미지 용량을 줄이는 방법을 소개합니다.",
    url: "https://dhlm-studio.com/blog/image-compress-free",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function ImageCompressFreePage() {
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
            이미지 용량 줄이기 무료 방법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            이미지 용량을 줄여야 하는 이유
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            웹사이트에 올리는 이미지, 이메일 첨부 파일, 블로그 포스팅, SNS
            업로드 등 다양한 상황에서 이미지 용량이 문제가 됩니다. 용량이 큰
            이미지는 웹페이지 로딩 속도를 느리게 만들어 사용자 경험을 떨어뜨리고,
            검색엔진 최적화(SEO)에도 불리합니다. 이메일 첨부 파일 크기 제한에
            걸리는 경우도 많습니다. 스마트폰으로 촬영한 사진은 한 장에 5~10MB가
            넘는 경우가 많아, 여러 장을 한 번에 공유하기 어렵습니다. 이미지
            압축을 통해 용량을 줄이면 이런 문제를 모두 해결할 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            이미지 압축의 원리
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            이미지 압축은 크게 손실 압축과 무손실 압축으로 나뉩니다. 무손실
            압축은 화질 저하 없이 파일 크기를 줄이는 방식으로, 주로 PNG
            파일에서 불필요한 메타데이터를 제거하거나 색상 팔레트를 최적화하는
            방법입니다. 손실 압축은 눈에 띄지 않는 수준으로 화질을 조금
            낮추면서 용량을 대폭 줄이는 방식으로, JPEG 형식에서 주로
            사용됩니다. 최신 형식인 WebP는 같은 화질에서 JPEG 대비 25~35%
            더 작은 용량을 달성할 수 있어 웹에서 점점 더 많이 채택되고 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            무료 이미지 압축 도구
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            온라인에서 무료로 사용할 수 있는 이미지 압축 도구가 많습니다.{" "}
            <a
              href="https://tools.dhlm-studio.com/image-compress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 이미지 압축기
            </a>
            는 드래그 앤 드롭으로 이미지를 업로드하면 자동으로 최적의 압축률을
            적용합니다. 여러 장을 한 번에 압축할 수 있으며, 압축 전후 용량
            비교를 바로 확인할 수 있습니다. 서버에 이미지를 업로드하지 않고
            브라우저에서 직접 처리하므로 개인정보 걱정도 없습니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            이미지 최적화 추가 팁
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            압축 외에도 이미지 용량을 줄이는 방법이 있습니다. 첫째, 실제
            사용할 크기에 맞게 리사이즈하세요. 웹에 표시되는 크기가 800px인데
            4000px 원본을 올릴 필요가 없습니다. 둘째, 적절한 파일 형식을
            선택하세요. 사진은 JPEG나 WebP, 로고나 아이콘은 PNG나 SVG가
            적합합니다. 셋째, 메타데이터(EXIF 정보)를 제거하면 약간의 용량을
            절약할 수 있습니다. 이런 방법들을 조합하면 원본 대비 80% 이상
            용량을 줄이면서도 충분한 화질을 유지할 수 있습니다.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/image-compress"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 이미지 압축기
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/youtube-thumbnail-download"
                className="text-[#31A575] font-medium hover:underline"
              >
                유튜브 썸네일 다운로드 방법
              </Link>
            </li>
            <li>
              <Link
                href="/blog/qr-code-free"
                className="text-[#31A575] font-medium hover:underline"
              >
                무료 QR코드 생성기 사용법
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
