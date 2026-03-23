"use client";
import { useState } from "react";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
  "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN", "JOIN", "ON",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
  "ALTER TABLE", "DROP TABLE", "AS", "IN", "NOT", "NULL", "IS", "LIKE",
  "BETWEEN", "LIMIT", "OFFSET", "UNION ALL", "UNION", "EXISTS",
  "CASE", "WHEN", "THEN", "ELSE", "END", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN",
];

const NEWLINE_BEFORE = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
  "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN", "JOIN",
  "INSERT INTO", "UPDATE", "SET", "DELETE FROM", "UNION ALL", "UNION", "LIMIT",
];

function formatSql(sql: string): string {
  let formatted = sql.replace(/\s+/g, " ").trim();

  // Uppercase keywords (longest first to avoid partial matches)
  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    const regex = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, kw);
  }

  // Add newlines before certain keywords
  for (const kw of NEWLINE_BEFORE.sort((a, b) => b.length - a.length)) {
    const regex = new RegExp(`\\s+${kw.replace(/ /g, "\\s+")}\\b`, "g");
    formatted = formatted.replace(regex, `\n${kw}`);
  }

  // Indent after SELECT, SET, VALUES
  const lines = formatted.split("\n");
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (["AND", "OR"].some((k) => trimmed.startsWith(k))) {
      result.push("  " + trimmed);
    } else if (["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "JOIN", "ON"].some((k) => trimmed.startsWith(k))) {
      result.push("  " + trimmed);
    } else {
      result.push(trimmed);
    }
  }

  return result.join("\n");
}

export default function SqlFormatterComponent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => setOutput(formatSql(input));
  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-40 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="SQL 쿼리를 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={format} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">정리하기</button>
      {output && (
        <div className="relative">
          <textarea className="w-full h-48 p-3 border rounded-lg font-mono text-sm resize-none bg-gray-50" value={output} readOnly />
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      )}
    </div>
  );
}
