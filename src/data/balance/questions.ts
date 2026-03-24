import { BalanceQuestion } from "@/types/balance";

export const questions: BalanceQuestion[] = [
  { id: 1, optionA: "짜장면", optionB: "짬뽕" },
  { id: 2, optionA: "여름", optionB: "겨울" },
  { id: 3, optionA: "산", optionB: "바다" },
  { id: 4, optionA: "아침형", optionB: "저녁형" },
  { id: 5, optionA: "강아지", optionB: "고양이" },
  { id: 6, optionA: "카페", optionB: "편의점" },
  { id: 7, optionA: "짧은 머리", optionB: "긴 머리" },
  { id: 8, optionA: "현금 100만원", optionB: "일주일 휴가" },
  { id: 9, optionA: "과거로 가기", optionB: "미래로 가기" },
  { id: 10, optionA: "첫사랑과 재회", optionB: "이상형 첫 만남" },
  { id: 11, optionA: "투명인간", optionB: "하늘 날기" },
  { id: 12, optionA: "요리 잘하는 사람", optionB: "잘 먹는 사람" },
  { id: 13, optionA: "단톡방 1등 읽씹", optionB: "혼자만 안 읽음" },
  { id: 14, optionA: "연봉 300 야근 없음", optionB: "연봉 500 야근 매일" },
  { id: 15, optionA: "매운 떡볶이", optionB: "순한 떡볶이" },
  { id: 16, optionA: "엘리베이터 혼자 갇힘", optionB: "관람차 꼭대기 멈춤" },
  { id: 17, optionA: "앞자리 로또 5등", optionB: "뒷자리 로또 3등" },
  { id: 18, optionA: "평생 치킨 공짜", optionB: "평생 피자 공짜" },
  { id: 19, optionA: "귀신 보는 능력", optionB: "다른 사람 생각 읽기" },
  { id: 20, optionA: "노래방 18번", optionB: "매번 새로운 노래" },
  { id: 21, optionA: "소개팅", optionB: "자연스러운 만남" },
  { id: 22, optionA: "무인도에 폰", optionB: "무인도에 음식" },
  { id: 23, optionA: "매일 비", optionB: "매일 눈" },
  { id: 24, optionA: "점심 고정 메뉴", optionB: "매일 랜덤" },
  { id: 25, optionA: "말하는 반려동물", optionB: "변신 능력" },
  { id: 26, optionA: "3일 뒤 기억 삭제 여행", optionB: "평범한 1주일 여행" },
  { id: 27, optionA: "영원한 20대 몸", optionB: "영원한 20대 정신" },
  { id: 28, optionA: "모든 악기 마스터", optionB: "모든 언어 마스터" },
  { id: 29, optionA: "맛집 줄 1시간", optionB: "평범한 음식 바로" },
  { id: 30, optionA: "월요일 없는 인생", optionB: "금요일이 이틀인 인생" },
];

export function getTodayQuestion(): BalanceQuestion {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % questions.length;
  return questions[index];
}
