import type { Metadata } from "next";
import SubnetCalc from "./SubnetCalc";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "서브넷 계산기 - CIDR/서브넷마스크 | DHLM Tools",
  description: "IP 주소와 CIDR로 네트워크 정보를 계산합니다.",
};

export default function SubnetPage() {
  return (
    <CalculatorLayout title="서브넷 계산기" category="개발자 도구">
      <SubnetCalc />
    </CalculatorLayout>
  );
}
