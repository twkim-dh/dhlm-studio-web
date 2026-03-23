import type { Metadata } from "next";
import YoutubeCalculator from "./YoutubeCalculator";

export const metadata: Metadata = {
  title: "유튜브 수익 계산기 - 예상 광고 수익 | DHLM Tools",
  description:
    "월 조회수와 CPM을 입력하면 예상 유튜브 광고 수익을 원화로 계산합니다. 월/연 수익을 미리 확인해보세요.",
};

export default function Page() {
  return <YoutubeCalculator />;
}
