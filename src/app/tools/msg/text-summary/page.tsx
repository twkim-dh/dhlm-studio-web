import type { Metadata } from "next";
import TextSummary from "./TextSummary";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "한줄 요약기 - 텍스트 요약 도구 | DHLM Tools",
  description: "긴 텍스트를 핵심만 추출하여 한줄로 요약합니다.",
};

export default function TextSummaryPage() {
  return (
    <CalculatorLayout title="한줄 요약기" category="문서/업무">
      <TextSummary />
    </CalculatorLayout>
  );
}
