import type { Metadata } from "next";
import ExchangeCalculator from "./ExchangeCalculator";

export const metadata: Metadata = {
  title: "환율 계산기 - 실시간 환율 변환 | DHLM Tools",
  description:
    "USD, JPY, EUR, CNY 등 주요 통화를 원화로 변환합니다. 참고용 고정 환율 기준.",
};

export default function Page() {
  return <ExchangeCalculator />;
}
