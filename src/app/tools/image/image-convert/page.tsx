import type { Metadata } from "next";
import ImageConverter from "./ImageConverter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "이미지 변환 - PNG/JPG/WebP 형식 변환 | DHLM Tools",
  description: "이미지 형식을 PNG, JPG, WebP로 변환하세요. 온라인 무료 변환기.",
};

export default function ImageConvertPage() {
  return (
    <CalculatorLayout title="이미지 형식 변환" category="이미지 도구">
      <ImageConverter />
    </CalculatorLayout>
  );
}
