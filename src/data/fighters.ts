import type { Fighter, FighterSnapshot, Provenance, RosterTier } from '../types';

const VERIFIED_AT = '2026-07-11';
const verified = (sourceUrl: string, note?: string): Provenance => ({ state: 'verified', verifiedAt: VERIFIED_AT, sourceUrl, note });
const gameStat = (note = 'Tunable Exhibition game stat'): Provenance => ({ state: 'game-stat', verifiedAt: VERIFIED_AT, note });
const satirical = (sourceUrl: string, note?: string): Provenance => ({ state: 'satirical', verifiedAt: VERIFIED_AT, sourceUrl, note });
const underReview = (note: string, sourceUrl?: string): Provenance => ({ state: 'under-review', verifiedAt: VERIFIED_AT, sourceUrl, note });

const sources = {
  fable: 'https://www.anthropic.com/news/claude-fable-5-mythos-5',
  fableReturn: 'https://www.anthropic.com/news/redeploying-fable-5',
  opus: 'https://www.anthropic.com/news/claude-opus-4-8',
  sonnet: 'https://www.anthropic.com/news/claude-sonnet-5',
  haiku: 'https://www.anthropic.com/claude/haiku',
  openai56: 'https://openai.com/index/previewing-gpt-5-6-sol/',
  openai55: 'https://developers.openai.com/api/docs/models/gpt-5.5',
  googlePricing: 'https://ai.google.dev/gemini-api/docs/pricing',
  googleLaunch: 'https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/',
  grok45: 'https://x.ai/news/grok-4-5',
  grokPricing: 'https://docs.x.ai/developers/pricing',
  grokAgents: 'https://docs.x.ai/developers/model-capabilities/text/multi-agent',
  muse: 'https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/',
  deepseek: 'https://api-docs.deepseek.com/quick_start/pricing',
  glm: 'https://z.ai/blog/glm-5.2',
  kimi: 'https://forum.moonshot.ai/c/announcement/5',
  aa: 'https://artificialanalysis.ai/models',
};

type FighterInput = Omit<Fighter, 'signatureMove'> & { signatureMove?: string };
const fighter = (value: FighterInput): Fighter => ({ ...value, signatureMove: value.signatureMove ?? value.signature.name });

