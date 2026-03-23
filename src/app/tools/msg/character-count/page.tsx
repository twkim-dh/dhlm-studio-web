import type { Metadata } from "next";
import CharacterCount from "./CharacterCount";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "글자수 세기 - 공백 포함/제외 | DHLM Tools",
  description: "텍스트의 글자수, 단어수, 문장수, 줄수를 실시간으로 세어줍니다.",
};

export default function CharacterCountPage() {
  return (
    <CalculatorLayout title="글자수 세기" category="문서/업무">
      <CharacterCount />
    </CalculatorLayout>
  );
}
