"use client";
import { useState } from "react";

const ADJ = ["행복한","용감한","빛나는","졸린","배고픈","귀여운","멋진","신비한","달리는","웃는","날아가는","춤추는","노래하는","꿈꾸는","반짝이는","조용한","시끄러운","수줍은","당당한","느긋한"];
const NOUN = ["호랑이","고양이","강아지","판다","코알라","토끼","여우","사자","펭귄","곰","다람쥐","부엉이","독수리","돌고래","해파리","선인장","구름","별","달","무지개"];
const ENG_ADJ = ["happy","brave","sleepy","shiny","cool","fast","lazy","magic","wild","tiny","super","mega","ultra","hyper","dark","ice","fire","storm","shadow","dream"];
const ENG_NOUN = ["tiger","cat","wolf","panda","eagle","fox","bear","shark","dragon","phoenix","ninja","samurai","knight","wizard","pirate","ghost","storm","blade","star","moon"];

export default function NicknameGenerator() {
  const [results, setResults] = useState<string[]>([]);
  const [style, setStyle] = useState<"korean"|"english"|"mixed">("korean");
  const [copied, setCopied] = useState(-1);

  const generate = () => {
    const names: string[] = [];
    for (let i = 0; i < 10; i++) {
      if (style === "korean") {
        names.push(ADJ[Math.floor(Math.random()*ADJ.length)] + NOUN[Math.floor(Math.random()*NOUN.length)]);
      } else if (style === "english") {
        const a = ENG_ADJ[Math.floor(Math.random()*ENG_ADJ.length)];
        const n = ENG_NOUN[Math.floor(Math.random()*ENG_NOUN.length)];
        names.push(a.charAt(0).toUpperCase()+a.slice(1)+n.charAt(0).toUpperCase()+n.slice(1)+Math.floor(Math.random()*100));
      } else {
        const a = ADJ[Math.floor(Math.random()*ADJ.length)];
        const n = ENG_NOUN[Math.floor(Math.random()*ENG_NOUN.length)];
        names.push(a+n.charAt(0).toUpperCase()+n.slice(1));
      }
    }
    setResults(names);
  };

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["korean","english","mixed"] as const).map(s => (
          <button key={s} onClick={() => setStyle(s)} className={`px-3 py-2 rounded-lg text-sm ${style===s?"bg-blue-600 text-white":"bg-gray-100"}`}>
            {s==="korean"?"한국어":s==="english"?"영어":"한영 믹스"}
          </button>
        ))}
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">10개 생성</button>
      {results.length > 0 && (
        <div className="grid gap-2">
          {results.map((n, i) => (
            <div key={i} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
              <span className="font-medium">{n}</span>
              <button onClick={() => copy(n, i)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded">{copied===i?"복사됨!":"복사"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
