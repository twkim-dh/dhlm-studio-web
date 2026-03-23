import type { Metadata } from "next";
import TypingSpeed from "./TypingSpeed";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "타자 속도 테스트 - 타이핑 연습 | DHLM Tools",
  description: "타이핑 속도를 측정합니다. 한글/영문 지원, WPM/타/분 표시.",
};

export default function TypingSpeedPage() {
  return (
    <CalculatorLayout title="타자 속도 테스트" category="생활">
      <TypingSpeed />
    </CalculatorLayout>
  );
}
