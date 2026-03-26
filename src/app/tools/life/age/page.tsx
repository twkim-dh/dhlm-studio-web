import type { Metadata } from "next";
import AgeCalculator from "./AgeCalculator";

export const metadata: Metadata = {
  title: "나이 계산기 - 만나이/한국나이 계산 | DHLM Tools",
  description:
    "생년월일을 입력하면 만나이, 한국나이(연나이), 띠, 별자리를 한번에 계산합니다.",
  openGraph: {
    title: "Age Calculator | DHLM Studio",
    description: "Calculate exact age in years, months, and days from birth date.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/age",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/age",
      "en": "https://dhlm-studio.com/tools/life/age",
      "x-default": "https://dhlm-studio.com/tools/life/age",
    },
  },
};

export default function Page() {
  return <AgeCalculator />;
}
