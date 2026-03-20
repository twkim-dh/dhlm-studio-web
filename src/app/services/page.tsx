import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스 | DHLM-STUDIO",
  description: "DHLM-STUDIO의 서비스를 소개합니다. 오늘 뭐먹?, 똑(Ttok), App Factory.",
};

const services = [
  {
    emoji: "\uD83C\uDF5D",
    title: "오늘 뭐먹?",
    subtitle: "함께 고르는 오늘의 저녁 메뉴",
    color: "#FF8C42",
    status: "coming-soon",
    description:
      "매일 저녁, 뭐 먹을지 고민하는 시간을 줄여드립니다. '오늘 뭐먹?'은 두 사람이 각자 먹고 싶은 메뉴 3개를 고르면, 겹치는 메뉴를 찾아 오늘의 저녁을 결정해주는 서비스입니다.",
    features: [
      "각자 메뉴 3개 선택 - 한식, 중식, 일식, 양식 등 다양한 카테고리에서 선택",
      "카카오톡 링크 공유 - 별도 앱 설치 없이 링크 하나로 참여",
      "실시간 매칭 결과 - 상대방이 선택을 완료하면 즉시 결과 확인",
      "겹치는 메뉴가 없을 때 - 랜덤 추천으로 새로운 메뉴 발견",
      "히스토리 저장 - 이전에 함께 선택한 메뉴 기록 보기",
    ],
  },
  {
    emoji: "\uD83D\uDC95",
    title: "똑(Ttok)",
    subtitle: "취향 싱크로율 테스트",
    color: "#FF6B6B",
    status: "live",
    link: "https://ttok.dhlm-studio.com",
    description:
      "친구, 연인, 가족과 취향이 얼마나 통하는지 궁금하지 않으셨나요? '똑(Ttok)'은 다양한 질문에 대한 서로의 답변을 비교해 취향 싱크로율을 알려주는 서비스입니다. 내가 만든 질문으로 상대방을 테스트해보세요.",
    features: [
      "나만의 테스트 만들기 - 직접 질문과 선택지를 구성",
      "카카오톡으로 공유 - 링크를 보내 상대방 참여 유도",
      "싱크로율 분석 - 퍼센트로 보는 취향 일치도",
      "결과 공유 - 재미있는 결과를 SNS에 공유",
      "익명 참여 - 회원가입 없이 누구나 참여 가능",
    ],
  },
  {
    emoji: "\uD83D\uDCF1",
    title: "App Factory",
    subtitle: "일상을 위한 28가지 실용 도구",
    color: "#31A575",
    status: "coming-soon",
    description:
      "DHLM-STUDIO의 App Factory는 일상에서 자주 필요한 계산기와 도구를 모바일 앱으로 만들어 제공합니다. CBM 계산기, VAT 계산기, BMI 계산기 등 28개 이상의 앱을 14개 언어로 지원하며, Google Play에서 만나보실 수 있습니다.",
    features: [
      "28개 이상의 실용 앱 - 물류, 건설, 금융, 건강 등 다양한 분야",
      "14개 언어 지원 - 한국어, 영어, 일본어, 스페인어 등 글로벌 대응",
      "오프라인 사용 가능 - 인터넷 없이도 핵심 기능 사용",
      "깔끔한 UI - 직관적이고 사용하기 쉬운 인터페이스",
      "지속적인 업데이트 - 사용자 피드백 반영 및 기능 개선",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="py-16 sm:py-24">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 text-center mb-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
          서비스 소개
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          일상의 결정을 함께, 더 재밌게 만드는 DHLM-STUDIO의 서비스들을
          소개합니다.
        </p>
      </section>

      {/* Service sections */}
      <div className="space-y-24 sm:space-y-32">
        {services.map((service, index) => (
          <section
            key={service.title}
            className={index % 2 === 1 ? "bg-gray-50 py-16 sm:py-20" : ""}
          >
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <div className="grid gap-10 lg:grid-cols-2 items-start">
                {/* Left: info */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="text-5xl sm:text-6xl">{service.emoji}</span>
                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {service.title}
                    </h2>
                    {service.status === "live" ? (
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: service.color }}
                      >
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-500">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-1 text-base font-medium"
                    style={{ color: service.color }}
                  >
                    {service.subtitle}
                  </p>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  {service.status === "live" && service.link && (
                    <Link
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
                      style={{ backgroundColor: service.color }}
                    >
                      지금 체험하기
                    </Link>
                  )}
                </div>

                {/* Right: features */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">
                      주요 기능
                    </h3>
                    <ul className="space-y-4">
                      {service.features.map((feature) => {
                        const [title, ...rest] = feature.split(" - ");
                        const desc = rest.join(" - ");
                        return (
                          <li key={feature} className="flex gap-3">
                            <span
                              className="mt-1 flex-shrink-0 w-2 h-2 rounded-full"
                              style={{ backgroundColor: service.color }}
                            />
                            <div>
                              <span className="font-semibold text-gray-900 text-sm">
                                {title}
                              </span>
                              {desc && (
                                <span className="text-gray-600 text-sm">
                                  {" "}
                                  - {desc}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
