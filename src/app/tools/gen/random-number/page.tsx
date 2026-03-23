import type { Metadata } from "next";
import RandomNumber from "./RandomNumber";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "랜덤 숫자 생성기 - 난수 생성 | DHLM Tools",
  description: "범위를 지정하여 랜덤 숫자를 생성합니다. 로또 번호 생성 기능 포함.",
};

export default function RandomNumberPage() {
  return (
    <CalculatorLayout title="랜덤 숫자 생성기" category="생성기">
      <RandomNumber />
    </CalculatorLayout>
  );
}
