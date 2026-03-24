import { VoteData } from "@/types/balance";

const FIREBASE_PROJECT = "ttok-app";
const COLLECTION = "balance_votes";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

interface FirestoreDocument {
  fields?: {
    optionA?: { integerValue: string };
    optionB?: { integerValue: string };
    totalVotes?: { integerValue: string };
  };
}

function parseVoteData(doc: FirestoreDocument | null): VoteData {
  if (!doc || !doc.fields) {
    return { optionA: 0, optionB: 0, totalVotes: 0 };
  }
  const a = parseInt(doc.fields.optionA?.integerValue || "0", 10);
  const b = parseInt(doc.fields.optionB?.integerValue || "0", 10);
  const total = parseInt(doc.fields.totalVotes?.integerValue || "0", 10);
  return { optionA: a, optionB: b, totalVotes: total };
}

async function restRead(questionId: number): Promise<VoteData> {
  const docPath = `${BASE_URL}/${COLLECTION}/question_${questionId}`;
  try {
    const res = await fetch(docPath);
    if (!res.ok) {
      if (res.status === 404) {
        return { optionA: 0, optionB: 0, totalVotes: 0 };
      }
      throw new Error(`Firestore read failed: ${res.status}`);
    }
    const doc: FirestoreDocument = await res.json();
    return parseVoteData(doc);
  } catch {
    return { optionA: 0, optionB: 0, totalVotes: 0 };
  }
}

async function restWrite(questionId: number, data: VoteData): Promise<void> {
  const docPath = `${BASE_URL}/${COLLECTION}/question_${questionId}`;
  const body = {
    fields: {
      optionA: { integerValue: String(data.optionA) },
      optionB: { integerValue: String(data.optionB) },
      totalVotes: { integerValue: String(data.totalVotes) },
    },
  };
  const res = await fetch(docPath, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Firestore write failed: ${res.status}`);
  }
}

export async function getVotes(questionId: number): Promise<VoteData> {
  return restRead(questionId);
}

export async function vote(
  questionId: number,
  option: "A" | "B"
): Promise<VoteData> {
  const current = await restRead(questionId);
  const updated: VoteData = {
    optionA: option === "A" ? current.optionA + 1 : current.optionA,
    optionB: option === "B" ? current.optionB + 1 : current.optionB,
    totalVotes: current.totalVotes + 1,
  };
  await restWrite(questionId, updated);
  return updated;
}
