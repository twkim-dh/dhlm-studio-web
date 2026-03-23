import type { Metadata } from "next";
import BmiCalculator from "./BmiCalculator";

export const metadata: Metadata = {
  title: "BMI 계산기 - 체질량지수 계산 | DHLM Tools",
  description:
    "키와 몸무게를 입력하면 BMI(체질량지수)를 계산하고 저체중, 정상, 과체중, 비만 여부를 판정합니다.",
};

export default function Page() {
  return <BmiCalculator />;
}
