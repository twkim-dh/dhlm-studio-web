import type { Metadata } from "next";
import ElectricityCalc from "./ElectricityCalc";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "전기요금 계산기 - 예상 전기세 계산 | DHLM Tools",
  description: "월 사용량(kWh)으로 예상 전기요금을 계산합니다. 누진제 적용.",
};

export default function ElectricityPage() {
  return (
    <CalculatorLayout title="전기요금 계산기" category="생활">
      <ElectricityCalc />
    </CalculatorLayout>
  );
}