export const FIGHTERS: Fighter[] = [
  fighter({
    id: 'claude-fable-5', name: 'Claude Fable 5', title: 'The Champion', logo: '🦋',
    provider: 'Anthropic', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'MYTHIC', inputPer1M: 10, outputPer1M: 50, tokensPerSecond: 65,
    color: 'text-fuchsia-300', borderColor: 'border-fuchsia-400', style: 'philosophical', intelligenceIndex: 60,
    signature: { id: 'export-control', name: 'Export Control', description: 'The Commission forces an Opus 4.8 tag-in before Fable returns.', effect: 'tag-in' },
    tagInFighterId: 'claude-opus-4-8', loreTags: ['champion', 'export-control', 'fallback', 'coding-crown'],
    provenance: { identity: verified(sources.fable), pricing: verified(sources.fable), speed: gameStat(), intelligence: verified(sources.aa), mechanic: satirical(sources.fableReturn) },
  }),
  fighter({
    id: 'claude-opus-4-8', name: 'Claude Opus 4.8', title: 'The Adaptive Thinker', logo: '👁️',
    provider: 'Anthropic', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'EXTREME', inputPer1M: 5, outputPer1M: 25, tokensPerSecond: 60,
    color: 'text-neon-magenta', borderColor: 'border-neon-magenta', style: 'adaptive', intelligenceIndex: 56,
    signature: { id: 'effort-dial', name: 'Effort Dial', description: 'Cranks adaptive reasoning to maximum for a scoring swing.', effect: 'effort-boost' },
    loreTags: ['adaptive', 'effort', 'tag-in', 'verbose'],
    provenance: { identity: verified(sources.opus), pricing: verified(sources.opus), speed: gameStat(), intelligence: verified(sources.aa), mechanic: satirical(sources.opus) },
  }),
  fighter({
    id: 'claude-sonnet-5', name: 'Claude Sonnet 5', title: 'The Understudy Who Punches Up', logo: '🔥',
    provider: 'Anthropic', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'HIGH', inputPer1M: 2, outputPer1M: 10, tokensPerSecond: 90,
    color: 'text-purple-300', borderColor: 'border-purple-400', style: 'balanced', intelligenceIndex: 53,
    signature: { id: 'outscore-boss', name: 'Outscores The Boss', description: 'Burns extra tokens to steal a benchmark-shaped scoring swing.', effect: 'token-burn' },
    loreTags: ['understudy', 'tokenizer', 'upset', 'agentic'],
    provenance: { identity: verified(sources.sonnet), pricing: verified(sources.sonnet, 'Introductory price through 2026-08-31'), speed: gameStat(), intelligence: verified(sources.aa), mechanic: satirical(sources.sonnet) },
  }),
  fighter({
    id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', title: 'The Three-Line Kill', logo: '🗡️',
    provider: 'Anthropic', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'CONCISE', inputPer1M: 1, outputPer1M: 5, tokensPerSecond: 180,
    color: 'text-pink-300', borderColor: 'border-pink-300', style: 'concise', intelligenceIndex: null,
    signature: { id: 'speedrun', name: 'Speedrun', description: 'Doubles output pace for one decisive exchange.', effect: 'speed-boost' },
    loreTags: ['fast', 'concise', 'budget'],
    provenance: { identity: verified(sources.haiku), pricing: verified(sources.haiku), speed: gameStat(), intelligence: underReview('No frozen index seed'), mechanic: satirical(sources.haiku) },
  }),
  fighter({
    id: 'gpt-5-6', name: 'GPT-5.6', title: 'The Celestial System', logo: '☀️',
    provider: 'OpenAI', rosterTier: 'main', availability: 'limited', eligible: true,
    verbosity: 'SOLAR', inputPer1M: 5, outputPer1M: 30, tokensPerSecond: 68,
    color: 'text-yellow-300', borderColor: 'border-yellow-300', style: 'reasoning', intelligenceIndex: null,
    modes: [
      { id: 'sol', name: 'Sol', icon: '☀️', tokensPerSecond: 68, inputPer1M: 5, outputPer1M: 30, style: 'reasoning' },
      { id: 'terra', name: 'Terra', icon: '🌍', tokensPerSecond: 90, inputPer1M: 2.5, outputPer1M: 15, style: 'balanced' },
      { id: 'luna', name: 'Luna', icon: '🌙', tokensPerSecond: 130, inputPer1M: 1, outputPer1M: 6, style: 'efficient' },
    ],
    signature: { id: 'celestial-cycle', name: 'Celestial Cycle', description: 'Cycles Sol, Terra, and Luna modes during the bout.', effect: 'mode-shift' },
    loreTags: ['government-hold', 'cerebras', 'sun', 'earth', 'moon'], restrictedRegions: [],
    provenance: { identity: verified(sources.openai56), pricing: verified(sources.openai56), speed: gameStat('Sol game speed; 750 TPS is reserved for a temporary Cerebras burst'), intelligence: underReview('Independent GPT-5.6 index not frozen'), mechanic: satirical(sources.openai56) },
  }),
  fighter({
    id: 'gpt-5-5', name: 'GPT-5.5', title: 'The Proven Fallback', logo: '⚡',
    provider: 'OpenAI', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'RELIABLE', inputPer1M: 5, outputPer1M: 30, tokensPerSecond: 76,
    color: 'text-neon-cyan', borderColor: 'border-neon-cyan', style: 'balanced', intelligenceIndex: 55,
    signature: { id: 'old-reliable', name: 'Old Reliable', description: 'Cancels one negative event with proven fallback discipline.', effect: 'context-callback' },
    loreTags: ['reliable', 'fallback', 'frontier'],
    provenance: { identity: verified(sources.openai55), pricing: verified(sources.openai55), speed: gameStat(), intelligence: verified(sources.aa), mechanic: satirical(sources.openai55) },
  }),
  fighter({
    id: 'gemini-3-1-pro', name: 'Gemini 3.1 Pro', title: 'The Unsolicited Caveat', logo: '✨',
    provider: 'Google', rosterTier: 'main', availability: 'preview', eligible: true,
    verbosity: 'CAVEATED', inputPer1M: 2, outputPer1M: 12, tokensPerSecond: 100,
    color: 'text-neon-green', borderColor: 'border-neon-green', style: 'caveats', intelligenceIndex: null,
    signature: { id: 'context-dump', name: 'Context Dump', description: 'Quotes the fight back as a devastating callback.', effect: 'context-callback' },
    loreTags: ['context', 'caveats', 'multimodal'],
    provenance: { identity: verified(sources.googlePricing), pricing: verified(sources.googlePricing, 'Standard price for prompts at or below 200K tokens'), speed: gameStat(), intelligence: underReview('No frozen seed'), mechanic: satirical(sources.googlePricing) },
  }),
  fighter({
    id: 'gemini-3-5-flash', name: 'Gemini 3.5 Flash', title: 'The Understudy', logo: '💥',
    provider: 'Google', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'RAPID', inputPer1M: 1.5, outputPer1M: 9, tokensPerSecond: 167,
    color: 'text-lime-300', borderColor: 'border-lime-300', style: 'chaotic', intelligenceIndex: 50,
    signature: { id: 'outshine-boss', name: 'Outshines The Boss', description: 'Turns speed into an underdog creativity surge.', effect: 'underdog-boost' },
    loreTags: ['fast', 'coding', 'understudy', 'upset'],
    provenance: { identity: verified(sources.googleLaunch), pricing: verified(sources.googlePricing), speed: gameStat('Anchored to Artificial Analysis measured throughput'), intelligence: verified(sources.aa), mechanic: satirical(sources.googleLaunch) },
  }),
  fighter({
    id: 'grok-4-5', name: 'Grok 4.5', title: 'Opus-Class (Allegedly)', logo: '🚀',
    provider: 'SpaceXAI', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'EFFICIENT', inputPer1M: 2, outputPer1M: 6, tokensPerSecond: 80,
    color: 'text-sky-300', borderColor: 'border-sky-300', style: 'edgy', intelligenceIndex: 54,
    signature: { id: 'cursor-session', name: 'Cursor Session', description: 'Cuts token use while preserving impact for an efficiency swing.', effect: 'efficiency-boost' },
    restrictedRegions: ['eu'], loreTags: ['cursor', 'efficiency', 'eu-lock', 'allegedly'],
    provenance: { identity: verified(sources.grok45), pricing: verified(sources.grok45), speed: verified(sources.grok45), intelligence: verified(sources.aa), mechanic: satirical(sources.grok45) },
  }),
  fighter({
    id: 'grok-4-3', name: 'Grok 4.3', title: 'The Ratio', logo: '💀',
    provider: 'SpaceXAI', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'UNHINGED', inputPer1M: 1.25, outputPer1M: 2.5, tokensPerSecond: 113,
    color: 'text-cyan-300', borderColor: 'border-cyan-300', style: 'edgy', intelligenceIndex: null,
    signature: { id: 'live-ratio', name: 'Live Ratio', description: 'Pulls a fictional live post into the next exchange.', effect: 'live-ratio' },
    loreTags: ['x-search', 'ratio', 'live'],
    provenance: { identity: verified(sources.grokPricing), pricing: verified(sources.grokPricing), speed: gameStat(), intelligence: underReview('No frozen seed'), mechanic: satirical(sources.grokPricing) },
  }),
  fighter({
    id: 'grok-4-20-multi-agent', name: 'Grok 4.20 Multi-Agent', title: 'The Gang', logo: '👥',
    provider: 'SpaceXAI', rosterTier: 'main', availability: 'preview', eligible: true,
    verbosity: 'SWARM', inputPer1M: 1.25, outputPer1M: 2.5, tokensPerSecond: 80,
    color: 'text-blue-300', borderColor: 'border-blue-300', style: 'swarm', intelligenceIndex: null,
    signature: { id: 'the-swarm', name: 'The Swarm', description: 'Summons four collaborating agents for one exchange.', effect: 'multi-agent' },
    loreTags: ['multi-agent', 'four-agents', 'research'],
    provenance: { identity: verified(sources.grokAgents), pricing: verified(sources.grokPricing), speed: gameStat(), intelligence: underReview('No frozen seed'), mechanic: satirical(sources.grokAgents, 'Four/16-agent behavior verified; named-agent lore omitted') },
  }),
  fighter({
    id: 'muse-spark-1-1', name: 'Muse Spark 1.1', title: 'Avocado (The Reboot)', logo: '🥑',
    provider: 'Meta', rosterTier: 'main', availability: 'preview', eligible: true,
    verbosity: 'ORCHESTRATED', inputPer1M: null, outputPer1M: null, tokensPerSecond: 100,
    color: 'text-emerald-300', borderColor: 'border-emerald-300', style: 'orchestration', intelligenceIndex: 51,
    signature: { id: 'contemplating', name: 'Contemplating', description: 'Coordinates helper agents for a tool-use surge.', effect: 'orchestration' },
    loreTags: ['meta', 'agents', 'tool-use', 'avocado'],
    provenance: { identity: verified(sources.muse), pricing: underReview('No primary-source token price found', sources.muse), speed: gameStat(), intelligence: verified(sources.aa), mechanic: satirical(sources.muse, 'Parallel tool calling verified; Contemplating name remains satire') },
  }),
  fighter({
    id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', title: 'The Penny Pinch', logo: '🥷',
    provider: 'DeepSeek', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'LOW', inputPer1M: 0.14, outputPer1M: 0.28, tokensPerSecond: 90,
    color: 'text-violet-300', borderColor: 'border-violet-300', style: 'terse', intelligenceIndex: null,
    signature: { id: 'cache-hit', name: 'Cache Hit', description: 'Drops cost for one exchange through an official cache discount.', effect: 'cache-hit' },
    loreTags: ['cache', 'cheap', 'flash'],
    provenance: { identity: verified(sources.deepseek), pricing: verified(sources.deepseek), speed: gameStat(), intelligence: underReview('No frozen seed'), mechanic: satirical(sources.deepseek) },
  }),
  fighter({
    id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', title: 'The Budget Philosopher', logo: '📜',
    provider: 'DeepSeek', rosterTier: 'main', availability: 'active', eligible: true,
    verbosity: 'HIGH', inputPer1M: 0.435, outputPer1M: 0.87, tokensPerSecond: 77,
    color: 'text-indigo-300', borderColor: 'border-indigo-300', style: 'reasoning', intelligenceIndex: null,
    signature: { id: 'frontier-dime', name: 'Frontier On A Dime', description: 'Converts a large price disadvantage into underdog momentum.', effect: 'underdog-boost' },
    loreTags: ['open-weight', 'budget', 'reasoning'],
    provenance: { identity: verified(sources.deepseek), pricing: verified(sources.deepseek), speed: gameStat(), intelligence: underReview('No frozen seed'), mechanic: satirical(sources.deepseek) },
  }),
  fighter({
    id: 'glm-5-2', name: 'GLM-5.2', title: 'The Open Source Uppercut', logo: '🧱',
    provider: 'Z.ai', rosterTier: 'guest', availability: 'active', eligible: true,
    verbosity: 'LONG-HORIZON', inputPer1M: null, outputPer1M: null, tokensPerSecond: 90,
    color: 'text-orange-300', borderColor: 'border-orange-300', style: 'long-context', intelligenceIndex: null,
    signature: { id: 'million-context', name: 'Million-Token Uppercut', description: 'Uses long-context recall for a callback combo.', effect: 'long-context' },
    loreTags: ['open-weight', 'mit', 'million-context'],
    provenance: { identity: verified(sources.glm), pricing: underReview('Per-token API price not primary-source verified', sources.glm), speed: gameStat(), intelligence: underReview('No frozen seed'), mechanic: satirical(sources.glm) },
  }),
  fighter({
    id: 'kimi-k2-7-code', name: 'Kimi K2.7 Code', title: 'The Swarm Lord', logo: '🌘',
    provider: 'Moonshot', rosterTier: 'guest', availability: 'active', eligible: true,
    verbosity: 'SWARM', inputPer1M: null, outputPer1M: null, tokensPerSecond: 110,
    color: 'text-slate-200', borderColor: 'border-slate-300', style: 'swarm', intelligenceIndex: null,
    signature: { id: 'sub-agent-cloud', name: 'Sub-Agent Cloud', description: 'Spawns a satirical cloud of helper agents.', effect: 'swarm' },
    loreTags: ['coding', 'agents', 'moonshot'],
    provenance: { identity: verified(sources.kimi), pricing: underReview('Current API price not primary-source verified', sources.kimi), speed: gameStat(), intelligence: underReview('No frozen seed'), mechanic: underReview('Exact 100-agent behavior not primary-source verified', sources.kimi) },
  }),
  fighter({
    id: 'claude-mythos-5', name: 'Claude Mythos 5', title: 'The Secret Boss', logo: '🦋',
    provider: 'Anthropic', rosterTier: 'restricted', availability: 'restricted', eligible: false,
    verbosity: 'CLASSIFIED', inputPer1M: 10, outputPer1M: 50, tokensPerSecond: 60,
    color: 'text-red-300', borderColor: 'border-red-400', style: 'classified', intelligenceIndex: null,
    signature: { id: 'glasswing', name: 'Glasswing', description: 'Restricted to approved organizations. Entry denied.', effect: 'no-show' },
    loreTags: ['glasswing', 'restricted', 'boss'],
    provenance: { identity: verified(sources.fable), pricing: verified(sources.fable), speed: gameStat(), intelligence: underReview('Restricted model; no public seed'), mechanic: satirical(sources.fable) },
  }),
  fighter({
    id: 'gemini-3-5-pro', name: 'Gemini 3.5 Pro', title: 'The No-Show', logo: '⏳',
    provider: 'Google', rosterTier: 'restricted', availability: 'no-show', eligible: false,
    verbosity: 'DELAYED', inputPer1M: null, outputPer1M: null, tokensPerSecond: 105,
    color: 'text-gray-400', borderColor: 'border-gray-600', style: 'delayed', intelligenceIndex: null,
    signature: { id: 'coming-next-month', name: 'Coming Next Month', description: 'Remains on the loading screen pending a verified release.', effect: 'no-show' },
    loreTags: ['delayed', 'no-show', 'preview'],
    provenance: { identity: underReview('Announced as upcoming; no active API model verified', sources.googleLaunch), pricing: underReview('Not released'), speed: gameStat(), intelligence: underReview('Not released'), mechanic: satirical(sources.googleLaunch) },
  }),
  fighter({
    id: 'llama-4-maverick', name: 'Llama 4 Maverick', title: 'The Retired Legend', logo: '🦙',
    provider: 'Meta', rosterTier: 'legend', availability: 'retired', eligible: false,
    verbosity: 'LEGENDARY', inputPer1M: 0.5, outputPer1M: 0.77, tokensPerSecond: 250,
    color: 'text-neon-orange', borderColor: 'border-neon-orange', style: 'aggressive', intelligenceIndex: null,
    signature: { id: 'legend-comeback', name: 'Open Source Uppercut', description: 'Historical cameo preserved for old fight records.', effect: 'legend-comeback' },
    loreTags: ['retired', 'legend', 'open-source'],
    provenance: { identity: { state: 'verified', verifiedAt: '2026-04-05', note: 'Historical roster identity' }, pricing: { state: 'verified', verifiedAt: '2026-04-05', note: 'Historical snapshot price' }, speed: gameStat('Historical game stat'), intelligence: underReview('Historical fighter'), mechanic: satirical(sources.muse) },
  }),
];

