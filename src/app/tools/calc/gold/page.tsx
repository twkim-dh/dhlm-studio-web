import type { Metadata } from "next";
import GoldCalculator from "./GoldCalculator";

export const metadata: Metadata = {
  title: "금 시세 계산기 - 금 무게별 가격 | DHLM Tools",
  description:
    "24K, 18K, 14K 금의 무게별(돈, g, oz) 예상 가격을 계산합니다. 참고용 고정 시세 기준.",
  openGraph: {
    title: "Gold Price Calculator | DHLM Studio",
    description: "Calculate gold value by weight with current market prices.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/calc/gold",
    languages: {
      "ko": "https://dhlm-studio.com/tools/calc/gold",
      "en": "https://dhlm-studio.com/tools/calc/gold",
      "x-default": "https://dhlm-studio.com/tools/calc/gold",
    },
  },
};

export default function Page() {
  return <GoldCalculator />;
}
