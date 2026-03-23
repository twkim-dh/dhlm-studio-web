import type { Metadata } from "next";
import UrlEncoder from "./UrlEncoder";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "URL 인코더/디코더 - URL 변환 | DHLM Tools",
  description: "URL을 인코딩하거나 디코딩합니다. 한글 URL 변환에 유용합니다.",
};

export default function UrlEncoderPage() {
  return (
    <CalculatorLayout title="URL 인코더/디코더" category="개발자 도구">
      <UrlEncoder />
    </CalculatorLayout>
  );
}
