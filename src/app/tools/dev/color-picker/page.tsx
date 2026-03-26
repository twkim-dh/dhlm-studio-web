import type { Metadata } from "next";
import ColorPicker from "./ColorPicker";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "색상 변환기 - HEX/RGB/HSL 변환 | DHLM Tools",
  description: "HEX, RGB, HSL 색상 코드를 상호 변환합니다. 컬러 피커 포함.",
  openGraph: {
    title: "Color Picker & Converter | DHLM Studio",
    description: "Pick colors and convert between HEX, RGB, and HSL formats.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/color-picker",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/color-picker",
      "en": "https://dhlm-studio.com/tools/dev/color-picker",
      "x-default": "https://dhlm-studio.com/tools/dev/color-picker",
    },
  },
};

export default function ColorPickerPage() {
  return (
    <CalculatorLayout title="색상 변환기" category="개발자 도구">
      <ColorPicker />
    </CalculatorLayout>
  );
}
