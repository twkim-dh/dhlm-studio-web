import type { Metadata } from "next";
import PhoneCompare from "./PhoneCompare";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "통신사 요금 비교 - 알뜰폰 요금제 비교 | DHLM Tools",
  description: "통신사별 요금제를 비교하고 나에게 맞는 요금제를 찾으세요.",
};

export default function PhoneComparePage() {
  return (
    <CalculatorLayout title="통신사 요금 비교" category="비교">
      <PhoneCompare />
    </CalculatorLayout>
  );
}
