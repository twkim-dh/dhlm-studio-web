import type { Metadata } from "next";
import UnitConverter from "./UnitConverter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "단위 변환기 - 길이/무게/온도/면적 변환 | DHLM Tools",
  description: "길이, 무게, 온도, 면적 등 다양한 단위를 변환합니다.",
  openGraph: {
    title: "Unit Converter - Length, Weight, Area | DHLM Studio",
    description: "Convert between units of length, weight, area, volume and more.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/life/unit-converter",
    languages: {
      "ko": "https://dhlm-studio.com/tools/life/unit-converter",
      "en": "https://dhlm-studio.com/tools/life/unit-converter",
      "x-default": "https://dhlm-studio.com/tools/life/unit-converter",
    },
  },
};

export default function UnitConverterPage() {
  return (
    <CalculatorLayout title="단위 변환기" category="생활">
      <UnitConverter />
    </CalculatorLayout>
  );
}
