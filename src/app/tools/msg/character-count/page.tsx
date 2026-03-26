import type { Metadata } from "next";
import CharacterCount from "./CharacterCount";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "글자수 세기 - 공백 포함/제외 | DHLM Tools",
  description: "텍스트의 글자수, 단어수, 문장수, 줄수를 실시간으로 세어줍니다.",
  openGraph: {
    title: "Character Counter - Word Counter | DHLM Studio",
    description: "Count characters, words, sentences, and paragraphs in text.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/msg/character-count",
    languages: {
      "ko": "https://dhlm-studio.com/tools/msg/character-count",
      "en": "https://dhlm-studio.com/tools/msg/character-count",
      "x-default": "https://dhlm-studio.com/tools/msg/character-count",
    },
  },
};

export default function CharacterCountPage() {
  return (
    <CalculatorLayout title="글자수 세기" category="문서/업무">
      <CharacterCount />
    </CalculatorLayout>
  );
}
