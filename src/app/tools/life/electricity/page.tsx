import type { Metadata } from "next";
import ElectricityCalc from "./ElectricityCalc";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "전기요금 계산기 - 예상 전기세 계산 | DHLM Tools",
  description: "월 사용량(kWh)으로 예상 전기요금을 계산합니다. 누진제 적용.",
  openGraph: {
    title: "Electricity Bill Calculator | DHLM Studio",
    description: "Estimate your electricity bill based on usage.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/electricity",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/electricity",
      "en": "https://dhlm-studio.com/tools/life/electricity",
      "x-default": "https://dhlm-studio.com/tools/life/electricity",
    },
  },
};

export default function ElectricityPage() {
  return (
    <CalculatorLayout title="전기요금 계산기" category="생활">
      <ElectricityCalc />
    </CalculatorLayout>
  );
}
