import type { Metadata } from "next";
import EmojiSearch from "./EmojiSearch";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "이모지 검색 - 이모티콘 찾기 & 복사 | DHLM Tools",
  description: "키워드로 이모지를 검색하고 클릭하면 바로 복사됩니다.",
  openGraph: {
    title: "Emoji Search & Copy | DHLM Studio",
    description: "Search and copy emojis easily. Browse all emojis by category.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/gen/emoji-search",
    languages: {
      "ko": "https://dhlm-studio.com/tools/gen/emoji-search",
      "en": "https://dhlm-studio.com/tools/gen/emoji-search",
      "x-default": "https://dhlm-studio.com/tools/gen/emoji-search",
    },
  },
};

export default function EmojiSearchPage() {
  return (
    <CalculatorLayout title="이모지 검색" category="생성기">
      <EmojiSearch />
    </CalculatorLayout>
  );
}
