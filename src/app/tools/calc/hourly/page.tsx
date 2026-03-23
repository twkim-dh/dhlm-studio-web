import type { Metadata } from "next";
import HourlyCalculator from "./HourlyCalculator";

export const metadata: Metadata = {
  title: "시급 계산기 - 2026년 최저시급 기준 | DHLM Tools",
  description:
    "2026년 최저시급 10,030원 기준으로 일급, 주급, 월급(209시간), 연봉, 주휴수당을 계산합니다.",
};

export default function Page() {
  return <HourlyCalculator />;
}
