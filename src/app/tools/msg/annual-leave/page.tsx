import type { Metadata } from "next";
import AnnualLeaveGenerator from "./AnnualLeaveGenerator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "연차 사유 생성기 - 연차 신청 사유 예시 | DHLM Tools",
  description: "연차 신청할 때 쓸 수 있는 사유를 자동으로 생성합니다.",
};

export default function AnnualLeavePage() {
  return (
    <CalculatorLayout title="연차 사유 생성기" category="문서/업무">
      <AnnualLeaveGenerator />
    </CalculatorLayout>
  );
}
