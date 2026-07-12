export type RosterTier = 'main' | 'guest' | 'restricted' | 'legend';
export type AvailabilityState = 'active' | 'limited' | 'preview' | 'restricted' | 'no-show' | 'retired';
export type VerificationState = 'verified' | 'game-stat' | 'satirical' | 'under-review';

export interface Provenance {
  state: VerificationState;
  verifiedAt: string;
  sourceUrl?: string;
  note?: string;
}

export type SignatureEffect =
  | 'tag-in'
  | 'effort-boost'
  | 'token-burn'
  | 'speed-boost'
  | 'mode-shift'
  | 'context-callback'
  | 'efficiency-boost'
  | 'live-ratio'
  | 'multi-agent'
  | 'orchestration'
  | 'cache-hit'
  | 'underdog-boost'
  | 'long-context'
  | 'swarm'
  | 'no-show'
  | 'legend-comeback';

export interface FighterSignature {
  id: string;
  name: string;
  description: string;
  effect: SignatureEffect;
}

export interface FighterMode {
  id: string;
  name: string;
  icon: string;
  tokensPerSecond: number;
  inputPer1M: number | null;
  outputPer1M: number | null;
  style: string;
}

export interface FighterSnapshot {
  id: string;
  name: string;
  title: string;
  logo: string;
  provider: string;
  color: string;
  rosterTier: RosterTier;
}

export interface Fighter extends FighterSnapshot {
  verbosity: string;
  inputPer1M: number | null;
  outputPer1M: number | null;
  tokensPerSecond: number;
  borderColor: string;
  style: string;
  signatureMove: string;
  signature: FighterSignature;
  availability: AvailabilityState;
  eligible: boolean;
  intelligenceIndex: number | null;
  modes?: FighterMode[];
  tagInFighterId?: string;
  restrictedRegions?: string[];
  loreTags: string[];
  provenance: {
    identity: Provenance;
    pricing: Provenance;
    speed: Provenance;
    intelligence: Provenance;
    mechanic: Provenance;
  };
}

export interface ArenaModifiers {
  aggression: number;
  rebuttal: number;
  creativity: number;
  volume: number;
  repetitionPenalty: number;
}

export interface Arena {
  id: string;
  name: string;
  desc: string;
  ruleSummary: string;
  phraseTags: string[];
  modifiers: ArenaModifiers;
}

export interface FightRules {
  customPrompt: string;
  commissionEnabled: boolean;
  venue: 'global' | 'eu';
  commentaryEnabled: boolean;
}

export type FightEventType =
  | 'fight-start'
  | 'fighter-output'
  | 'momentum'
  | 'signature'
  | 'commission'
  | 'intervention'
  | 'commentary'
  | 'cost-effect'
  | 'stall'
  | 'recovery'
  | 'tag-in'
  | 'mode-shift'
  | 'countdown'
  | 'verdict';

export interface ScoreModifiers {
  dev?: number;
  com?: number;
  cre?: number;
  eff?: number;
  mc?: number;
}

export interface FightEvent {
  id: string;
  timestamp: number;
  elapsed: number;
  type: FightEventType;
  actor: string | 'commission' | 'audience' | 'commentator' | 'system';
  target?: string;
  headline: string;
  detail: string;
  effect?: string;
  scoreModifiers?: ScoreModifiers;
  visualCue?: string;
  audioCue?: string;
  commentaryTags: string[];
  accessibleText: string;
  priority: number;
}

export interface FightScores {
  dev: number;
  com: number;
  cre: number;
  eff: number;
  mc: number;
}

export interface VerdictData {
  f1Score: FightScores;
  f2Score: FightScores;
  f1Total: number;
  f2Total: number;
  winner: Fighter | null;
  result: 'win' | 'draw';
  statement: string;
  totalTokens: number;
  totalCost: number | null;
  f1Cost: number | null;
  f2Cost: number | null;
  duration: number;
  events: FightEvent[];
  seed: number;
  turningPoint?: FightEvent;
  biggestBurn?: FightEvent;
  mode?: 'exhibition' | 'live';
  liveUsage?: LiveFightUsage;
}

export interface LiveUsageBreakdown {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedTokens: number;
  reasoningTokens: number;
  costSource: 'provider-reported' | 'price-estimate' | 'unavailable';
  provider: string;
  model: string;
}

export interface LiveFightUsage {
  fighter1: LiveUsageBreakdown;
  fighter2: LiveUsageBreakdown;
}

export interface FightOutcome {
  f1Text: string;
  f2Text: string;
  f1Tokens: number;
  f2Tokens: number;
  f1Cost: number | null;
  f2Cost: number | null;
  duration: number;
  events: FightEvent[];
  seed: number;
  mode?: 'exhibition' | 'live';
  liveUsage?: LiveFightUsage;
}

export interface FightRecord {
  schemaVersion: 2;
  id: string;
  seed: number;
  timestamp: number;
  fighter1: string;
  fighter2: string;
  fighter1Snapshot: FighterSnapshot;
  fighter2Snapshot: FighterSnapshot;
  arena: string;
  customPrompt: string;
  winner: string | null;
  result: 'win' | 'draw';
  f1Score: number;
  f2Score: number;
  f1Tokens: number;
  f2Tokens: number;
  f1Cost: number | null;
  f2Cost: number | null;
  totalCost: number | null;
  duration: number;
  events: FightEvent[];
  mode?: 'exhibition' | 'live';
  liveUsage?: LiveFightUsage;
}

export type CompetitionMode = 'best-of-three' | 'provider-card' | 'bracket-four' | 'daily';

export interface CompetitionMatchup {
  id: string;
  fighter1Id: string;
  fighter2Id: string;
  label: string;
  winnerId?: string;
  result?: 'win' | 'draw';
}

export interface CompetitionProgram {
  schemaVersion: 1;
  id: string;
  mode: CompetitionMode;
  title: string;
  matchups: CompetitionMatchup[];
  currentIndex: number;
  scores: Record<string, number>;
  completed: boolean;
  championId: string | null;
  arenaId?: string;
  rules?: FightRules;
  updatedAt: number;
}

export type ViewState =
  | 'landing'
  | 'live-settings'
  | 'programs'
  | 'select-fighters'
  | 'select-arena'
  | 'tale-of-tape'
  | 'fight'
  | 'verdict'
  | 'leaderboard';
