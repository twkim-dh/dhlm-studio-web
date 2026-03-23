import type { Metadata } from "next";
import CalorieCalculator from "./CalorieCalculator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "칼로리 계산기 - 일일 권장 칼로리 | DHLM Tools",
  description: "나이, 성별, 활동량에 따른 일일 권장 칼로리와 기초대사량을 계산합니다.",
};

export default function CaloriePage() {
  return (
    <CalculatorLayout title="칼로리 계산기" category="생활/건강">
      <CalorieCalculator />
    </CalculatorLayout>
  );
}
