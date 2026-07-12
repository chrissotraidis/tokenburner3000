import { FIGHTERS } from '../data/fighters';
import type { Fighter } from '../types';

export type FightMode = 'exhibition' | 'live';
export type LiveProviderId = 'openrouter' | 'openai' | 'anthropic' | 'google' | 'xai' | 'deepseek' | 'zai' | 'moonshot';

export interface LiveProviderStatus {
  id: LiveProviderId;
  label: string;
  configured: boolean;
  testedAt: number | null;
}

export interface LiveStatus {
  expiresInSeconds: number;
  providers: Record<LiveProviderId, LiveProviderStatus>;
}

export interface FighterLiveRoute {
  provider: LiveProviderId;
  modelId: string;
  inputPer1M: number | null;
  outputPer1M: number | null;
}

export interface LiveUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedTokens: number;
  reasoningTokens: number;
  costUsd: number | null;
  costSource: 'provider-reported' | 'price-estimate' | 'unavailable';
}

export interface LiveTurnResult {
  text: string;
  usage: LiveUsage;
  provider: LiveProviderId;
  model: string;
  requestId: string | null;
  latencyMs: number;
  fightCostUsd: number;
  budgetUsd: number;
}

export interface PreviousExchange { fighterName: string; text: string }

export interface LiveTurnRequest {
  fightId: string;
  fighterId: string;
  fighterName: string;
  fighterTitle: string;
  opponentId: string;
  opponentName: string;
  arenaName: string;
  arenaRuleSummary: string;
  customPrompt: string;
  round: number;
  previousExchanges: PreviousExchange[];
  maxOutputTokens: number;
  budgetUsd: number;
  route: FighterLiveRoute;
}

export const LIVE_PROVIDERS: Array<{ id: LiveProviderId; label: string; note: string }> = [
  { id: 'openrouter', label: 'OpenRouter', note: 'Universal routing plus provider-reported billed cost.' },
  { id: 'openai', label: 'OpenAI', note: 'Direct Responses API route.' },
  { id: 'anthropic', label: 'Anthropic', note: 'Direct Claude Messages API route.' },
  { id: 'google', label: 'Google Gemini', note: 'Direct Gemini generateContent route.' },
  { id: 'xai', label: 'xAI', note: 'Direct OpenAI-compatible xAI route.' },
  { id: 'deepseek', label: 'DeepSeek', note: 'Direct OpenAI-compatible route with cache usage.' },
  { id: 'zai', label: 'Z.ai', note: 'Direct GLM OpenAI-compatible route.' },
  { id: 'moonshot', label: 'Moonshot', note: 'Direct Kimi OpenAI-compatible route.' },
];

const ROUTES_KEY = 'tokenburner3000_live_routes_v1';
const BUDGET_KEY = 'tokenburner3000_live_budget_v1';

const OPENROUTER_MODELS: Record<string, string> = {
  'claude-fable-5': 'anthropic/claude-fable-5',
  'claude-opus-4-8': 'anthropic/claude-opus-4.8',
  'claude-sonnet-5': 'anthropic/claude-sonnet-5',
  'claude-haiku-4-5': 'anthropic/claude-haiku-4.5',
  'gpt-5-6': 'openai/gpt-5.6-sol',
  'gpt-5-5': 'openai/gpt-5.5',
  'gemini-3-1-pro': 'google/gemini-3.1-pro-preview',
  'gemini-3-5-flash': 'google/gemini-3.5-flash',
  'grok-4-5': 'x-ai/grok-4.5',
  'grok-4-3': 'x-ai/grok-4.3',
  'grok-4-20-multi-agent': 'x-ai/grok-4.20-multi-agent',
  'deepseek-v4-flash': 'deepseek/deepseek-v4-flash',
  'deepseek-v4-pro': 'deepseek/deepseek-v4-pro',
  'glm-5-2': 'z-ai/glm-5.2',
  'kimi-k2-7-code': 'moonshotai/kimi-k2.7-code',
  'claude-mythos-5': '',
  'gemini-3-5-pro': '',
  'llama-4-maverick': 'meta-llama/llama-4-maverick',
  'muse-spark-1-1': '',
};

