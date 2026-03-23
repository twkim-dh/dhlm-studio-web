import type { Metadata } from "next";
import DepositCalculator from "./DepositCalculator";

export const metadata: Metadata = {
  title: "적금 이자 계산기 - 만기 수령액 계산 | DHLM Tools",
  description:
    "월 납입액, 이율, 기간을 입력하면 적금 만기 수령액을 계산합니다. 세전/세후 이자와 원금을 확인하세요.",
};

export default function Page() {
  return <DepositCalculator />;
}
