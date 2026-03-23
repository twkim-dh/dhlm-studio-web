import type { Metadata } from "next";
import LoanCompare from "./LoanCompare";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "대출 비교 계산기 - 은행별 대출 이자 비교 | DHLM Tools",
  description: "여러 대출 조건을 비교하여 최적의 대출을 찾으세요.",
};

export default function LoanComparePage() {
  return (
    <CalculatorLayout title="대출 비교 계산기" category="금융">
      <LoanCompare />
    </CalculatorLayout>
  );
}
