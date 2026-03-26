import type { Metadata } from "next";
import FontPreview from "./FontPreview";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "폰트 미리보기 - 웹폰트 미리보기 | DHLM Tools",
  description: "다양한 웹폰트를 실시간으로 미리보기합니다. 크기, 두께 조절 가능.",
  openGraph: {
    title: "Font Preview Tool | DHLM Studio",
    description: "Preview and compare fonts with custom text.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/font-preview",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/font-preview",
      "en": "https://dhlm-studio.com/tools/dev/font-preview",
      "x-default": "https://dhlm-studio.com/tools/dev/font-preview",
    },
  },
};

export default function FontPreviewPage() {
  return (
    <CalculatorLayout title="폰트 미리보기" category="개발자 도구">
      <FontPreview />
    </CalculatorLayout>
  );
}
