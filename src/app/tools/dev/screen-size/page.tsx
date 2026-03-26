import type { Metadata } from "next";
import ScreenSize from "./ScreenSize";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "내 화면 크기 확인 - 해상도/PPI 확인 | DHLM Tools",
  description: "현재 기기의 화면 해상도, 뷰포트 크기, PPI를 확인합니다.",
  openGraph: {
    title: "Screen Size & Resolution Checker | DHLM Studio",
    description: "Check your screen resolution and viewport size.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/screen-size",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/screen-size",
      "en": "https://dhlm-studio.com/tools/dev/screen-size",
      "x-default": "https://dhlm-studio.com/tools/dev/screen-size",
    },
  },
};

export default function ScreenSizePage() {
  return (
    <CalculatorLayout title="내 화면 크기 확인" category="개발자 도구">
      <ScreenSize />
    </CalculatorLayout>
  );
}
