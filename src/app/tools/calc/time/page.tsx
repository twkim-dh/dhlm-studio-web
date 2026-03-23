import type { Metadata } from "next";
import TimeCalculator from "./TimeCalculator";

export const metadata: Metadata = {
  title: "시급 계산기 - 시급/월급/연봉 변환 | DHLM Tools",
  description:
    "시급, 일급, 주급, 월급, 연봉을 상호 변환합니다. 주당 근무시간 기준으로 정확하게 계산.",
};

export default function Page() {
  return <TimeCalculator />;
}
