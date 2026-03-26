import type { Metadata } from "next";
import BinaryConverter from "./BinaryConverter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "진법 변환기 - 2진수/8진수/16진수 변환 | DHLM Tools",
  description: "10진수를 2진수, 8진수, 16진수로 상호 변환합니다.",
  openGraph: {
    title: "Number Base Converter | DHLM Studio",
    description: "Convert between binary, octal, decimal, and hexadecimal.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/binary-converter",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/binary-converter",
      "en": "https://dhlm-studio.com/tools/dev/binary-converter",
      "x-default": "https://dhlm-studio.com/tools/dev/binary-converter",
    },
  },
};

export default function BinaryConverterPage() {
  return (
    <CalculatorLayout title="진법 변환기" category="개발자 도구">
      <BinaryConverter />
    </CalculatorLayout>
  );
}
