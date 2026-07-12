import { describe, expect, it } from 'vitest';
import { fighterPortraitSrc } from '../lib/portraits';

describe('fighterPortraitSrc', () => {
  it('maps historical Claude IDs to real cabinet portraits', () => {
    expect(fighterPortraitSrc('claude-sonnet')).toBe('/art/fighters/claude-sonnet-5.jpg');
    expect(fighterPortraitSrc('claude-opus')).toBe('/art/fighters/claude-opus-4-8.jpg');
  });

  it('leaves current fighter IDs stable', () => {
    expect(fighterPortraitSrc('grok-4-5')).toBe('/art/fighters/grok-4-5.jpg');
  });
});
