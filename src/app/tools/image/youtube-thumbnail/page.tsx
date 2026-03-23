import type { Metadata } from "next";
import YoutubeThumbnail from "./YoutubeThumbnail";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "유튜브 썸네일 다운로드 - YouTube 썸네일 추출 | DHLM Tools",
  description: "유튜브 영상 URL을 입력하면 모든 크기의 썸네일을 다운로드할 수 있습니다.",
};

export default function YoutubeThumbnailPage() {
  return (
    <CalculatorLayout title="유튜브 썸네일 다운로드" category="이미지 도구">
      <YoutubeThumbnail />
    </CalculatorLayout>
  );
}
