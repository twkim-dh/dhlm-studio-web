import type { Metadata } from "next";
import DateCalculator from "./DateCalculator";

export const metadata: Metadata = {
  title: "날짜 계산기 - D-Day/날짜 차이 계산 | DHLM Tools",
  description:
    "두 날짜 사이의 차이를 일, 주, 월 단위로 계산하고 D-Day와 요일을 확인합니다.",
  openGraph: {
    title: "Date Calculator - Days Between Dates | DHLM Studio",
    description: "Calculate the number of days between two dates.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/date",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/date",
      "en": "https://dhlm-studio.com/tools/life/date",
      "x-default": "https://dhlm-studio.com/tools/life/date",
    },
  },
};

export default function Page() {
  return <DateCalculator />;
}
