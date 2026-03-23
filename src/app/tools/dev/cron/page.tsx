import type { Metadata } from "next";
import CronParser from "./CronParser";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "Cron 표현식 변환기 - 크론 스케줄 해석 | DHLM Tools",
  description: "Cron 표현식을 한국어로 해석합니다. 프리셋으로 쉽게 만들 수 있습니다.",
};

export default function CronPage() {
  return (
    <CalculatorLayout title="Cron 표현식 변환기" category="개발자 도구">
      <CronParser />
    </CalculatorLayout>
  );
}
