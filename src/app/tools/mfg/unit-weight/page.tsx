import type { Metadata } from "next";
import UnitWeightCalculator from "./UnitWeightCalculator";

export const metadata: Metadata = {
  title: "단중 계산기 - 코일/판재 단위중량 | DHLM Tools",
  description:
    "철, SUS, 알루미늄, 구리 등 재질별 비중을 적용하여 판재/코일의 단위중량을 계산합니다.",
  openGraph: {
    title: "Unit Weight Calculator | DHLM Studio",
    description: "Calculate material unit weight for manufacturing.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/mfg/unit-weight",
    languages: {
      "ko": "https://dhlm-studio.com/tools/mfg/unit-weight",
      "en": "https://dhlm-studio.com/tools/mfg/unit-weight",
      "x-default": "https://dhlm-studio.com/tools/mfg/unit-weight",
    },
  },
};

export default function Page() {
  return <UnitWeightCalculator />;
}
