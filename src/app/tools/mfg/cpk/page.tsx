import type { Metadata } from "next";
import CpkCalculator from "./CpkCalculator";

export const metadata: Metadata = {
  title: "Cpk 계산기 - 공정능력지수 | DHLM Tools",
  description:
    "USL, LSL, 평균, 표준편차를 입력하여 Cp와 Cpk(공정능력지수)를 계산하고 공정 판정을 확인합니다.",
};

export default function Page() {
  return <CpkCalculator />;
}
