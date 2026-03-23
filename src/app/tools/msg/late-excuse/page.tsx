import type { Metadata } from "next";
import LateExcuseGenerator from "./LateExcuseGenerator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "지각 변명 생성기 - 지각 사유 문자 | DHLM Tools",
  description: "지각했을 때 보낼 수 있는 사유 메시지를 자동으로 생성합니다.",
};

export default function LateExcusePage() {
  return (
    <CalculatorLayout title="지각 변명 생성기" category="문서/업무">
      <LateExcuseGenerator />
    </CalculatorLayout>
  );
}
