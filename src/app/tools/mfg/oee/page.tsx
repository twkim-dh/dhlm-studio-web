import type { Metadata } from "next";
import OeeCalculator from "./OeeCalculator";

export const metadata: Metadata = {
  title: "가동률/OEE 계산기 | DHLM Tools",
  description:
    "계획가동시간, 실가동시간, 생산수, 양품수, 이론사이클타임으로 가동률, 성능률, 양품률, OEE를 계산합니다.",
  openGraph: {
    title: "OEE Calculator - Overall Equipment Effectiveness | DHLM Studio",
    description: "Calculate OEE from availability, performance, and quality.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/mfg/oee",
    languages: {
      "ko": "https://dhlm-studio.com/tools/mfg/oee",
      "en": "https://dhlm-studio.com/tools/mfg/oee",
      "x-default": "https://dhlm-studio.com/tools/mfg/oee",
    },
  },
};

export default function Page() {
  return <OeeCalculator />;
}
