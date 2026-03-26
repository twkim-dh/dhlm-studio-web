import type { Metadata } from "next";
import RentVsBuy from "./RentVsBuy";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "전세 vs 월세 비교 계산기 | DHLM Tools",
  description: "전세와 월세 중 어떤 것이 유리한지 비교 계산합니다.",
  openGraph: {
    title: "Rent vs Buy Calculator | DHLM Studio",
    description: "Compare renting vs buying a home financially.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/calc/rent-vs-buy",
    languages: {
      "ko": "https://dhlm-studio.com/tools/calc/rent-vs-buy",
      "en": "https://dhlm-studio.com/tools/calc/rent-vs-buy",
      "x-default": "https://dhlm-studio.com/tools/calc/rent-vs-buy",
    },
  },
};

export default function RentVsBuyPage() {
  return (
    <CalculatorLayout title="전세 vs 월세 비교" category="금융">
      <RentVsBuy />
    </CalculatorLayout>
  );
}
