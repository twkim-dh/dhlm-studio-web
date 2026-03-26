import type { Metadata } from "next";
import QrGenerator from "./QrGenerator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "QR코드 생성기 - 무료 QR코드 만들기 | DHLM Tools",
  description: "URL이나 텍스트로 QR코드를 만드세요. 크기와 색상 선택 가능.",
  openGraph: {
    title: "QR Code Generator | DHLM Studio",
    description: "Generate QR codes for URLs, text, and more for free.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/image/qr",
    languages: {
      "ko": "https://dhlm-studio.com/tools/image/qr",
      "en": "https://dhlm-studio.com/tools/image/qr",
      "x-default": "https://dhlm-studio.com/tools/image/qr",
    },
  },
};

export default function QrPage() {
  return (
    <CalculatorLayout title="QR코드 생성기" category="이미지 도구">
      <QrGenerator />
    </CalculatorLayout>
  );
}
