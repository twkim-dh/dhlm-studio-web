import type { Metadata } from "next";
import CpkCalculator from "./CpkCalculator";

export const metadata: Metadata = {
  title: "Cpk 계산기 - 공정능력지수 | DHLM Tools",
  description:
    "USL, LSL, 평균, 표준편차를 입력하여 Cp와 Cpk(공정능력지수)를 계산하고 공정 판정을 확인합니다.",
  openGraph: {
    title: "Cpk Calculator - Process Capability | DHLM Studio",
    description: "Calculate process capability index (Cpk/Cp) for quality control.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/mfg/cpk",
    languages: {
      "ko": "https://dhlm-studio.com/tools/mfg/cpk",
      "en": "https://dhlm-studio.com/tools/mfg/cpk",
      "x-default": "https://dhlm-studio.com/tools/mfg/cpk",
    },
  },
};

export default function Page() {
  return <CpkCalculator />;
}
