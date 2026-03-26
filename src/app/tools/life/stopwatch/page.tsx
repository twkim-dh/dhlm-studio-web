import type { Metadata } from "next";
import Stopwatch from "./Stopwatch";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "스톱워치 & 타이머 - 온라인 무료 | DHLM Tools",
  description: "온라인 스톱워치와 카운트다운 타이머. 랩 기록 지원.",
  openGraph: {
    title: "Online Stopwatch & Timer | DHLM Studio",
    description: "Free online stopwatch and countdown timer.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/stopwatch",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/stopwatch",
      "en": "https://dhlm-studio.com/tools/life/stopwatch",
      "x-default": "https://dhlm-studio.com/tools/life/stopwatch",
    },
  },
};

export default function StopwatchPage() {
  return (
    <CalculatorLayout title="스톱워치 & 타이머" category="생활">
      <Stopwatch />
    </CalculatorLayout>
  );
}
