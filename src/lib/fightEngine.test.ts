import { describe, expect, it } from 'vitest';
import { ARENAS } from '../data/arenas';
import { FIGHTERS, getFighterById } from '../data/fighters';
import { appendEvent, createFightSchedule, generateFightChunk, seededRandom } from './fightEngine';

describe('roster snapshot', () => {
  it('has four roster tiers and never coerces unknown price to zero', () => {
    expect(new Set(FIGHTERS.map(fighter => fighter.rosterTier))).toEqual(new Set(['main', 'guest', 'restricted', 'legend']));
    expect(getFighterById('muse-spark-1-1')?.outputPer1M).toBeNull();
    expect(getFighterById('llama')).toBeDefined();
  });

  it('represents GPT-5.6 as one fighter with three modes', () => {
    const gpt = getFighterById('gpt-5-6');
    expect(gpt?.modes?.map(mode => mode.id)).toEqual(['sol', 'terra', 'luna']);
    expect(FIGHTERS.filter(fighter => fighter.id.startsWith('gpt-5-6'))).toHaveLength(1);
  });
});

describe('fight event engine', () => {
  const fable = getFighterById('claude-fable-5')!;
  const grok = getFighterById('grok-4-5')!;

  it('creates deterministic schedules and one signature per fighter', () => {
    const first = createFightSchedule('fight', 42, fable, grok, true, 'global');
    const second = createFightSchedule('fight', 42, fable, grok, true, 'global');
    expect(first).toEqual(second);
    expect(first.filter(event => event.type === 'signature')).toHaveLength(2);
  });

  it('emits no commission event in pure competition', () => {
    const schedule = createFightSchedule('fight', 42, fable, grok, false, 'eu');
    expect(schedule.some(event => event.type === 'commission')).toBe(false);
  });

  it('can produce a disclosed EU region-lock recovery', () => {
    let found = false;
    for (let seed = 1; seed < 500 && !found; seed++) {
      found = createFightSchedule('fight', seed, fable, grok, true, 'eu').some(event => event.effect === 'region-relay');
    }
    expect(found).toBe(true);
  });

  it('applies duplicate event IDs only once', () => {
    const scheduled = createFightSchedule('fight', 42, fable, grok, false, 'global')[0];
    expect(appendEvent(appendEvent([], scheduled), scheduled)).toHaveLength(1);
  });

  it('uses the freestyle mandate in generated content', () => {
    const arena = ARENAS.find(item => item.id === 'freestyle')!;
    const chunk = generateFightChunk(fable, grok, arena, 'Debate whether a hotdog is a sandwich', () => 0);
    expect(chunk).toContain('Debate whether a hotdog is a sandwich');
  });

  it('seeded random is reproducible', () => {
    const one = seededRandom(99); const two = seededRandom(99);
    expect([one(), one(), one()]).toEqual([two(), two(), two()]);
  });
});
