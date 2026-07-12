import type { Arena, Fighter, FightEvent, FightScores, ScoreModifiers } from '../types';

const STYLE_BONUSES: Record<string, number> = {
  philosophical: 1, adaptive: 0.9, reasoning: 0.8, edgy: 0.7, caveats: 0.5,
  balanced: 0.3, aggressive: 0.3, chaotic: 0.6, concise: -0.2, terse: -0.5,
  swarm: 0.7, orchestration: 0.6, 'long-context': 0.5, efficient: 0.4,
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function noise(range: number, random: () => number): number {
  return (random() - 0.5) * 2 * range;
}

export function collectEventModifiers(events: FightEvent[], fighterId: string): ScoreModifiers {
  return events.reduce<ScoreModifiers>((total, event) => {
    if (event.actor !== fighterId || !event.scoreModifiers) return total;
    for (const key of ['dev', 'com', 'cre', 'eff', 'mc'] as const) {
      total[key] = (total[key] ?? 0) + (event.scoreModifiers[key] ?? 0);
    }
    return total;
  }, {});
}

export function scoreFighter(
  myTokens: number,
  myCost: number | null,
  opponentTokens: number,
  opponentCost: number | null,
  fighter: Fighter,
  arena: Arena,
  eventModifiers: ScoreModifiers = {},
  random: () => number = Math.random,
): FightScores {
  const maxTokens = Math.max(myTokens, opponentTokens, 1);
  const styleBonus = STYLE_BONUSES[fighter.style] ?? 0;
  const volumeRatio = myTokens / maxTokens;
  const hasComparableCost = myCost != null && opponentCost != null;
  const maxCost = hasComparableCost ? Math.max(myCost, opponentCost, 0.0001) : 1;
  const myTPD = hasComparableCost && myCost > 0 ? myTokens / myCost : 1;
  const oppTPD = hasComparableCost && opponentCost > 0 ? opponentTokens / opponentCost : 1;
  const maxTPD = Math.max(myTPD, oppTPD, 1);

  const dev = clamp(Math.round(5 + 5 * volumeRatio * arena.modifiers.aggression + noise(0.35, random) + (eventModifiers.dev ?? 0)), 1, 10);
  const comBase = hasComparableCost ? 5 + 5 * (myCost / maxCost) : 7;
  const com = clamp(Math.round(comBase + noise(0.25, random) + (eventModifiers.com ?? 0)), 1, 10);
  const cre = clamp(Math.round(5.5 + styleBonus * arena.modifiers.creativity + noise(0.65, random) + (eventModifiers.cre ?? 0)), 1, 10);
  const effBase = hasComparableCost ? 5 + 5 * (myTPD / maxTPD) : 7;
  const eff = clamp(Math.round(effBase + noise(0.25, random) + (eventModifiers.eff ?? 0)), 1, 10);
  const mc = clamp(Math.round(5 + 2 * volumeRatio + random() * 2.5 + (eventModifiers.mc ?? 0)), 1, 10);

  return { dev, com, cre, eff, mc };
}

export function totalScore(s: FightScores): number {
  return s.dev + s.com + s.cre + s.eff + s.mc;
}

export function computeCost(tokens: number, fighter: Fighter, outputPer1M = fighter.outputPer1M): number | null {
  return outputPer1M == null ? null : tokens * outputPer1M / 1_000_000;
}
