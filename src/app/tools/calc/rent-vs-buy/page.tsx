import type { Metadata } from "next";
import RentVsBuy from "./RentVsBuy";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "전세 vs 월세 비교 계산기 | DHLM Tools",
  description: "전세와 월세 중 어떤 것이 유리한지 비교 계산합니다.",
};

export default function RentVsBuyPage() {
  return (
    <CalculatorLayout title="전세 vs 월세 비교" category="금융">
      <RentVsBuy />
    </CalculatorLayout>
  );
}
