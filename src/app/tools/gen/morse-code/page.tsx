import type { Metadata } from "next";
import MorseCode from "./MorseCode";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "모스 부호 변환기 - 텍스트 ↔ 모스부호 | DHLM Tools",
  description: "텍스트를 모스 부호로, 모스 부호를 텍스트로 변환합니다.",
  openGraph: {
    title: "Morse Code Translator | DHLM Studio",
    description: "Convert text to Morse code and Morse code to text.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/gen/morse-code",
    languages: {
      "ko": "https://dhlm-studio.com/tools/gen/morse-code",
      "en": "https://dhlm-studio.com/tools/gen/morse-code",
      "x-default": "https://dhlm-studio.com/tools/gen/morse-code",
    },
  },
};

export default function MorseCodePage() {
  return (
    <CalculatorLayout title="모스 부호 변환기" category="생성기">
      <MorseCode />
    </CalculatorLayout>
  );
}
