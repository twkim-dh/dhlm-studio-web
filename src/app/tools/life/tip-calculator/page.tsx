import type { Metadata } from "next";
import TipCalculator from "./TipCalculator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "팁 계산기 - 더치페이/N빵 계산 | DHLM Tools",
  description: "식사 금액을 인원수로 나누고 팁을 계산합니다. 더치페이 계산기.",
};

export default function TipCalculatorPage() {
  return (
    <CalculatorLayout title="더치페이/팁 계산기" category="생활">
      <TipCalculator />
    </CalculatorLayout>
  );
}
