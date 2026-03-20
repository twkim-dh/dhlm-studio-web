import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개 | DHLM-STUDIO",
  description: "DHLM-STUDIO는 함께 고르는 즐거움을 만드는 앱 개발 스튜디오입니다.",
};

const timeline = [
  {
    date: "2026년 1월",
    title: "DHLM-STUDIO 설립",
    description: "일상의 결정을 함께 만드는 서비스를 꿈꾸며 출발",
  },
  {
    date: "2026년 2월",
    title: "App Factory 런칭",
    description: "28개 이상의 실용 계산기 및 도구 앱 개발 시작",
  },
  {
    date: "2026년 3월",
    title: "똑(Ttok) 서비스 오픈",
    description: "취향 싱크로율 테스트 웹 서비스 정식 출시",
  },
  {
    date: "2026년 상반기",
    title: "오늘 뭐먹? 준비 중",
    description: "함께 메뉴를 고르는 서비스 개발 진행 중",
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 text-center mb-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
          DHLM-STUDIO를 소개합니다
        </h1>
        <p
          className="text-xl sm:text-2xl font-bold"
          style={{ color: "var(--brand-green)" }}
        >
          함께 고르는 즐거움을 만듭니다
        </p>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 mb-20">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            DHLM-STUDIO는 2026년, &ldquo;일상의 작은 결정들을 더 즐겁게 만들 수
            있지 않을까?&rdquo;라는 질문에서 시작되었습니다. 매일 반복되는 &ldquo;오늘
            뭐 먹지?&rdquo;, &ldquo;우리 취향이 얼마나 비슷할까?&rdquo;와 같은
            소소한 고민들을 재미있는 경험으로 바꾸는 것이 우리의 목표입니다.
          </p>
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            우리는 기술이 사람과 사람 사이를 연결하는 다리가 되어야 한다고
            믿습니다. 혼자 고민하는 대신 함께 고르고, 함께 결정하는 과정에서
            생기는 즐거움 - 그것이 DHLM-STUDIO가 추구하는 가치입니다.
          </p>
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            모바일 앱 개발 스튜디오로서 28개 이상의 실용적인 앱을 14개 언어로
            제공하며, 전 세계 사용자들이 일상에서 필요로 하는 도구를 만들고
            있습니다. CBM 계산기부터 BMI 계산기, VAT 계산기까지 다양한 분야의
            실용 앱은 Google Play를 통해 만나보실 수 있습니다.
          </p>
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            앞으로도 DHLM-STUDIO는 사람들의 일상에 &lsquo;함께&rsquo;라는 가치를
            더하는 서비스를 만들어 나가겠습니다. 작은 결정 하나에도 즐거움이
            있도록, 우리는 계속 새로운 도전을 이어갑니다.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16 sm:py-20 mb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--brand-green)" }}
              >
                Mission
              </h2>
              <p className="text-xl font-bold text-gray-900 mb-3">
                함께 고르는 즐거움을 만듭니다
              </p>
              <p className="text-gray-600 leading-relaxed">
                일상 속 크고 작은 결정의 순간에 함께할 수 있는 서비스를 만들어,
                선택의 과정 자체를 즐거운 경험으로 바꿉니다.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--brand-orange)" }}
              >
                Vision
              </h2>
              <p className="text-xl font-bold text-gray-900 mb-3">
                모든 일상의 결정에 &lsquo;함께&rsquo;를 더합니다
              </p>
              <p className="text-gray-600 leading-relaxed">
                전 세계 사람들이 매일의 결정을 더 쉽고 재미있게 함께 내릴 수 있는
                플랫폼을 만들어 나갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
          여정
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-10">
            {timeline.map((item, index) => (
              <div
                key={item.date}
                className={`relative flex items-start gap-6 ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white z-10"
                  style={{ backgroundColor: "var(--brand-green)" }}
                />

                {/* Content */}
                <div
                  className={`ml-10 sm:ml-0 sm:w-1/2 ${
                    index % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"
                  }`}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--brand-green)" }}
                  >
                    {item.date}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
