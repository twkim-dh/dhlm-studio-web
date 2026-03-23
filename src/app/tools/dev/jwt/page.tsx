import type { Metadata } from "next";
import JwtDecoder from "./JwtDecoder";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "JWT 디코더 - JWT 토큰 분석 | DHLM Tools",
  description: "JWT 토큰을 디코딩하여 Header, Payload를 확인하세요.",
};

export default function JwtPage() {
  return (
    <CalculatorLayout title="JWT 디코더" category="개발자 도구">
      <JwtDecoder />
    </CalculatorLayout>
  );
}
