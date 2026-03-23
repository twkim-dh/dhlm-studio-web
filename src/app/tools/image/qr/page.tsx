import type { Metadata } from "next";
import QrGenerator from "./QrGenerator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "QR코드 생성기 - 무료 QR코드 만들기 | DHLM Tools",
  description: "URL이나 텍스트로 QR코드를 만드세요. 크기와 색상 선택 가능.",
};

export default function QrPage() {
  return (
    <CalculatorLayout title="QR코드 생성기" category="이미지 도구">
      <QrGenerator />
    </CalculatorLayout>
  );
}
