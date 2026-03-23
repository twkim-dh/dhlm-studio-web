import type { Metadata } from "next";
import DepositCompare from "./DepositCompare";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "적금 이율 비교 - 은행별 적금 금리 비교 | DHLM Tools",
  description: "은행별 적금 금리를 비교하고 만기 수령액을 계산합니다.",
};

export default function DepositComparePage() {
  return (
    <CalculatorLayout title="적금 이율 비교" category="비교">
      <DepositCompare />
    </CalculatorLayout>
  );
}
