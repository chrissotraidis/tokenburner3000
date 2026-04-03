import type { Fighter, FightScores } from '../types';

const STYLE_BONUSES: Record<string, number> = {
  philosophical: 1.0,
  chain_of_thought: 0.8,
  edgy: 0.7,
  caveats: 0.5,
  balanced: 0.3,
  sophisticated: 0.5,
  aggressive: 0.3,
  chaotic: 0.6,
  eager: 0.2,
  concise: -0.2,
  terse: -0.5,
  numbered_lists: 0.0,
  synergy: 0.1,
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function noise(range: number): number {
  return (Math.random() - 0.5) * 2 * range;
}

export function scoreFighter(
  myTokens: number,
  myCost: number,
  opponentTokens: number,
  opponentCost: number,
  fighter: Fighter,
): FightScores {
  const maxTokens = Math.max(myTokens, opponentTokens, 1);
  const maxCost = Math.max(myCost, opponentCost, 0.0001);
  const myTPD = myCost > 0 ? myTokens / myCost : myTokens * 10000;
  const oppTPD = opponentCost > 0 ? opponentTokens / opponentCost : opponentTokens * 10000;
  const maxTPD = Math.max(myTPD, oppTPD, 1);

  const styleBonus = STYLE_BONUSES[fighter.style] ?? 0;

  // Devastation: raw token volume
  const dev = clamp(Math.round(5 + 5 * (myTokens / maxTokens) + noise(0.5)), 1, 10);

  // Commitment: money burned
  const com = clamp(Math.round(5 + 5 * (myCost / maxCost) + noise(0.5)), 1, 10);

  // Creativity: style-driven + randomness
  const cre = clamp(Math.round(6 + styleBonus + noise(1)), 1, 10);

  // Efficiency: tokens per dollar (cheap fast models shine here)
  const eff = clamp(Math.round(5 + 5 * (myTPD / maxTPD) + noise(0.5)), 1, 10);

  // Main Character Energy: partially random, biased toward output volume
  const mc = clamp(Math.round(5 + 2 * (myTokens / maxTokens) + Math.random() * 3), 1, 10);

  return { dev, com, cre, eff, mc };
}

export function totalScore(s: FightScores): number {
  return s.dev + s.com + s.cre + s.eff + s.mc;
}

export function computeCost(tokens: number, fighter: Fighter): number {
  return tokens * fighter.outputPer1M / 1_000_000;
}
