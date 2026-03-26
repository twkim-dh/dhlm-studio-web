import type { Metadata } from "next";
import LoremIpsum from "./LoremIpsum";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "더미 텍스트 생성기 - 한글/영문 Lorem Ipsum | DHLM Tools",
  description: "디자인, 개발에 필요한 더미 텍스트를 한글 또는 영문으로 생성합니다.",
  openGraph: {
    title: "Lorem Ipsum Generator | DHLM Studio",
    description: "Generate dummy placeholder text for design and development.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/lorem-ipsum",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/lorem-ipsum",
      "en": "https://dhlm-studio.com/tools/dev/lorem-ipsum",
      "x-default": "https://dhlm-studio.com/tools/dev/lorem-ipsum",
    },
  },
};

export default function LoremIpsumPage() {
  return (
    <CalculatorLayout title="더미 텍스트 생성기" category="개발자 도구">
      <LoremIpsum />
    </CalculatorLayout>
  );
}
