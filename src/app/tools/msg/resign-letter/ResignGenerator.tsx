"use client";
import { useState } from "react";

const TEMPLATES = [
  { label: "일반 퇴사", tone: "formal", template: (name: string, company: string, reason: string) =>
    `${company}에서 함께한 시간 동안 많은 것을 배웠습니다.\n\n개인적인 사유(${reason})로 퇴사를 결정하게 되었습니다.\n\n그동안 감사했습니다. ${name} 드림` },
  { label: "감사 강조", tone: "warm", template: (name: string, company: string, reason: string) =>
    `안녕하세요, ${name}입니다.\n\n${company}에서 보낸 시간은 저에게 큰 성장의 기회였습니다. 함께 일한 모든 분들께 진심으로 감사드립니다.\n\n${reason}으로 인해 새로운 도전을 하게 되었습니다. 항상 건강하시고 좋은 일만 가득하시길 바랍니다.\n\n감사합니다. ${name} 올림` },
  { label: "간결한 퇴사", tone: "brief", template: (name: string, company: string, reason: string) =>
    `안녕하세요, ${name}입니다.\n${reason}으로 ${company}를 떠나게 되었습니다.\n그동안 감사했습니다.` },
  { label: "팀/동료용", tone: "casual", template: (name: string, company: string, reason: string) =>
    `안녕하세요, ${name}입니다.\n\n${reason}으로 ${company}를 떠나게 되었어요.\n함께 일하면서 정말 즐거웠고, 좋은 동료분들 덕분에 많이 배웠습니다.\n\n다들 건강하시고, 언제든 연락 주세요!\n항상 응원하겠습니다. 🙏` },
];

export default function ResignGenerator() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("개인 사유");
  const [selected, setSelected] = useState(0);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const t = TEMPLATES[selected];
    setResult(t.template(name || "홍길동", company || "회사", reason));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <input className="w-full p-3 border rounded-lg" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full p-3 border rounded-lg" placeholder="회사명" value={company} onChange={(e) => setCompany(e.target.value)} />
      <select className="w-full p-3 border rounded-lg" value={reason} onChange={(e) => setReason(e.target.value)}>
        <option>개인 사유</option><option>건강 문제</option><option>이직</option><option>학업</option><option>가정 사정</option><option>창업</option>
      </select>
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t, i) => (
          <button key={i} onClick={() => setSelected(i)} className={`px-3 py-2 rounded-lg text-sm ${selected === i ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{t.label}</button>
        ))}
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">생성하기</button>
      {result && (
        <div className="relative">
          <textarea className="w-full h-48 p-3 border rounded-lg bg-gray-50 resize-none" value={result} readOnly />
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
    </div>
  );
}
