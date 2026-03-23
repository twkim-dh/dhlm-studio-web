"use client";
import { useState, useEffect } from "react";

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  timezone?: string;
}

export default function IpCheck() {
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("https://ipinfo.io/json?token=")
      .then(r => r.json())
      .then(data => setInfo(data))
      .catch(() => {
        fetch("https://api.ipify.org?format=json")
          .then(r => r.json())
          .then(data => setInfo({ ip: data.ip }))
          .catch(() => setInfo({ ip: "확인 실패" }));
      })
      .finally(() => setLoading(false));
  }, []);

  const copy = async () => {
    if (info?.ip) {
      await navigator.clipboard.writeText(info.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">IP 확인 중...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-6 rounded-xl text-center">
        <p className="text-sm text-gray-500 mb-2">내 공인 IP 주소</p>
        <p className="text-3xl font-bold font-mono text-blue-700">{info?.ip}</p>
        <button onClick={copy} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{copied ? "복사됨!" : "IP 복사"}</button>
      </div>
      {info && (info.city || info.country) && (
        <div className="grid grid-cols-2 gap-3">
          {info.country && <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">국가</p><p className="font-semibold">{info.country}</p></div>}
          {info.region && <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">지역</p><p className="font-semibold">{info.region}</p></div>}
          {info.city && <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">도시</p><p className="font-semibold">{info.city}</p></div>}
          {info.org && <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">ISP</p><p className="font-semibold text-sm">{info.org}</p></div>}
          {info.timezone && <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">시간대</p><p className="font-semibold">{info.timezone}</p></div>}
        </div>
      )}
    </div>
  );
}
