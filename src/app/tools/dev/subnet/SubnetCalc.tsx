"use client";
import { useState } from "react";

function ipToNum(ip: string): number {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}
function numToIp(num: number): string {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(".");
}

export default function SubnetCalc() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const calculate = () => {
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const ipNum = ipToNum(ip);
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;
    const firstHost = network + 1;
    const lastHost = broadcast - 1;
    const hostCount = Math.max(0, Math.pow(2, 32 - cidr) - 2);

    setResult({
      "네트워크 주소": numToIp(network),
      "브로드캐스트 주소": numToIp(broadcast),
      "서브넷 마스크": numToIp(mask),
      "첫 번째 호스트": cidr < 31 ? numToIp(firstHost) : "-",
      "마지막 호스트": cidr < 31 ? numToIp(lastHost) : "-",
      "사용 가능 호스트 수": hostCount.toLocaleString() + "개",
      "CIDR 표기": `/${cidr}`,
      "와일드카드 마스크": numToIp(~mask >>> 0),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="flex-1 p-3 border rounded-lg font-mono" placeholder="192.168.1.0" value={ip} onChange={e => setIp(e.target.value)} />
        <span className="flex items-center text-xl font-bold text-gray-400">/</span>
        <input type="number" min={0} max={32} className="w-20 p-3 border rounded-lg font-mono text-center" value={cidr} onChange={e => setCidr(+e.target.value)} />
      </div>
      <div className="flex gap-2 flex-wrap">
        {[8, 16, 20, 24, 25, 26, 27, 28, 30, 32].map(c => (
          <button key={c} onClick={() => setCidr(c)} className={`px-3 py-1 text-sm rounded-full ${cidr === c ? "bg-blue-600 text-white" : "bg-gray-100"}`}>/{c}</button>
        ))}
      </div>
      <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">계산하기</button>
      {result && (
        <div className="space-y-2">
          {Object.entries(result).map(([k, v]) => (
            <div key={k} className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">{k}</span>
              <span className="font-mono text-sm font-semibold">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
