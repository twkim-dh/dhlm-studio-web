import type { Metadata } from "next";
import Base64Tool from "./Base64Tool";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "Base64 인코더/디코더 - 온라인 변환 | DHLM Tools",
  description: "텍스트를 Base64로 인코딩하거나 Base64를 텍스트로 디코딩하세요.",
  openGraph: {
    title: "Base64 Encoder/Decoder | DHLM Studio",
    description: "Encode text to Base64 or decode Base64 to text online.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/base64",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/base64",
      "en": "https://dhlm-studio.com/tools/dev/base64",
      "x-default": "https://dhlm-studio.com/tools/dev/base64",
    },
  },
};

export default function Base64Page() {
  return (
    <CalculatorLayout title="Base64 인코더/디코더" category="개발자 도구">
      <Base64Tool />
    </CalculatorLayout>
  );
}
