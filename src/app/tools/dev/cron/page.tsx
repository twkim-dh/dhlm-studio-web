import type { Metadata } from "next";
import CronParser from "./CronParser";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "Cron 표현식 변환기 - 크론 스케줄 해석 | DHLM Tools",
  description: "Cron 표현식을 한국어로 해석합니다. 프리셋으로 쉽게 만들 수 있습니다.",
  openGraph: {
    title: "Cron Expression Generator | DHLM Studio",
    description: "Generate and explain cron schedule expressions.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/cron",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/cron",
      "en": "https://dhlm-studio.com/tools/dev/cron",
      "x-default": "https://dhlm-studio.com/tools/dev/cron",
    },
  },
};

export default function CronPage() {
  return (
    <CalculatorLayout title="Cron 표현식 변환기" category="개발자 도구">
      <CronParser />
    </CalculatorLayout>
  );
}
