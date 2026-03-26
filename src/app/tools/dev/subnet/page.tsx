import type { Metadata } from "next";
import SubnetCalc from "./SubnetCalc";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "서브넷 계산기 - CIDR/서브넷마스크 | DHLM Tools",
  description: "IP 주소와 CIDR로 네트워크 정보를 계산합니다.",
  openGraph: {
    title: "Subnet Calculator | DHLM Studio",
    description: "Calculate subnet masks, network addresses, and IP ranges.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/subnet",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/subnet",
      "en": "https://dhlm-studio.com/tools/dev/subnet",
      "x-default": "https://dhlm-studio.com/tools/dev/subnet",
    },
  },
};

export default function SubnetPage() {
  return (
    <CalculatorLayout title="서브넷 계산기" category="개발자 도구">
      <SubnetCalc />
    </CalculatorLayout>
  );
}
