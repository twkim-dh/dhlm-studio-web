import type { Metadata } from "next";
import TypingSpeed from "./TypingSpeed";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "타자 속도 테스트 - 타이핑 연습 | DHLM Tools",
  description: "타이핑 속도를 측정합니다. 한글/영문 지원, WPM/타/분 표시.",
  openGraph: {
    title: "Typing Speed Test - WPM Test | DHLM Studio",
    description: "Test your typing speed in words per minute. Free online typing test.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/typing-speed",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/typing-speed",
      "en": "https://dhlm-studio.com/tools/life/typing-speed",
      "x-default": "https://dhlm-studio.com/tools/life/typing-speed",
    },
  },
};

export default function TypingSpeedPage() {
  return (
    <CalculatorLayout title="타자 속도 테스트" category="생활">
      <TypingSpeed />
    </CalculatorLayout>
  );
}
