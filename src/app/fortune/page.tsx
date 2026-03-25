import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 운세 | DHLM-STUDIO",
  description:
    "매일 새로운 운세가 기다려요! 오늘의 운세, 타로, 궁합, 이름 운세를 무료로 확인하세요.",
  openGraph: {
    title: "오늘의 운세 | DHLM-STUDIO",
    description: "매일 새로운 운세가 기다려요! 무료 운세, 타로, 궁합 확인",
    url: "https://dhlm-studio.com/fortune",
  },
};

const fortuneCards = [
  {
    emoji: "🔮",
    title: "오늘의 운세",
    description: "생년월일로 보는 오늘의 총 운세",
    href: "/fortune/daily",
    gradient: "from-purple-600 to-indigo-700",
  },
  {
    emoji: "🃏",
    title: "타로 카드",
    description: "3장의 카드가 전하는 과거·현재·미래",
    href: "/fortune/tarot",
    gradient: "from-violet-600 to-purple-800",
  },
  {
    emoji: "💕",
    title: "궁합 보기",
    description: "나와 그 사람의 궁합은 몇 %?",
    href: "/fortune/compatibility",
    gradient: "from-pink-500 to-rose-700",
  },
  {
    emoji: "✍️",
    title: "이름 운세",
    description: "내 이름에 담긴 운명의 점수",
    href: "/fortune/name",
    gradient: "from-amber-500 to-orange-700",
  },
];

export default function FortunePage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)" }}>
      <div className="mx-auto max-w-lg px-5 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-3">
            운세의 방 ✨
          </h1>
          <p className="text-lg text-purple-200">
            매일 새로운 운세가 기다려요
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4">
          {fortuneCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <div
                className={`bg-gradient-to-r ${card.gradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{card.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {card.title}
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                      {card.description}
                    </p>
                  </div>
                  <svg
                    className="ml-auto w-6 h-6 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-purple-300 text-xs mt-8">
          모든 운세는 재미 목적이며, 알고리즘 기반으로 생성됩니다.
        </p>
      </div>
    </div>
  );
}
