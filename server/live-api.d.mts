import type { Plugin } from 'vite';

export interface NormalizedUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedTokens: number;
  reasoningTokens: number;
  costUsd: number | null;
  costSource: 'provider-reported' | 'price-estimate' | 'unavailable';
}

export function liveApiVitePlugin(): Plugin;
export function normalizeUsage(payload: unknown, provider: string, route: Record<string, unknown>): NormalizedUsage;
