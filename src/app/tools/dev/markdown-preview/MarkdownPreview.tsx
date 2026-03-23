"use client";
import { useState } from "react";

function parseMarkdown(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold mt-5 mb-2'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1 rounded text-sm font-mono'>$1</code>")
    .replace(/^\- (.+)$/gm, "<li class='ml-4'>• $1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li class='ml-4'>$1</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' class='text-blue-600 underline'>$1</a>")
    .replace(/^---$/gm, "<hr class='my-4 border-gray-300'/>")
    .replace(/^> (.+)$/gm, "<blockquote class='border-l-4 border-gray-300 pl-3 text-gray-600 my-2'>$1</blockquote>")
    .replace(/\n\n/g, "</p><p class='my-2'>")
    .replace(/\n/g, "<br/>");
  return `<p class='my-2'>${html}</p>`;
}

const SAMPLE = `# 마크다운 미리보기

## 기능
- **굵게**, *기울임*, \`코드\`
- [링크](https://dhlm-studio.com)
- 리스트 항목

## 사용법
1. 왼쪽에 마크다운을 입력하세요
2. 오른쪽에서 실시간 미리보기

> 인용문도 지원합니다

---

### 즐거운 코딩! 🚀`;

export default function MarkdownPreviewComponent() {
  const [input, setInput] = useState(SAMPLE);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">마크다운 입력</label>
          <textarea
            className="w-full h-80 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">미리보기</label>
          <div
            className="w-full h-80 p-3 border rounded-lg overflow-y-auto bg-white prose prose-sm"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }}
          />
        </div>
      </div>
    </div>
  );
}
