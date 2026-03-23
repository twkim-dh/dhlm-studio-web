import type { Metadata } from "next";
import UnitWeightCalculator from "./UnitWeightCalculator";

export const metadata: Metadata = {
  title: "단중 계산기 - 코일/판재 단위중량 | DHLM Tools",
  description:
    "철, SUS, 알루미늄, 구리 등 재질별 비중을 적용하여 판재/코일의 단위중량을 계산합니다.",
};

export default function Page() {
  return <UnitWeightCalculator />;
}
