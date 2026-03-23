import type { Metadata } from "next";
import NicknameGenerator from "./NicknameGenerator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "닉네임 생성기 - 랜덤 닉네임 만들기 | DHLM Tools",
  description: "게임, SNS에서 사용할 수 있는 재미있는 닉네임을 자동으로 생성합니다.",
};

export default function NicknamePage() {
  return (
    <CalculatorLayout title="닉네임 생성기" category="생성기">
      <NicknameGenerator />
    </CalculatorLayout>
  );
}
