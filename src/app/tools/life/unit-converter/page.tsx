import type { Metadata } from "next";
import UnitConverter from "./UnitConverter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "단위 변환기 - 길이/무게/온도/면적 변환 | DHLM Tools",
  description: "길이, 무게, 온도, 면적 등 다양한 단위를 변환합니다.",
};

export default function UnitConverterPage() {
  return (
    <CalculatorLayout title="단위 변환기" category="생활">
      <UnitConverter />
    </CalculatorLayout>
  );
}
