import { describe, expect, it } from 'vitest';
import { ARENAS } from '../data/arenas';
import { getFighterById } from '../data/fighters';
import { scoreFighter } from './scoring';

describe('scoring', () => {
  it('uses neutral price categories when either fighter is unpriced', () => {
    const muse = getFighterById('muse-spark-1-1')!;
    const fable = getFighterById('claude-fable-5')!;
    const arena = ARENAS.find(item => item.id === 'roast')!;
    const score = scoreFighter(100, null, 100, 0.01, muse, arena, {}, () => 0.5);
    expect(score.com).toBe(7);
    expect(score.eff).toBe(7);
    expect(score.dev).toBeGreaterThan(0);
    expect(fable.outputPer1M).toBe(50);
  });
});
