import type { Metadata } from "next";
import InvestmentReturn from "./InvestmentReturn";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "투자 수익률 계산기 - ROI 계산 | DHLM Tools",
  description: "투자 수익률(ROI)과 연평균 수익률(CAGR)을 계산합니다.",
};

export default function InvestmentReturnPage() {
  return (
    <CalculatorLayout title="투자 수익률 계산기" category="금융">
      <InvestmentReturn />
    </CalculatorLayout>
  );
}
