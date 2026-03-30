import type { Metadata } from "next";
import PasswordGen from "./PasswordGen";

export const metadata: Metadata = {
  title: "Password Generator — Strong & Secure | DHLM Studio",
  description: "Generate strong random passwords with customizable length and options. Free, no login required.",
};

export default function PasswordGenPage() {
  return (
    <div style={{ background: "#0B0F19", minHeight: "100vh", padding: "80px 24px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "#C73E3A", letterSpacing: 3, marginBottom: 8 }}>FREE TOOL</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 900, color: "#F1F5F9", margin: "0 0 24px" }}>Password Generator</h1>
        <PasswordGen />
      </div>
    </div>
  );
}
