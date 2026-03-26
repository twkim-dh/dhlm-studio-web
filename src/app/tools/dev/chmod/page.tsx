import type { Metadata } from "next";
import ChmodCalc from "./ChmodCalc";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "chmod 계산기 - 리눅스 파일 권한 | DHLM Tools",
  description: "리눅스 파일 권한을 숫자(755)와 문자(rwxr-xr-x)로 상호 변환합니다.",
  openGraph: {
    title: "chmod Calculator - File Permissions | DHLM Studio",
    description: "Calculate Linux file permission values (chmod).",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/chmod",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/chmod",
      "en": "https://dhlm-studio.com/tools/dev/chmod",
      "x-default": "https://dhlm-studio.com/tools/dev/chmod",
    },
  },
};

export default function ChmodPage() {
  return (
    <CalculatorLayout title="chmod 권한 계산기" category="개발자 도구">
      <ChmodCalc />
    </CalculatorLayout>
  );
}
