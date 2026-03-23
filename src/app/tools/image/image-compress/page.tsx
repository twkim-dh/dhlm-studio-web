import type { Metadata } from "next";
import ImageCompressor from "./ImageCompressor";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "이미지 압축 - 온라인 무료 이미지 용량 줄이기 | DHLM Tools",
  description: "이미지 파일 크기를 줄여보세요. JPG, PNG, WebP 지원. 품질 조절 가능.",
};

export default function ImageCompressPage() {
  return (
    <CalculatorLayout title="이미지 압축" category="이미지 도구">
      <ImageCompressor />
    </CalculatorLayout>
  );
}
