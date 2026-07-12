import { describe, expect, it } from 'vitest';
import { getFighterById } from '../data/fighters';
import { createBestOfThree, createFourBracket, currentProgramMatchup, recordProgramBout } from './competition';

describe('competition programs', () => {
  const fable = getFighterById('claude-fable-5')!;
  const gpt = getFighterById('gpt-5-6')!;

  it('requires two wins to close a best of three', () => {
    let program = createBestOfThree(fable, gpt);
    program = recordProgramBout(program, fable.id);
    expect(program.completed).toBe(false);
    expect(program.currentIndex).toBe(1);
    program = recordProgramBout(program, fable.id);
    expect(program.completed).toBe(true);
    expect(program.championId).toBe(fable.id);
    expect(program.scores[fable.id]).toBe(2);
  });

  it('does not advance a drawn program bout', () => {
    const program = recordProgramBout(createBestOfThree(fable, gpt), null);
    expect(program.currentIndex).toBe(0);
    expect(program.completed).toBe(false);
    expect(currentProgramMatchup(program)?.result).toBe('draw');
  });

  it('advances semifinal winners into one championship final', () => {
    let program = createFourBracket();
    const semifinal1 = currentProgramMatchup(program)!;
    program = recordProgramBout(program, semifinal1.fighter1Id);
    const semifinal2 = currentProgramMatchup(program)!;
    program = recordProgramBout(program, semifinal2.fighter2Id);
    const final = currentProgramMatchup(program)!;
    expect(final.label).toBe('Championship Final');
    expect([final.fighter1Id, final.fighter2Id]).toEqual([semifinal1.fighter1Id, semifinal2.fighter2Id]);
    program = recordProgramBout(program, final.fighter1Id);
    expect(program.completed).toBe(true);
    expect(program.championId).toBe(final.fighter1Id);
  });
});
