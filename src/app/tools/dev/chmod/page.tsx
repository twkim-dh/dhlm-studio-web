import type { Metadata } from "next";
import ChmodCalc from "./ChmodCalc";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "chmod 계산기 - 리눅스 파일 권한 | DHLM Tools",
  description: "리눅스 파일 권한을 숫자(755)와 문자(rwxr-xr-x)로 상호 변환합니다.",
};

export default function ChmodPage() {
  return (
    <CalculatorLayout title="chmod 권한 계산기" category="개발자 도구">
      <ChmodCalc />
    </CalculatorLayout>
  );
}
