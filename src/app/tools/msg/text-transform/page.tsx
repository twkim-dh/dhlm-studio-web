import type { Metadata } from "next";
import TextTransform from "./TextTransform";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "텍스트 변환기 - 대소문자/공백/줄바꿈 변환 | DHLM Tools",
  description: "텍스트를 대문자, 소문자, 제목형으로 변환하고 공백/줄바꿈을 정리합니다.",
  openGraph: {
    title: "Text Case Converter | DHLM Studio",
    description: "Convert text between uppercase, lowercase, title case and more.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/msg/text-transform",
    languages: {
      "ko": "https://dhlm-studio.com/tools/msg/text-transform",
      "en": "https://dhlm-studio.com/tools/msg/text-transform",
      "x-default": "https://dhlm-studio.com/tools/msg/text-transform",
    },
  },
};

export default function TextTransformPage() {
  return (
    <CalculatorLayout title="텍스트 변환기" category="문서/업무">
      <TextTransform />
    </CalculatorLayout>
  );
}
