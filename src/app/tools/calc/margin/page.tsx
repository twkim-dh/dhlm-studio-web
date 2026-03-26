import type { Metadata } from "next";
import MarginCalculator from "./MarginCalculator";

export const metadata: Metadata = {
  title: "마진 계산기 - 마진율/원가/판매가 계산 | DHLM Tools",
  description:
    "원가와 판매가로 마진율을 계산하거나, 마진율로 판매가를 역산합니다. 마진율, 마크업율, 이익을 한눈에 확인하세요.",
  openGraph: {
    title: "Profit Margin Calculator | DHLM Studio",
    description: "Calculate profit margin percentage from cost and selling price.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/calc/margin",
    languages: {
      "ko": "https://dhlm-studio.com/tools/calc/margin",
      "en": "https://dhlm-studio.com/tools/calc/margin",
      "x-default": "https://dhlm-studio.com/tools/calc/margin",
    },
  },
};

export default function Page() {
  return <MarginCalculator />;
}
