import type { Metadata } from "next";
import RandomNumber from "./RandomNumber";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "랜덤 숫자 생성기 - 난수 생성 | DHLM Tools",
  description: "범위를 지정하여 랜덤 숫자를 생성합니다. 로또 번호 생성 기능 포함.",
  openGraph: {
    title: "Random Number Generator | DHLM Studio",
    description: "Generate random numbers within a custom range.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/gen/random-number",
    languages: {
      "ko": "https://dhlm-studio.com/tools/gen/random-number",
      "en": "https://dhlm-studio.com/tools/gen/random-number",
      "x-default": "https://dhlm-studio.com/tools/gen/random-number",
    },
  },
};

export default function RandomNumberPage() {
  return (
    <CalculatorLayout title="랜덤 숫자 생성기" category="생성기">
      <RandomNumber />
    </CalculatorLayout>
  );
}
