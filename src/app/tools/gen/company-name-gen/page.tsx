import type { Metadata } from "next";
import CompanyNameGen from "./CompanyNameGen";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "회사명/브랜드명 생성기 | DHLM Tools",
  description: "키워드를 입력하면 창의적인 회사명, 브랜드명을 추천합니다.",
  openGraph: {
    title: "Business Name Generator | DHLM Studio",
    description: "Generate creative company and brand name ideas.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/gen/company-name-gen",
    languages: {
      "ko": "https://dhlm-studio.com/tools/gen/company-name-gen",
      "en": "https://dhlm-studio.com/tools/gen/company-name-gen",
      "x-default": "https://dhlm-studio.com/tools/gen/company-name-gen",
    },
  },
};

export default function CompanyNamePage() {
  return (
    <CalculatorLayout title="회사명/브랜드명 생성기" category="생성기">
      <CompanyNameGen />
    </CalculatorLayout>
  );
}
