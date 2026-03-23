import type { Metadata } from "next";
import ColorPicker from "./ColorPicker";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "색상 변환기 - HEX/RGB/HSL 변환 | DHLM Tools",
  description: "HEX, RGB, HSL 색상 코드를 상호 변환합니다. 컬러 피커 포함.",
};

export default function ColorPickerPage() {
  return (
    <CalculatorLayout title="색상 변환기" category="개발자 도구">
      <ColorPicker />
    </CalculatorLayout>
  );
}
