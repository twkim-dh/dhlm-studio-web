import type { Metadata } from "next";
import RejectGenerator from "./RejectGenerator";
import CalculatorLayout from "@/components/CalculatorLayout";

export const metadata: Metadata = {
  title: "거절 메시지 생성기 - 정중한 거절 문구 | DHLM Tools",
  description: "약속, 부탁, 제안을 정중하게 거절하는 메시지를 자동으로 생성합니다.",
  openGraph: {
    title: "Polite Rejection Message Generator | DHLM Studio",
    description: "Create polite rejection messages for various situations.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "https://dhlm-studio.com/tools/msg/reject-message",
    languages: {
      "ko": "https://dhlm-studio.com/tools/msg/reject-message",
      "en": "https://dhlm-studio.com/tools/msg/reject-message",
      "x-default": "https://dhlm-studio.com/tools/msg/reject-message",
    },
  },
};

export default function RejectPage() {
  return (
    <CalculatorLayout title="거절 메시지 생성기" category="문서/업무">
      <RejectGenerator />
    </CalculatorLayout>
  );
}
