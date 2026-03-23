"use client";
import { useState } from "react";

const KR_SENTENCES = [
  "다람쥐 헌 쳇바퀴에 타고파.", "키스의 고유 조건은 입술끼리 만나야 하고 특, 별한 기술은 필요치 않다.",
  "가나다라마바사 아자차카타파하.", "빠른 갈색 여우가 게으른 개를 뛰어넘었다.",
  "오늘도 좋은 하루 되세요.", "프로그래밍은 문제 해결의 예술이다.",
  "사용자 경험은 디자인의 핵심입니다.", "테스트 데이터를 입력해 주세요.",
  "모든 위대한 일은 작은 시작에서 비롯됩니다.", "함께하면 더 큰 가치를 만들 수 있습니다.",
  "디지털 기술로 세상을 더 좋게 만듭니다.", "혁신은 항상 불편함에서 시작됩니다.",
  "좋은 서비스는 사용자를 생각하는 마음에서 나옵니다.", "작은 차이가 큰 변화를 만듭니다.",
  "매일 조금씩 성장하는 것이 가장 중요합니다.",
];

const EN_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa.", "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.", "Quis autem vel eum iure reprehenderit qui in ea voluptate velit.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus.", "Nam libero tempore, cum soluta nobis est eligendi optio cumque.",
];

export default function LoremIpsumComponent() {
  const [lang, setLang] = useState<"kr"|"en">("kr");
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraph"|"sentence">("paragraph");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const sentences = lang === "kr" ? KR_SENTENCES : EN_SENTENCES;
    let text = "";
    if (unit === "sentence") {
      for (let i = 0; i < count; i++) {
        text += sentences[i % sentences.length] + " ";
      }
    } else {
      for (let p = 0; p < count; p++) {
        const numSentences = 3 + Math.floor(Math.random() * 3);
        let para = "";
        for (let i = 0; i < numSentences; i++) {
          para += sentences[Math.floor(Math.random() * sentences.length)] + " ";
        }
        text += para.trim() + "\n\n";
      }
    }
    setResult(text.trim());
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setLang("kr")} className={`px-3 py-2 rounded-lg text-sm ${lang==="kr"?"bg-blue-600 text-white":"bg-gray-100"}`}>한글</button>
        <button onClick={() => setLang("en")} className={`px-3 py-2 rounded-lg text-sm ${lang==="en"?"bg-blue-600 text-white":"bg-gray-100"}`}>English</button>
      </div>
      <div className="flex items-center gap-3">
        <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-20 p-2 border rounded-lg text-center" />
        <select value={unit} onChange={(e) => setUnit(e.target.value as "paragraph"|"sentence")} className="p-2 border rounded-lg">
          <option value="paragraph">문단</option>
          <option value="sentence">문장</option>
        </select>
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">생성하기</button>
      {result && (
        <div className="relative">
          <textarea className="w-full h-48 p-3 border rounded-lg bg-gray-50 resize-none text-sm" value={result} readOnly />
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied ? "복사됨!" : "복사"}</button>
        </div>
      )}
    </div>
  );
}
