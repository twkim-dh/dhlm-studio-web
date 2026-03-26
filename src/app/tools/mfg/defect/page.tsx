import type { Metadata } from "next";
import DefectCalculator from "./DefectCalculator";

export const metadata: Metadata = {
  title: "불량률 계산기 - PPM/불량률 계산 | DHLM Tools",
  description:
    "총 생산수와 불량수를 입력하면 불량률(%), PPM, 수율(%), 시그마 수준을 계산합니다.",
  openGraph: {
    title: "Defect Rate Calculator - PPM/DPMO | DHLM Studio",
    description: "Calculate defect rate, PPM, and DPMO for manufacturing.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/mfg/defect",
    languages: {
      "ko": "https://dhlm-studio.com/tools/mfg/defect",
      "en": "https://dhlm-studio.com/tools/mfg/defect",
      "x-default": "https://dhlm-studio.com/tools/mfg/defect",
    },
  },
};

export default function Page() {
  return <DefectCalculator />;
}
