import type { Metadata } from "next";
import HtmlEntity from "./HtmlEntity";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "HTML 엔티티 변환기 - 특수문자 변환 | DHLM Tools",
  description: "HTML 특수문자를 엔티티 코드로, 엔티티 코드를 문자로 변환합니다.",
};

export default function HtmlEntityPage() {
  return (
    <CalculatorLayout title="HTML 엔티티 변환기" category="개발자 도구">
      <HtmlEntity />
    </CalculatorLayout>
  );
}
