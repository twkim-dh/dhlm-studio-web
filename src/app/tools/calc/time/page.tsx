import type { Metadata } from "next";
import TimeCalculator from "./TimeCalculator";

export const metadata: Metadata = {
  title: "시급 계산기 - 시급/월급/연봉 변환 | DHLM Tools",
  description:
    "시급, 일급, 주급, 월급, 연봉을 상호 변환합니다. 주당 근무시간 기준으로 정확하게 계산.",
  openGraph: {
    title: "Time & Hourly Rate Converter | DHLM Studio",
    description: "Convert between hourly, daily, monthly and yearly rates.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/calc/time",
    languages: {
      "ko": "https://dhlm-studio.com/tools/calc/time",
      "en": "https://dhlm-studio.com/tools/calc/time",
      "x-default": "https://dhlm-studio.com/tools/calc/time",
    },
  },
};

export default function Page() {
  return <TimeCalculator />;
}
