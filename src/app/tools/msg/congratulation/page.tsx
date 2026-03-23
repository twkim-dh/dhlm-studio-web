import type { Metadata } from "next";
import CongratGenerator from "./CongratGenerator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "축의금/조의금 문구 생성기 - 경조사 메시지 | DHLM Tools",
  description: "결혼, 출산, 장례 등 경조사에 맞는 축하/위로 메시지를 생성합니다.",
};

export default function CongratPage() {
  return (
    <CalculatorLayout title="축의금/조의금 문구 생성기" category="문서/업무">
      <CongratGenerator />
    </CalculatorLayout>
  );
}
