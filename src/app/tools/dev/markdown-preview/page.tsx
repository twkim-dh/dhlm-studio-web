import type { Metadata } from "next";
import MarkdownPreview from "./MarkdownPreview";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "마크다운 미리보기 - Markdown 에디터 | DHLM Tools",
  description: "마크다운을 실시간으로 미리보기합니다. 복사 기능 포함.",
};

export default function MarkdownPreviewPage() {
  return (
    <CalculatorLayout title="마크다운 미리보기" category="개발자 도구">
      <MarkdownPreview />
    </CalculatorLayout>
  );
}
