import type { Metadata } from "next";
import ImageResizer from "./ImageResizer";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "이미지 리사이즈 - 이미지 크기 변경 | DHLM Tools",
  description: "이미지 크기를 원하는 사이즈로 변경하세요. 비율 유지 옵션 제공.",
  openGraph: {
    title: "Image Resizer | DHLM Studio",
    description: "Resize images to any dimension online for free.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/image/image-resize",
    languages: {
      "ko": "https://dhlm-studio.com/tools/image/image-resize",
      "en": "https://dhlm-studio.com/tools/image/image-resize",
      "x-default": "https://dhlm-studio.com/tools/image/image-resize",
    },
  },
};

export default function ImageResizePage() {
  return (
    <CalculatorLayout title="이미지 리사이즈" category="이미지 도구">
      <ImageResizer />
    </CalculatorLayout>
  );
}
