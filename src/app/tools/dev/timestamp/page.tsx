import type { Metadata } from "next";
import TimestampConverter from "./TimestampConverter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "Unix 타임스탬프 변환기 | DHLM Tools",
  description: "Unix 타임스탬프를 날짜로, 날짜를 타임스탬프로 변환합니다.",
};

export default function TimestampPage() {
  return (
    <CalculatorLayout title="Unix 타임스탬프 변환기" category="개발자 도구">
      <TimestampConverter />
    </CalculatorLayout>
  );
}
