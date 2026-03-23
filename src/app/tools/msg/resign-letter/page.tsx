import type { Metadata } from "next";
import ResignGenerator from "./ResignGenerator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "퇴사 문자 생성기 - 퇴사 메시지 예시 | DHLM Tools",
  description: "상황에 맞는 퇴사 문자를 자동으로 생성합니다. 정중하고 깔끔한 퇴사 인사말.",
};

export default function ResignPage() {
  return (
    <CalculatorLayout title="퇴사 문자 생성기" category="문서/업무">
      <ResignGenerator />
    </CalculatorLayout>
  );
}
