import type { Metadata } from "next";
import ImageConverter from "./ImageConverter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "이미지 변환 - PNG/JPG/WebP 형식 변환 | DHLM Tools",
  description: "이미지 형식을 PNG, JPG, WebP로 변환하세요. 온라인 무료 변환기.",
  openGraph: {
    title: "Image Format Converter | DHLM Studio",
    description: "Convert images between PNG, JPG, WebP and more.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/image/image-convert",
    languages: {
      "ko": "https://dhlm-studio.com/tools/image/image-convert",
      "en": "https://dhlm-studio.com/tools/image/image-convert",
      "x-default": "https://dhlm-studio.com/tools/image/image-convert",
    },
  },
};

export default function ImageConvertPage() {
  return (
    <CalculatorLayout title="이미지 형식 변환" category="이미지 도구">
      <ImageConverter />
    </CalculatorLayout>
  );
}
