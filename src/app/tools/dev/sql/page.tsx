import type { Metadata } from "next";
import SqlFormatter from "./SqlFormatter";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "SQL 포맷터 - SQL 쿼리 정리 | DHLM Tools",
  description: "SQL 쿼리를 보기 좋게 정리합니다. 키워드 대문자 변환, 자동 들여쓰기.",
};

export default function SqlPage() {
  return (
    <CalculatorLayout title="SQL 포맷터" category="개발자 도구">
      <SqlFormatter />
    </CalculatorLayout>
  );
}
