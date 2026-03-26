import type { Metadata } from "next";
import ImageCompressor from "./ImageCompressor";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "이미지 압축 - 온라인 무료 이미지 용량 줄이기 | DHLM Tools",
  description: "이미지 파일 크기를 줄여보세요. JPG, PNG, WebP 지원. 품질 조절 가능.",
  openGraph: {
    title: "Image Compressor - Reduce File Size | DHLM Studio",
    description: "Compress images online for free. Reduce file size without quality loss.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/image/image-compress",
    languages: {
      "ko": "https://dhlm-studio.com/tools/image/image-compress",
      "en": "https://dhlm-studio.com/tools/image/image-compress",
      "x-default": "https://dhlm-studio.com/tools/image/image-compress",
    },
  },
};

export default function ImageCompressPage() {
  return (
    <CalculatorLayout title="이미지 압축" category="이미지 도구">
      <ImageCompressor />
    </CalculatorLayout>
  );
}
