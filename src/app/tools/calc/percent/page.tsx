import type { Metadata } from "next";
import PercentCalculator from "./PercentCalculator";

export const metadata: Metadata = {
  title: "퍼센트 계산기 - % 계산 | DHLM Tools",
  description:
    "퍼센트 계산을 쉽게 할 수 있습니다. A의 B%는? A는 B의 몇%? A에서 B로의 변화율? 3가지 모드를 지원합니다.",
};

export default function Page() {
  return <PercentCalculator />;
}
