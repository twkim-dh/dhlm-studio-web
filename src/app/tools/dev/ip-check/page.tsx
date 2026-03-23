import type { Metadata } from "next";
import IpCheck from "./IpCheck";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "내 IP 주소 확인 - 공인 IP 조회 | DHLM Tools",
  description: "현재 접속 중인 공인 IP 주소와 위치 정보를 확인합니다.",
};

export default function IpCheckPage() {
  return (
    <CalculatorLayout title="내 IP 주소 확인" category="개발자 도구">
      <IpCheck />
    </CalculatorLayout>
  );
}
