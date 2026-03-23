import type { Metadata } from "next";
import CoupangFee from "./CoupangFee";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "쿠팡 수수료 계산기 - 판매 수익 계산 | DHLM Tools",
  description: "쿠팡 판매 시 수수료와 예상 수익을 계산합니다.",
};

export default function CoupangFeePage() {
  return (
    <CalculatorLayout title="쿠팡 수수료 계산기" category="금융">
      <CoupangFee />
    </CalculatorLayout>
  );
}
