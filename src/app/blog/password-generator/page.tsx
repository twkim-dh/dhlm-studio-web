import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "안전한 비밀번호 만드는 법 | DHLM-STUDIO 블로그",
  description:
    "안전한 비밀번호를 만드는 방법과 관리 팁을 알아봅니다. 무료 비밀번호 생성기를 활용한 강력한 비밀번호 만들기를 소개합니다.",
  openGraph: {
    title: "안전한 비밀번호 만드는 법",
    description:
      "안전한 비밀번호 생성 방법과 관리 팁을 소개합니다.",
    url: "https://dhlm-studio.com/blog/password-generator",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "article",
  },
};

export default function PasswordGeneratorPage() {
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
            안전한 비밀번호 만드는 법
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <time>2026-03-23</time>
            <span>|</span>
            <span>DHLM-STUDIO</span>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            왜 강력한 비밀번호가 중요한가
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            매년 수백만 건의 개인정보 유출 사고가 발생하고 있습니다. 해커들은
            유출된 비밀번호 데이터베이스를 활용하여 다른 사이트에 같은
            비밀번호로 로그인을 시도하는 크리덴셜 스터핑 공격을 합니다. 만약
            여러 사이트에서 같은 비밀번호를 사용하고 있다면, 하나의 사이트가
            해킹되면 모든 계정이 위험해집니다. 또한 짧고 단순한 비밀번호는
            무차별 대입 공격(브루트포스)으로 몇 초 만에 뚫릴 수 있습니다.
            &ldquo;123456&rdquo;, &ldquo;password&rdquo;, &ldquo;qwerty&rdquo;
            같은 비밀번호는 해커가 가장 먼저 시도하는 비밀번호 목록에 포함되어
            있어 절대 사용해서는 안 됩니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            강력한 비밀번호의 조건
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            안전한 비밀번호는 최소 12자 이상이어야 합니다. 대문자, 소문자,
            숫자, 특수문자를 모두 포함하는 것이 좋습니다. 사전에 있는 단어,
            개인 정보(생년월일, 전화번호, 이름), 연속된 문자(abcd, 1234)는
            피해야 합니다. 예를 들어 &ldquo;G#m9$kP2vX!q&rdquo;는 12자에 모든
            종류의 문자가 포함되어 강력한 비밀번호입니다. 하지만 이런 비밀번호를
            직접 만들고 외우기는 어렵기 때문에, 비밀번호 생성기를 활용하는
            것이 현실적입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            비밀번호 생성기 활용
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <a
              href="https://tools.dhlm-studio.com/password-gen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31A575] font-medium hover:underline"
            >
              DHLM 비밀번호 생성기
            </a>
            를 사용하면 원하는 길이와 포함 문자 종류를 설정하여 강력한
            비밀번호를 즉시 만들 수 있습니다. 생성된 비밀번호의 강도도 함께
            표시되어, 충분히 안전한지 확인할 수 있습니다. 한 번 클릭으로 여러
            개의 비밀번호를 생성할 수 있어, 사이트마다 다른 비밀번호를 설정하기
            편리합니다. 생성은 브라우저에서 처리되므로 서버에 전송되지 않아
            안전합니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            비밀번호 관리 팁
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            사이트마다 다른 강력한 비밀번호를 사용하되, 모든 것을 외우려 하지
            마세요. 비밀번호 관리 프로그램(1Password, Bitwarden 등)을 사용하면
            마스터 비밀번호 하나만 기억하면 됩니다. 이중 인증(2FA)을 지원하는
            사이트에서는 반드시 활성화하세요. 비밀번호가 유출되더라도 2FA가
            있으면 계정을 보호할 수 있습니다. 3~6개월마다 중요한 계정의
            비밀번호를 변경하고, 의심스러운 로그인 알림을 받으면 즉시
            비밀번호를 바꾸세요.
          </p>
        </div>

        <div className="mt-14 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 서비스</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://tools.dhlm-studio.com/password-gen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#31A575] font-medium hover:underline"
              >
                DHLM 비밀번호 생성기
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/blog/json-formatter-online"
                className="text-[#31A575] font-medium hover:underline"
              >
                JSON 포맷터 온라인 무료 사용법
              </Link>
            </li>
            <li>
              <Link
                href="/blog/online-tools-free"
                className="text-[#31A575] font-medium hover:underline"
              >
                무료 온라인 계산기 모음 80개
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
