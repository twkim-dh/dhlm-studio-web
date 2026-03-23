import type { Metadata } from "next";
import PasswordGen from "./PasswordGen";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "비밀번호 생성기 - 안전한 비밀번호 만들기 | DHLM Tools",
  description: "강력하고 안전한 비밀번호를 자동으로 생성합니다. 길이와 옵션 선택 가능.",
};

export default function PasswordGenPage() {
  return (
    <CalculatorLayout title="비밀번호 생성기" category="생성기">
      <PasswordGen />
    </CalculatorLayout>
  );
}
