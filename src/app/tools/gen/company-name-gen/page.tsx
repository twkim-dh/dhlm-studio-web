import type { Metadata } from "next";
import CompanyNameGen from "./CompanyNameGen";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "회사명/브랜드명 생성기 | DHLM Tools",
  description: "키워드를 입력하면 창의적인 회사명, 브랜드명을 추천합니다.",
};

export default function CompanyNamePage() {
  return (
    <CalculatorLayout title="회사명/브랜드명 생성기" category="생성기">
      <CompanyNameGen />
    </CalculatorLayout>
  );
}
