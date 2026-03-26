import type { Metadata } from "next";
import DepositCompare from "./DepositCompare";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "적금 이율 비교 - 은행별 적금 금리 비교 | DHLM Tools",
  description: "은행별 적금 금리를 비교하고 만기 수령액을 계산합니다.",
  openGraph: {
    title: "Savings Rate Comparison | DHLM Studio",
    description: "Compare savings account interest rates side by side.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/compare/deposit-compare",
    languages: {
      "ko": "https://dhlm-studio.com/tools/compare/deposit-compare",
      "en": "https://dhlm-studio.com/tools/compare/deposit-compare",
      "x-default": "https://dhlm-studio.com/tools/compare/deposit-compare",
    },
  },
};

export default function DepositComparePage() {
  return (
    <CalculatorLayout title="적금 이율 비교" category="비교">
      <DepositCompare />
    </CalculatorLayout>
  );
}
