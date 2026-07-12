import { describe, expect, it } from 'vitest';
import type { FightRecord } from '../types';
import { getRestrictedUnlocks } from './unlocks';

function record(id: string, arena: string, winner: string | null, mode: FightRecord['mode'] = 'exhibition'): FightRecord {
  return {
    schemaVersion: 2,
    id,
    seed: 1,
    timestamp: 1,
    fighter1: 'alpha',
    fighter2: 'beta',
    fighter1Snapshot: { id: 'alpha', name: 'Alpha', title: 'A', logo: 'A', provider: 'Test', color: 'white', rosterTier: 'main' },
    fighter2Snapshot: { id: 'beta', name: 'Beta', title: 'B', logo: 'B', provider: 'Test', color: 'white', rosterTier: 'main' },
    arena,
    customPrompt: '',
    winner,
    result: winner ? 'win' : 'draw',
    f1Score: 40,
    f2Score: 39,
    f1Tokens: 10,
    f2Tokens: 10,
    f1Cost: 0,
    f2Cost: 0,
    totalCost: 0,
    duration: 60,
    events: [],
    mode,
  };
}

describe('restricted fighter clearance', () => {
  it('unlocks Gemini after three Exhibition bouts', () => {
    const progress = getRestrictedUnlocks([
      record('1', 'roast', null),
      record('2', 'debate', 'alpha'),
      record('3', 'roast', 'beta'),
    ]);
    expect(progress['gemini-3-5-pro']).toMatchObject({ current: 3, required: 3, unlocked: true });
  });

  it('unlocks Mythos after wins in three distinct Exhibition arenas', () => {
    const progress = getRestrictedUnlocks([
      record('1', 'roast', 'alpha'),
      record('2', 'debate', 'beta'),
      record('3', 'explain', 'alpha'),
      record('4', 'roast', 'alpha'),
    ]);
    expect(progress['claude-mythos-5']).toMatchObject({ current: 3, required: 3, unlocked: true });
  });

  it('does not count Live bouts toward local Exhibition clearance', () => {
    const progress = getRestrictedUnlocks([
      record('1', 'roast', 'alpha', 'live'),
      record('2', 'debate', 'beta', 'live'),
      record('3', 'explain', 'alpha', 'live'),
    ]);
    expect(progress['gemini-3-5-pro'].current).toBe(0);
    expect(progress['claude-mythos-5'].current).toBe(0);
  });
});
