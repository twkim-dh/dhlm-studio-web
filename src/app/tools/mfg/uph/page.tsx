import type { Metadata } from "next";
import UphCalculator from "./UphCalculator";

export const metadata: Metadata = {
  title: "UPH 계산기 - 시간당 생산량 | DHLM Tools",
  description:
    "일 생산량, 가동시간, 사이클타임으로 UPH(시간당 생산량)와 월 생산량을 계산합니다.",
};

export default function Page() {
  return <UphCalculator />;
}
