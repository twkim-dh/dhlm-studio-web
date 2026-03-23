import type { Metadata } from "next";
import SeveranceCalculator from "./SeveranceCalculator";

export const metadata: Metadata = {
  title: "퇴직금 계산기 - 예상 퇴직금 계산 | DHLM Tools",
  description:
    "입사일, 퇴사일, 최근 3개월 급여를 입력하면 예상 퇴직금을 계산합니다. 근무일수와 1일 평균임금 기반으로 정확하게 산출합니다.",
};

export default function Page() {
  return <SeveranceCalculator />;
}
