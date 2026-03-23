"use client";
import { useState } from "react";

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(escape(atob(padded)));
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) throw new Error("JWT는 3개 파트(header.payload.signature)로 구성됩니다");
      const h = JSON.parse(base64UrlDecode(parts[0]));
      const p = JSON.parse(base64UrlDecode(parts[1]));
      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      if (p.exp) {
        const expDate = new Date(p.exp * 1000);
        const now = new Date();
        const expired = expDate < now;
        setExpiry(`${expDate.toLocaleString("ko-KR")} (${expired ? "❌ 만료됨" : "✅ 유효"})`);
      } else {
        setExpiry("exp 클레임 없음");
      }
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setHeader("");
      setPayload("");
      setExpiry("");
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-24 p-3 border rounded-lg font-mono text-xs resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="JWT 토큰을 붙여넣으세요 (eyJ...)"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={decode} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">디코딩</button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {header && (
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm text-gray-600 mb-1">Header</h3>
            <pre className="bg-gray-50 p-3 rounded-lg text-xs font-mono overflow-x-auto">{header}</pre>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-600 mb-1">Payload</h3>
            <pre className="bg-gray-50 p-3 rounded-lg text-xs font-mono overflow-x-auto">{payload}</pre>
          </div>
          {expiry && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-sm font-semibold">만료 시간: </span>
              <span className="text-sm">{expiry}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
