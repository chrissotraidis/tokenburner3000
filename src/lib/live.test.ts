import { describe, expect, it } from 'vitest';
import { normalizeUsage } from '../../server/live-api.mjs';

const priced = { inputPer1M: 2, outputPer1M: 10 };

describe('Sanctioned Live usage normalization', () => {
  it('uses OpenRouter native counts and reported billed cost', () => {
    expect(normalizeUsage({ usage: { prompt_tokens: 120, completion_tokens: 30, total_tokens: 150, cost: 0.0042, prompt_tokens_details: { cached_tokens: 20 }, completion_tokens_details: { reasoning_tokens: 4 } } }, 'openrouter', priced)).toEqual({
      inputTokens: 120, outputTokens: 30, totalTokens: 150, cachedTokens: 20, reasoningTokens: 4,
      costUsd: 0.0042, costSource: 'provider-reported',
    });
  });

  it('normalizes OpenAI Responses usage and labels price estimates', () => {
    const usage = normalizeUsage({ usage: { input_tokens: 100, output_tokens: 25, total_tokens: 125, input_tokens_details: { cached_tokens: 10 }, output_tokens_details: { reasoning_tokens: 5 } } }, 'openai', priced);
    expect(usage.totalTokens).toBe(125);
    expect(usage.costUsd).toBeCloseTo(0.00045);
    expect(usage.costSource).toBe('price-estimate');
  });

  it('normalizes Anthropic cache and output usage', () => {
    const usage = normalizeUsage({ usage: { input_tokens: 70, cache_read_input_tokens: 20, cache_creation_input_tokens: 10, output_tokens: 40 } }, 'anthropic', priced);
    expect(usage).toMatchObject({ inputTokens: 100, outputTokens: 40, totalTokens: 140, cachedTokens: 20 });
  });

  it('normalizes Gemini thoughts without calling them visible output', () => {
    const usage = normalizeUsage({ usageMetadata: { promptTokenCount: 90, candidatesTokenCount: 35, thoughtsTokenCount: 15, cachedContentTokenCount: 8, totalTokenCount: 140 } }, 'google', priced);
    expect(usage).toMatchObject({ inputTokens: 90, outputTokens: 35, reasoningTokens: 15, totalTokens: 140, cachedTokens: 8 });
  });

  it('rejects responses without auditable provider usage', () => {
    expect(() => normalizeUsage({ choices: [{ message: { content: 'unmetered' } }] }, 'openrouter', priced)).toThrow(/auditable token usage/i);
  });
});