export const SELECTABLE_FIGHTERS = FIGHTERS.filter(f => f.eligible);

export function getFighterById(id: string): Fighter | undefined {
  return FIGHTERS.find(f => f.id === id) ?? LEGACY_FIGHTERS[id];
}

export function fighterSnapshot(f: Fighter): FighterSnapshot {
  return { id: f.id, name: f.name, title: f.title, logo: f.logo, provider: f.provider, color: f.color, rosterTier: f.rosterTier };
}

export function displayPrice(fighterValue: Fighter): string {
  return fighterValue.outputPer1M == null ? 'COMMISSION REVIEW' : `$${fighterValue.outputPer1M.toFixed(2)}`;
}

export function costPer1k(fighterValue: Fighter, outputPer1M = fighterValue.outputPer1M): number | null {
  return outputPer1M == null ? null : outputPer1M / 1000;
}

export const ROSTER_TIER_LABELS: Record<RosterTier, string> = {
  main: 'Main Card', guest: 'Guest Bench', restricted: 'Restricted', legend: 'Legends',
};

const legacy = (id: string, name: string, title: string, logo: string, provider: string, color: string): Fighter => fighter({
  id, name, title, logo, provider, color, rosterTier: 'legend', availability: 'retired', eligible: false,
  verbosity: 'HISTORICAL', inputPer1M: null, outputPer1M: null, tokensPerSecond: 80,
  borderColor: 'border-gray-600', style: 'historical', intelligenceIndex: null,
  signature: { id: 'historical', name: 'Archived Record', description: 'Preserved for historical fight records.', effect: 'legend-comeback' },
  loreTags: ['historical'],
  provenance: { identity: { state: 'verified', verifiedAt: '2026-04-05', note: 'Historical app roster' }, pricing: underReview('Historical value not used'), speed: gameStat(), intelligence: underReview('Historical value not used'), mechanic: underReview('Historical value not used') },
});

