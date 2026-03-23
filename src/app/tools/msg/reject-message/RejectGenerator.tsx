"use client";
import { useState } from "react";

const SITUATIONS = [
  { label: "약속/모임 거절", templates: [
    "정말 가고 싶지만, 이번에는 선약이 있어서 어려울 것 같아요. 다음에 꼭 함께할게요! 😊",
    "이번 주는 일정이 꽉 차서 참석이 어려워요. 너무 아쉽지만 다음 기회에 꼭 갈게요.",
    "감사한 초대인데, 개인적인 일이 있어서 이번에는 빠져야 할 것 같아요. 이해해 주세요.",
  ]},
  { label: "업무 요청 거절", templates: [
    "말씀하신 부분 충분히 이해합니다. 다만 현재 진행 중인 업무 일정상 추가 작업이 어려운 상황입니다. 혹시 일정을 조율할 수 있을까요?",
    "좋은 제안 감사합니다. 하지만 현재 프로젝트에 집중해야 하는 시기라 추가 업무 수행이 어렵습니다. 양해 부탁드립니다.",
    "검토해 보았으나, 현재 리소스 상황을 고려하면 퀄리티를 보장하기 어려울 것 같습니다. 다른 방법을 함께 찾아볼까요?",
  ]},
  { label: "부탁 거절", templates: [
    "도와드리고 싶은 마음은 있지만, 지금 상황에서는 어려울 것 같아요. 정말 미안해요.",
    "부탁해 주셔서 감사한데, 이번에는 사정이 여의치 않네요. 다른 방법이 있는지 같이 생각해 볼까요?",
    "마음은 정말 그런데, 지금은 제가 도움을 드리기 어려운 상황이에요. 이해해 주시면 감사하겠습니다.",
  ]},
  { label: "소개팅/만남 거절", templates: [
    "좋은 분을 소개해 주셔서 감사해요. 하지만 지금은 만남보다는 제 자신에게 집중하고 싶은 시기예요.",
    "감사한 제안이지만, 현재는 새로운 만남이 부담스러운 상황이에요. 마음만 감사히 받을게요.",
    "신경 써주셔서 고마워요. 다만 지금은 개인적인 사정으로 여유가 없어서 어려울 것 같아요.",
  ]},
];

export default function RejectGenerator() {
  const [situation, setSituation] = useState(0);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const templates = SITUATIONS[situation].templates;
    const random = templates[Math.floor(Math.random() * templates.length)];
    setResult(random);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SITUATIONS.map((s, i) => (
          <button key={i} onClick={() => setSituation(i)} className={`px-3 py-2 rounded-lg text-sm ${situation === i ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{s.label}</button>
        ))}
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">생성하기</button>
      {result && (
        <div className="relative">
          <div className="p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap">{result}</div>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
      <p className="text-xs text-gray-400">버튼을 여러 번 누르면 다른 문구가 나옵니다.</p>
    </div>
  );
}
