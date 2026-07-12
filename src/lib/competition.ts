import type { CompetitionMatchup, CompetitionProgram, Fighter, FightRules } from '../types';
import { SELECTABLE_FIGHTERS, getFighterById } from '../data/fighters';

const ACTIVE_PROGRAM_KEY = 'tokenburner3000_active_program_v1';

function base(mode: CompetitionProgram['mode'], title: string, matchups: CompetitionMatchup[]): CompetitionProgram {
  return { schemaVersion: 1, id: crypto.randomUUID(), mode, title, matchups, currentIndex: 0, scores: {}, completed: false, championId: null, updatedAt: Date.now() };
}

function matchup(fighter1: Fighter, fighter2: Fighter, label: string, index: number): CompetitionMatchup {
  return { id: `${fighter1.id}:${fighter2.id}:${index}`, fighter1Id: fighter1.id, fighter2Id: fighter2.id, label };
}

export function createBestOfThree(fighter1: Fighter, fighter2: Fighter): CompetitionProgram {
  return base('best-of-three', `${fighter1.name} vs ${fighter2.name} · Best of Three`, [0, 1, 2].map(index => matchup(fighter1, fighter2, `Bout ${index + 1}`, index)));
}

export function providerNames(): string[] {
  return [...new Set(SELECTABLE_FIGHTERS.map(fighter => fighter.provider))].sort();
}

export function createProviderCard(provider1: string, provider2: string): CompetitionProgram | null {
  const first = SELECTABLE_FIGHTERS.filter(fighter => fighter.provider === provider1);
  const second = SELECTABLE_FIGHTERS.filter(fighter => fighter.provider === provider2);
  const count = Math.min(3, first.length, second.length);
  if (!count || provider1 === provider2) return null;
  const pairings = Array.from({ length: count }, (_, index) => matchup(first[index], second[index], `Card Bout ${index + 1}`, index));
  const program = base('provider-card', `${provider1} vs ${provider2} · Provider Card`, pairings);
  program.scores = { [provider1]: 0, [provider2]: 0 };
  return program;
}

export function createFourBracket(): CompetitionProgram {
  const seeded = SELECTABLE_FIGHTERS.filter(fighter => fighter.intelligenceIndex != null)
    .sort((a, b) => (b.intelligenceIndex ?? 0) - (a.intelligenceIndex ?? 0)).slice(0, 4);
  return base('bracket-four', 'Intelligence Index · Final Four', [
    matchup(seeded[0], seeded[3], 'Semifinal 1', 0),
    matchup(seeded[1], seeded[2], 'Semifinal 2', 1),
  ]);
}

export function createDailyProgram(date = new Date()): CompetitionProgram {
  const dateKey = date.toLocaleDateString('en-CA');
  let seed = 0;
  for (const character of dateKey) seed = (seed * 31 + character.charCodeAt(0)) >>> 0;
  const roster = SELECTABLE_FIGHTERS.filter(fighter => fighter.rosterTier === 'main');
  const firstIndex = seed % roster.length;
  const secondIndex = (firstIndex + 1 + (seed % (roster.length - 1))) % roster.length;
  const program = base('daily', `Daily Featured Matchup · ${dateKey}`, [matchup(roster[firstIndex], roster[secondIndex], 'Daily Main Event', 0)]);
  program.id = `daily:${dateKey}`;
  return program;
}

export function currentProgramMatchup(program: CompetitionProgram): CompetitionMatchup | null {
  return program.matchups[program.currentIndex] ?? null;
}

export function configureProgram(program: CompetitionProgram, arenaId: string, rules: FightRules): CompetitionProgram {
  return { ...program, arenaId, rules, updatedAt: Date.now() };
}

export function recordProgramBout(program: CompetitionProgram, winnerId: string | null): CompetitionProgram {
  const next: CompetitionProgram = { ...program, scores: { ...program.scores }, matchups: program.matchups.map(item => ({ ...item })), updatedAt: Date.now() };
  const bout = next.matchups[next.currentIndex];
  if (!bout) return next;
  bout.result = winnerId ? 'win' : 'draw';
  bout.winnerId = winnerId ?? undefined;
  if (!winnerId) return next;

  if (next.mode === 'best-of-three') {
    next.scores[winnerId] = (next.scores[winnerId] ?? 0) + 1;
    if (next.scores[winnerId] >= 2) { next.completed = true; next.championId = winnerId; }
    else next.currentIndex += 1;
  } else if (next.mode === 'provider-card') {
    const provider = getFighterById(winnerId)?.provider ?? winnerId;
    next.scores[provider] = (next.scores[provider] ?? 0) + 1;
    if (next.currentIndex >= next.matchups.length - 1) {
      next.completed = true;
      const standings = Object.entries(next.scores).sort((a, b) => b[1] - a[1]);
      next.championId = standings[0]?.[1] === standings[1]?.[1] ? null : standings[0]?.[0] ?? null;
    } else next.currentIndex += 1;
  } else if (next.mode === 'bracket-four') {
    if (next.currentIndex === 0) next.currentIndex = 1;
    else if (next.currentIndex === 1) {
      const finalist1 = next.matchups[0].winnerId;
      const finalist2 = next.matchups[1].winnerId;
      const first = finalist1 ? getFighterById(finalist1) : undefined;
      const second = finalist2 ? getFighterById(finalist2) : undefined;
      if (first && second) { next.matchups.push(matchup(first, second, 'Championship Final', 2)); next.currentIndex = 2; }
    } else { next.completed = true; next.championId = winnerId; }
  } else {
    next.completed = true; next.championId = winnerId;
  }
  return next;
}

export function saveActiveProgram(program: CompetitionProgram | null): void {
  if (program) localStorage.setItem(ACTIVE_PROGRAM_KEY, JSON.stringify(program));
  else localStorage.removeItem(ACTIVE_PROGRAM_KEY);
}

export function loadActiveProgram(): CompetitionProgram | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACTIVE_PROGRAM_KEY) ?? 'null') as CompetitionProgram | null;
    return parsed?.schemaVersion === 1 && Array.isArray(parsed.matchups) ? parsed : null;
  } catch { return null; }
}