const DIRECT_PROVIDERS: Record<string, LiveProviderId | null> = {
  Anthropic: 'anthropic', OpenAI: 'openai', Google: 'google', SpaceXAI: 'xai',
  DeepSeek: 'deepseek', 'Z.ai': 'zai', Moonshot: 'moonshot', Meta: null,
};

const DIRECT_MODELS: Record<string, string> = {
  'claude-fable-5': 'claude-fable-5', 'claude-opus-4-8': 'claude-opus-4-8',
  'claude-sonnet-5': 'claude-sonnet-5', 'claude-haiku-4-5': 'claude-haiku-4-5',
  'gpt-5-6': 'gpt-5.6-sol', 'gpt-5-5': 'gpt-5.5',
  'gemini-3-1-pro': 'gemini-3.1-pro-preview', 'gemini-3-5-flash': 'gemini-3.5-flash',
  'grok-4-5': 'grok-4.5', 'grok-4-3': 'grok-4.3', 'grok-4-20-multi-agent': 'grok-4.20-multi-agent',
  'deepseek-v4-flash': 'deepseek-v4-flash', 'deepseek-v4-pro': 'deepseek-v4-pro',
  'glm-5-2': 'glm-5.2', 'kimi-k2-7-code': 'kimi-k2.7-code',
};

function defaultRoute(fighter: Fighter): FighterLiveRoute {
  return { provider: 'openrouter', modelId: OPENROUTER_MODELS[fighter.id] ?? '', inputPer1M: fighter.inputPer1M, outputPer1M: fighter.outputPer1M };
}

export function loadLiveRoutes(): Record<string, FighterLiveRoute> {
  const defaults = Object.fromEntries(FIGHTERS.map(fighter => [fighter.id, defaultRoute(fighter)]));
  try {
    const parsed = JSON.parse(localStorage.getItem(ROUTES_KEY) ?? '{}') as Record<string, Partial<FighterLiveRoute>>;
    return Object.fromEntries(Object.entries(defaults).map(([id, route]) => [id, { ...route, ...(parsed[id] ?? {}) }]));
  } catch { return defaults; }
}

export function saveLiveRoutes(routes: Record<string, FighterLiveRoute>) {
  localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
}

export function loadLiveBudget(): number {
  const stored = Number(localStorage.getItem(BUDGET_KEY));
  return Number.isFinite(stored) && stored >= 0.01 ? Math.min(10, stored) : 0.25;
}

export function saveLiveBudget(value: number) {
  localStorage.setItem(BUDGET_KEY, String(Math.max(0.01, Math.min(10, value))));
}

export function providerOptionsFor(fighter: Fighter): LiveProviderId[] {
  const direct = DIRECT_PROVIDERS[fighter.provider];
  return direct ? ['openrouter', direct] : ['openrouter'];
}

export function suggestedModel(fighter: Fighter, provider: LiveProviderId): string {
  return provider === 'openrouter' ? OPENROUTER_MODELS[fighter.id] ?? '' : DIRECT_MODELS[fighter.id] ?? '';
}

export function isLiveReady(fighter: Fighter, routes: Record<string, FighterLiveRoute>, status: LiveStatus | null): boolean {
  const route = routes[fighter.id];
  return fighter.eligible && !!route?.modelId.trim() && !!status?.providers[route.provider]?.configured;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message ?? `Live API returned ${response.status}.`);
  return payload as T;
}

export const getLiveStatus = () => api<LiveStatus>('/api/live/status');
export const saveProviderKey = (provider: LiveProviderId, apiKey: string) => api<LiveStatus>(`/api/live/providers/${provider}`, { method: 'PUT', body: JSON.stringify({ apiKey }) });
export const clearProviderKey = (provider: LiveProviderId) => api<LiveStatus>(`/api/live/providers/${provider}`, { method: 'DELETE' });
export const testProviderKey = (provider: LiveProviderId) => api<LiveStatus>(`/api/live/providers/${provider}/test`, { method: 'POST' });
export const requestLiveTurn = (body: LiveTurnRequest) => api<LiveTurnResult>('/api/live/turn', { method: 'POST', body: JSON.stringify(body) });
