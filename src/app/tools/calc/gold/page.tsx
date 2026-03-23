import type { Metadata } from "next";
import GoldCalculator from "./GoldCalculator";

export const metadata: Metadata = {
  title: "금 시세 계산기 - 금 무게별 가격 | DHLM Tools",
  description:
    "24K, 18K, 14K 금의 무게별(돈, g, oz) 예상 가격을 계산합니다. 참고용 고정 시세 기준.",
};

export default function Page() {
  return <GoldCalculator />;
}
