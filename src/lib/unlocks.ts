import type { FightRecord, Fighter } from '../types';

export interface RestrictedUnlockProgress {
  fighterId: string;
  title: string;
  description: string;
  current: number;
  required: number;
  unlocked: boolean;
}

const isExhibition = (record: FightRecord) => record.mode !== 'live';

export function getRestrictedUnlocks(records: FightRecord[]): Record<string, RestrictedUnlockProgress> {
  const exhibition = records.filter(isExhibition);
  const mythosArenas = new Set(
    exhibition
      .filter(record => record.winner != null)
      .map(record => record.arena),
  );

  const geminiCurrent = Math.min(3, exhibition.length);
  const mythosCurrent = Math.min(3, mythosArenas.size);

  return {
    'gemini-3-5-pro': {
      fighterId: 'gemini-3-5-pro',
      title: 'SHIP THE NO-SHOW',
      description: 'Complete three Exhibition bouts.',
      current: geminiCurrent,
      required: 3,
      unlocked: geminiCurrent >= 3,
    },
    'claude-mythos-5': {
      fighterId: 'claude-mythos-5',
      title: 'GLASSWING CLEARANCE',
      description: 'Record wins in three distinct Exhibition arenas.',
      current: mythosCurrent,
      required: 3,
      unlocked: mythosCurrent >= 3,
    },
  };
}

export function fighterHasClearance(fighter: Fighter, unlocks: Record<string, RestrictedUnlockProgress>): boolean {
  return fighter.eligible || Boolean(unlocks[fighter.id]?.unlocked);
}

export function withExhibitionClearance(fighter: Fighter, unlocks: Record<string, RestrictedUnlockProgress>): Fighter {
  if (fighter.eligible || !unlocks[fighter.id]?.unlocked) return fighter;
  return { ...fighter, eligible: true };
}
