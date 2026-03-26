import type { Metadata } from "next";
import CardCompare from "./CardCompare";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "신용카드 혜택 비교 - 카드 추천 | DHLM Tools",
  description: "소비 패턴에 맞는 신용카드를 비교하고 추천받으세요.",
  openGraph: {
    title: "Credit Card Comparison | DHLM Studio",
    description: "Compare credit card benefits and rewards.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/compare/card-compare",
    languages: {
      "ko": "https://dhlm-studio.com/tools/compare/card-compare",
      "en": "https://dhlm-studio.com/tools/compare/card-compare",
      "x-default": "https://dhlm-studio.com/tools/compare/card-compare",
    },
  },
};

export default function CardComparePage() {
  return (
    <CalculatorLayout title="신용카드 혜택 비교" category="비교">
      <CardCompare />
    </CalculatorLayout>
  );
}
