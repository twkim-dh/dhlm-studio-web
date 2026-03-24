export interface BalanceQuestion {
  id: number;
  optionA: string;
  optionB: string;
}

export interface VoteData {
  optionA: number;
  optionB: number;
  totalVotes: number;
}
