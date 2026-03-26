import type { Metadata } from "next";
import CoupangFee from "./CoupangFee";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "쿠팡 수수료 계산기 - 판매 수익 계산 | DHLM Tools",
  description: "쿠팡 판매 시 수수료와 예상 수익을 계산합니다.",
  openGraph: {
    title: "Marketplace Fee Calculator | DHLM Studio",
    description: "Calculate e-commerce marketplace selling fees and profit.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/calc/coupang-fee",
    languages: {
      "ko": "https://dhlm-studio.com/tools/calc/coupang-fee",
      "en": "https://dhlm-studio.com/tools/calc/coupang-fee",
      "x-default": "https://dhlm-studio.com/tools/calc/coupang-fee",
    },
  },
};

export default function CoupangFeePage() {
  return (
    <CalculatorLayout title="쿠팡 수수료 계산기" category="금융">
      <CoupangFee />
    </CalculatorLayout>
  );
}
