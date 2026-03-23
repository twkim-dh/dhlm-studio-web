import type { Metadata } from "next";
import AgeCalculator from "./AgeCalculator";

export const metadata: Metadata = {
  title: "나이 계산기 - 만나이/한국나이 계산 | DHLM Tools",
  description:
    "생년월일을 입력하면 만나이, 한국나이(연나이), 띠, 별자리를 한번에 계산합니다.",
};

export default function Page() {
  return <AgeCalculator />;
}
