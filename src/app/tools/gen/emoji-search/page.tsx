import type { Metadata } from "next";
import EmojiSearch from "./EmojiSearch";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "이모지 검색 - 이모티콘 찾기 & 복사 | DHLM Tools",
  description: "키워드로 이모지를 검색하고 클릭하면 바로 복사됩니다.",
};

export default function EmojiSearchPage() {
  return (
    <CalculatorLayout title="이모지 검색" category="생성기">
      <EmojiSearch />
    </CalculatorLayout>
  );
}
