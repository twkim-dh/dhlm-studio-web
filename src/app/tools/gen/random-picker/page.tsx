import type { Metadata } from "next";
import RandomPicker from "./RandomPicker";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "랜덤 뽑기 - 무작위 선택기 | DHLM Tools",
  description: "항목을 입력하고 랜덤으로 하나를 뽑습니다. 제비뽑기, 당첨자 추첨에 사용하세요.",
  openGraph: {
    title: "Random Picker - Decision Maker | DHLM Studio",
    description: "Pick a random item from your list. Great for making decisions.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/gen/random-picker",
    languages: {
      "ko": "https://dhlm-studio.com/tools/gen/random-picker",
      "en": "https://dhlm-studio.com/tools/gen/random-picker",
      "x-default": "https://dhlm-studio.com/tools/gen/random-picker",
    },
  },
};

export default function RandomPickerPage() {
  return (
    <CalculatorLayout title="랜덤 뽑기" category="생성기">
      <RandomPicker />
    </CalculatorLayout>
  );
}
