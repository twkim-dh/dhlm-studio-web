import type { Metadata } from "next";
import PercentCalculator from "./PercentCalculator";

export const metadata: Metadata = {
  title: "퍼센트 계산기 - % 계산 | DHLM Tools",
  description:
    "퍼센트 계산을 쉽게 할 수 있습니다. A의 B%는? A는 B의 몇%? A에서 B로의 변화율? 3가지 모드를 지원합니다.",
  openGraph: {
    title: "Percentage Calculator | DHLM Studio",
    description: "Calculate percentages, percentage change, and percentage of a number.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/calc/percent",
    languages: {
      "ko": "https://dhlm-studio.com/tools/calc/percent",
      "en": "https://dhlm-studio.com/tools/calc/percent",
      "x-default": "https://dhlm-studio.com/tools/calc/percent",
    },
  },
};

export default function Page() {
  return <PercentCalculator />;
}
