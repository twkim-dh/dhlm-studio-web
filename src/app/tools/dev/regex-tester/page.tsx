import type { Metadata } from "next";
import RegexTester from "./RegexTester";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "정규식 테스터 - 정규표현식 실시간 테스트 | DHLM Tools",
  description: "정규표현식을 실시간으로 테스트하고 매칭 결과를 확인합니다.",
};

export default function RegexTesterPage() {
  return (
    <CalculatorLayout title="정규식 테스터" category="개발자 도구">
      <RegexTester />
    </CalculatorLayout>
  );
}
