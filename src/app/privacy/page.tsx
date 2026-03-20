import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | DHLM-STUDIO",
  description: "DHLM-STUDIO 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          개인정보처리방침
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          시행일: 2026년 3월 20일
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              1. 개인정보의 처리 목적
            </h2>
            <p>
              DHLM-STUDIO(이하 &ldquo;회사&rdquo;)는 다음의 목적을 위하여 개인정보를
              처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
              이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를
              받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>서비스 제공 및 운영: 웹사이트 및 앱 서비스의 원활한 제공</li>
              <li>문의 응대: 사용자 문의에 대한 회신 및 처리</li>
              <li>서비스 개선: 이용 통계 분석 및 서비스 품질 향상</li>
              <li>광고 제공: 맞춤형 광고 제공 (Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              2. 수집하는 개인정보 항목
            </h2>
            <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                <strong>문의 양식:</strong> 이름, 이메일 주소, 문의 내용
              </li>
              <li>
                <strong>자동 수집 정보:</strong> IP 주소, 기기 정보, 브라우저
                유형, 방문 일시, 서비스 이용 기록, 쿠키
              </li>
              <li>
                <strong>앱 서비스:</strong> 기기 식별자(광고 ID), 앱 사용
                통계
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p>
              회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체
              없이 파기합니다. 단, 관련 법령에 의해 보존할 필요가 있는 경우
              해당 법령에서 정한 기간 동안 보존합니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>문의 기록: 응대 완료 후 1년</li>
              <li>서비스 이용 기록: 서비스 종료 시까지</li>
              <li>
                전자상거래법에 따른 기록: 계약 또는 청약철회에 관한 기록 5년,
                대금결제 및 재화 등의 공급에 관한 기록 5년, 소비자 불만 또는
                분쟁처리에 관한 기록 3년
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              4. 개인정보의 제3자 제공
            </h2>
            <p>
              회사는 원칙적으로 사용자의 개인정보를 외부에 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>사용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의한 경우</li>
            </ul>
            <p className="mt-3">
              서비스 운영을 위해 다음의 외부 서비스를 이용하고 있으며, 해당
              서비스의 개인정보 처리에 대해서는 각 서비스의 개인정보처리방침을
              참고해 주십시오.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                <strong>Google AdSense:</strong> 맞춤형 광고 제공을 위한 쿠키 및
                기기 정보 수집
              </li>
              <li>
                <strong>Google Analytics:</strong> 서비스 이용 통계 분석을 위한
                방문 데이터 수집
              </li>
              <li>
                <strong>Firebase:</strong> 앱 서비스 운영, 인증, 데이터 저장을
                위한 정보 처리
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              5. 쿠키(Cookie)의 사용
            </h2>
            <p>
              회사는 서비스 이용 과정에서 쿠키를 사용할 수 있습니다. 쿠키는
              웹사이트가 사용자의 브라우저에 보내는 소량의 데이터로, 사용자의
              컴퓨터에 저장됩니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                <strong>사용 목적:</strong> 사용자 편의 제공, 서비스 이용 분석,
                맞춤형 광고 제공
              </li>
              <li>
                <strong>거부 방법:</strong> 브라우저 설정에서 쿠키 저장을
                거부할 수 있습니다. 다만, 쿠키를 거부할 경우 일부 서비스 이용에
                제한이 있을 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              6. 개인정보의 파기
            </h2>
            <p>
              회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                <strong>전자적 파일 형태:</strong> 복구 및 재생이 불가능한
                방법으로 영구 삭제
              </li>
              <li>
                <strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              7. 정보주체의 권리 및 행사 방법
            </h2>
            <p>사용자는 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p className="mt-3">
              위 권리 행사는 아래 개인정보 보호책임자에게 이메일로 연락하시면
              지체 없이 조치하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              8. 개인정보 보호책임자
            </h2>
            <ul className="list-none space-y-1">
              <li>
                <strong>성명:</strong> 김태우
              </li>
              <li>
                <strong>직위:</strong> 대표
              </li>
              <li>
                <strong>이메일:</strong>{" "}
                <a
                  href="mailto:tw.kim@dhlm.co.kr"
                  className="underline"
                  style={{ color: "var(--brand-green)" }}
                >
                  tw.kim@dhlm.co.kr
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              9. 개인정보처리방침의 변경
            </h2>
            <p>
              이 개인정보처리방침은 2026년 3월 20일부터 적용됩니다. 법령 및
              방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
