import type { Metadata } from "next";
import TeamNameGen from "./TeamNameGen";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "팀명 생성기 - 랜덤 팀 이름 만들기 | DHLM Tools",
  description: "모임, 동아리, 프로젝트 팀명을 자동으로 생성합니다.",
  openGraph: {
    title: "Team Name Generator | DHLM Studio",
    description: "Generate cool team names for sports, games and projects.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/gen/team-name-gen",
    languages: {
      "ko": "https://dhlm-studio.com/tools/gen/team-name-gen",
      "en": "https://dhlm-studio.com/tools/gen/team-name-gen",
      "x-default": "https://dhlm-studio.com/tools/gen/team-name-gen",
    },
  },
};

export default function TeamNamePage() {
  return (
    <CalculatorLayout title="팀명 생성기" category="생성기">
      <TeamNameGen />
    </CalculatorLayout>
  );
}
