import type { Metadata } from "next";
import LoanCalculator from "./LoanCalculator";

export const metadata: Metadata = {
  title: "대출 이자 계산기 - 월 상환액 계산 | DHLM Tools",
  description:
    "대출금액, 연이율, 기간을 입력하면 월 상환액과 총 이자를 계산합니다. 원리금균등/원금균등 상환 방식을 비교해보세요.",
  openGraph: {
    title: "Loan Interest Calculator | DHLM Studio",
    description: "Calculate loan interest payments, monthly installments and total cost.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/calc/loan",
    languages: {
      "ko": "https://dhlm-studio.com/tools/calc/loan",
      "en": "https://dhlm-studio.com/tools/calc/loan",
      "x-default": "https://dhlm-studio.com/tools/calc/loan",
    },
  },
};

export default function Page() {
  return <LoanCalculator />;
}
