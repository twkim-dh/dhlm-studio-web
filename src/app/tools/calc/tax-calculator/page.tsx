import type { Metadata } from "next";
import TaxCalculator from "./TaxCalculator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "소득세 계산기 - 종합소득세/양도세 계산 | DHLM Tools",
  description: "과세표준에 따른 소득세를 계산합니다. 2026년 세율 기준.",
};

export default function TaxPage() {
  return (
    <CalculatorLayout title="소득세 계산기" category="금융">
      <TaxCalculator />
    </CalculatorLayout>
  );
}
