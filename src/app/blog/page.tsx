import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "블로그 | DHLM-STUDIO",
  description:
    "DHLM-STUDIO 블로그 - 메뉴 고르기, 취향 테스트, 밸런스 게임 등 일상 속 결정을 재밌게 만드는 팁과 이야기를 나눕니다.",
  openGraph: {
    title: "블로그 | DHLM-STUDIO",
    description:
      "일상 속 결정을 재밌게 만드는 팁과 이야기를 나눕니다.",
    url: "https://dhlm-studio.com/blog",
    siteName: "DHLM-STUDIO",
    locale: "ko_KR",
    type: "website",
  },
};

const posts = [
  {
    slug: "how-to-choose-menu",
    title: "매일 저녁 메뉴 고르기가 힘든 이유와 해결법",
    excerpt:
      "결정 피로란 무엇인지, 커플과 가족 사이 메뉴 갈등의 원인은 무엇인지, 그리고 함께 고르기 도구를 활용해 저녁 메뉴 스트레스를 줄이는 방법을 알아봅니다.",
    date: "2026-03-21",
  },
  {
    slug: "couple-compatibility-test",
    title: "연인 취향 테스트로 알아보는 우리의 궁합",
    excerpt:
      "취향 싱크로율이 관계에서 왜 중요한지, 똑(Ttok) 서비스를 통해 연인과의 궁합을 재밌게 확인하는 방법을 소개합니다.",
    date: "2026-03-21",
  },
  {
    slug: "food-matching-guide",
    title: "음식 취향으로 보는 성격 유형 가이드",
    excerpt:
      "짜장면 vs 짬뽕 논쟁부터 매운 음식 선호도까지, 음식 취향에 숨겨진 성격 유형을 분석해봅니다.",
    date: "2026-03-21",
  },
  {
    slug: "balance-game-ideas",
    title: "친구와 함께하면 재밌는 밸런스 게임 모음",
    excerpt:
      "MZ세대에서 유행하는 밸런스 게임 주제 10가지와 활용 팁을 소개합니다. 모임에서 바로 써먹을 수 있는 아이디어 모음입니다.",
    date: "2026-03-21",
  },
  {
    slug: "daily-decision-tips",
    title: "일상 속 작은 결정을 쉽게 만드는 5가지 방법",
    excerpt:
      "결정 피로를 줄이고 일상의 선택을 가볍게 만드는 실용적인 팁 5가지를 소개합니다.",
    date: "2026-03-21",
  },
];

export default function BlogPage() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            블로그
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            일상 속 결정을 재밌게 만드는 이야기
          </p>
        </div>

        <div className="grid gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-3">
                <time className="text-sm text-gray-400">{post.date}</time>
                <span className="text-sm font-medium text-[#31A575]">
                  DHLM-STUDIO
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#31A575] transition-colors mb-3">
                {post.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[#31A575]">
                자세히 읽기 &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
