import type { Metadata } from "next";
import JsonFormatter from "./JsonFormatter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "JSON 포맷터 - JSON 정리/검증 도구 | DHLM Tools",
  description: "JSON 데이터를 보기 좋게 정리하거나 압축하세요. 실시간 검증 기능 포함.",
  openGraph: {
    title: "JSON Formatter & Validator | DHLM Studio",
    description: "Format, validate, and beautify JSON data online for free.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/json",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/json",
      "en": "https://dhlm-studio.com/tools/dev/json",
      "x-default": "https://dhlm-studio.com/tools/dev/json",
    },
  },
};

export default function JsonPage() {
  return (
    <CalculatorLayout title="JSON 포맷터" category="개발자 도구">
      <JsonFormatter />
    </CalculatorLayout>
  );
}
