import type { Metadata } from "next";
import HashtagGen from "./HashtagGen";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "해시태그 생성기 - 인스타그램 해시태그 추천 | DHLM Tools",
  description: "키워드를 입력하면 인스타그램, 틱톡에서 사용할 해시태그를 추천합니다.",
  openGraph: {
    title: "Hashtag Generator | DHLM Studio",
    description: "Generate trending hashtags for Instagram, TikTok and social media.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/gen/hashtag-gen",
    languages: {
      "ko": "https://dhlm-studio.com/tools/gen/hashtag-gen",
      "en": "https://dhlm-studio.com/tools/gen/hashtag-gen",
      "x-default": "https://dhlm-studio.com/tools/gen/hashtag-gen",
    },
  },
};

export default function HashtagGenPage() {
  return (
    <CalculatorLayout title="해시태그 생성기" category="생성기">
      <HashtagGen />
    </CalculatorLayout>
  );
}
