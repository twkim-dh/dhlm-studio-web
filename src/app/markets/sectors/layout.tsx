import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "S&P 500 Sector Heatmap — Market Performance | DHLM Studio",
  description: "Interactive sector heatmap showing S&P 500 performance by sector. Technology, Healthcare, Financial, Energy and more.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
