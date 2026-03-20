import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import ContactForm from "@/components/ContactForm";

const services = [
  {
    emoji: "\uD83C\uDF5D",
    title: "오늘 뭐먹?",
    description:
      "매일 저녁 뭐 먹을지 고민될 때, 링크 하나로 함께 고르세요. 각자 메뉴 3개를 고르면 겹치는 메뉴가 오늘의 저녁이 됩니다.",
    features: ["카카오톡 공유", "실시간 결과", "메뉴 매칭"],
    color: "#FF8C42",
    status: "coming-soon" as const,
  },
  {
    emoji: "\uD83D\uDC95",
    title: "똑(Ttok)",
    description:
      "친구, 연인과 취향 싱크로율을 확인해보세요. 서로의 답변을 비교해 얼마나 통하는지 알 수 있습니다.",
    features: ["취향 테스트", "싱크로율", "카카오 공유", "결과 분석"],
    color: "#FF6B6B",
    status: "live" as const,
    link: "https://ttok.dhlm-studio.com",
  },
  {
    emoji: "\uD83D\uDCF1",
    title: "App Factory",
    description:
      "일상에 필요한 28가지 실용 계산기와 도구. CBM 계산기, VAT 계산기, BMI 계산기 등 다양한 실용 앱을 만듭니다.",
    features: ["28+ 앱", "14개 언어", "Google Play", "실용 도구"],
    color: "#31A575",
    status: "coming-soon" as const,
  },
];

const steps = [
  {
    emoji: "\uD83C\uDFAF",
    title: "메뉴 3개 고르기",
    description: "오늘 먹고 싶은 메뉴를 3개 골라주세요",
  },
  {
    emoji: "\uD83D\uDCF1",
    title: "카톡 공유",
    description: "링크를 상대방에게 카카오톡으로 공유하세요",
  },
  {
    emoji: "\uD83C\uDF89",
    title: "겹치는 메뉴 = 오늘의 저녁",
    description: "서로 겹치는 메뉴가 오늘의 저녁 메뉴가 됩니다",
  },
];

const stats = [
  { number: "28+", label: "앱" },
  { number: "14", label: "언어" },
  { number: "5+", label: "서비스" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/40 to-orange-50/30 py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-tight">
            함께 고르는{" "}
            <span style={{ color: "var(--brand-green)" }}>즐거움</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            매일의 작은 결정을 재밌게 만드는 서비스를 만듭니다
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#services"
              className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              서비스 둘러보기
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold border-2 transition-colors hover:bg-gray-50"
              style={{
                borderColor: "var(--brand-green)",
                color: "var(--brand-green)",
              }}
            >
              문의하기
            </Link>
          </div>
        </div>

        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: "var(--brand-green)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: "var(--brand-orange)" }}
        />
      </section>

      {/* Services */}
      <section id="services" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              우리의 서비스
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              일상의 결정을 함께, 더 재밌게
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              이렇게 사용해요
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              &ldquo;오늘 뭐먹?&rdquo; 3단계로 끝!
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm text-4xl">
                  {step.emoji}
                </div>
                <div
                  className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "var(--brand-green)" }}
                >
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 text-2xl">
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-4xl sm:text-5xl lg:text-6xl font-black"
                  style={{ color: "var(--brand-green)" }}
                >
                  {stat.number}
                </div>
                <div className="mt-2 text-sm sm:text-base font-medium text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                DHLM-STUDIO를 소개합니다
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                DHLM-STUDIO는 &ldquo;함께 고르는 즐거움&rdquo;이라는 가치 아래,
                일상 속 작은 결정들을 더 재미있고 의미 있게 만드는 서비스를
                개발합니다.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                2026년에 설립된 DHLM-STUDIO는 모바일 앱과 웹 서비스를 통해
                사람들이 함께 결정하고, 함께 즐기는 경험을 만들어갑니다.
              </p>
              <p className="text-gray-600 leading-relaxed">
                28개 이상의 실용 앱을 14개 언어로 제공하며, 전 세계 사용자들이
                일상에서 필요로 하는 도구를 만들고 있습니다.
              </p>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--brand-green)" }}
                >
                  Mission
                </h3>
                <p className="text-gray-700 font-medium">
                  함께 고르는 즐거움을 만듭니다
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--brand-orange)" }}
                >
                  Vision
                </h3>
                <p className="text-gray-700 font-medium">
                  모든 일상의 결정에 &lsquo;함께&rsquo;를 더합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              문의하기
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              궁금한 점이 있으시면 언제든 연락해주세요
            </p>
            <a
              href="mailto:tw.kim@dhlm.co.kr"
              className="mt-3 inline-block text-base font-medium transition-colors hover:underline"
              style={{ color: "var(--brand-green)" }}
            >
              tw.kim@dhlm.co.kr
            </a>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
