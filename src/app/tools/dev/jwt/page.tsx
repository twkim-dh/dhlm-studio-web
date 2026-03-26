import type { Metadata } from "next";
import JwtDecoder from "./JwtDecoder";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "JWT 디코더 - JWT 토큰 분석 | DHLM Tools",
  description: "JWT 토큰을 디코딩하여 Header, Payload를 확인하세요.",
  openGraph: {
    title: "JWT Decoder - JSON Web Token | DHLM Studio",
    description: "Decode and inspect JWT tokens online.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/jwt",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/jwt",
      "en": "https://dhlm-studio.com/tools/dev/jwt",
      "x-default": "https://dhlm-studio.com/tools/dev/jwt",
    },
  },
};

export default function JwtPage() {
  return (
    <CalculatorLayout title="JWT 디코더" category="개발자 도구">
      <JwtDecoder />
    </CalculatorLayout>
  );
}