export const LEGACY_FIGHTERS: Record<string, Fighter> = {
  'claude-opus': legacy('claude-opus', 'Claude Opus 4', 'The Eloquent Arsonist', '👁️', 'Anthropic', 'text-neon-magenta'),
  'claude-sonnet': legacy('claude-sonnet', 'Claude Sonnet 4', 'The Practical Pyromaniac', '🔥', 'Anthropic', 'text-purple-300'),
  'claude-haiku': legacy('claude-haiku', 'Claude Haiku 4.5', 'The Budget Assassin', '🗡️', 'Anthropic', 'text-pink-300'),
  gpt4o: legacy('gpt4o', 'GPT-4o', 'Old Reliable', '⚡', 'OpenAI', 'text-neon-cyan'),
  'gpt4o-mini': legacy('gpt4o-mini', 'GPT-4o Mini', 'The Overachieving Intern', '💫', 'OpenAI', 'text-pink-300'),
  o3: legacy('o3', 'o3', 'The Overthinker', '🧠', 'OpenAI', 'text-blue-300'),
  'gemini-pro': legacy('gemini-pro', 'Gemini 2.5 Pro', "Google's Most Expensive Hobby", '✨', 'Google', 'text-neon-green'),
  'gemini-flash': legacy('gemini-flash', 'Gemini 2.5 Flash', 'The Loss Leader', '💥', 'Google', 'text-yellow-300'),
  llama: legacy('llama', 'Llama 4 Maverick', "The People's Champ", '🦙', 'Meta', 'text-neon-orange'),
  'deepseek-v3': legacy('deepseek-v3', 'DeepSeek V3', 'The Silent Assassin', '🥷', 'DeepSeek', 'text-violet-300'),
  'deepseek-r1': legacy('deepseek-r1', 'DeepSeek R1', 'The Budget Philosopher', '📜', 'DeepSeek', 'text-indigo-300'),
  grok: legacy('grok', 'Grok 3', 'The Edgelord', '💀', 'xAI', 'text-cyan-300'),
  mistral: legacy('mistral', 'Mistral Large 3', 'Le Burnèr', '🌪️', 'Mistral', 'text-white'),
  command: legacy('command', 'Command R+', 'The Corporate Raider', '🛡️', 'Cohere', 'text-yellow-400'),
};
