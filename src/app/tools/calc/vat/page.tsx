import type { Metadata } from "next";
import VatCalculator from "./VatCalculator";

export const metadata: Metadata = {
  title: "부가세 계산기 - VAT 포함/제외 계산 | DHLM Tools",
  description:
    "부가가치세(VAT) 포함 금액에서 공급가액과 부가세를 분리하거나, 공급가액에 부가세를 더한 합계를 계산합니다.",
};

export default function Page() {
  return <VatCalculator />;
}
