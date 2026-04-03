export interface Fighter {
  id: string;
  name: string;
  title: string;
  logo: string;
  verbosity: string;
  inputPer1M: number;
  outputPer1M: number;
  tokensPerSecond: number;
  color: string;
  borderColor: string;
  style: string;
  signatureMove: string;
  provider: string;
}

export interface Arena {
  id: string;
  name: string;
  desc: string;
}

export interface FightScores {
  dev: number;
  com: number;
  cre: number;
  eff: number;
  mc: number;
}

export interface VerdictData {
  f1Score: FightScores;
  f2Score: FightScores;
  f1Total: number;
  f2Total: number;
  winner: Fighter;
  statement: string;
  totalTokens: number;
  totalCost: number;
  f1Cost: number;
  f2Cost: number;
  duration: number;
}

export interface FightRecord {
  id: string;
  timestamp: number;
  fighter1: string;
  fighter2: string;
  arena: string;
  winner: string;
  f1Score: number;
  f2Score: number;
  f1Tokens: number;
  f2Tokens: number;
  f1Cost: number;
  f2Cost: number;
  totalCost: number;
  duration: number;
}

export type ViewState = 'landing' | 'select-fighters' | 'select-arena' | 'fight' | 'verdict' | 'leaderboard';
