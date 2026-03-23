import type { Metadata } from "next";
import LoanCalculator from "./LoanCalculator";

export const metadata: Metadata = {
  title: "대출 이자 계산기 - 월 상환액 계산 | DHLM Tools",
  description:
    "대출금액, 연이율, 기간을 입력하면 월 상환액과 총 이자를 계산합니다. 원리금균등/원금균등 상환 방식을 비교해보세요.",
};

export default function Page() {
  return <LoanCalculator />;
}
