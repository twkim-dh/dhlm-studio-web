import type { Metadata } from "next";
import UphCalculator from "./UphCalculator";

export const metadata: Metadata = {
  title: "UPH 계산기 - 시간당 생산량 | DHLM Tools",
  description:
    "일 생산량, 가동시간, 사이클타임으로 UPH(시간당 생산량)와 월 생산량을 계산합니다.",
  openGraph: {
    title: "UPH Calculator - Units Per Hour | DHLM Studio",
    description: "Calculate production rate in units per hour.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/mfg/uph",
    languages: {
      "ko": "https://dhlm-studio.com/tools/mfg/uph",
      "en": "https://dhlm-studio.com/tools/mfg/uph",
      "x-default": "https://dhlm-studio.com/tools/mfg/uph",
    },
  },
};

export default function Page() {
  return <UphCalculator />;
}
