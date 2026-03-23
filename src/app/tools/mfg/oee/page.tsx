import type { Metadata } from "next";
import OeeCalculator from "./OeeCalculator";

export const metadata: Metadata = {
  title: "가동률/OEE 계산기 | DHLM Tools",
  description:
    "계획가동시간, 실가동시간, 생산수, 양품수, 이론사이클타임으로 가동률, 성능률, 양품률, OEE를 계산합니다.",
};

export default function Page() {
  return <OeeCalculator />;
}
