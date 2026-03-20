import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | DHLM-STUDIO",
  description: "DHLM-STUDIO 이용약관",
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          이용약관
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          시행일: 2026년 3월 20일
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제1조 (목적)
            </h2>
            <p>
              이 약관은 DHLM-STUDIO(이하 &ldquo;회사&rdquo;)가 제공하는 웹사이트 및
              모바일 애플리케이션 서비스(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여
              회사와 이용자 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을
              규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제2조 (정의)
            </h2>
            <ul className="list-decimal pl-5 space-y-2">
              <li>
                &ldquo;서비스&rdquo;란 회사가 제공하는 모든 웹사이트 및 모바일
                애플리케이션을 의미합니다. 이에는 &ldquo;오늘 뭐먹?&rdquo;, &ldquo;똑(Ttok)&rdquo;,
                &ldquo;App Factory&rdquo; 및 기타 회사가 운영하는 서비스가
                포함됩니다.
              </li>
              <li>
                &ldquo;이용자&rdquo;란 회사의 서비스에 접속하여 이 약관에 따라
                회사가 제공하는 서비스를 이용하는 모든 사람을 말합니다.
              </li>
              <li>
                &ldquo;콘텐츠&rdquo;란 서비스 내에서 이용자가 생성하거나 회사가
                제공하는 모든 텍스트, 이미지, 데이터 등을 의미합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제3조 (서비스의 내용)
            </h2>
            <p>회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                오늘 뭐먹?: 함께 메뉴를 선택하는 의사결정 서비스
              </li>
              <li>
                똑(Ttok): 취향 싱크로율 테스트 서비스
              </li>
              <li>
                App Factory: 실용 계산기 및 도구 모바일 앱
              </li>
              <li>기타 회사가 추가로 개발하여 제공하는 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제4조 (서비스의 이용)
            </h2>
            <ul className="list-decimal pl-5 space-y-2">
              <li>
                서비스는 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴,
                1일 24시간 제공함을 원칙으로 합니다.
              </li>
              <li>
                회사는 서비스의 제공에 필요한 경우 정기 점검을 실시할 수
                있으며, 정기 점검 시간은 서비스 내에 사전 공지합니다.
              </li>
              <li>
                회사는 컴퓨터 등 정보통신설비의 보수 점검, 교체 및 고장,
                통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을
                일시적으로 중단할 수 있습니다.
              </li>
              <li>
                일부 서비스는 회원 가입 없이 이용할 수 있으며, 별도의 회원
                가입이 필요한 서비스는 해당 서비스 내에서 안내합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제5조 (이용자의 의무)
            </h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>서비스 이용 시 허위 정보를 제공하는 행위</li>
              <li>타인의 개인정보를 도용하는 행위</li>
              <li>
                서비스를 이용하여 법령 또는 이 약관이 금지하는 행위를 하는
                행위
              </li>
              <li>서비스의 안정적 운영을 방해하는 행위</li>
              <li>
                서비스를 통해 얻은 정보를 회사의 사전 승인 없이 복제, 유통,
                상업적으로 이용하는 행위
              </li>
              <li>
                타인의 명예를 훼손하거나 불이익을 주는 행위
              </li>
              <li>
                서비스에 대한 리버스 엔지니어링, 디컴파일, 디스어셈블 및 기타
                일체의 가공 행위
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제6조 (회사의 의무)
            </h2>
            <ul className="list-decimal pl-5 space-y-2">
              <li>
                회사는 관련 법령과 이 약관이 금지하거나 미풍양속에 반하는
                행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기
                위하여 최선을 다합니다.
              </li>
              <li>
                회사는 이용자의 개인정보를 보호하기 위해
                개인정보처리방침을 수립하고 이를 준수합니다.
              </li>
              <li>
                회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나
                불만이 정당하다고 인정할 경우 이를 처리하여야 합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제7조 (면책 조항)
            </h2>
            <ul className="list-decimal pl-5 space-y-2">
              <li>
                회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등
                불가항력적인 사유가 발생한 경우 서비스 제공에 대한 책임이
                면제됩니다.
              </li>
              <li>
                회사는 이용자의 귀책 사유로 인한 서비스 이용의 장애에 대하여
                책임을 지지 않습니다.
              </li>
              <li>
                회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못한
                것에 대하여 책임을 지지 않으며, 서비스를 통하여 얻은 정보에
                대한 취사선택 또는 이용으로 발생하는 손해에 대해서는 책임을
                지지 않습니다.
              </li>
              <li>
                서비스에서 제공하는 계산 결과, 분석 데이터 등은 참고용이며,
                이를 근거로 한 의사결정에 대해 회사는 책임을 지지 않습니다.
              </li>
              <li>
                무료로 제공되는 서비스 이용과 관련하여 회사는 관련 법령에
                특별한 규정이 없는 한 책임을 지지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제8조 (지적 재산권)
            </h2>
            <ul className="list-decimal pl-5 space-y-2">
              <li>
                서비스에 대한 저작권 및 지적 재산권은 회사에 귀속됩니다.
              </li>
              <li>
                이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승인
                없이 복제, 전송, 출판, 배포, 방송, 기타 방법에 의하여
                영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안
                됩니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제9조 (약관의 변경)
            </h2>
            <ul className="list-decimal pl-5 space-y-2">
              <li>
                회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며,
                변경된 약관은 서비스 내 공지사항을 통해 공지합니다.
              </li>
              <li>
                변경된 약관은 공지 후 7일이 경과한 날로부터 효력이
                발생합니다.
              </li>
              <li>
                이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을
                중단할 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              제10조 (분쟁 해결)
            </h2>
            <ul className="list-decimal pl-5 space-y-2">
              <li>
                회사와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법률에
                따릅니다.
              </li>
              <li>
                서비스 이용과 관련하여 분쟁이 발생한 경우 양 당사자는 분쟁의
                해결을 위해 성실히 협의합니다.
              </li>
              <li>
                협의에 의해 해결되지 않는 경우, 회사의 소재지를 관할하는
                법원을 전속 관할 법원으로 합니다.
              </li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <p className="text-gray-500">
              <strong>부칙</strong>
            </p>
            <p className="text-gray-500 mt-2">
              이 약관은 2026년 3월 20일부터 시행합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
