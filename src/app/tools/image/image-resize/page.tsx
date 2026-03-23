import type { Metadata } from "next";
import ImageResizer from "./ImageResizer";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "이미지 리사이즈 - 이미지 크기 변경 | DHLM Tools",
  description: "이미지 크기를 원하는 사이즈로 변경하세요. 비율 유지 옵션 제공.",
};

export default function ImageResizePage() {
  return (
    <CalculatorLayout title="이미지 리사이즈" category="이미지 도구">
      <ImageResizer />
    </CalculatorLayout>
  );
}
