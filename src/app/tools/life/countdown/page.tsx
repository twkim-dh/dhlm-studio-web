import type { Metadata } from "next";
import Countdown from "./Countdown";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "카운트다운 타이머 - D-Day 실시간 | DHLM Tools",
  description: "목표 날짜까지 남은 시간을 일/시/분/초로 실시간 표시합니다.",
  openGraph: {
    title: "Countdown Timer | DHLM Studio",
    description: "Set a countdown to any date or event.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/countdown",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/countdown",
      "en": "https://dhlm-studio.com/tools/life/countdown",
      "x-default": "https://dhlm-studio.com/tools/life/countdown",
    },
  },
};

export default function CountdownPage() {
  return (
    <CalculatorLayout title="카운트다운 타이머" category="생활">
      <Countdown />
    </CalculatorLayout>
  );
}
