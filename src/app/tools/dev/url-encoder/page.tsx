import type { Metadata } from "next";
import UrlEncoder from "./UrlEncoder";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "URL 인코더/디코더 - URL 변환 | DHLM Tools",
  description: "URL을 인코딩하거나 디코딩합니다. 한글 URL 변환에 유용합니다.",
  openGraph: {
    title: "URL Encoder/Decoder | DHLM Studio",
    description: "Encode or decode URLs and query strings online.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/dev/url-encoder",
    languages: {
      "ko": "https://dhlm-studio.com/tools/dev/url-encoder",
      "en": "https://dhlm-studio.com/tools/dev/url-encoder",
      "x-default": "https://dhlm-studio.com/tools/dev/url-encoder",
    },
  },
};

export default function UrlEncoderPage() {
  return (
    <CalculatorLayout title="URL 인코더/디코더" category="개발자 도구">
      <UrlEncoder />
    </CalculatorLayout>
  );
}
