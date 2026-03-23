import type { Metadata } from "next";
import DefectCalculator from "./DefectCalculator";

export const metadata: Metadata = {
  title: "불량률 계산기 - PPM/불량률 계산 | DHLM Tools",
  description:
    "총 생산수와 불량수를 입력하면 불량률(%), PPM, 수율(%), 시그마 수준을 계산합니다.",
};

export default function Page() {
  return <DefectCalculator />;
}
