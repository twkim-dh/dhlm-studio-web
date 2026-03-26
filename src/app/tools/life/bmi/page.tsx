import type { Metadata } from "next";
import BmiCalculator from "./BmiCalculator";

export const metadata: Metadata = {
  title: "BMI 계산기 - 체질량지수 계산 | DHLM Tools",
  description:
    "키와 몸무게를 입력하면 BMI(체질량지수)를 계산하고 저체중, 정상, 과체중, 비만 여부를 판정합니다.",
  openGraph: {
    title: "BMI Calculator - Body Mass Index | DHLM Studio",
    description: "Calculate your BMI and check if your weight is healthy.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/bmi",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/bmi",
      "en": "https://dhlm-studio.com/tools/life/bmi",
      "x-default": "https://dhlm-studio.com/tools/life/bmi",
    },
  },
};

export default function Page() {
  return <BmiCalculator />;
}
