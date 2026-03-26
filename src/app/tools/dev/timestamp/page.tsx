import type { Metadata } from "next";
import TimestampConverter from "./TimestampConverter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "Unix 타임스탬프 변환기 | DHLM Tools",
  description: "Unix 타임스탬프를 날짜로, 날짜를 타임스탬프로 변환합니다.",
  openGraph: {
    title: "Unix Timestamp Converter | DHLM Studio",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/timestamp",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/timestamp",
      "en": "https://dhlm-studio.com/tools/dev/timestamp",
      "x-default": "https://dhlm-studio.com/tools/dev/timestamp",
    },
  },
};

export default function TimestampPage() {
  return (
    <CalculatorLayout title="Unix 타임스탬프 변환기" category="개발자 도구">
      <TimestampConverter />
    </CalculatorLayout>
  );
}
