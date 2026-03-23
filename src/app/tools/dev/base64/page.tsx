import type { Metadata } from "next";
import Base64Tool from "./Base64Tool";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "Base64 인코더/디코더 - 온라인 변환 | DHLM Tools",
  description: "텍스트를 Base64로 인코딩하거나 Base64를 텍스트로 디코딩하세요.",
};

export default function Base64Page() {
  return (
    <CalculatorLayout title="Base64 인코더/디코더" category="개발자 도구">
      <Base64Tool />
    </CalculatorLayout>
  );
}
