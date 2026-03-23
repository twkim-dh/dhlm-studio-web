"use client";
import { useState } from "react";

const EMOJIS: { emoji: string; tags: string[] }[] = [
  { emoji: "😀", tags: ["웃음","행복","기쁨","smile"] }, { emoji: "😂", tags: ["웃음","눈물","재미","laugh"] },
  { emoji: "🥰", tags: ["사랑","하트","love"] }, { emoji: "😍", tags: ["사랑","눈하트","love"] },
  { emoji: "😊", tags: ["미소","행복","blush"] }, { emoji: "😎", tags: ["멋짐","선글라스","cool"] },
  { emoji: "🤔", tags: ["생각","고민","think"] }, { emoji: "😅", tags: ["땀","당황","sweat"] },
  { emoji: "😢", tags: ["슬픔","울음","sad","cry"] }, { emoji: "😡", tags: ["화남","분노","angry"] },
  { emoji: "🥺", tags: ["부탁","간절","pleading"] }, { emoji: "😴", tags: ["졸림","잠","sleep"] },
  { emoji: "🤮", tags: ["구역질","sick"] }, { emoji: "🤗", tags: ["포옹","hug"] },
  { emoji: "👍", tags: ["좋아요","엄지","like","thumbs"] }, { emoji: "👎", tags: ["싫어요","thumbs down"] },
  { emoji: "👏", tags: ["박수","축하","clap"] }, { emoji: "🙏", tags: ["감사","부탁","기도","pray"] },
  { emoji: "💪", tags: ["힘","근육","화이팅","strong"] }, { emoji: "✌️", tags: ["평화","브이","peace"] },
  { emoji: "❤️", tags: ["하트","사랑","heart","love"] }, { emoji: "💕", tags: ["하트","사랑","hearts"] },
  { emoji: "💔", tags: ["실연","깨진하트","broken"] }, { emoji: "🔥", tags: ["불","핫","인기","fire","hot"] },
  { emoji: "⭐", tags: ["별","star"] }, { emoji: "🎉", tags: ["축하","파티","party"] },
  { emoji: "🎂", tags: ["생일","케이크","birthday"] }, { emoji: "🎁", tags: ["선물","gift"] },
  { emoji: "📱", tags: ["폰","핸드폰","phone"] }, { emoji: "💻", tags: ["컴퓨터","노트북","computer"] },
  { emoji: "🍕", tags: ["피자","음식","pizza"] }, { emoji: "🍔", tags: ["햄버거","음식","burger"] },
  { emoji: "🍺", tags: ["맥주","술","beer"] }, { emoji: "☕", tags: ["커피","카페","coffee"] },
  { emoji: "🍚", tags: ["밥","쌀","rice"] }, { emoji: "🍜", tags: ["라면","면","noodles"] },
  { emoji: "🐶", tags: ["강아지","개","dog"] }, { emoji: "🐱", tags: ["고양이","cat"] },
  { emoji: "🌸", tags: ["벚꽃","꽃","flower"] }, { emoji: "🌙", tags: ["달","밤","moon"] },
  { emoji: "☀️", tags: ["해","태양","sun"] }, { emoji: "🌧️", tags: ["비","rain"] },
  { emoji: "✅", tags: ["체크","확인","완료","check"] }, { emoji: "❌", tags: ["취소","아님","wrong"] },
  { emoji: "⚠️", tags: ["주의","경고","warning"] }, { emoji: "💯", tags: ["백점","완벽","perfect"] },
  { emoji: "🏠", tags: ["집","home","house"] }, { emoji: "🚗", tags: ["차","자동차","car"] },
  { emoji: "✈️", tags: ["비행기","여행","airplane"] }, { emoji: "📧", tags: ["이메일","메일","email"] },
];

export default function EmojiSearchComponent() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");

  const filtered = query.trim()
    ? EMOJIS.filter(e => e.tags.some(t => t.includes(query.toLowerCase())))
    : EMOJIS;

  const copy = async (emoji: string) => {
    await navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setTimeout(() => setCopied(""), 1000);
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="이모지 검색 (예: 사랑, 음식, 축하)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
        {filtered.map((e) => (
          <button
            key={e.emoji}
            onClick={() => copy(e.emoji)}
            className={`text-3xl p-2 rounded-lg hover:bg-blue-50 transition-all ${copied === e.emoji ? "bg-green-100 scale-110" : ""}`}
            title={e.tags.join(", ")}
          >
            {e.emoji}
          </button>
        ))}
      </div>
      {copied && <p className="text-sm text-green-600 text-center">{copied} 복사됨!</p>}
      <p className="text-xs text-gray-400">{filtered.length}개 이모지 | 클릭하면 복사됩니다</p>
    </div>
  );
}
