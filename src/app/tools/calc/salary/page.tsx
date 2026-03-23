import type { Metadata } from "next";
import SalaryCalculator from "./SalaryCalculator";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 - 세후 월급 계산 | DHLM Tools",
  description:
    "연봉에서 4대보험과 세금을 공제한 실수령액을 계산합니다. 국민연금, 건강보험, 고용보험, 소득세 공제 항목별 금액을 확인하세요.",
};

export default function Page() {
  return <SalaryCalculator />;
}
