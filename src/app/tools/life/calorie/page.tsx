import type { Metadata } from "next";
import CalorieCalculator from "./CalorieCalculator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "칼로리 계산기 - 일일 권장 칼로리 | DHLM Tools",
  description: "나이, 성별, 활동량에 따른 일일 권장 칼로리와 기초대사량을 계산합니다.",
  openGraph: {
    title: "Calorie Calculator | DHLM Studio",
    description: "Calculate daily calorie needs based on age, weight, and activity.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/calorie",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/calorie",
      "en": "https://dhlm-studio.com/tools/life/calorie",
      "x-default": "https://dhlm-studio.com/tools/life/calorie",
    },
  },
};

export default function CaloriePage() {
  return (
    <CalculatorLayout title="칼로리 계산기" category="생활/건강">
      <CalorieCalculator />
    </CalculatorLayout>
  );
}
