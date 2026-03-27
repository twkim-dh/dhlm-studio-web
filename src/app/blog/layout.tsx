import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그 | DHLM Studio",
  description: "로또 당첨번호, 도구 활용법, 생활 정보 — DHLM Studio 블로그",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
