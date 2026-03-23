import type { Metadata } from "next";
import TeamNameGen from "./TeamNameGen";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "팀명 생성기 - 랜덤 팀 이름 만들기 | DHLM Tools",
  description: "모임, 동아리, 프로젝트 팀명을 자동으로 생성합니다.",
};

export default function TeamNamePage() {
  return (
    <CalculatorLayout title="팀명 생성기" category="생성기">
      <TeamNameGen />
    </CalculatorLayout>
  );
}
